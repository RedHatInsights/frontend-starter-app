import { test, expect } from '@playwright/test';
import { disableCookiePrompt } from './test-utils';

test.describe('Breadcrumbs - Replace Mode (useReplaceBreadcrumbs)', () => {
  test.beforeEach(async ({ page }) => {
    await disableCookiePrompt(page);
    await page.goto('/staging/starter/breadcrumb-demo', { waitUntil: 'load' });
    // Wait for page to be fully loaded
    await page.waitForSelector('.pf-v6-c-breadcrumb__item', { timeout: 10000 });
  });

  test('should show root breadcrumb at base route', async ({ page }) => {
    const breadcrumbs = page.locator('.pf-v6-c-breadcrumb__item');

    await expect(breadcrumbs).toHaveCount(3);
    await expect(breadcrumbs.nth(0)).toContainText('staging');
    await expect(breadcrumbs.nth(1)).toContainText('Starter app link');
    await expect(breadcrumbs.nth(2)).toContainText('Breadcrumb Demo');
  });

  test('should show full breadcrumb trail at item detail route', async ({ page }) => {
    // Click "View Item 1"
    await page.getByRole('link', { name: 'View Item 1' }).click();
    await expect(page).toHaveURL('/staging/starter/breadcrumb-demo/items/1');

    const breadcrumbs = page.locator('.pf-v6-c-breadcrumb__item');

    await expect(breadcrumbs).toHaveCount(4);
    await expect(breadcrumbs.nth(0)).toContainText('staging');
    await expect(breadcrumbs.nth(1)).toContainText('Starter app link');
    await expect(breadcrumbs.nth(2)).toContainText('Breadcrumb Demo');
    await expect(breadcrumbs.nth(3)).toContainText('Item 1');
  });

  test('should show full breadcrumb trail at tab route', async ({ page }) => {
    // Navigate to item
    await page.getByRole('link', { name: 'View Item 1' }).click();

    // Navigate to tab
    await page.getByRole('link', { name: 'Overview Tab' }).click();
    await expect(page).toHaveURL('/staging/starter/breadcrumb-demo/items/1/overview');

    const breadcrumbs = page.locator('.pf-v6-c-breadcrumb__item');

    await expect(breadcrumbs).toHaveCount(5);
    await expect(breadcrumbs.nth(0)).toContainText('staging');
    await expect(breadcrumbs.nth(1)).toContainText('Starter app link');
    await expect(breadcrumbs.nth(2)).toContainText('Breadcrumb Demo');
    await expect(breadcrumbs.nth(3)).toContainText('Item 1');
    await expect(breadcrumbs.nth(4)).toContainText('Overview');
  });

  test('should navigate back when clicking breadcrumb links', async ({ page }) => {
    // Navigate to tab
    await page.getByRole('link', { name: 'View Item 2' }).click();
    await page.getByRole('link', { name: 'Details Tab' }).click();
    await expect(page).toHaveURL('/staging/starter/breadcrumb-demo/items/2/details');

    // Click "Item 2" breadcrumb
    await page.locator('.pf-v6-c-breadcrumb__item').filter({ hasText: 'Item 2' }).locator('a').click();
    await expect(page).toHaveURL('/staging/starter/breadcrumb-demo/items/2');
    await expect(page.getByRole('heading', { name: 'Item 2' })).toBeVisible();

    // Click "Breadcrumb Demo" breadcrumb
    await page.locator('.pf-v6-c-breadcrumb__item').filter({ hasText: 'Breadcrumb Demo' }).locator('a').click();
    await expect(page).toHaveURL('/staging/starter/breadcrumb-demo');
    await expect(page.getByRole('heading', { name: 'Breadcrumb Demo' })).toBeVisible();
  });

  test('should update breadcrumbs when navigating between items', async ({ page }) => {
    // Go to Item 1
    await page.getByRole('link', { name: 'View Item 1' }).click();
    let breadcrumbs = page.locator('.pf-v6-c-breadcrumb__item');
    await expect(breadcrumbs.nth(3)).toContainText('Item 1');

    // Go back and click Item 3
    await page.goBack();
    await page.getByRole('link', { name: 'View Item 3' }).click();
    breadcrumbs = page.locator('.pf-v6-c-breadcrumb__item');
    await expect(breadcrumbs.nth(3)).toContainText('Item 3');
  });

  test('should show all tab variations', async ({ page }) => {
    await page.getByRole('link', { name: 'View Item 1' }).click();

    // Test Overview tab
    await page.getByRole('link', { name: 'Overview Tab' }).click();
    let breadcrumbs = page.locator('.pf-v6-c-breadcrumb__item');
    await expect(breadcrumbs.nth(4)).toContainText('Overview');

    // Navigate back to item detail before clicking next tab
    await page.getByRole('link', { name: 'Back to Item 1' }).click();

    // Test Details tab
    await page.getByRole('link', { name: 'Details Tab' }).click();
    breadcrumbs = page.locator('.pf-v6-c-breadcrumb__item');
    await expect(breadcrumbs.nth(4)).toContainText('Details');

    // Navigate back to item detail before clicking next tab
    await page.getByRole('link', { name: 'Back to Item 1' }).click();

    // Test Settings tab
    await page.getByRole('link', { name: 'Settings Tab' }).click();
    breadcrumbs = page.locator('.pf-v6-c-breadcrumb__item');
    await expect(breadcrumbs.nth(4)).toContainText('Settings');
  });
});
