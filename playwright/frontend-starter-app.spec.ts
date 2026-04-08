import { test, expect } from '@playwright/test';
import { disableCookiePrompt } from '@redhat-cloud-services/playwright-test-auth';

test.describe('frontend starter app', async () => {
    test.beforeEach(async ({page}): Promise<void> => {
        await disableCookiePrompt(page);
        await page.goto('/', { waitUntil: 'load', timeout: 60000 });
    });

    test('starter app page loads and has the expected content', async({page}) => {
        // navigate to the sample app and wait for it to load
        await page.getByLabel('Expandable search input toggle').click();
        await page.getByLabel('Search input').first().pressSequentially('star');
        await page.getByText('Starter app').first().click();

        // confirm that the expected content is present
        await expect(page.getByText('Sample Insights App')).toBeVisible();
        await expect(page.getByRole('button', {name: 'Add alert'})).toBeVisible();
        await expect(page.getByRole('link', { name: 'How to handle 500s in app'})).toBeVisible();
    });

});

