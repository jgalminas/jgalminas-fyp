import express, { Express } from 'express';
import path from 'path';
import { VIDEO_DIRECTORY, VIDEO_FORMAT } from '../constants';
import { app } from 'electron';
import fs from 'fs';
import range from 'range-parser';

export const videoServer: Express = express();

videoServer.get('/video/:id', (req, res) => {
  
  const id = req.params.id;
  const videoPath = path.join(app.getPath('videos'), VIDEO_DIRECTORY, `${id}.${VIDEO_FORMAT}`);

  if (!fs.existsSync(videoPath)) {
    return res.status(404).send('Video not found');
  }

  // Get file stats
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;

  // Parse range header to support seeking
  const rangeHeader = req.headers.range || 'bytes=0-';
  const ranges = range(fileSize, rangeHeader);

  if (ranges === -1) {
    return res.status(416).send('Requested range not satisfiable');
  }

  const start = ranges[0].start;
  const end = ranges[0].end;

  res.writeHead(206, {
    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': end - start + 1,
    'Content-Type': `video/${VIDEO_FORMAT}`,
  });

  const stream = fs.createReadStream(videoPath, { start, end });
  return stream.pipe(res);

})