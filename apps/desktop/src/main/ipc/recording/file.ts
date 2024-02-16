import ffmpeg from 'fluent-ffmpeg';
import { app, ipcMain } from 'electron';
import path from 'path';
import { HIGHLIGHTS_SUBDIRECTORY, THUMBNAIL_FORMAT, VIDEO_DIRECTORY, VIDEO_FORMAT } from '../../../constants';
import { fileExists } from '../../util/file';
import { captureThumbnail } from '../../../shared/util/recording';
import { FileIPC, HighlightIPC } from '../../../shared/ipc';
import { mkdir, readFile, unlink } from 'fs/promises';
import { ObjectId } from 'bson';
import { ffmpegPath, ffprobePath } from 'ffmpeg-ffprobe-static';
import { HighlightTimeframe, IRecording } from '@fyp/types';
import { MainRequestBuilder } from '../../util/request';
import { getApiCookieString } from '../../util/cookie';
import { mainWindow, settingsManager } from '../..';
import { defaultSettings } from '../../../shared/settings';

ffmpeg.setFfmpegPath(ffmpegPath as string);
ffmpeg.setFfprobePath(ffprobePath as string);

export type VideoData = {
  name: string,
  size: number,
  path: string,
  created: Date
  length?: number
}

export const getMetadata = (filePath: string): Promise<ffmpeg.FfprobeData> => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    })
  })
}

const createHighlight = async({
  recordingPath,
  outputPath,
  start,
  name,
  duration
}: {
  recordingPath: string,
  outputPath: string,
  start: number,
  name: string,
  duration: number
}): Promise<{
  id: string,
  message: 'OK',
  path: string
}> => {
  return new Promise(async(resolve, reject) => {
    const filePath = path.join(outputPath, `${name}.${VIDEO_FORMAT}`);
    ffmpeg(recordingPath)
      .setStartTime(start)
      .setDuration(duration)
      .outputOptions('-c:v', 'copy', '-r', settingsManager.getSettings()?.frameRate.toString() ?? defaultSettings.frameRate.toString())
      .output(filePath)
      .on('end', async() => {
        const thumbnailPath = await captureThumbnail(filePath);

        try {
          const data = await readFile(thumbnailPath, 'base64');
          resolve({
            id: name,
            message: 'OK',
            path: `data:image/jpeg;base64,${data}`
          });
        } catch {
          reject({
            message: 'VIDEO_NOT_FOUND'
          });
        }

      })
      .on('error', (err) => {
        console.log(err);
        reject();
      })
      .run()
  })
}

