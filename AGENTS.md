# AI Agent Guide

This document helps AI coding agents (Claude Code, Copilot, Cursor, etc.)
work effectively with this codebase.

## Architecture

HCC micro-frontend running inside the Chrome shell via Module Federation.
See `CLAUDE.md` for full architecture details.

## Key Patterns

### Feature Islands (`src/features/`)
Each feature is self-contained: components, hooks, queries, mocks, stories,
and docs co-located in one folder. Features should not import from each other.

### ServiceContext DI (`src/shared/ServiceContext.tsx`)
Components use `useAppServices()` instead of importing `useChrome()` directly.
This makes components testable in Storybook without Chrome.
See `src/shared/WHY-ServiceContext.md`.

### TanStack Query (`src/shared/QueryClientSetup.tsx`)
Server state is managed with TanStack Query — no `useEffect` + `useState`
fetch boilerplate. Query hooks live in `src/features/*/data/queries/`.
See `src/shared/WHY-TanStackQuery.md`.

### Navigation
- **Links:** Use `AppLink` from `src/Components/AppLink` (not `Link`)
- **Programmatic:** Use `useAppNavigate` from `src/hooks/useAppNavigate`
  (not `useNavigate`)
- ESLint's `no-restricted-imports` enforces this

### Testing
- **Unit tests:** Jest + Testing Library (`*.test.tsx`)
- **Component/integration tests:** Storybook stories with play functions
- **E2E tests:** Playwright (`playwright/`)
- No Cypress — removed in favor of Storybook

## Custom ESLint Rules

Three local rules under `starter-local/*` — see `eslint-rules/README.md`.

## Reference Guide

`src/features/roles/` is a REFERENCE GUIDE demonstrating all patterns.
Replace it with your own features when creating a new app.

## File Naming

- **Components:** PascalCase (`RolesPage.tsx`)
- **Hooks:** camelCase with `use` prefix (`useRolesTable.ts`)
- **Queries:** camelCase (`roles.ts`)
- **Stories:** `ComponentName.stories.tsx`
- **Tests:** `component-name.test.tsx`

## Don't

- Import `useChrome()` in feature components — use `useAppServices()`
- Write `useEffect` + `useState` for data fetching — use TanStack Query
- Import `Link` or `useNavigate` from react-router-dom — use AppLink/useAppNavigate
- Use `canvasElement.querySelector()` in stories — use `within()` queries
- Use `getBy*` inside `waitFor()` — use `queryBy*` + `expect` or `findBy*`
