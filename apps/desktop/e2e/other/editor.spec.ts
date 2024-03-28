import { test, _electron, ElectronApplication, expect } from '@playwright/test';
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

test('Navigate to the editor via a recording', async () => {
  const page = await app.firstWindow();

  await page.getByRole('navigation').waitFor();
  await page.getByRole('link', { name: /Recordings/ }).click();

  await page.getByRole('link', { name: /Create Highlight/ }).first().click();
  await page.getByTestId(/editor/).waitFor();
});

test('Play/pause recording', async () => {
  const page = await app.firstWindow();

  await page.getByRole('navigation').waitFor();
  await page.getByRole('link', { name: /Recordings/ }).click();

  await page.getByRole('link', { name: /Create Highlight/ }).first().click();
  await page.getByTestId(/editor/).waitFor();

  const video = page.locator('video');
  expect(video).toHaveJSProperty('currentTime', 0);
  await page.waitForLoadState('networkidle');

  // Play recording for 1 second
  await page.getByRole('button', { name: /Play/ }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: /Pause/ }).click();

  const currentTime = await video.evaluate(e => (e as HTMLVideoElement).currentTime);
  expect(Math.round(currentTime) * 1000).toBe(1000);
});

test('Fast forward', async () => {
  const page = await app.firstWindow();

  await page.getByRole('navigation').waitFor();
  await page.getByRole('link', { name: /Recordings/ }).click();

  await page.getByRole('link', { name: /Create Highlight/ }).first().click();
  await page.getByTestId(/editor/).waitFor();

  const video = page.locator('video');
  expect(video).toHaveJSProperty('currentTime', 0);
  await page.waitForLoadState('networkidle');

  await page.getByRole('button', { name: /Fast Forward/ }).click();

  const currentTime = await video.evaluate(e => (e as HTMLVideoElement).currentTime);
  expect(Math.round(currentTime) * 1000).toBe(15_000);
});

test('Rewind back', async () => {
  const page = await app.firstWindow();

  await page.getByRole('navigation').waitFor();
  await page.getByRole('link', { name: /Recordings/ }).click();

  await page.getByRole('link', { name: /Create Highlight/ }).first().click();
  await page.getByTestId(/editor/).waitFor();

  const video = page.locator('video');
  await video.evaluate(e => (e as HTMLVideoElement).currentTime = 20);
  expect(video).toHaveJSProperty('currentTime', 20);
  await page.waitForLoadState('networkidle');

  await page.getByRole('button', { name: /Rewind/ }).last().click();

  const currentTime = await video.evaluate(e => (e as HTMLVideoElement).currentTime);
  expect(Math.round(currentTime) * 1000).toBe(5000);
});

test('Rewind to start', async () => {
  const page = await app.firstWindow();

  await page.getByRole('navigation').waitFor();
  await page.getByRole('link', { name: /Recordings/ }).click();

  await page.getByRole('link', { name: /Create Highlight/ }).first().click();
  await page.getByTestId(/editor/).waitFor();

  const video = page.locator('video');
  await video.evaluate(e => (e as HTMLVideoElement).currentTime = 20);
  expect(video).toHaveJSProperty('currentTime', 20);
  await page.waitForLoadState('networkidle');

  await page.getByRole('button', { name: /Rewind To Start/ }).click();

  const currentTime = await video.evaluate(e => (e as HTMLVideoElement).currentTime);
  expect(Math.round(currentTime) * 1000).toBe(0);
});

test('Skip to end', async () => {
  const page = await app.firstWindow();

  await page.getByRole('navigation').waitFor();
  await page.getByRole('link', { name: /Recordings/ }).click();

  await page.getByRole('link', { name: /Create Highlight/ }).first().click();
  await page.getByTestId(/editor/).waitFor();

  const video = page.locator('video');
  expect(video).toHaveJSProperty('currentTime', 0);
  await page.waitForLoadState('networkidle');

  await page.getByRole('button', { name: /Skip To End/ }).click();

  const duration = await video.evaluate(e => (e as HTMLVideoElement).duration);
  const currentTime = await video.evaluate(e => (e as HTMLVideoElement).currentTime);

  expect(currentTime).toBe(duration);
});

test('Drag time cursor', async () => {
  const page = await app.firstWindow();

  await page.getByRole('navigation').waitFor();
  await page.getByRole('link', { name: /Recordings/ }).click();

  await page.getByRole('link', { name: /Create Highlight/ }).first().click();
  await page.getByTestId(/editor/).waitFor();

  const video = page.locator('video');
  expect(video).toHaveJSProperty('currentTime', 0);

  await page.waitForLoadState('networkidle');

  await page.getByLabel(/Time Cursor/).dragTo(page.getByLabel(/Time Drag Area/), { targetPosition: { y: 0, x: 100 } });

  const currentTime = await video.evaluate(e => (e as HTMLVideoElement).currentTime);
  expect(currentTime).not.toBe(0);
});

test('Create highlight', async () => {
  const page = await app.firstWindow();

  await page.getByRole('navigation').waitFor();
  await page.getByRole('link', { name: /Recordings/ }).click();

  await page.getByRole('link', { name: /Create Highlight/ }).first().click();
  await page.getByTestId(/editor/).waitFor();

  const video = page.locator('video');
  expect(video).toHaveJSProperty('currentTime', 0);

  await page.waitForLoadState('networkidle');

  const draggableAria = page.getByLabel(/Slider Drag Area/);
  await page.getByLabel(/Slider Right/).last().dragTo(draggableAria, { targetPosition: { y: 0, x: 200 } });
  await page.getByLabel(/Slider Left/).dragTo(draggableAria, { force: true, targetPosition: { y: 0, x: 100 } });

  await page.getByRole('button', { name: /Create Highlight/ }).click();
  await page.getByText(/Success/).waitFor();
});
