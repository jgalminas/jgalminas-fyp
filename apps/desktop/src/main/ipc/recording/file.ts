import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import { app, ipcMain } from 'electron';
import path from 'path';
import { readdir, stat } from 'fs/promises';
import { THUMBNAIL_FORMAT, VIDEO_FORMAT } from '../../../constants';
import { fileExists } from '../../util/file';
import { captureThumbnail } from '../../../shared/util/recording';

ffmpeg.setFfmpegPath(ffmpegStatic as string);

export type VideoData = {
  name: string,
  size: number,
  path: string,
  created: Date
  length?: number
}

const getMetadata = (filePath: string): Promise<ffmpeg.FfprobeData> => {
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
  
    for (const fn of fileNames) {
  
      const filePath = path.join(videosDir, fn);
  
      // if video
      if (fn.split('.')[1] === VIDEO_FORMAT) {
        const stats = await stat(filePath);
        const data = await getMetadata(filePath);

        const thumbnailPath = filePath.replace(VIDEO_FORMAT, THUMBNAIL_FORMAT);

        if (!fileExists(thumbnailPath)) {
          await captureThumbnail(filePath);
        }
  
        files.push({
          name: fn,
          path: 'local:\\' + filePath.replace(VIDEO_FORMAT, THUMBNAIL_FORMAT),
          size: stats.size,
          created: stats.birthtime,
          length: data.format.duration
        });
      }
  
    }
  
    return files;
  });
  
}