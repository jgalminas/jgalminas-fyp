import { app, shell, BrowserWindow, protocol, net } from 'electron';
import path from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
import { registerChannels } from './ipc/index';
import { ClientManager } from './clientManager';
import { LolApi } from 'twisted';
import { MatchObserver } from './matchObserver';
import { MatchRecorderIPC } from './matchRecorderIPC';
import env from '../env';
import { videoServer } from './videoServer';
import { HighlightIPC } from '../shared/ipc';

registerChannels();

export let mainWindow: BrowserWindow | undefined;

export const lolApi = new LolApi(process.env.MAIN_VITE_RIOT_KEY as string);
export const clientManager = new ClientManager();
export const matchObserver = new MatchObserver(
  clientManager,
  new MatchRecorderIPC()
);

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.webContents.openDevTools();

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
});

videoServer.listen(env.RENDERER_VITE_VIDEO_SERVER_PORT, () => {
  console.log("Video server running on: " + env.RENDERER_VITE_VIDEO_SERVER_PORT);
});