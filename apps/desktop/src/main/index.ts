import { app, shell, BrowserWindow, protocol, net, session } from 'electron';
import path from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
import { registerChannels } from './ipc/index';
import { ClientManager } from './clientManager';
import { MatchObserver } from './matchObserver';
import { MatchRecorderIPC } from './matchRecorderIPC';
import env from '../env';
import { videoServerHttp } from './videoServer';
import { SettingsManager } from './settingsManager';
import { SETTINGS_PATH } from './constants';
import { ffmpegPath, ffprobePath } from 'ffmpeg-ffprobe-static';
import _ffmpeg from 'fluent-ffmpeg';


// Configure ffmpeg
if (app.isPackaged) {
  const unpackedPath = path.resolve(process.resourcesPath, 'app.asar.unpacked', 'node_modules')
  const customFfmpegPath = path.join(unpackedPath, (ffmpegPath as string).split('node_modules')[1]);
  const customFfprobePath = path.join(unpackedPath, (ffprobePath as string).split('node_modules')[1]);
  _ffmpeg.setFfmpegPath(customFfmpegPath);
  _ffmpeg.setFfprobePath(customFfprobePath);
} else {
  _ffmpeg.setFfmpegPath(ffmpegPath as string);
  _ffmpeg.setFfprobePath(ffprobePath as string);
}

export const ffmpeg = _ffmpeg;

// Register IPC listeners
registerChannels();

export let mainWindow: BrowserWindow;
export let clientManager: ClientManager;
export let matchObserver: MatchObserver;
export let settingsManager: SettingsManager;

export function initialiseServices() {
  clientManager = new ClientManager();
  matchObserver = new MatchObserver(clientManager, new MatchRecorderIPC());
  settingsManager = new SettingsManager(SETTINGS_PATH);
  settingsManager.loadSettings();
}

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    minWidth: 1024,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
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
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async() => {
  initialiseServices();
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

  await clientManager.init();
  await matchObserver.observe()

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


  // Handle auth cookies for incoming and outgoing requests
  const filter = {
    urls: [
      env.RENDERER_VITE_API_URL + '/*',
      env.RENDERER_VITE_SOCKET_URL + '/*'
    ]
  }

  session.defaultSession.webRequest.onCompleted(filter, async(details) => {
    if (details.responseHeaders && details.responseHeaders['Set-Cookie']) {
      for (const cookieString of details.responseHeaders['Set-Cookie']) {
        const splitCookie = cookieString.split(';');
        const [name, value] = splitCookie[0].split('=');
        const expiration = splitCookie[2].split('=')[1];
        await session.defaultSession.cookies.set({ name: name, value: value, url: env.RENDERER_VITE_APP_URL, expirationDate: Date.parse(expiration) });
      }
    }
  })

  session.defaultSession.webRequest.onBeforeSendHeaders(filter, async(details, callback) => {
    const cookies =  await session.defaultSession.cookies.get({ url: env.RENDERER_VITE_APP_URL });
    for (const cookie of cookies) {
      details.requestHeaders['Cookie'] = `${cookie.name}=${cookie.value};`;
    }
    callback({ requestHeaders: details.requestHeaders })
  })

});

videoServerHttp.listen(0, () => {
  // @ts-expect-error
  console.log("Video server running on: " + videoServerHttp.address()?.port);
});
