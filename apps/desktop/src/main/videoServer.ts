import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { HIGHLIGHTS_SUBDIRECTORY, VIDEO_FORMAT } from '../constants';
import { app } from 'electron';
import fs from 'fs';
import range from 'range-parser';
import { VIDEO_DIRECTORY } from './constants';

export const videoServer = express();
export const videoServerHttp = createServer(videoServer);

videoServer.get('/recording/:id', (req, res) => {

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

videoServer.get('/highlight/:id', (req, res) => {

  const id = req.params.id;
  const videoPath = path.join(app.getPath('videos'), VIDEO_DIRECTORY, HIGHLIGHTS_SUBDIRECTORY, `${id}.${VIDEO_FORMAT}`);

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
