# Frontend Starter App

**Seed repository** for creating new Red Hat Hybrid Cloud Console (HCC) frontend applications. Use this as a template when starting a new HCC UI project — it provides a working foundation with all required integrations, build tooling, and testing infrastructure pre-configured.

## Purpose

This is a **starter template and reference implementation** that frontend teams use to:
- Bootstrap new HCC frontend applications quickly
- Follow established HCC frontend patterns and best practices
- Get pre-configured integration with Chrome shell, Module Federation, and FEO
- Start with a working testing infrastructure (unit, component, e2e)
- Learn by example from working code demonstrating common patterns

**Who uses this**: Platform Experience Services teams and other HCC teams building new frontend micro-frontends.

**How to use this**: Fork or clone this repository as the starting point for your new HCC application, then customize it for your specific use case (see "Getting Started with a New Application" below).

## What This Template Provides

### Pre-configured Integrations
- **Chrome Shell Integration**: Authentication, navigation, notifications ready to use
- **Module Federation**: Webpack Module Federation configured for micro-frontend architecture
- **Frontend Operator (FEO)**: Complete deployment configuration template
- **Scalprum**: Cross-micro-frontend state management examples

### Build and Development Tools
- **TypeScript 5** with strict mode enabled
- **Webpack** via `@redhat-cloud-services/frontend-components-config` (FEC)
- **React 18** with modern hooks patterns
- **PatternFly 6** component library integration
- **Hot reload** development server
- **ESLint** with HCC coding standards

### Testing Infrastructure
- **Unit tests**: Jest + Testing Library configured and working
- **Component tests**: Cypress with PatternFly support
- **E2E tests**: Playwright with HCC auth helpers
- **CI/CD**: GitHub Actions workflow for automated testing

### Working Examples
- Sample components demonstrating PatternFly usage
- Scalprum shared stores demo (cross-app state management)
- Chrome integration patterns
- Routing with React Router v6
- FEO configuration for navigation, service tiles, and search

## Architecture Overview

HCC frontend applications are **micro-frontends** that run within the Chrome shell:

```
┌─────────────────────────────────────────────────┐
│  Chrome Shell (Navigation, Auth, Services)      │
│  ┌───────────────────────────────────────────┐  │
│  │  Your Application (Module Federation)    │  │
│  │  - Loaded dynamically                     │  │
│  │  - Routes defined in FEO config          │  │
│  │  - Uses Scalprum for federation          │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

**Key Concepts**:
- **Module Federation**: Your app is loaded as a federated module into Chrome at runtime
- **FEO Configuration**: `deploy/frontend.yaml` defines routes, navigation, service tiles
- **Scalprum**: Enables cross-application communication and shared state
- **Chrome Services**: Auth, navigation, notifications provided by Chrome shell

## Getting Started with a New Application

### 1. Create Your Repository

```bash
# Option A: Use as GitHub template (recommended)
# Click "Use this template" button on GitHub

# Option B: Clone and re-initialize
git clone https://github.com/RedHatInsights/frontend-starter-app.git my-new-app
cd my-new-app
rm -rf .git
git init
```

### 2. Customize for Your Application

Update these files to reflect your new application:

**package.json**:

```json
{
  "name": "my-new-app",  // Change to your app name
  "version": "0.1.0",    // Start at 0.1.0
  "insights": {
    "appname": "my-new-app"  // Must match your app identifier
  }
}
```

**deploy/frontend.yaml**:
- Change `metadata.name` to your app name
- Update `spec.title` to your app display name
- Configure `spec.module.modules[].routes` for your routes
- Update `spec.bundleSegments` for navigation placement
- Configure `spec.serviceTiles` if you want service catalog tiles
- Update `spec.searchEntries` for global search integration
- Change `spec.deploymentRepo` to your GitHub repository
- Update `spec.image` to your Quay.io registry path

**fec.config.js**:

```javascript
module.exports = {
  appUrl: '/apps/my-new-app',  // Your app's base path
  // ... other config
};
```

**README.md**: Replace with your application's documentation

### 3. Install and Run

```bash
# Install dependencies
npm install

