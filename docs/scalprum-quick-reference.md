# Scalprum Remote Hooks & Shared Stores - Quick Reference

Quick reference guide for Scalprum remote hooks and shared stores. For detailed explanations, see [Scalprum Remote Hooks and Shared Stores](./scalprum-remote-hooks-shared-stores.md).

## Quick Setup Checklist

- [ ] Create shared store with `createSharedStore()`
- [ ] Wrap in singleton pattern (`getStore()`)
- [ ] Create React hook that uses `useGetState()` or `useSubscribeStore()`
- [ ] Expose hook in `fec.config.js` → `moduleFederation.exposes`
- [ ] Define TypeScript return type interface
- [ ] Consume with `useRemoteHook()`

## Essential Code Snippets

### 1. Create Shared Store

```typescript
import { createSharedStore } from '@scalprum/core';
import { useGetState } from '@scalprum/react-core';

const EVENTS = ['UPDATE', 'RESET'] as const;

interface State {
  data: any;
  loading: boolean;
}

const handleEvents = (prevState: State, event, payload?) => {
  switch (event) {
    case 'UPDATE':
      return { ...prevState, data: payload.data };
    case 'RESET':
      return initialState;
    default:
      return prevState;
  }
};

let store = null;
const getStore = () => {
  if (!store) {
    store = createSharedStore({
      initialState: { data: null, loading: false },
      events: EVENTS,
      onEventChange: handleEvents,
    });
  }
  return store;
};

export const useMyStore = () => {
  const store = getStore();
  const state = useGetState(store);

  const updateData = useCallback((data) => {
    store.updateState('UPDATE', { data });
  }, [store]);

  return { data: state.data, loading: state.loading, updateData };
};
```

### 2. Expose in Module Federation

```javascript
// fec.config.js
module.exports = {
  appUrl: '/staging/myapp',
  moduleFederation: {
    exposes: {
      './RootApp': './src/AppEntry',
      './hooks/useMyStore': './src/hooks/useMyStore',
    },
  },
};
```

### 3. Consume Remote Hook

```typescript
import { useRemoteHook } from '@scalprum/react-core';

interface MyStoreResult {
  data: any;
  loading: boolean;
  updateData: (data: any) => void;
}

const MyComponent = () => {
  const { hookResult, loading, error } = useRemoteHook<MyStoreResult>({
    scope: 'myApp',  // camelCase of package.json insights.appname
    module: './hooks/useMyStore',
    importName: undefined,  // Optional: omit for default export, specify for named exports
    // args omitted - hook takes no arguments
  });

  if (loading) return <Spinner />;
  if (error) return <Alert variant="danger" title={error.message} />;
  if (!hookResult) return null;

  return <div>{hookResult.data}</div>;
};
```

### 4. Selective Event Subscription (Rendering Optimization)

```typescript
import { useSubscribeStore } from '@scalprum/react-core';

export const useMyFilter = () => {
  const store = getStore();

  // Only re-renders on SET_FILTER events, not on data fetches
  const filterConfig = useSubscribeStore(
    store,
    'SET_FILTER',
    (state) => state.filterConfig
  );

  const setFilter = useCallback((filter) => {
    store.updateState('SET_FILTER', { filterConfig: filter });
  }, [store]);

  return { filterConfig, setFilter };
};
```
## API Reference

### `createSharedStore(config)`

Creates a shared store singleton.

```typescript
const store = createSharedStore({
  initialState: { ... },
  events: ['EVENT_1', 'EVENT_2'] as const,
  onEventChange: (prevState, event, payload) => { ... },
});
```

### `useGetState(store)`

Subscribes to ALL events. Use for components that need all data.

```typescript
const state = useGetState(store);
// Re-renders on every event
```

### `useSubscribeStore(store, event, selector)`

Subscribes to SPECIFIC event. Use for optimized rendering.

```typescript
const filterConfig = useSubscribeStore(
  store,
  'SET_FILTER',
  (state) => state.filterConfig
);
// Only re-renders on SET_FILTER event
```

### `useRemoteHook(config)`

Loads and uses remote hook from Module Federation.

```typescript
const { hookResult, loading, error } = useRemoteHook<T>({
  scope: 'appName',           // Module federation scope (camelCase)
  module: './path/to/hook',   // Path from fec.config.js exposes
  args: useMemo(() => [], []), // Memoized arguments
});
```

### `store.updateState(event, payload?)`

Triggers event and updates state.

