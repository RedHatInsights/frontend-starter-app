import type { FullConfig } from '@playwright/test';
import { chromium } from 'playwright';
import { disableCookiePrompt, login } from './test-utils';

// The package's global setup in v0.0.2 does not forward use.proxy.
// Keep browser setup here for E2E_PROXY support and delegate auth to the package.
async function globalSetup(config: FullConfig) {
  const { storageState, baseURL, proxy } = config.projects[0].use;

  if (!storageState) {
    return;
  }

  const browser = await chromium.launch();
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    baseURL: baseURL as string,
    proxy: proxy,
  });
  const page = await context.newPage();

  try {
    await disableCookiePrompt(page);

    await page.goto(baseURL as string || '/', { waitUntil: 'load', timeout: 60000 });

    const user = process.env.E2E_USER;
    const password = process.env.E2E_PASSWORD;

    if (!user || !password) {
      throw new Error('E2E_USER and E2E_PASSWORD environment variables must be set');
    }

    await page.waitForLoadState('load');

    await login(page, user, password);

    await context.storageState({ path: storageState as string });

    console.log('✅ Authentication state saved successfully');
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
}

export default globalSetup;