# Setup local hosts (one-time)
npm run patch:hosts  # May require sudo

# Start development server
npm start
```

### 4. Remove Example Code

Delete or replace these example files with your actual implementation:
- `src/Routes/` - Replace sample routes with your application routes
- `src/Components/SampleComponent/` - Remove sample component
- `cypress/components/SampleComponent.cy.tsx` - Remove sample test
- `playwright/frontend-starter-app.spec.ts` - Rename or remove starter test

### 5. Update Documentation

- Update this CLAUDE.md file with your application's specific details
- Create `.coderabbit.yml` with your team's code review guidelines
- Update README.md with application-specific setup and documentation

## Tech Stack (Pre-configured)

All dependencies are already configured in `package.json`:

- **Framework**: React 18 with TypeScript 5
- **UI Library**: PatternFly 6 (`@patternfly/react-core`, `@patternfly/react-table`, `@patternfly/react-data-view`)
- **Build Tool**: `@redhat-cloud-services/frontend-components-config` (FEC) - Webpack-based
- **Routing**: React Router v6
- **Micro-frontend**: Scalprum (`@scalprum/react-core`, `@scalprum/core`)
- **Testing**:
  - **Unit**: Jest + Testing Library
  - **Component**: Cypress
  - **E2E**: Playwright
- **Linting**: ESLint with `@redhat-cloud-services/eslint-config-redhat-cloud-services`
- **Node Requirements**: Node >=18.20.8, npm >=8.19.4

**All of these are ready to use** — just `npm install` and start coding.

## Project Structure

```
frontend-starter-app/
├── src/
│   ├── Components/         # Reusable React components
│   ├── Routes/            # Page-level route components
│   │   └── SharedStoresDemo/  # Scalprum shared stores example
│   ├── index.tsx          # Entry point
│   └── RootApp.tsx        # Root application component
├── config/                # Webpack and build configuration
├── build-tools/           # Git submodule (insights-frontend-builder-common)
├── deploy/
│   └── frontend.yaml      # Frontend Operator configuration
├── cypress/
│   └── components/        # Cypress component tests (*.cy.tsx)
├── playwright/            # Playwright e2e tests (*.spec.ts)
├── docs/                  # Documentation
│   ├── frontend-operator/ # FEO configuration guides
│   ├── scalprum-remote-hooks-shared-stores.md
│   └── scalprum-quick-reference.md
├── fec.config.js          # FEC build configuration
├── cypress.config.ts      # Cypress configuration
└── playwright.config.ts   # Playwright configuration
```

## Development Workflow

### Prerequisites

1. **Node.js and npm**: Install Node >=18.20.8 and npm >=8.19.4
2. **Hosts file setup** (one-time): Add entries to `/etc/hosts` for local development:

```bash
# Manual edit: Add to your localhost line in /etc/hosts
127.0.0.1 localhost prod.foo.redhat.com stage.foo.redhat.com

# Or use the automated script:
npm run patch:hosts  # May require sudo
```

3. **Red Hat SSO account**: Required for testing against staging/production environments

### Daily Development

```bash
# Start dev server with hot reload
npm start  # Opens https://stage.foo.redhat.com:1337

# Start with local chrome-service-backend (optional, for Chrome development)
CHROME_SERVICE=8000 npm start

# Run tests while developing
npm test -- --watch           # Unit tests in watch mode
npm run test:cypress:open     # Interactive component testing

# Lint and fix code
npm run lint:js:fix
```

After starting, the dev server runs at `https://stage.foo.redhat.com:1337`. Your application will hot-reload as you make changes.

### Building and Verification

```bash
# Production build
npm run build

# Run all checks (build + lint + test)
npm run verify

# Serve built files locally
npm run static
```

