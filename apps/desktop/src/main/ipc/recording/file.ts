import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import { app, ipcMain } from 'electron';
import path from 'path';
import { readdir, stat } from 'fs/promises';
import { THUMBNAIL_FORMAT, VIDEO_FORMAT } from '../../../constants';
import { fileExists } from '../../util/file';
import { captureThumbnail } from '../../../shared/util/recording';
import { exec, execFile, spawn } from 'child_process';

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

  ipcMain.handle("recording:videos", async() => {
  
    const videosDir = path.join(app.getPath('videos'), 'Fyp');
    const fileNames = await readdir(videosDir);
    const files: VideoData[] = [];
  
    const results = await Promise.all(fileNames.map(async(fn) => {
      
      const filePath = path.join(videosDir, fn);
      // const [stats, data] = await Promise.all([stat(filePath), getMetadata(filePath)]);
      const stats = await stat(filePath);

      return {
        fileName: fn,
        filePath,
        stats,
        // data
      }

    }))

    for (const result of results) {
  
      // const filePath = path.join(videosDir, fn);
  
      // if video
      if (result.fileName.split('.')[1] === VIDEO_FORMAT) {
        // const stats = await stat(filePath);
        // const data = await getMetadata(filePath);

        const thumbnailPath = result.filePath.replace(VIDEO_FORMAT, THUMBNAIL_FORMAT);

        // if (!fileExists(thumbnailPath)) {
        //   await captureThumbnail(result.filePath);
        // }
  
        files.push({
          name: result.fileName,
          path: 'local:\\' + thumbnailPath,
          size: result.stats.size,
          created: result.stats.birthtime,
          length: 0 //result.data.format.duration
        });
      }
  
    }
  
    return files;
  });
  
}