```typescript
store.updateState('UPDATE_DATA', { data: newData });
```

## Type Definitions

### Event Payload Type (Discriminated Union)

```typescript
type EventPayload =
  | { event: 'FETCH_START' }
  | { event: 'FETCH_SUCCESS'; payload: { data: Data } }
  | { event: 'FETCH_ERROR'; payload: { error: string } }
  | { event: 'SET_FILTER'; payload: { filter: Filter } };
```

### Type Guard Pattern

```typescript
const isMyPayload = (
  event: EventType,
  payload: unknown
): payload is MyPayload => {
  return (
    event === 'MY_EVENT' &&
    typeof payload === 'object' &&
    payload !== null &&
    'requiredField' in payload
  );
};

// Use in event handler
case 'MY_EVENT':
  if (!isMyPayload(event, payload)) {
    return prevState;  // Invalid payload, no update
  }
  // Safe to use payload here
```

### Hook Return Type

```typescript
export interface MyStoreResult {
  // State
  data: Data | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchData: () => Promise<void>;
  updateFilter: (filter: Filter) => void;

  // Computed
  totalCount: number;
}
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Module not found" | Check scope name (must be camelCase of `insights.appname`) |
| Infinite re-renders | Memoize args: `useMemo(() => [], [])` |
| Hook not updating | Verify event name matches store events |
| Type errors | Define return type interface and pass to `useRemoteHook<T>` |
| Performance issues | Use `useSubscribeStore()` instead of `useGetState()` |
| State not syncing | Ensure singleton pattern: check `getStore()` implementation |
| Hook fails to load | Verify path in `fec.config.js` matches `useRemoteHook` module |

## Architecture Patterns

### Pattern 1: Full Store Hook

```typescript
// For components that need all data
export const useDataStore = () => {
  const state = useGetState(store);
  return {
    data: state.data,
    loading: state.loading,
    // ... all state and actions
  };
};
```

### Pattern 2: Specialized Hook

```typescript
// For filter inputs (optimized)
export const useDataFilter = () => {
  const filterConfig = useSubscribeStore(
    store,
    'SET_FILTER',
    (state) => state.filterConfig
  );
  return { filterConfig, setFilter };
};
```

### Pattern 3: Multiple Hooks from One Store

```javascript
// fec.config.js - expose multiple hooks
exposes: {
  './hooks/useDataStore': './src/hooks/useDataStore',
  './hooks/useDataFilter': './src/hooks/useDataFilter',
  './hooks/useDataSort': './src/hooks/useDataSort',
}
```

## Performance Comparison

| Hook Type | Subscribes To | Re-renders Per Operation | Use Case |
|-----------|---------------|--------------------------|----------|
| `useGetState()` | All events | Every event (100%) | Data display |
| `useSubscribeStore('SET_FILTER')` | Filter events | Only filter changes (~30%) | Filter inputs |
| `useSubscribeStore('SET_SORT')` | Sort events | Only sort changes (~20%) | Sort controls |

## Best Practices Checklist

- [ ] Use singleton pattern for stores
- [ ] Memoize `useRemoteHook` args with `useMemo`
- [ ] Define TypeScript interfaces for all payloads and return types
- [ ] Validate payloads with type guards in event handlers
- [ ] Handle loading, error, and undefined states when consuming
- [ ] Create specialized hooks for different use cases (filter, sort, etc.)
- [ ] Document exposed modules in `fec.config.js`
- [ ] Use `useSubscribeStore()` for components that don't need all data
- [ ] Keep event names as const arrays for type safety
- [ ] Return immutable state objects from event handlers

## File Locations Reference

Based on this repository:

| Purpose | File Path |
|---------|-----------|
| Full store hook | `/src/hooks/sharedStores/useFedModulesStore.ts` |
| Filter-only hook | `/src/hooks/sharedStores/useFedModulesFilter.ts` |
| Type definitions | `/src/Routes/SharedStoresDemo/types.ts` |
| Module exposure config | `/fec.config.js` |
| Consumer example | `/src/Routes/SharedStoresDemo/SharedStoresDemo.tsx` |
| Optimized consumer | `/src/Routes/SharedStoresDemo/useFedModulesDataView.tsx` |

## Additional Resources

- [Full Documentation](./scalprum-remote-hooks-shared-stores.md)
- [Scalprum GitHub](https://github.com/scalprum/scaffolding)
- [Demo Implementation](/src/Routes/SharedStoresDemo/)
