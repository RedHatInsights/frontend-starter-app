import { test as base, expect } from '@playwright/test';
import {
  disableCookiePrompt,
  login,
} from '@redhat-cloud-services/playwright-test-auth';

export { expect, disableCookiePrompt, login };

/**
 * Custom test fixture that automatically calls disableCookiePrompt on every
 * page. disableCookiePrompt works via page.route() (a per-page network
 * interceptor), so it cannot be persisted through storageState and must be
 * applied to each new page instance.
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    await disableCookiePrompt(page);
    await use(page);
  },
});

export const STARTER_APP_PATH = '/staging/starter';

export const PAGE_LOAD_TIMEOUT = 60000;
export const ELEMENT_VISIBLE_TIMEOUT = 10000;
