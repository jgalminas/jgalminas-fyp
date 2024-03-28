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

test('Navigate to matches page', async () => {
  const page = await app.firstWindow();

  await page.getByRole('navigation').waitFor();
  await page.getByRole('link', { name: /Matches/ }).click();
  await page.getByRole('heading', { name: /Played Matches/ }).waitFor();
});

test('View match details', async () => {
  const page = await app.firstWindow();

  await page.getByRole('navigation').waitFor();
  await page.getByRole('link', { name: /Matches/ }).click();

  const match = page.getByTestId(/match-card/).first();
  await match.waitFor();
  const duration = await match.getByLabel(/Match Duration/).innerText();

  await match.getByRole('link', { name: 'View Details' }).click();
  await page.getByRole('heading', { name: /Match Details/ }).waitFor();
  const detailsDuration = await page.getByText(duration).innerText();

  expect(detailsDuration).toBe(duration);
});

test('View the timeline tab', async () => {
  const page = await app.firstWindow();

  await page.getByRole('navigation').waitFor();
  await page.getByRole('link', { name: /Matches/ }).click();

  const match = page.getByTestId(/match-card/).first();
  await match.waitFor();

  await match.getByRole('link', { name: 'View Details' }).click();
  await page.getByRole('heading', { name: /Match Details/ }).waitFor();

  const tabs = page.getByTestId(/tabs/);
  const timelineLink = tabs.getByRole('link', { name: /Timeline/ });
  await timelineLink.click();
  expect(timelineLink).toHaveAttribute('data-active', 'true');
  await page.getByText(/TEAM GOLD ADVANTAGE/i).waitFor();
});

test('View the highlights tab', async () => {
  const page = await app.firstWindow();

  await page.getByRole('navigation').waitFor();
  await page.getByRole('link', { name: /Matches/ }).click();

  const match = page.getByTestId(/match-card/).first();
  await match.waitFor();

  await match.getByRole('link', { name: 'View Details' }).click();
  await page.getByRole('heading', { name: /Match Details/ }).waitFor();

  const tabs = page.getByTestId(/tabs/);
  const highlightsLink = tabs.getByRole('link', { name: /Highlights/ });
  await highlightsLink.click();
  expect(highlightsLink).toHaveAttribute('data-active', 'true');
});
