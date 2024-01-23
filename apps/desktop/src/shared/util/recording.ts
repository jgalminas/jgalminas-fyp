import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import { THUMBNAIL_FORMAT, VIDEO_FORMAT } from '../../constants';
ffmpeg.setFfmpegPath(ffmpegStatic as string);

export const captureThumbnail = async(filePath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      ffmpeg()
      .input(filePath)
      .inputFormat('mp4')
      .videoCodec('mjpeg')
      .frames(1)
      .output(filePath.replace(VIDEO_FORMAT, THUMBNAIL_FORMAT))
      .on('end', () => resolve())
      .on('error', () => reject())
      .run()
    } catch (err) {
      reject(err);
    }
  })
}