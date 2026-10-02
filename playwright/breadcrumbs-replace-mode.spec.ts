import type { Page } from '@playwright/test';
import { expect, test } from './test-utils';

// NOTE: `breadcrumb-demo` is an app-internal React Router route and is NOT a
// registered FEO route (deploy/frontend.yaml only registers /staging/starter).
// Chrome only mounts this app for its registered routes, so a direct
// page.goto('/staging/starter/breadcrumb-demo') does NOT mount the app in
// deployed environments (stage/CI) — the demo (and its breadcrumbs) never
// render. Always reach the demo by client-side navigation from the registered
// /staging/starter route, the same way the main starter-app spec navigates.
//
// Chrome also renders the leading breadcrumb segments itself (e.g. the console
// root and the app nav link) and that set is environment dependent. Assert only
// the app-owned tail crumbs via relative locators (filter by text / last).

async function openBreadcrumbDemo(page: Page): Promise<void> {
  await page.goto('/staging/starter', { waitUntil: 'load', timeout: 60000 });
  await expect(page.getByText('Sample Insights App')).toBeVisible();
  await page.getByRole('link', { name: 'Breadcrumb Demo' }).click();
  await expect(page).toHaveURL(/\/staging\/starter\/breadcrumb-demo$/);
  await page.waitForSelector('.pf-v6-c-breadcrumb__item', { timeout: 10000 });
}

test.describe('Breadcrumbs - Replace Mode (useReplaceBreadcrumbs)', () => {
  test.beforeEach(async ({ page }) => {
    await openBreadcrumbDemo(page);
  });

  test('should show root breadcrumb at base route', async ({ page }) => {
    const breadcrumbs = page.locator('.pf-v6-c-breadcrumb__item');

    await expect(
      breadcrumbs.filter({ hasText: 'Breadcrumb Demo' }),
    ).toHaveCount(1);
    await expect(breadcrumbs.last()).toContainText('Breadcrumb Demo');
  });

  test('should show full breadcrumb trail at item detail route', async ({
    page,
  }) => {
    // Click "View Item 1"
    await page.getByRole('link', { name: 'View Item 1' }).click();
    await expect(page).toHaveURL('/staging/starter/breadcrumb-demo/items/1');

    const breadcrumbs = page.locator('.pf-v6-c-breadcrumb__item');

    await expect(
      breadcrumbs.filter({ hasText: 'Breadcrumb Demo' }),
    ).toBeVisible();
    await expect(breadcrumbs.last()).toContainText('Item 1');
  });

  test('should show full breadcrumb trail at tab route', async ({ page }) => {
    // Navigate to item
    await page.getByRole('link', { name: 'View Item 1' }).click();

    // Navigate to tab
    await page.getByRole('link', { name: 'Overview Tab' }).click();
    await expect(page).toHaveURL(
      '/staging/starter/breadcrumb-demo/items/1/overview',
    );

    const breadcrumbs = page.locator('.pf-v6-c-breadcrumb__item');

    await expect(
      breadcrumbs.filter({ hasText: 'Breadcrumb Demo' }),
    ).toBeVisible();
    await expect(breadcrumbs.filter({ hasText: 'Item 1' })).toBeVisible();
    await expect(breadcrumbs.last()).toContainText('Overview');
  });

  // TODO(RHCLOUD-51825): Re-enable once the missing Item 2 breadcrumb link is resolved.
  test.skip('should navigate back when clicking breadcrumb links', async ({
    page,
  }) => {
    // Navigate to tab
    await page.getByRole('link', { name: 'View Item 2' }).click();
    await page.getByRole('link', { name: 'Details Tab' }).click();
    await expect(page).toHaveURL(
      '/staging/starter/breadcrumb-demo/items/2/details',
    );

    // Click "Item 2" breadcrumb
    await page
      .locator('.pf-v6-c-breadcrumb__item')
      .filter({ hasText: 'Item 2' })
      .locator('a')
      .click();
    await expect(page).toHaveURL('/staging/starter/breadcrumb-demo/items/2');
    await expect(page.getByRole('heading', { name: 'Item 2' })).toBeVisible();

    // Click "Breadcrumb Demo" breadcrumb
    await page
      .locator('.pf-v6-c-breadcrumb__item')
      .filter({ hasText: 'Breadcrumb Demo' })
      .locator('a')
      .click();
    await expect(page).toHaveURL('/staging/starter/breadcrumb-demo');
    await expect(
      page.getByRole('heading', { name: 'Breadcrumb Demo' }),
    ).toBeVisible();
  });

  test('should update breadcrumbs when navigating between items', async ({
    page,
  }) => {
    // Go to Item 1
    await page.getByRole('link', { name: 'View Item 1' }).click();
    await expect(page).toHaveURL('/staging/starter/breadcrumb-demo/items/1');
    const breadcrumbs = page.locator('.pf-v6-c-breadcrumb__item');
    await expect(breadcrumbs.last()).toContainText('Item 1');

    // Go back and click Item 3
    await page.goBack();
    await expect(page).toHaveURL(/\/staging\/starter\/breadcrumb-demo$/);
    await page.getByRole('link', { name: 'View Item 3' }).click();
    await expect(page).toHaveURL('/staging/starter/breadcrumb-demo/items/3');
    await expect(breadcrumbs.last()).toContainText('Item 3');
  });

  // TODO(RHCLOUD-51825): Re-enable once tab navigation reliably updates replacement breadcrumbs.
  test.skip('should show all tab variations', async ({ page }) => {
    await page.getByRole('link', { name: 'View Item 1' }).click();
    const breadcrumbs = page.locator('.pf-v6-c-breadcrumb__item');

    // Test Overview tab
    await page.getByRole('link', { name: 'Overview Tab' }).click();
    await expect(breadcrumbs.last()).toContainText('Overview');

    // Navigate back to item detail before clicking next tab
    await page.getByRole('link', { name: 'Back to Item 1' }).click();

    // Test Details tab
    await page.getByRole('link', { name: 'Details Tab' }).click();
    await expect(breadcrumbs.last()).toContainText('Details');

    // Navigate back to item detail before clicking next tab
    await page.getByRole('link', { name: 'Back to Item 1' }).click();

    // Test Settings tab
    await page.getByRole('link', { name: 'Settings Tab' }).click();
    await expect(breadcrumbs.last()).toContainText('Settings');
  });
});
