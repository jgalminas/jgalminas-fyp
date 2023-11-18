import { app, shell, BrowserWindow, ipcMain, desktopCapturer, protocol, net } from 'electron';
import path, { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
import { readdir, stat } from 'fs/promises';

import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
ffmpeg.setFfmpegPath(ffmpegStatic as string);

import { MatchRecorder } from '../preload/matchRecorder';

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.webContents.openDevTools();

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.whenReady().then(async() => {
  protocol.handle('local', (req) => net.fetch(req.url.replace('local:\\', 'file:\\')));
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

ipcMain.handle('sources', async(e) => {
  return await desktopCapturer.getSources({ types: ['window'] });
});

export type VideoData = {
  name: string,
  size: number,
  path: string,
  created: Date
  length?: number
}

ipcMain.handle('file:getVideos', async() => {

  const videosDir = path.join(app.getPath('videos'), 'Fyp');
  const fileNames = await readdir(videosDir);
  const files: VideoData[] = [];

  for (const fn of fileNames) {

    const filePath = path.join(videosDir, fn);

    // if video
    if (fn.split('.')[1] === 'mkv') {
      const stats = await stat(filePath);
      const data = await getMetadata(filePath);

      files.push({
        name: fn,
        path: 'local:\\' + filePath.replace('mkv', 'jpg'),
        size: stats.size,
        created: stats.birthtime,
        length: data.format.duration
      });
    }

  }

  return files;
});

ipcMain.handle('file:getThumbnails', async() => {
  const videosDir = path.join(app.getPath('videos'), 'Fyp');
  const fileNames = await readdir(videosDir);
  return fileNames.filter(fn => fn.split('.')[1] === 'jpg');
});

const getMetadata = (filePath: string): Promise<ffmpeg.FfprobeData> => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    })
  })
}

ipcMain.on('getPath', (e, path: Parameters<typeof app.getPath>[0]) => {
  e.returnValue = app.getPath(path);
})