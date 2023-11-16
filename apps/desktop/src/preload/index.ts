import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { Readable } from 'stream';

import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
ffmpeg.setFfmpegPath(ffmpegStatic as string);



export type PreloadAPI = typeof api;

// Custom APIs for renderer

let recorder: MediaRecorder | undefined;
// const chunks: Blob[] = [];
// const file = createWriteStream('./output111.webm');
const readable = new Readable({ read() {} });
let running = false;

const api = {

  stopRecording: async() => {
    recorder?.stop();
    running = false;
    readable.push(null);
    // file.close();
  },

  getSources: async() => {
    const sources = await ipcRenderer.invoke('sources');

    console.log(sources[1]);
    
    running = true;

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        // @ts-ignore
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: sources[1].id,
        },
      },
      video: {
        // @ts-ignore
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: sources[1].id,
          minWidth: 1920,
          maxWidth: 1920,
          minHeight: 1080,
          maxHeight: 1080,
          frameRate: {
            ideal: 60
          }
        }
      }
    });    

    // const videoEl = document.getElementById('video') as HTMLVideoElement
    // videoEl.srcObject = stream;
    // videoEl.play()

    recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

    recorder.ondataavailable = async(e) => {
      const reader = e.data.stream().getReader();

      while (true && running) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        readable.push(value);
        // file.write(value);
      }

    }

    recorder.start(1000);
    
    const cmd = ffmpeg()
    .input(readable)
    .inputFormat('webm')
    .videoCodec('libx264')
    .audioCodec('aac')
    .toFormat('mp4')
    .on('start', () => {
      console.log("started encoding");
    })
    .on('end', () => {
      console.log("finished");
    })
    .on('error',(err) => {
      console.log(err);
      
    })

    cmd.saveToFile('./video.mp4');
    
  },

  file: {
    getVideos: async() => await ipcRenderer.invoke('file:getThumbnails')
  }
}

// const api = 


// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api;
}
