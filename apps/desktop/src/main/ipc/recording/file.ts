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
import Ffmpeg from 'fluent-ffmpeg';
import { readFileSync } from 'fs';

ffmpeg.setFfmpegPath(ffmpegStatic as string);

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

  ipcMain.handle(FileIPC.CreateHighlight, async(_, id) => {

    const filePath = path.join(app.getPath('videos'), VIDEO_DIRECTORY, `${id}.${VIDEO_FORMAT}`);
    
    const py = "C:\\Users\\datgu\\Desktop\\fyp-ai\\main.py";
    const match = "C:\\Users\\datgu\\Desktop\\fyp-ai\\match2.json";

    const outputFp = path.join(app.getPath('videos'), VIDEO_DIRECTORY);

    const result = spawnSync('py', [py], {
      input: JSON.stringify({
        puuid: "Yd5iuNMv_8KkEwpOcdzlLv9u6OuKVi6rPOIENOMp6edGzHdkNO5DCFXWxRDZdeASj-_8AE-Mpbq_AA",
        data: readFileSync(match, 'utf-8')
      }),
      encoding: 'utf-8'
    })

    const frames: { frame: number, timestamp: number }[] = JSON.parse(result.stdout);

    const offset = 13 * 60;

    const create = async(start: number, name: string) => {
      return new Promise((resolve, reject) => {
        Ffmpeg(filePath)
          .setStartTime(start)
          .setDuration(60)
          .output(outputFp + `/${name}.mp4`)
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