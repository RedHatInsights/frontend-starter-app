import { test, expect } from '@playwright/test';
import { disableCookiePrompt } from './test-utils';

test.describe('Breadcrumbs - Incremental Mode (useBreadcrumbs)', () => {
  test.beforeEach(async ({ page }) => {
    await disableCookiePrompt(page);
    await page.goto('/staging/starter/breadcrumb-demo/nested/items', { waitUntil: 'load' });
    await page.waitForSelector('.pf-v6-c-breadcrumb__item', { timeout: 10000 });
  });

  test('should show breadcrumb trail at items list route', async ({ page }) => {
    const breadcrumbs = page.locator('.pf-v6-c-breadcrumb__item');

    await expect(breadcrumbs).toHaveCount(4);
    await expect(breadcrumbs.nth(0)).toContainText('staging');
    await expect(breadcrumbs.nth(1)).toContainText('Starter app link');
    await expect(breadcrumbs.nth(2)).toContainText('Breadcrumb Demo');
    await expect(breadcrumbs.nth(3)).toContainText('Items');
  });

  test('should show full breadcrumb trail at item detail route', async ({ page }) => {
    await page.getByRole('link', { name: 'View Item 1' }).click();
    await expect(page).toHaveURL('/staging/starter/breadcrumb-demo/nested/items/1');

    const breadcrumbs = page.locator('.pf-v6-c-breadcrumb__item');

    await expect(breadcrumbs).toHaveCount(5);
    await expect(breadcrumbs.nth(0)).toContainText('staging');
    await expect(breadcrumbs.nth(1)).toContainText('Starter app link');
    await expect(breadcrumbs.nth(2)).toContainText('Breadcrumb Demo');
    await expect(breadcrumbs.nth(3)).toContainText('Items');
    await expect(breadcrumbs.nth(4)).toContainText('Item 1');
  });

  test('should show full breadcrumb trail at tab route', async ({ page }) => {
    await page.getByRole('link', { name: 'View Item 2' }).click();
    await page.getByRole('link', { name: 'Overview Tab' }).click();
    await expect(page).toHaveURL('/staging/starter/breadcrumb-demo/nested/items/2/overview');

    const breadcrumbs = page.locator('.pf-v6-c-breadcrumb__item');

    await expect(breadcrumbs).toHaveCount(6);
    await expect(breadcrumbs.nth(0)).toContainText('staging');
    await expect(breadcrumbs.nth(1)).toContainText('Starter app link');
    await expect(breadcrumbs.nth(2)).toContainText('Breadcrumb Demo');
    await expect(breadcrumbs.nth(3)).toContainText('Items');
    await expect(breadcrumbs.nth(4)).toContainText('Item 2');
    await expect(breadcrumbs.nth(5)).toContainText('Overview');
  });

  test('should navigate back when clicking breadcrumb links', async ({ page }) => {
    await page.getByRole('link', { name: 'View Item 3' }).click();
    await page.getByRole('link', { name: 'Settings Tab' }).click();
    await expect(page).toHaveURL('/staging/starter/breadcrumb-demo/nested/items/3/settings');

    await page.locator('.pf-v6-c-breadcrumb__item').filter({ hasText: 'Item 3' }).locator('a').click();
    await expect(page).toHaveURL('/staging/starter/breadcrumb-demo/nested/items/3');
    await expect(page.getByRole('heading', { name: 'Item 3' })).toBeVisible();

    await page.locator('.pf-v6-c-breadcrumb__item').filter({ hasText: 'Items' }).locator('a').click();
    await expect(page).toHaveURL('/staging/starter/breadcrumb-demo/nested/items');
    await expect(page.getByRole('heading', { name: 'Items', exact: true })).toBeVisible();
  });

  test('should only show content for exact route match', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Items', exact: true })).toBeVisible();
    await expect(page.getByText('Available Items')).toBeVisible();

    await page.getByRole('link', { name: 'View Item 1' }).click();
    await expect(page.getByRole('heading', { name: 'Item 1' })).toBeVisible();
    await expect(page.getByText('Item Details')).toBeVisible();
    await expect(page.getByText('Available Items')).not.toBeVisible();

    await page.getByRole('link', { name: 'Overview Tab' }).click();
    await expect(page.getByText('This is the Overview tab for Item 1')).toBeVisible();
    await expect(page.getByText('Item Details')).not.toBeVisible();
  });

  test('should handle direct navigation to deep route', async ({ page }) => {
    await page.goto('/staging/starter/breadcrumb-demo/nested/items/2/details');

    const breadcrumbs = page.locator('.pf-v6-c-breadcrumb__item');
    await expect(breadcrumbs).toHaveCount(6);
    await expect(breadcrumbs.nth(0)).toContainText('staging');
    await expect(breadcrumbs.nth(1)).toContainText('Starter app link');
    await expect(breadcrumbs.nth(2)).toContainText('Breadcrumb Demo');
    await expect(breadcrumbs.nth(3)).toContainText('Items');
    await expect(breadcrumbs.nth(4)).toContainText('Item 2');
    await expect(breadcrumbs.nth(5)).toContainText('Details');

    await expect(page.getByText('This is the details tab for Item 2')).toBeVisible();
  });

  test('should show all tab variations', async ({ page }) => {
    await page.getByRole('link', { name: 'View Item 1' }).click();

    await page.getByRole('link', { name: 'Overview Tab' }).click();
    await expect(page.locator('.pf-v6-c-breadcrumb__item').nth(5)).toContainText('Overview');

    // Navigate back to item detail before clicking next tab
    await page.getByRole('link', { name: 'Back to Item 1' }).click();

    await page.getByRole('link', { name: 'Details Tab' }).click();
    await expect(page.locator('.pf-v6-c-breadcrumb__item').nth(5)).toContainText('Details');

    // Navigate back to item detail before clicking next tab
    await page.getByRole('link', { name: 'Back to Item 1' }).click();

    await page.getByRole('link', { name: 'Settings Tab' }).click();
    await expect(page.locator('.pf-v6-c-breadcrumb__item').nth(5)).toContainText('Settings');
  });
});
