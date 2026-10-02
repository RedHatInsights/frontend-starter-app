import type { Page } from '@playwright/test';
import { expect, test } from './test-utils';

// NOTE: `breadcrumb-demo` (and its nested routes) are app-internal React Router
// routes, NOT registered FEO routes (deploy/frontend.yaml only registers
// /staging/starter). Chrome only mounts this app for its registered routes, so a
// direct page.goto() to a breadcrumb-demo sub-path does NOT mount the app in
// deployed environments (stage/CI) and nothing renders. Always reach these
// routes by client-side navigation from the registered /staging/starter route.
//
// Chrome also renders the leading breadcrumb segments itself (environment
// dependent), so assert only the app-owned tail crumbs via relative locators.

/**
 * Returns a locator for the breadcrumb navigation landmark.
 * Uses the semantic `navigation` role with accessible name instead of CSS classes.
 */
function getBreadcrumbNav(page: Page) {
  return page.getByRole('navigation', { name: /breadcrumb/i });
}

async function openIncrementalItems(page: Page): Promise<void> {
  await page.goto('/staging/starter', { waitUntil: 'load', timeout: 60000 });
  await expect(page.getByText('Sample Insights App')).toBeVisible();
  await page.getByRole('link', { name: 'Breadcrumb Demo' }).click();
  await expect(page).toHaveURL(/\/staging\/starter\/breadcrumb-demo$/);
  await page.getByRole('tab', { name: 'Incremental Mode' }).click();
  await page.getByRole('link', { name: 'View Items List' }).click();
  await expect(page).toHaveURL('/staging/starter/breadcrumb-demo/nested/items');
  await expect(
    getBreadcrumbNav(page).getByRole('listitem').filter({ hasText: 'Items' }),
  ).toBeVisible({ timeout: 10000 });
}

test.describe('Breadcrumbs - Incremental Mode (useBreadcrumbs)', () => {
  test.beforeEach(async ({ page }) => {
    await openIncrementalItems(page);
  });

  test('should show breadcrumb trail at items list route', async ({ page }) => {
    const breadcrumbs = getBreadcrumbNav(page).getByRole('listitem');

    await expect(
      breadcrumbs.filter({ hasText: 'Breadcrumb Demo' }),
    ).toBeVisible();
    await expect(breadcrumbs.last()).toContainText('Items');
  });

  test('should show full breadcrumb trail at item detail route', async ({
    page,
  }) => {
    await page.getByRole('link', { name: 'View Item 1' }).click();
    await expect(page).toHaveURL(
      '/staging/starter/breadcrumb-demo/nested/items/1',
    );

    const breadcrumbs = getBreadcrumbNav(page).getByRole('listitem');

    await expect(
      breadcrumbs.filter({ hasText: 'Breadcrumb Demo' }),
    ).toBeVisible();
    await expect(breadcrumbs.filter({ hasText: 'Items' })).toBeVisible();
    await expect(breadcrumbs.last()).toContainText('Item 1');
  });

  test('should show full breadcrumb trail at tab route', async ({ page }) => {
    await page.getByRole('link', { name: 'View Item 2' }).click();
    await page.getByRole('link', { name: 'Overview Tab' }).click();
    await expect(page).toHaveURL(
      '/staging/starter/breadcrumb-demo/nested/items/2/overview',
    );

    const breadcrumbs = getBreadcrumbNav(page).getByRole('listitem');

    await expect(
      breadcrumbs.filter({ hasText: 'Breadcrumb Demo' }),
    ).toBeVisible();
    await expect(breadcrumbs.filter({ hasText: 'Items' })).toBeVisible();
    await expect(breadcrumbs.filter({ hasText: 'Item 2' })).toBeVisible();
    await expect(breadcrumbs.last()).toContainText('Overview');
  });

  test('should navigate back when clicking breadcrumb links', async ({
    page,
  }) => {
    const nav = getBreadcrumbNav(page);

    await page.getByRole('link', { name: 'View Item 3' }).click();
    await page.getByRole('link', { name: 'Settings Tab' }).click();
    await expect(page).toHaveURL(
      '/staging/starter/breadcrumb-demo/nested/items/3/settings',
    );

    // Click "Item 3" breadcrumb link
    await nav.getByRole('link', { name: 'Item 3' }).click();
    await expect(page).toHaveURL(
      '/staging/starter/breadcrumb-demo/nested/items/3',
    );
    await expect(page.getByRole('heading', { name: 'Item 3' })).toBeVisible();

    // Click "Items" breadcrumb link
    await nav.getByRole('link', { name: 'Items' }).click();
    await expect(page).toHaveURL(
      '/staging/starter/breadcrumb-demo/nested/items',
    );
    await expect(
      page.getByRole('heading', { name: 'Items', exact: true }),
    ).toBeVisible();
  });

  test('should only show content for exact route match', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Items', exact: true }),
    ).toBeVisible();
    await expect(page.getByText('Available Items')).toBeVisible();

    await page.getByRole('link', { name: 'View Item 1' }).click();
    await expect(page.getByRole('heading', { name: 'Item 1' })).toBeVisible();
    await expect(page.getByText('Item Details')).toBeVisible();
    await expect(page.getByText('Available Items')).not.toBeVisible();

    await page.getByRole('link', { name: 'Overview Tab' }).click();
    await expect(
      page.getByText('This is the Overview tab for Item 1'),
    ).toBeVisible();
    await expect(page.getByText('Item Details')).not.toBeVisible();
  });

  test('should show full trail at a deep tab route (via navigation)', async ({
    page,
  }) => {
    // Navigate to the deep route via client-side clicks (a direct page.goto to
    // this unregistered sub-path would not mount the app in stage/CI).
    await page.getByRole('link', { name: 'View Item 2' }).click();
    await page.getByRole('link', { name: 'Details Tab' }).click();
    await expect(page).toHaveURL(
      '/staging/starter/breadcrumb-demo/nested/items/2/details',
    );

    const breadcrumbs = getBreadcrumbNav(page).getByRole('listitem');
    await expect(
      breadcrumbs.filter({ hasText: 'Breadcrumb Demo' }),
    ).toBeVisible();
    await expect(breadcrumbs.filter({ hasText: 'Items' })).toBeVisible();
    await expect(breadcrumbs.filter({ hasText: 'Item 2' })).toBeVisible();
    await expect(breadcrumbs.last()).toContainText('Details');

    await expect(
      page.getByText('This is the details tab for Item 2'),
    ).toBeVisible();
  });

  test('should show all tab variations', async ({ page }) => {
    await page.getByRole('link', { name: 'View Item 1' }).click();
    const breadcrumbs = getBreadcrumbNav(page).getByRole('listitem');

    await page.getByRole('link', { name: 'Overview Tab' }).click();
    await expect(breadcrumbs.last()).toContainText('Overview');

    // Navigate back to item detail before clicking next tab
    await page.getByRole('link', { name: 'Back to Item 1' }).click();

    await page.getByRole('link', { name: 'Details Tab' }).click();
    await expect(breadcrumbs.last()).toContainText('Details');

    // Navigate back to item detail before clicking next tab
    await page.getByRole('link', { name: 'Back to Item 1' }).click();

    await page.getByRole('link', { name: 'Settings Tab' }).click();
    await expect(breadcrumbs.last()).toContainText('Settings');
  });
});
