# Shared Stores Feature Island

Demonstrates Scalprum's cross-micro-frontend state management using remote hooks and shared stores. This is an **advanced pattern** — most applications won't need it.

## What this island owns

- **useFedModulesStore** — Shared store exposed via Module Federation. Fetches and manages federated module metadata across micro-frontend boundaries.
- **useFedModulesFilter** — Lightweight filter-only hook that subscribes to SET_FILTER events without re-rendering on data changes.
- **SharedStoresDemo** — Page component that consumes the shared store via `useRemoteHook` and renders a DataView table.

## When to use this pattern

- Sharing state between different micro-frontends (e.g., app A reads data published by app B)
- Event-driven communication across application boundaries
- Synchronizing data without prop drilling across federated modules

## Module Federation exports

These hooks are exposed in `fec.config.js` as federated modules:

| Export | Hook |
|--------|------|
| `./frontendModules/useFedModulesStore` | Full store with data, filters, sorting |
| `./frontendModules/useFedModulesFilter` | Filter-only subscription (prevents unnecessary re-renders) |

## Key concepts

- **`createSharedStore()`** — Creates a singleton store accessible across micro-frontends
- **`useRemoteHook()`** — Loads a hook from another federated module at runtime
- **`useSubscribeStore()`** — Subscribes to specific store events without full store access

## Documentation

- `docs/scalprum-remote-hooks-shared-stores.md` — Full implementation guide
- `docs/scalprum-quick-reference.md` — Quick code snippets
