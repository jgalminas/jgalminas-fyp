import ffmpeg from 'fluent-ffmpeg';
import { app, ipcMain } from 'electron';
import path from 'path';
import { HIGHLIGHTS_SUBDIRECTORY, THUMBNAIL_FORMAT, VIDEO_DIRECTORY, VIDEO_FORMAT } from '../../../constants';
import { fileExists } from '../../util/file';
import { captureThumbnail } from '../../../shared/util/recording';
import { FileIPC, HighlightIPC } from '../../../shared/ipc';
import { mkdir } from 'fs/promises';
import { ObjectId } from 'bson';
import { ffmpegPath, ffprobePath } from 'ffmpeg-ffprobe-static';
import { IRecording } from '@fyp/types';
import { MainRequestBuilder } from '../../util/request';
import { getApiCookieString } from '../../util/cookie';
import { mainWindow } from '../..';

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

    return {
      message: 'OK',
      path: 'local:\\' + thumbnailPath
    }
    
  });

  ipcMain.handle(FileIPC.CreateHighlights, async(_, { timeframes, recording, matchDuration }: {
    timeframes: {
      frame: number,
      timestamp: number
    }[],
    matchDuration: number,
    recording: IRecording }
    ) => {

    const recordingPath = path.join(app.getPath('videos'), VIDEO_DIRECTORY, `${recording.gameId.toString()}.${VIDEO_FORMAT}`);
    const outputPath = path.join(app.getPath('videos'), VIDEO_DIRECTORY, HIGHLIGHTS_SUBDIRECTORY);
    const offset = recording.length - (matchDuration / 1000);

    if (!await fileExists(outputPath)) {
      await mkdir(outputPath);
    }

    const create = async(start: number, name: string, duration: number): Promise<boolean> => {
      return new Promise(async(resolve, reject) => {
        const filePath = path.join(outputPath, `${name}.${VIDEO_FORMAT}`);
        ffmpeg(recordingPath)
          .setStartTime(start)
          .setDuration(duration)
          .outputOptions('-c', 'copy')
          .output(filePath)
          .on('end', async() => {
            await captureThumbnail(filePath);
            resolve(true);
          })
          .on('error', (err) => {
            console.log(err);
            reject(false)
          })
          .run()
      })
    }

    const files: string[] = [];

    const highlightPromises = timeframes.map((tf) => {
      const start = Math.floor((tf.timestamp + offset) / 1000);
      const name = new ObjectId().toString();
      files.push(name);
      return create(start, name, 60);
    })

    await Promise.all(highlightPromises);

    const apiPromises = files.map((name): Promise<void> => {
      return new Promise(async(resolve, reject) => {

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
          tags: []
        })
        .fetch()
    
        if (res.ok) {
          const highlight = await res.json();
          mainWindow?.webContents.send(HighlightIPC.Created, highlight);
          resolve();
        } else {
          reject();
        }

      })
    })

    Promise.all(apiPromises);

  })
  
}