export default () => {

  ipcMain.handle(FileIPC.GetThumbnail, async(_, id: string, type: 'recordings' | 'highlights') => {

    const videoDir = path.join(app.getPath('videos'), VIDEO_DIRECTORY, type === 'highlights' ? type : '');
    const thumbnailPath = path.join(videoDir, `${id}.${THUMBNAIL_FORMAT}`);
    const videoPath = path.join(videoDir, `${id}.${VIDEO_FORMAT}`);

    if (!await fileExists(thumbnailPath)) {
      if (!await fileExists(videoPath)) {
        return {
          message: 'VIDEO_NOT_FOUND'
        }
      } else {
        await captureThumbnail(videoPath);
      }
    }

    const data = await readFile(thumbnailPath, 'base64');

    return {
      id: id,
      message: 'OK',
      path: `data:image/jpeg;base64,${data}`
    }
    
  });

  ipcMain.handle(FileIPC.CreateHighlights, async(_, { timeframes, recording, matchDuration }: {
      timeframes: HighlightTimeframe[],
      matchDuration: number,
      recording: IRecording
    }
  ) => {

    const recordingPath = path.join(app.getPath('videos'), VIDEO_DIRECTORY, `${recording.gameId.toString()}.${VIDEO_FORMAT}`);
    const outputPath = path.join(app.getPath('videos'), VIDEO_DIRECTORY, HIGHLIGHTS_SUBDIRECTORY);
    const offset = recording.length - (matchDuration / 1000);

    if (!await fileExists(outputPath)) {
      await mkdir(outputPath);
    }

    const files: string[] = [];

    const highlightPromises = timeframes.map((tf) => {
      const start = (tf.start / 1000) + offset;
      const duration = (tf.finish - tf.start) / 1000;
      const name = new ObjectId().toString();
      files.push(name);

      return createHighlight({
        recordingPath,
        outputPath,
        duration,
        start,
        name
      });
    })

    const highlightResults = await Promise.all(highlightPromises);

    const apiPromises = files.map((name, i): Promise<void> => {
      return new Promise(async(resolve, reject) => {

        const metadata = await getMetadata(path.join(outputPath, `${name}.${VIDEO_FORMAT}`));
        const highlightTimeframe = timeframes[i];

        const res = await new MainRequestBuilder()
        .route('/v1/highlight')
        .method('POST')
        .headers({
          Cookie: await getApiCookieString()
        })
        .body({
          match: recording.match,
          fileId: name,
          length: metadata.format.duration,
          champion: recording.champion,
          position: recording.position,
          size: metadata.format.size,
          queueId: recording.queueId,
          tags: highlightTimeframe.tags
        })
        .fetch()
    
        if (res.ok) {
          const highlight = await res.json();
          mainWindow?.webContents.send(HighlightIPC.Created, {
            highlight: highlight,
            thumbnail: highlightResults[i]
          });
          resolve();
        } else {
          reject();
        }

      })
    })

    Promise.all(apiPromises);

  })
  
  ipcMain.handle(FileIPC.CreateHighlight, async(_, { timeframe, recording }: {
    timeframe: HighlightTimeframe,
    recording: IRecording
  }
  ) => {

    const recordingPath = path.join(app.getPath('videos'), VIDEO_DIRECTORY, `${recording.gameId.toString()}.${VIDEO_FORMAT}`);
    const outputPath = path.join(app.getPath('videos'), VIDEO_DIRECTORY, HIGHLIGHTS_SUBDIRECTORY);

    if (!await fileExists(outputPath)) {
      await mkdir(outputPath);
    }

    const start = (timeframe.start / 1000);
    const duration = (timeframe.finish - timeframe.start) / 1000;
    const name = new ObjectId().toString();

    const thumbnail = await createHighlight({
      recordingPath,
      outputPath,
      duration,
      start,
      name
    });

    const metadata = await getMetadata(path.join(outputPath, `${name}.${VIDEO_FORMAT}`));

    const res = await new MainRequestBuilder()
    .route('/v1/highlight')
    .method('POST')
    .headers({
      Cookie: await getApiCookieString()
    })
    .body({
      match: recording.match,
      fileId: name,
      length: metadata.format.duration,
      champion: recording.champion,
      position: recording.position,
      size: metadata.format.size,
      queueId: recording.queueId,
      tags: timeframe.tags
    })
    .fetch()

    if (res.ok) {
      const highlight = await res.json();
      mainWindow?.webContents.send(HighlightIPC.Created, {
        highlight: highlight,
        thumbnail: thumbnail
      });

      return {
        status: "OK",
        message: "Success!"
      }
    } else {
      return {
        status: "Error",
        message: "Failed to create."
      }
    }

  })

  ipcMain.handle(FileIPC.Delete, async(_, { id, fileName, type }: { id: string, fileName: string, type: 'recording' | 'highlight' }) => {
    const filePath = path.join(app.getPath('videos'), VIDEO_DIRECTORY, type === 'highlight' ? type + 's' : '', `${fileName}.${VIDEO_FORMAT}`);

    const res = await new MainRequestBuilder()
    .route(`/v1/${type}/${id}`)
    .method('DELETE')
    .headers({
      Cookie: await getApiCookieString()
    })
    .fetch();

    if (res.ok) {
      await unlink(filePath);
    }

  })

}