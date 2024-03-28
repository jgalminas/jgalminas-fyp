import {test as setup, _electron, ElectronApplication } from '@playwright/test';
import { findLatestBuild, parseElectronApp } from 'electron-playwright-helpers';

let app: ElectronApplication;

setup.beforeAll(async () => {
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

setup.afterAll(async() => {
  await app.close();
});

setup('Authenticate', async () => {
  const page = await app.firstWindow();

  const login = async() => {
    await page.locator('input[name="email"]').fill('j.galminas@gmail.com');
    await page.locator('input[name="password"]').fill('password');
    await page.getByRole('button', { name: /Sign In/ }).click();

    await page.getByRole('navigation').waitFor();
    await page.getByRole('heading', { name: /Home/ }).waitFor();
  }

  try {
    await page.getByRole('heading', { name: /Home/ }).waitFor({ timeout: 5000 });
    await page.getByLabel(/Options/).click();
    await page.getByRole('menuitem', { name: /Sign Out/ }).click();
    await login();
  } catch {
    await login();
  }

});