### Key Configuration Files

**When starting a new app, you MUST update these**:

| File | Purpose | What to Change |
|------|---------|----------------|
| `package.json` | Package metadata and dependencies | `name`, `version`, `insights.appname` |
| `fec.config.js` | Build configuration | `appUrl` (must match your app's route) |
| `deploy/frontend.yaml` | FEO deployment config | All metadata, routes, navigation, service tiles |
| `README.md` | Project documentation | Replace with your app's documentation |

**Optional configuration**:
- `cypress.config.ts` - Cypress component test configuration
- `playwright.config.ts` - Playwright e2e test configuration (update `baseURL` if needed)
- `.github/workflows/test.yml` - CI/CD pipeline (customize as needed)

## Code Conventions (Follow These in Your App)

This template follows HCC frontend standards. When building your application using this template, **continue following these patterns** for consistency across HCC applications.

### TypeScript Standards

✅ **DO**:
- Use TypeScript strict mode (already enabled in `tsconfig.json`)
- Provide explicit types for function parameters and return values
- Use interfaces for object shapes (`interface Props { ... }`)
- Let TypeScript infer types for variables when obvious

❌ **DON'T**:
- Use `any` type (strict mode prevents this)
- Use `as any` type assertions (find the proper type instead)
- Disable TypeScript errors with `// @ts-ignore` (fix the underlying issue)

**Example**:

```tsx
// Good
interface UserData {
  id: string;
  name: string;
}

function getUser(userId: string): Promise<UserData> {
  return fetch(`/api/users/${userId}`).then(r => r.json());
}

// Bad
function getUser(userId: any): any {  // ❌ No any types
  return fetch(`/api/users/${userId}`).then(r => r.json());
}
```

### React Patterns

**Component Style**: Functional components with hooks only (no class components)

**File Organization**:

```
src/
├── Components/
│   └── MyComponent/
│       ├── MyComponent.tsx      # Component implementation
│       ├── MyComponent.test.tsx # Jest tests
│       ├── MyComponent.scss     # Component styles
│       └── index.ts            # Re-export for clean imports
└── Routes/
    └── MyPage/
        ├── MyPage.tsx
        ├── MyPage.test.tsx
        └── index.ts
```

**Naming Conventions**:
- **Components**: PascalCase (`UserCard.tsx`, `DataTable.tsx`)
- **Utilities**: kebab-case (`api-utils.ts`, `date-formatter.ts`)
- **Hooks**: camelCase starting with `use` (`useUserData.ts`)
- **Types**: PascalCase (`UserData`, `ApiResponse`)

**Component Structure** (follow this template):

```tsx
import React from 'react';
import { Button, Card } from '@patternfly/react-core';
import './MyComponent.scss';

// Types/Interfaces at top
interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

// Component definition
const MyComponent: React.FC<MyComponentProps> = ({ title, onAction }) => {
  // Hooks first
  const [state, setState] = React.useState(false);

  // Event handlers
  const handleClick = () => {
    setState(!state);
    onAction?.();
  };

  // Render
  return (
    <Card>
      <Button onClick={handleClick}>{title}</Button>
    </Card>
  );
};

export default MyComponent;
```

### PatternFly Usage

**Component Selection**:
- ✅ **Use PatternFly 6 components** for all UI (already configured in `package.json`)
- ✅ **For data tables/lists**: Use `@patternfly/react-data-view` (modern, recommended)
- ⚠️ **Avoid**: Raw `@patternfly/react-table` (legacy, only if DataView can't handle your use case)
- ✅ **For common UI patterns**: Use `@redhat-cloud-services/frontend-components` (alerts, filters, etc.)

**Styling Guidelines**:

```scss
// MyComponent.scss - Use SCSS modules
.my-component {
  // ✅ Use PatternFly CSS variables
  padding: var(--pf-v6-global--spacer--md);
  color: var(--pf-v6-global--Color--100);

  // ❌ Don't hardcode values
  // padding: 16px;
  // color: #333;
}
```

**PatternFly Resources**:
- Component docs: https://www.patternfly.org/
- Use MCP server `hcc-patternfly-data-view` for DataView guidance (already configured in `.mcp.json`)

### Chrome Integration Patterns

**Chrome Hook**: Use `useChrome()` to access Chrome services

```tsx
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

const MyComponent = () => {
  const { updateDocumentTitle, appAction } = useChrome();

  React.useEffect(() => {
    updateDocumentTitle('My Page Title');
    appAction('my-page');
  }, []);

  return <div>My Page Content</div>;
};
```

**Common Chrome Services**:
- `updateDocumentTitle()` - Set page title
- `appAction()` - Notify Chrome of the current page/action
- `isBeta()` - Check if user is in beta environment
- Navigation events - Listen for route changes

### Scalprum Patterns (Advanced)

For **cross-application state management** and **shared stores**:

📖 **See working examples** in:
- `/src/Routes/SharedStoresDemo/` - Complete implementation
- `docs/scalprum-remote-hooks-shared-stores.md` - Full guide
- `docs/scalprum-quick-reference.md` - Quick snippets

**When to use Scalprum shared stores**:
- Sharing state between different micro-frontends
- Event-driven communication across applications
- Synchronizing data without prop drilling

**Most applications won't need this** — it's for advanced cross-app integration.

## Testing Strategy (Pre-configured and Ready to Use)

This template includes three testing layers — all configured and working out of the box. **Add tests as you build your application** following the patterns shown in the example tests.

### Unit Testing (Jest + Testing Library)

**Location**: `src/**/__tests__/*.test.tsx` or alongside source files

**Commands**:

```bash
npm test              # Run all unit tests
npm test -- --watch   # Run in watch mode
npm test -- --coverage # Run with coverage report
```

**Patterns**:
- Test user behavior, not implementation details
- Use Testing Library queries (`getByRole`, `getByLabelText`, etc.)
- Mock external dependencies (API calls, Chrome services)
- Test accessibility (semantic HTML, ARIA attributes)

**Example**:

```tsx
import { render, screen } from '@testing-library/react';
import SampleComponent from './SampleComponent';

test('displays the title', () => {
  render(<SampleComponent title="Hello" />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

### Component Testing (Cypress)

**Location**: `cypress/components/**/*.cy.tsx`

**Commands**:

```bash
npm run test:cypress        # Run headlessly
npm run test:cypress:open   # Interactive mode
```

**Configuration**: `cypress.config.ts`
- Spec pattern: `cypress/components/**/*.cy.{js,jsx,ts,tsx}`
- Uses custom webpack config: `config/webpack.cy.config.js`
- Code coverage enabled via `@cypress/code-coverage`

**Patterns**:
- Test components in isolation with various props and states
- Test user interactions (clicks, form inputs, etc.)
- Test visual appearance and layout
- Fast feedback loop without server dependencies

**Example**:

```tsx
import React from 'react';
import SampleComponent from '../../src/Components/SampleComponent';

describe('SampleComponent', () => {
  it('renders with children', () => {
    cy.mount(<SampleComponent>Hello, World!</SampleComponent>);
    cy.contains('Hello, World!').should('be.visible');
  });
});
```

### E2E Testing with Playwright

**Location**: `playwright/**/*.spec.ts`

**Commands**:

```bash
# Note: Add these to package.json if needed
npx playwright test              # Run all e2e tests
npx playwright test --ui         # Interactive mode
npx playwright test --headed     # See browser
npx playwright show-report       # View HTML report
```

**Configuration**: `playwright.config.ts`
- Test directory: `./playwright`
- Base URL: `https://stage.foo.redhat.com:1337` (override with `PLAYWRIGHT_BASE_URL`)
- Default browser: Chromium
- Retries: 2 on CI, 0 locally
- Timeout: 120s per test, 10s per assertion
- Parallel execution enabled
- **Global setup**: Uses `@redhat-cloud-services/playwright-test-auth` for authentication
- **Storage state**: Authentication state saved to `playwright/.auth/user.json` and reused across tests

**Setup Requirements**:
- **Environment variables**: `E2E_USER` and `E2E_PASSWORD` required for authentication
- **Proxy config**: Tests expect proper proxy configuration (no "Lockdown" message)
- **Stage environment**: Tests run against Red Hat staging environment
- **Auth package**: `@redhat-cloud-services/playwright-test-auth` handles Red Hat SSO authentication

**Authentication Strategy**:
- **Global setup**: Authentication happens once before all tests via `globalSetup`
- **Reusable state**: Login session stored in `playwright/.auth/user.json` and shared across tests
- **No per-test login**: Tests automatically use the authenticated state without manual login
- **Cookie handling**: Import `disableCookiePrompt` from the auth package to block TrustArc prompts

**Patterns**:
- **Cookie prompt handling**: Use `disableCookiePrompt()` from `@redhat-cloud-services/playwright-test-auth`
- **Page object pattern**: Extract common page interactions into reusable functions
- **Waiting strategies**:
  - Use `waitForLoadState('load')` after navigation
  - Use `expect(element).toBeVisible()` for element readiness
  - Avoid fixed timeouts except for staging environment quirks
- **Selectors**: Prefer role-based selectors (`getByRole`, `getByLabel`) over CSS selectors

**Example** (see `playwright/frontend-starter-app.spec.ts`):

```typescript
import { test, expect } from '@playwright/test';
import { disableCookiePrompt } from '@redhat-cloud-services/playwright-test-auth';

test.describe('frontend starter app', () => {
  test.beforeEach(async ({ page }) => {
    await disableCookiePrompt(page);
    await page.goto('/');
  });

  test('page loads with expected content', async ({ page }) => {
    await expect(page.getByText('Sample Insights App')).toBeVisible();
  });
});
```

**Manual Authentication** (if needed for special cases):

```typescript
import { login } from '@redhat-cloud-services/playwright-test-auth';

// Manual login when global setup can't be used
await login(page, process.env.E2E_USER!, process.env.E2E_PASSWORD!);
```

### Browser Compatibility

**Supported Browsers**:
- **Primary**: Chrome/Chromium (latest)
- **Secondary**: Firefox (latest), Safari (latest), Edge (latest)
- **Mobile**: iOS Safari, Chrome Mobile (latest)

**Testing Requirements**:
- Playwright tests run on Chromium by default
- Manual testing required for Firefox/Safari before major releases
- Use CSS Grid/Flexbox (avoid floats or tables for layout)
- Test responsive behavior at: 320px, 768px, 1024px, 1920px widths

### Accessibility Testing

**Requirements**:
- **WCAG 2.1 AA compliance** required for all UI
- Use semantic HTML elements (`<button>`, `<nav>`, `<main>`, etc.)
- Provide ARIA labels for icon buttons and interactive elements
- Ensure keyboard navigation works for all interactive elements
- Test with screen readers (VoiceOver, NVDA)
- Minimum color contrast ratios: 4.5:1 for text, 3:1 for UI components

**PatternFly Accessibility**:
- PatternFly components are accessible by default
- Always provide `aria-label` for icon-only buttons
- Use `aria-describedby` for form field help text
- Test keyboard navigation (Tab, Enter, Escape, Arrow keys)

**Testing Tools**:
- Browser DevTools Accessibility Inspector
- axe DevTools browser extension
- Lighthouse accessibility audits

### CI/CD Testing

**GitHub Actions** (`.github/workflows/test.yml`):
- **Unit tests**: Run on every PR/push to master
- **Component tests**: Run Cypress component tests on every PR
- **Linting**: ESLint checks enforced
- **Coverage**: Jest coverage uploaded to Codecov

**E2E Testing**:
- E2E tests can be run manually or integrated into CI with proper credentials
- Requires `E2E_USER` and `E2E_PASSWORD` environment variables

## Deployment (Setting Up for Your New App)

### Frontend Operator (FEO) Configuration

HCC uses the **Frontend Operator** to manage UI deployments. Your `deploy/frontend.yaml` tells FEO how to deploy and integrate your app.

**Critical fields to update for your app**:

```yaml
apiVersion: cloud.redhat.com/v1alpha1
kind: Frontend
metadata:
  name: my-new-app  # Your app identifier (must match package.json)
spec:
  title: My New App  # Display name in UI
  deploymentRepo: https://github.com/yourorg/my-new-app  # Your repo
  image: quay.io/cloudservices/my-new-app:${IMAGE_TAG}  # Your image

  # Define your navigation
  bundleSegments:
    - segmentId: my-app-nav
      bundleId: insights  # Or appropriate bundle (staging, ansible, etc.)
      position: 100
      navItems:
        - id: my-app
          title: My Application
          href: /insights/my-app

  # Define your module routes
  module:
    manifestLocation: '/apps/my-new-app/fed-mods.json'
    modules:
      - id: 'my-app'
        module: './RootApp'
        routes:
          - pathname: /insights/my-app

  # Optional: Service tiles for the catalog
  serviceTiles:
    - id: my-app-tile
      title: My Application
      href: /insights/my-app
      description: Description of your app
      icon: AppIcon
      section: automation  # Choose appropriate section
      group: automation    # Choose appropriate group

  # Optional: Global search entries
  searchEntries:
    - id: "my-app"
      title: "My Application"
      href: /insights/my-app
      description: "Search result description"
```

**FEO Documentation**: See `docs/frontend-operator/index.md` for complete FEO configuration guide

📖 **Use MCP Server**: The `hcc-feo-mcp` server (configured in `.mcp.json`) provides FEO schemas, templates, and validation

## Common Commands Reference

### Development Commands

| Command | Purpose |
|---------|---------|
| `npm start` | Start dev server with hot reload |
| `npm run build` | Production build |
| `npm run static` | Serve built files locally |
| `npm run verify` | Run build + lint + test (pre-PR check) |

### Testing Commands

| Command | Purpose |
|---------|---------|
| `npm test` | Run Jest unit tests |
| `npm test -- --watch` | Run tests in watch mode |
| `npm test -- --coverage` | Run with coverage report |
| `npm run test:cypress` | Run Cypress component tests (headless) |
| `npm run test:cypress:open` | Open Cypress interactive UI |
| `npx playwright test` | Run Playwright e2e tests |
| `npx playwright test --ui` | Open Playwright interactive UI |

### Linting Commands

| Command | Purpose |
|---------|---------|
| `npm run lint` | Run all linters |
| `npm run lint:js` | Run ESLint |
| `npm run lint:js:fix` | Auto-fix ESLint issues |

### Maintenance Commands

| Command | Purpose |
|---------|---------|
| `npm outdated` | Check for outdated packages |
| `npm update` | Update dependencies (within semver ranges) |
| `npm audit` | Check for security vulnerabilities |
| `npm run patch:hosts` | Update /etc/hosts for local dev |

## Troubleshooting Common Issues

### Build Errors

**Problem**: `Module not found` errors during build
```bash
# Solution: Clear caches and reinstall
rm -rf node_modules .cache dist
npm install
```

**Problem**: TypeScript errors about types
```bash
# Solution: Ensure all @types packages are installed
npm install --save-dev @types/react @types/react-dom
```

### Development Server Issues

**Problem**: Cannot access `https://stage.foo.redhat.com:1337`
```bash
# Solution: Check /etc/hosts configuration
cat /etc/hosts | grep foo.redhat.com

# Should see:
# 127.0.0.1 ... stage.foo.redhat.com prod.foo.redhat.com

# If missing, run:
npm run patch:hosts  # May require sudo
```

**Problem**: Chrome integration not working locally
```bash
# Solution: Run local chrome-service-backend
CHROME_SERVICE=8000 npm start
```

### Test Failures

**Problem**: Playwright tests fail with authentication errors
```bash
# Solution: Set environment variables
export E2E_USER="your-username"
export E2E_PASSWORD="your-password"
npx playwright test
```

**Problem**: Cypress component tests fail to mount
```bash
# Solution: Check webpack config and clear Cypress cache
rm -rf ~/.cache/Cypress
npm run test:cypress
```

### Git Submodule Issues

This template uses `build-tools/` as a git submodule:

```bash
# Initialize submodules (first time clone)
git submodule update --init --recursive

# Update submodules to latest
git submodule update --remote build-tools

# If submodule is out of sync
git submodule sync
git submodule update --init --recursive
```

## Learning Resources

### In This Repository

- 📖 **Frontend Operator Guide**: `docs/frontend-operator/index.md`
- 📖 **Scalprum Shared Stores**: `docs/scalprum-remote-hooks-shared-stores.md`
- 📖 **Scalprum Quick Reference**: `docs/scalprum-quick-reference.md`
- 💡 **Working Example**: `src/Routes/SharedStoresDemo/` - Cross-app state management

### External Documentation

- **PatternFly Components**: https://www.patternfly.org/ - UI component library docs
- **Frontend Components**: https://github.com/RedHatInsights/frontend-components - Shared HCC components
- **HCC Frontend Docs**: http://front-end-docs-insights.apps.ocp4.prod.psi.redhat.com/ - Internal frontend standards
- **React**: https://react.dev/ - React 18 documentation
- **TypeScript**: https://www.typescriptlang.org/ - TypeScript handbook

### Testing Documentation

- **Jest**: https://jestjs.io/ - Unit testing framework
- **Testing Library**: https://testing-library.com/react - React testing utilities
- **Cypress**: https://www.cypress.io/ - Component testing framework
- **Playwright**: https://playwright.dev/ - E2E testing framework

### Getting Help

- **Platform Experience Services team** - Primary maintainers of this template
- **#forum-consoledot-ui** (Slack) - HCC frontend development discussions
- **#platform-experience-services** (Slack) - Team channel

## MCP Servers (AI Assistant Integration)

This template includes MCP (Model Context Protocol) server configurations for AI assistants like Claude Code:

| Server | Purpose |
|--------|---------|
| `hcc-patternfly-data-view` | PatternFly component documentation and examples |
| `hcc-feo-mcp` | Frontend Operator schema validation and templates |

Configured in `.mcp.json` — automatically loaded when using Claude Code in this directory.

## Next Steps After Creating Your App

✅ **Immediate Tasks** (before first commit):
1. Update `package.json` (`name`, `version`, `insights.appname`)
2. Update `deploy/frontend.yaml` (all metadata, routes, navigation)
3. Update `fec.config.js` (`appUrl`)
4. Update `README.md` with your app's documentation
5. Remove example code (`src/Routes/` sample components)
6. Update this `CLAUDE.md` file with app-specific details

✅ **Before First PR**:
1. Configure CI/CD pipeline for building and pushing images
2. Add your app to FEO configuration (work with Platform team)
3. Test deployment to staging environment
4. Add your team's code review guidelines in `.coderabbit.yml`

✅ **Ongoing**:
1. Add tests as you build features (unit, component, e2e)
2. Keep dependencies updated (`npm outdated`, `npm update`)
3. Follow HCC frontend standards and patterns
4. Document your app's specific architecture and patterns
5. Set up monitoring and error tracking for production

## Support and Contributions

**Template Maintainers**: Platform Experience Services team
**GitHub**: https://github.com/RedHatInsights/frontend-starter-app
**Issues**: Report template issues in the GitHub repository

**Contributing improvements to the template**: PRs welcome! This template benefits all HCC frontend teams.
