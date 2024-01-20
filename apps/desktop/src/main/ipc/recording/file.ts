import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import { app, ipcMain } from 'electron';
import path from 'path';
import { readdir, stat } from 'fs/promises';
import { THUMBNAIL_FORMAT, VIDEO_DIRECTORY, VIDEO_FORMAT } from '../../../constants';
import { fileExists } from '../../util/file';
import { captureThumbnail } from '../../../shared/util/recording';
import { exec, execFile, spawn, spawnSync } from 'child_process';
import { FileIPC } from '../../../shared/ipc';
import * as fs from 'fs';

import { ffmpegPath, ffprobePath } from 'ffmpeg-ffprobe-static';
import { IMatch, IRecording } from '@fyp/types';
import input from 'postcss/lib/input';

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

  // ipcMain.handle("recording:videos", async() => {
  
  //   const videosDir = path.join(app.getPath('videos'), VIDEO_DIRECTORY);
  //   const fileNames = await readdir(videosDir);
  //   const files: VideoData[] = [];
  
  //   const results = await Promise.all(fileNames.map(async(fn) => {
      
  //     const filePath = path.join(videosDir, fn);
  //     // const [stats, data] = await Promise.all([stat(filePath), getMetadata(filePath)]);
  //     const stats = await stat(filePath);

  //     return {
  //       fileName: fn,
  //       filePath,
  //       stats,
  //       // data
  //     }

  //   }))

  //   for (const result of results) {
  
  //     // const filePath = path.join(videosDir, fn);
  
  //     // if video
  //     if (result.fileName.split('.')[1] === VIDEO_FORMAT) {
  //       // const stats = await stat(filePath);
  //       // const data = await getMetadata(filePath);

  //       const thumbnailPath = result.filePath.replace(VIDEO_FORMAT, THUMBNAIL_FORMAT);

  //       // if (!fileExists(thumbnailPath)) {
  //       //   await captureThumbnail(result.filePath);
  //       // }
  
  //       files.push({
  //         name: result.fileName,
  //         path: 'local:\\' + thumbnailPath,
  //         size: result.stats.size,
  //         created: result.stats.birthtime,
  //         length: 0 //result.data.format.duration
  //       });
  //     }
  
  //   }
  
  //   return files;
  // });

  ipcMain.handle(FileIPC.GetThumbnail, async(_, id: string) => {
    const filePath = path.join(app.getPath('videos'), VIDEO_DIRECTORY, `${id}.${THUMBNAIL_FORMAT}`);
    return 'local:\\' + filePath;
  });

  ipcMain.handle(FileIPC.CreateHighlights, async(_, { match, puuid, recording }: { match: IMatch, recording: IRecording, puuid: string }) => {

    const recordingPath = path.join(app.getPath('videos'), VIDEO_DIRECTORY, `${recording.gameId.toString()}.${VIDEO_FORMAT}`);
    
    const py = "C:\\Users\\datgu\\Desktop\\fyp-ai\\dist\\main.exe";

    const outputPath = path.join(app.getPath('videos'), VIDEO_DIRECTORY);

    const tempFilePath = './temp.json';

    const input = JSON.stringify({
      puuid: puuid,
      data: JSON.stringify(match)
    })

    // Write JSON data to a temporary file
    fs.writeFileSync(tempFilePath, input, {
      encoding: 'utf-8'
    });

    // Execute the command with the file path as an argument
    const result = spawnSync(py, {
      input: tempFilePath,
      encoding: 'utf-8'
    });

    // Remove the temporary file after execution
    fs.unlinkSync(tempFilePath);

    // const result = spawnSync('py', [py], {
    //   input: JSON.stringify({
    //     puuid: puuid,
    //     data: JSON.stringify(match)
    //   }),
    //   encoding: 'utf-8'
    // })

    const frames: { frame: number, timestamp: number }[] = JSON.parse(result.stdout);

    const duration = (match.finish - match.start) / 1000;
    const offset = recording.length - duration;

    const create = async(start: number, name: string) => {
      return new Promise((resolve, reject) => {
        ffmpeg(recordingPath)
          .setStartTime(start)
          .setDuration(60)
          .output(outputPath + `/${name}.mp4`)
          .on('end', () => {
            console.log("done");
            resolve(true)
          })
          .on('error', (err) => {
            console.log(err);
            reject(false)
          })
          .run()
      })
    }

    for (const fr of frames) {
      const start = Math.floor((fr.timestamp + offset) / 1000);
      await create(start, "highlight_" + fr.frame)
    }
   
    return frames;

  })
  
}