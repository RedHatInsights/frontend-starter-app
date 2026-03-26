import { defineConfig, devices } from '@playwright/test';
import { currentsReporter } from "@currents/playwright";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './playwright',

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,

  reporter: [currentsReporter()], // 👈🏻 add Currents reporter

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')` */
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'https://stage.foo.redhat.com:1337',

    /* Ignore HTTPS errors */
    ignoreHTTPSErrors: true,
    trace: "on",
    video: "on",
    screenshot: "on",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Timeout for each test */
  timeout: 120000,

  /* Timeout for each assertion */
  expect: {
    timeout: 10000,
  },
});
