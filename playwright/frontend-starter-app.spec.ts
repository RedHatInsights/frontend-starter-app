/**
 * E2E Tests — Frontend Starter App
 *
 * WHEN TO ADD TESTS HERE:
 * - Smoke tests that verify the app loads and renders in the real Chrome shell
 * - Integration with Chrome services (auth, navigation, search)
 * - Flows that depend on real backend responses (not mocked)
 *
 * WHEN TO USE STORYBOOK INSTEAD:
 * - Component behavior and interactions (use play functions)
 * - CRUD workflows with mocked APIs (use MSW handler factories)
 * - Visual regression and accessibility checks
 *
 * @environment stage (https://stage.foo.redhat.com:1337)
 * @auth Global setup via @redhat-cloud-services/playwright-test-auth
 * @dependencies Chrome shell, FEO navigation config
 */

import { test, expect } from '@playwright/test';
import { disableCookiePrompt } from '@redhat-cloud-services/playwright-test-auth';

test.describe('frontend starter app', async () => {
  test.beforeEach(async ({ page }): Promise<void> => {
    await disableCookiePrompt(page);
    await page.goto('/', { waitUntil: 'load', timeout: 60000 });
  });

  test('starter app page loads and has the expected content', async ({
    page,
  }) => {
    await page.getByLabel('Expandable search input toggle').click();
    await page.getByLabel('Search input').first().pressSequentially('star');
    await page.getByText('Starter app').first().click();

    await expect(page.getByText('Roles')).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Create role' }),
    ).toBeVisible();
  });
});
