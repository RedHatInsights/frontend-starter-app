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

## Rules

- Nothing here imports from `src/features/` — shared code must not depend on feature code.
- New files should have a clear reason to be shared. If only one feature uses it, it belongs in that feature.
