import { afterAll, beforeAll, describe, test } from 'vitest'
import { preview } from 'vite'
import type { PreviewServer } from 'vite'
import { chromium } from 'playwright'
import type { Browser, Page } from 'playwright'
import { expect } from '@playwright/test'

const PORT = 1420

// unstable in Windows, TODO: investigate
describe('basic', async () => {
  let server: PreviewServer
  let browser: Browser
  let page: Page

  beforeAll(async () => {
    server = await preview({ preview: { port: PORT } })
    browser = await chromium.launch({ headless: true })
    page = await browser.newPage()
  })

  afterAll(async () => {
    await browser.close()
    await new Promise<void>((resolve, reject) => {
      server.httpServer.close(error => error ? reject(error) : resolve())
    })
  })

  test('should change count when button clicked', async () => {

    await page.goto("https://playwright.dev/"); // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Playwright/); // create a locator
    const getStarted = page.locator("text=Get Started"); // Expect an attribute "to be strictly equal" to the value.
    await expect(getStarted).toHaveAttribute("href", "/docs/intro"); // Click the get started link.
    await getStarted.click(); // Expects the URL to contain intro.
    await expect(page).toHaveURL(/.*intro/);
    
  }, 60_000)


})