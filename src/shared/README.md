# src/shared/

Infrastructure code used across all feature islands. Nothing here is feature-specific — if it is, it belongs in `src/features/<island>/` instead.

## Files

| File | What it is |
|------|------------|
| `AppServices.types.ts` | `AppServices` interface — the DI contract (`axios`, `notify`, `getToken`, `environment`) |
| `AppServices.browser.ts` | Browser wiring: axios with 401 interceptor, `createBrowserServices()` factory |
| `ServiceContext.tsx` | React Context + `useAppServices()` hook for dependency injection |
| `QueryClientSetup.tsx` | TanStack Query provider, dual-mode: production (caching) / test (no cache) |
| `interactionHelpers.ts` | Storybook play function helpers: `waitForModal`, `waitForContentReady`, `clearAndType`, etc. |
| `mockCollections.ts` | `createResettableCollection()` — in-memory mock DB for Storybook stories |

## Why these exist

### ServiceContext DI

Data hooks get all dependencies (`axios`, `notify`, `getToken`, `environment`) from `useAppServices()` instead of importing Chrome hooks directly. This means:

- **Storybook stories work without Chrome** — inject MSW-backed axios and a mock notifier, no complex Chrome mocking needed.
- **Tests stay fast** — no global state, no Redux store setup, just pass the services you need.
- **Feature code is environment-agnostic** — the same hook works in browser, Storybook, and CLI contexts.

### TanStack Query

TanStack Query is an **async state manager**, not a state management library. It replaces the `useEffect` + `useState` + `loading` + `error` boilerplate that every developer writes wrong (race conditions, stale closures, missing cleanup). See the [TanStack FAQ](https://tanstack.com/query/v5/docs/framework/react/guides/does-this-replace-client-state) for why this is not a Redux replacement — it manages server state, not client state.

### Storybook-first testing

Test UI with Storybook stories and play functions. Jest is only for pure utility functions with no UI. Play functions run real user interactions against real (MSW-mocked) APIs, catching integration bugs that unit tests miss.

### Why Cypress was removed

Cypress was phased out in favor of Playwright for E2E and Storybook for component testing. Storybook play functions cover the same ground as Cypress component tests with better DX (hot reload, visual debugging, shareable stories).

## Rules

- Nothing here imports from `src/features/` — shared code must not depend on feature code.
- New files should have a clear reason to be shared. If only one feature uses it, it belongs in that feature.
