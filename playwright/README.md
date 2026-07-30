# Playwright E2E Tests

## Setup

### Prerequisites

1. **Environment variables** - Required for authentication:
   ```bash
   export E2E_USER="your-username"
   export E2E_PASSWORD="your-password"
   ```

2. **Dependencies**:
   ```bash
   npm install
   ```

### Running Tests

```bash
# Run all tests (headless, with overlay disabled)
npm run playwright

# Run specific test file
npm run playwright -- breadcrumbs-incremental-mode.spec.ts

# Run with UI (interactive)
npm run playwright -- --ui

# Run with headed browser (see browser)
npm run playwright -- --headed

# Run in debug mode
npm run playwright -- --debug

# View test report
npx playwright show-report
```

## Test Structure

### Test Files

- `breadcrumbs-incremental-mode.spec.ts` - Tests incremental breadcrumb mode (`useBreadcrumbs`)
- `breadcrumbs-replace-mode.spec.ts` - Tests replace breadcrumb mode (`useReplaceBreadcrumbs`)

### Cookie Prompt Handling

Tests disable the TrustArc cookie prompt in `test.beforeEach` using `disableCookiePrompt()` from `./test-utils` (re-exported from `@redhat-cloud-services/playwright-test-auth`):

```ts
test.beforeEach(async ({ page }) => {
  await disableCookiePrompt(page);
});
```

### Global Setup (`global-setup-with-proxy.ts`)

Handles authentication before all tests:
- Logs in to Red Hat SSO using test credentials
- Saves authentication state to `playwright/.auth/user.json`
- Runs once before test suite

## Authentication

Tests use `@redhat-cloud-services/playwright-test-auth` package:
- **Global setup**: Single login before all tests
- **Storage state**: Reuses authentication across tests
- **No per-test login**: Tests start already authenticated

## Configuration

See `playwright.config.ts` for full configuration:
- Base URL: `https://stage.foo.redhat.com:1337` (override with `PLAYWRIGHT_BASE_URL`)
- Browser: Chromium
- Retries: 2 on CI, 0 locally
- Timeout: 120s per test, 10s per assertion
- Storage state: `playwright/.auth/user.json`

## Troubleshooting

### Authentication errors

Ensure `E2E_USER` and `E2E_PASSWORD` are set:
```bash
export E2E_USER=""
export E2E_PASSWORD=""
```

### Tests timing out

- Increase timeout in `playwright.config.ts`
- Check staging environment is responsive
- Verify network connectivity to `stage.foo.redhat.com`

### Storage state missing

Delete and regenerate:
```bash
rm -rf playwright/.auth
npm run playwright
```
