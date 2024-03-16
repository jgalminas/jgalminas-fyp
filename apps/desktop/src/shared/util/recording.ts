import ffmpeg from 'fluent-ffmpeg';
import { ffmpegPath } from 'ffmpeg-ffprobe-static';
import { THUMBNAIL_FORMAT, VIDEO_FORMAT } from '../../constants';
ffmpeg.setFfmpegPath(ffmpegPath as string);

export const captureThumbnail = async(filePath: string): Promise<string> => {
  const thumbnailPath = filePath.replace(VIDEO_FORMAT, THUMBNAIL_FORMAT);
  return new Promise((resolve, reject) => {
    try {
      ffmpeg()
      .input(filePath)
      .inputFormat('mp4')
      .videoCodec('mjpeg')
      .frames(1)
      .output(thumbnailPath)
      .on('end', () => resolve(thumbnailPath))
      .on('error', () => reject())
      .run()
    } catch (err) {
      reject(err);
    }
  })
}
