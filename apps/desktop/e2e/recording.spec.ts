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

test.afterEach(async() => {
  const page = await app.firstWindow();
  await page.getByRole('link', { name: /Home/ }).click();
})

test('Navigate to recordings page', async () => {
  const page = await app.firstWindow();

  await page.getByRole('navigation').waitFor();
  await page.getByRole('link', { name: /Recordings/ }).click();

  expect(page.getByRole('heading', { name: /Match Recordings/ })).toBeInViewport();
});

test('Watch a recording', async () => {
  const page = await app.firstWindow();

  await page.getByRole('navigation').waitFor();
  await page.getByRole('link', { name: /Recordings/ }).click();

  const recording = page.getByTestId(/recording-card/).first();
  await recording.waitFor();

  await recording.getByTestId(/video-thumbnail/).getByRole('button').click();

  const modal = page.getByTestId(/recording-modal/);
  await modal.waitFor();

  expect(modal).toBeVisible();
  expect(modal).toBeInViewport();

  await modal.getByRole('button', { name: /Close/ }).click();

  const heading = page.getByRole('heading', { name: /Match Recordings/ });
  await heading.waitFor();
});

test('Navigate to associated match', async () => {
  const page = await app.firstWindow();

  await page.getByRole('navigation').waitFor();
  await page.getByRole('link', { name: /Recordings/ }).click();
  expect(page.getByRole('heading', { name: /Match Recordings/ })).toBeInViewport();

  await page.getByRole('link', { name: /View Match/ }).first().click();
  const matchDetailsHeading = page.getByRole('heading', { name: /Match Details/ });
  await matchDetailsHeading.waitFor({ state: 'visible' });

  expect(matchDetailsHeading).toBeInViewport();
});

// test('Delete a recording', async () => {

// });
