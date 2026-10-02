import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './playwright',
  testMatch: /\.spec\.(ts|tsx)$/,
  workers: 1,
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  globalSetup: process.env.E2E_PROXY
    ? './playwright/global-setup-with-proxy.ts'
    : require.resolve('@redhat-cloud-services/playwright-test-auth/global-setup'),
  expect: {
    timeout: 10000,
  },
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'https://stage.foo.redhat.com:1337',
    storageState: './playwright/.auth/user.json',
    ignoreHTTPSErrors: true,
    ...(process.env.E2E_PROXY && { proxy: { server: process.env.E2E_PROXY } }),
  },
});
