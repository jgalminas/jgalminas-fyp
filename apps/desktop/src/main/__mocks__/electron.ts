
module.exports = {
  app: {
    isPackaged: false,
    getAppPath: jest.fn().mockImplementation(() => __dirname),
    whenReady: jest.fn().mockImplementation(() => ({
      then: jest.fn()
    })),
    on: jest.fn()
  },
  ipcMain: {
    on: jest.fn(),
    handle: jest.fn()
  },
  BrowserWindow: jest.fn().mockImplementation(() => ({
    webContents: {
      session: {
        cookies: {
          get: jest.fn()
        }
      }
    }
  }))
};