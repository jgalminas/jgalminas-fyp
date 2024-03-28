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

test('Navigate to the highlights page', async () => {
  const page = await app.firstWindow();

  await page.getByRole('navigation').waitFor();
  await page.getByRole('link', { name: /Highlights/ }).click();
  await page.getByRole('heading', { name: /All Highlights/ }).waitFor();
});

test('Watch a highlight', async () => {
  const page = await app.firstWindow();

  await page.getByRole('navigation').waitFor();
  await page.getByRole('link', { name: /Highlights/ }).click();

  const highlight = page.getByTestId(/highlight-card/).first();
  await highlight.waitFor();

  await highlight.getByTestId(/video-thumbnail/).getByRole('button').click();

  const modal = page.getByTestId(/highlight-modal/);
  await modal.waitFor();

  expect(modal).toBeVisible();
  expect(modal).toBeInViewport();

  await modal.getByRole('button', { name: /Close/ }).click();

  const heading = page.getByRole('heading', { name: /All Highlights/ });
  await heading.waitFor();
});

test('Navigate to associated match', async () => {
  const page = await app.firstWindow();

  await page.getByRole('navigation').waitFor();
  await page.getByRole('link', { name: /Highlights/ }).click();
  expect(page.getByRole('heading', { name: /All Highlights/ })).toBeInViewport();

  await page.getByRole('link', { name: /View Match/ }).first().click();
  await page.getByRole('heading', { name: /Match Details/ }).waitFor();
});

// test('Delete a highlight', async () => {

// });
