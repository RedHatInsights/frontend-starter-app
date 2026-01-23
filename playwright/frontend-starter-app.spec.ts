import { Page, test, expect } from '@playwright/test';

test.use({ ignoreHTTPSErrors: true });

// This can be changed to hit stage directly, but by default devs should be using stage.foo
const APP_TEST_HOST_PORT = 'stage.foo.redhat.com:1337';

// Prevents inconsistent cookie prompting that is problematic for UI testing
async function disableCookiePrompt(page: Page) {
    await page.route('**/*', async (route, request) => {
        if (request.url().includes('consent.trustarc.com') && request.resourceType() !== 'document') {
            await route.abort();
        } else {
            await route.continue();
        }
    });
}

async function login(page: Page, user: string, password: string): Promise<void> {
    // Fail in a friendly way if the proxy config is not set up correctly
    await expect(page.locator("text=Lockdown"), 'proxy config incorrect').toHaveCount(0)

    await disableCookiePrompt(page)

    // Wait for and fill username field
    await page.getByLabel('Red Hat login').first().fill(user);
    await page.getByRole('button', { name: 'Next' }).click();

    // Wait for and fill password field
    await page.getByLabel('Password').first().fill(password);
    await page.getByRole('button', { name: 'Log in' }).click();

    // confirm login was valid
    await expect(page.getByText('Invalid login')).not.toBeVisible();
}

test.describe('frontend starter app', async () => {
    test.beforeEach(async ({page}): Promise<void> => {
        await page.goto(`https://${APP_TEST_HOST_PORT}`, { waitUntil: 'load', timeout: 60000 });
        const loggedIn = await page.getByText('Hi,').isVisible();
        if (!loggedIn) {
            const user = process.env.E2E_USER!;
            const password = process.env.E2E_PASSWORD!;
            // make sure the SSO prompt is loaded for login
            await page.waitForLoadState("load");
            await expect(page.locator("#username-verification")).toBeVisible();
            await login(page, user, password);
            await page.waitForLoadState("load");
            await expect(page.getByText('Invalid login')).not.toBeVisible();
            // long wait for the page to load; stage can be delicate
            await page.waitForTimeout(5000);
            await expect(page.getByRole('button', { name: 'Add widgets' }), 'dashboard not displayed').toBeVisible();

            // conditionally accept cookie prompt
            const acceptAllButton = page.getByRole('button', { name: 'Accept all'});
            if (await acceptAllButton.isVisible()) {
                await acceptAllButton.click();
            }
        }
    });

    test('starter app page loads and has the expected content', async({page}) => {
        // navigate to the sample app and wait for it to load
        await page.getByLabel('Expandable search input toggle').click();
        await page.getByLabel('Search input').first().pressSequentially('star');
        await page.getByText('Starter app').click();
        // await page.locator('[data-quickstart-id=staging_foo_starter]').click();


        // confirm that the expected content is present
        await expect(page.getByText('Sample Insights App')).toBeVisible();
        await expect(page.getByRole('button', {name: 'Add alert'})).toBeVisible();
        await expect(page.getByRole('link', { name: 'How to handle 500s in app'})).toBeVisible();
    });

});

