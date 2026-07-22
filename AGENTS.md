# Frontend Starter App — Agent Context

React starter template for Red Hat Hybrid Cloud Console (HCC) frontend applications. Built on PatternFly 6 (design system), TanStack Query (server state), Scalprum (module federation), and Storybook as the primary development and testing environment.

**Architecture**: Feature islands in `src/features/`, shared code in `src/shared/`, error pages in `src/Routes/`.

**Testing**: Storybook stories with MSW handlers and `fn()` API spies are the first-class test artifact. Use `npm run test-storybook` for CI runs.

All detailed documentation is in `src/docs/` (MDX). Read the relevant doc before writing code.

---

## Non-negotiables (apply without reading further)

1. **Feature islands** must have a `README.md` explaining what the island owns, which APIs it calls, and any constraints.
2. **`TableView` always requires `useTableState`** — never hand-roll pagination, sort, filter, or selection state with `useState`.
3. **No inline MSW handlers in stories.** Import handler factories from `data/mocks/` directories. If a factory doesn't exist, create one.
4. **Data layer DI**: hooks in `data/queries/` get ALL dependencies from `useAppServices()`. Never import `useChrome()`, `useAddNotification()`, or any platform hook in data layer files.
5. **Query keys via factory pattern.** Define a keys object per domain (`itemKeys`, `userKeys`). Mutations invalidate via keys factory, never with string literals.
6. **Mutations invalidate queries** by calling `queryClient.invalidateQueries({ queryKey: keys.all })`.
7. **Play functions use `step()` closures** — destructure `step` from play context, wrap each logical phase. Re-query DOM inside each step to prevent stale references.
8. **Handler factories are typed against API types.** Use the same types the real code uses so TypeScript catches mock drift at build time.
9. **No hardcoded mock data strings in stories.** Reference seed constants from `data/mocks/db.ts`.
10. Storybook test imports: `import { userEvent, within, expect, fn, waitFor } from 'storybook/test'`.
11. **Use shared interaction helpers** from `src/shared/test-utils/`. Never inline modal waits, notification checks, or form interactions in play functions.
12. **Exports**: Named exports only. Default exports are reserved for two cases: (a) the Module Federation entry point (`AppEntry.tsx`), and (b) lazy-loaded route components (required by `React.lazy()`). Everything else uses named exports exclusively. No barrel files (`index.ts` re-exports) — import from the specific file.
13. **Navigation**: Use `useAppNavigate()` from `src/hooks/useAppNavigate.ts` instead of raw `useNavigate()` from React Router. The app runs under a basename (`/staging/starter`) set by Chrome; raw `useNavigate` produces paths that miss the basename. `useAppNavigate` prepends it automatically and is idempotent (won't double-prepend). The only place `useNavigate` is acceptable is inside `useAppNavigate` itself and in `Routing.tsx` (route-level `<Navigate>` redirects).
14. Conventional commits. No git operations unless explicitly requested.

---

## Key file locations

```text
src/
├── hooks/
│   └── useAppNavigate.ts                 # Basename-aware navigation (use instead of useNavigate)
├── features/                             # Feature islands
│   └── sample/                           # Example CRUD feature
│       ├── RolesPage.tsx                # Roles list with TableView
│       ├── RolesPage.stories.tsx        # User journey stories (browse, create, edit, delete, empty)
│       ├── README.md                    # Feature documentation
│       ├── components/                  # Feature-specific components
│       ├── data/
│       │   ├── queries/items.ts         # Query hooks + keys factory
│       │   └── mocks/
│       │       ├── db.ts               # Mock database (ResettableMockCollection)
│       │       └── handlers.ts         # MSW handler factory with spy callbacks
│       └── hooks/
│           └── useSampleTable.ts        # useTableState instance for this feature
├── shared/
│   ├── components/
│   │   ├── QueryClientSetup.tsx         # TanStack Query provider (test/prod modes)
│   │   └── table-view/
│   │       ├── TableView.tsx           # Table component
│   │       ├── hooks/useTableState.ts  # Table state hook
│   │       ├── types.ts               # Table types
│   │       └── index.ts               # Barrel export
│   ├── contexts/
│   │   └── ServiceContext.tsx           # DI context (useAppServices)
│   ├── services/
│   │   ├── types.ts                    # AppServices interface
│   │   ├── browser.ts                  # Browser services factory
│   │   └── index.ts                    # Barrel export
│   └── test-utils/
│       ├── interactionHelpers.ts       # waitForModal, clearAndType, etc.
│       └── mockCollections.ts          # ResettableMockCollection utility
├── Routes/                              # Error pages
│   ├── OopsPage/
│   └── NoPermissionsPage/
├── docs/                                # Storybook MDX documentation
├── App.tsx                              # Root app component
├── AppEntry.tsx                         # Module federation entry (ServiceProvider + QueryClientSetup)
└── Routing.tsx                          # Route definitions

.storybook/
├── main.ts                              # Storybook config (hcc-storybook-hub)
└── preview.tsx                          # Global decorators, MSW setup, DI providers
```

---

## Docs index

```text
root: src/docs/

getting-started:          Introduction.mdx
query-keys:               QueryKeysFactory.mdx
table-component:          TableView.mdx
data-layer-di:            ServiceContextDI.mdx
storybook-patterns:       StorybookPatterns.mdx
user-journey-tests:       UserJourneyTests.mdx
```
