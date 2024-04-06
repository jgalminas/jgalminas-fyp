import { test, _electron, ElectronApplication } from '@playwright/test';
import { findLatestBuild, parseElectronApp } from 'electron-playwright-helpers';
import { randomUUID } from 'crypto';

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

// test.beforeEach(async() => {

//   // const page = await app.firstWindow();
//   // try {
//   //   await page.getByRole('heading', { name: /Home/ }).waitFor({ timeout: 2000 });
//   //   await page.getByLabel(/Options/).click();
//   //   await page.getByRole('menuitem', { name: /Sign Out/ }).click();
//   // } catch (error) { }
// })

test.beforeEach(async() => {
  const page = await app.firstWindow();

  try {
    await page.getByRole('heading', { name: /Welcome/ }).waitFor({ timeout: 5000 });
    await page.getByLabel(/Options/).click();
    await page.getByRole('menuitem', { name: /Sign Out/ }).click();
  } catch (error) { }
})

test('Log in', async () => {
  const page = await app.firstWindow();

  await page.locator('input[name="email"]').fill('j.galminas@gmail.com');
  await page.locator('input[name="password"]').fill('password');
  await page.getByRole('button', { name: /Sign In/ }).click();

  await page.getByRole('navigation').waitFor();
  await page.getByRole('heading', { name: /Welcome/ }).waitFor();
});

test('Sign up', async () => {
  const page = await app.firstWindow();
  await page.getByRole('link', { name: /Sign up/ }).click();

  await page.locator('input[name="email"]').fill(`${randomUUID()}@gmail.com`);
  await page.locator('input[name="username"]').fill('someusername');
  await page.locator('input[name="password"]').fill('password');
  await page.locator('input[name="confirmPassword"]').fill('password');
  await page.getByRole('button', { name: /Sign Up/ }).click();

  await page.getByRole('navigation').waitFor();
  await page.getByRole('heading', { name: /Welcome/ }).waitFor();
});
