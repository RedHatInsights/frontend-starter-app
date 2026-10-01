import { chromium, type FullConfig, type Page } from 'playwright';
import { disableCookiePrompt } from './test-utils';

async function login(page: Page, user: string, password: string, baseURL: string) {
  const lockdownCount = await page.locator('text=Lockdown').count();
  if (lockdownCount > 0) {
    throw new Error('Proxy config incorrect - Lockdown page detected');
  }

  await page.getByLabel('Red Hat login').first().fill(user);
  await page.getByRole('button', { name: 'Next' }).click();

  await page.getByLabel('Password').first().fill(password);
  await page.getByRole('button', { name: 'Log in' }).click();

  await page.waitForURL(`${baseURL}/**`, { timeout: 60000 });

  await page.getByText('Hi,').waitFor({ state: 'visible', timeout: 60000 });
}

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

    await login(page, user, password, baseURL as string);

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
