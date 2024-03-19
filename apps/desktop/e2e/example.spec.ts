import { test, _electron, ElectronApplication } from '@playwright/test';
import { findLatestBuild, parseElectronApp } from 'electron-playwright-helpers';

let app: ElectronApplication;

test.beforeAll(async () => {
  const latestBuild = findLatestBuild('./dist');
  const appInfo = parseElectronApp(latestBuild);

  process.env.CI = 'e2e'

  app = await _electron.launch({
    args: [appInfo.main],
    executablePath: appInfo.executable
  })

  app.on('window', async (page) => {
    page.on('pageerror', (error) => {
      console.error(error)
    })
    page.on('console', (msg) => {
      console.log(msg.text())
    })
  });

});

test.afterAll(async() => {
  await app.close();
});

test('save screenshot', async () => {
  const page = await app.firstWindow();

  await page.getByRole('link', { name: /Home/ }).waitFor();

});
