# Shared Utilities

Cross-cutting concerns shared across all features.

## ServiceContext (Dependency Injection)

`ServiceContext.tsx` provides application services (Chrome APIs, notifications)
via React context instead of direct imports. This makes components testable
in Storybook without Chrome.

- **AppServices.types.ts** — the service interface
- **AppServices.browser.ts** — production implementation using Chrome APIs
- **AppServices.cli.ts** — standalone example for CLI/non-Chrome usage
- **ServiceContext.tsx** — React context and `useAppServices()` hook

See `WHY-ServiceContext.md` for the rationale.
