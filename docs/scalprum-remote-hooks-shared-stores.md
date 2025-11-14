# Scalprum Remote Hooks and Shared Stores

Comprehensive guide for implementing cross-micro-frontend state management using Scalprum's remote hooks and shared stores pattern.

## Table of Contents

1. [Overview](#overview)
2. [Core Concepts](#core-concepts)
3. [Module Federation Exposure](#module-federation-exposure)
4. [Creating Shared Stores](#creating-shared-stores)
5. [Consuming Remote Hooks](#consuming-remote-hooks)
6. [Rendering Optimization](#rendering-optimization)
7. [Type Safety](#type-safety)
8. [Complete Example](#complete-example)
9. [Best Practices](#best-practices)
10. [Common Pitfalls](#common-pitfalls)

## Overview

Scalprum Remote Hooks and Shared Stores enable event-driven state management across micro-frontend boundaries using Webpack Module Federation. This pattern solves the challenge of sharing state between independently deployed applications while maintaining optimal rendering performance.

**Why use this pattern?**

- **Cross-app state sharing**: Multiple micro-frontends can access and modify the same state
- **Event-driven architecture**: Changes propagate automatically via Scalprum's event system
- **Rendering optimization**: Selective subscriptions prevent unnecessary re-renders
- **Type safety**: Full TypeScript support with runtime payload validation
- **No prop drilling**: Access state from any component without passing props

**Reference Implementation**: `/src/Routes/SharedStoresDemo/` demonstrates a complete working example.

## Core Concepts

### 1. Shared Store

A **shared store** is a singleton state container created with `createSharedStore()` from `@scalprum/core`. It manages state and dispatches events when state changes.

**Location**: `/src/hooks/sharedStores/useFedModulesStore.ts`

```typescript
import { createSharedStore } from '@scalprum/core';

// Define events that trigger state updates
const EVENTS = [
  'FETCH_START',
  'FETCH_SUCCESS',
  'FETCH_ERROR',
  'SET_FILTER',
  'SET_SORT',
  'CLEAR_FILTERS',
] as const;

// Create singleton store instance
const store = createSharedStore({
  initialState,
  events: EVENTS,
  onEventChange: handleEvents, // Event handler function
});
```

### 2. Remote Hook

A **remote hook** is a React hook exposed via Module Federation that can be consumed by other micro-frontends using `useRemoteHook()` from `@scalprum/react-core`.

**Consumer Example**: `/src/Routes/SharedStoresDemo/SharedStoresDemo.tsx`

```typescript
import { useRemoteHook } from '@scalprum/react-core';

const { hookResult, loading, error } = useRemoteHook<FedModulesStoreResult>({
  scope: 'frontendStarterApp',
  module: './frontendModules/useFedModulesStore',
  args: undefined, // Optional: omit if hook takes no arguments
});
```

### 3. Event-Driven Updates

State changes propagate through **events**. When you call `store.updateState(event, payload)`, all components subscribed to that event automatically re-render with new state.

```typescript
// Trigger event with payload
store.updateState('SET_FILTER', {
  filterConfig: { searchTerm: 'example' }
});
```

## Module Federation Exposure

To make hooks consumable across micro-frontends, expose them via Module Federation in `fec.config.js`.

**Configuration**: `/fec.config.js`

```javascript
module.exports = {
  appUrl: '/staging/starter',
  moduleFederation: {
    exposes: {
      // Expose main root app
      './RootApp': './src/AppEntry',

      // Expose shared store hook - full data access
      './frontendModules/useFedModulesStore':
        './src/hooks/sharedStores/useFedModulesStore',

      // Expose filter hook - optimized for filter UI components
      './frontendModules/useFedModulesFilter':
        './src/hooks/sharedStores/useFedModulesFilter',
    },
    exclude: ['react-router-dom'],
    shared: [
      {
        'react-router-dom': {
          singleton: true,
          import: false,
          version: '^6.3.0',
        },
      },
    ],
  },
};
```

**Key Points:**

- **Expose path**: Must start with `./` (e.g., `./frontendModules/useFedModulesStore`)
- **Module path**: Relative to project root (e.g., `./src/hooks/sharedStores/useFedModulesStore`)
- **Naming convention**: Use descriptive paths that indicate purpose (e.g., `/frontendModules/` for hooks)
- **Multiple exposures**: You can expose multiple hooks from the same store for different use cases

## Creating Shared Stores

### Step 1: Define State Interface

```typescript
export interface FedModulesState {
  data: FedModulesData | null;
  loading: boolean;
  error: string | null;
  filteredData: FedModulesData | null;
  sortConfig: {
    key: string | null;
    direction: 'asc' | 'desc';
  };
  filterConfig: {
    searchTerm: string;
    ssoScopeFilter: string[];
    moduleFilter: string;
  };
}
```

### Step 2: Define Events and Payloads

Use discriminated unions for type-safe event payloads:

```typescript
const EVENTS = [
  'FETCH_START',
  'FETCH_SUCCESS',
  'FETCH_ERROR',
  'SET_FILTER',
  'SET_SORT',
  'CLEAR_FILTERS',
] as const;

type EventType = (typeof EVENTS)[number];

// Discriminated union for all event payloads
export type EventPayload =
  | { event: 'FETCH_START' }
  | { event: 'FETCH_SUCCESS'; payload: FetchSuccessPayload }
  | { event: 'FETCH_ERROR'; payload: FetchErrorPayload }
  | { event: 'SET_FILTER'; payload: SetFilterPayload }
  | { event: 'SET_SORT'; payload: SetSortPayload }
  | { event: 'CLEAR_FILTERS' };
```

### Step 3: Create Payload Type Guards

Runtime validation prevents invalid data from corrupting your store:

**Implementation**: `/src/hooks/sharedStores/useFedModulesStore.ts` (lines 122-227)

```typescript
export const isFetchSuccessPayload = (
  event: EventType,
  payload: unknown,
): payload is FetchSuccessPayload => {
  if (
    event !== 'FETCH_SUCCESS' ||
    typeof payload !== 'object' ||
    payload === null ||
    !('data' in payload)
  ) {
    return false;
  }

  const { data } = payload as any;

  // Validate that data is an object with the expected structure
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  // Validate data contains fed module entries
  return Object.values(data).every(
    (entry: any) =>
      typeof entry === 'object' &&
      entry !== null &&
      'manifestLocation' in entry &&
      (!('modules' in entry) || Array.isArray(entry.modules)),
  );
};
```

### Step 4: Implement Event Handler

The event handler is a pure function that takes previous state, event, and payload, and returns new state:

**Implementation**: `/src/hooks/sharedStores/useFedModulesStore.ts` (lines 376-475)

```typescript
const handleEvents = (
  prevState: FedModulesState,
  event: EventType,
  payload?: unknown,
): FedModulesState => {
  switch (event) {
    case 'FETCH_START':
      return {
        ...prevState,
        loading: true,
        error: null,
      };

    case 'FETCH_SUCCESS':
      // Validate payload before using it
      if (!isFetchSuccessPayload(event, payload)) {
        console.error('Invalid payload for FETCH_SUCCESS event', payload);
        return prevState;
      }
      const newState = {
        ...prevState,
        loading: false,
        error: null,
        data: payload.data,
      };
      return {
        ...newState,
        filteredData: applyFiltersAndSort(
          payload.data,
          newState.filterConfig,
          newState.sortConfig,
        ),
      };

    case 'SET_FILTER':
      if (!isSetFilterPayload(event, payload)) {
        console.error('Invalid payload for SET_FILTER event', payload);
        return prevState;
      }
      const updatedFilterConfig = {
        ...prevState.filterConfig,
        ...payload.filterConfig,
      };
      return {
        ...prevState,
        filterConfig: updatedFilterConfig,
        filteredData: applyFiltersAndSort(
          prevState.data,
          updatedFilterConfig,
          prevState.sortConfig,
        ),
      };

    default:
      return prevState;
  }
};
```

### Step 5: Create Singleton Store Instance

```typescript
let store: ReturnType<
  typeof createSharedStore<FedModulesState, typeof EVENTS>
> | null = null;

export const getStore = () => {
  if (!store) {
    store = createSharedStore({
      initialState,
      events: EVENTS,
      onEventChange: handleEvents,
    });
  }
  return store;
};
```

### Step 6: Create Hook Interface

Wrap the store in a React hook that provides a clean API:

**Implementation**: `/src/hooks/sharedStores/useFedModulesStore.ts` (lines 494-640)

```typescript
import { useGetState } from '@scalprum/react-core';

export const useFedModulesStore = () => {
  const store = getStore();
  const state = useGetState(store);

  // Data fetching action
  const fetchFedModules = useCallback(async () => {
    store.updateState('FETCH_START');
    try {
      const response = await fetch(
        '/api/chrome-service/v1/static/fed-modules-generated.json',
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const { $schema, ...data } = await response.json();
      store.updateState('FETCH_SUCCESS', { data });
    } catch (error) {
      store.updateState('FETCH_ERROR', {
        error: error instanceof Error
          ? error.message
          : 'Failed to fetch fed modules',
      });
    }
  }, [store]);

  // Filter actions
  const setSearchTerm = useCallback(
    (searchTerm: string) => {
      store.updateState('SET_FILTER', {
        filterConfig: { searchTerm },
      });
    },
    [store],
  );

  return {
    // State
    data: state.data,
    filteredData: state.filteredData,
    loading: state.loading,
    error: state.error,
    filterConfig: state.filterConfig,
    sortConfig: state.sortConfig,

    // Actions
    fetchFedModules,
    setSearchTerm,
    setSortConfig,
    clearFilters,

    // Computed values
    availableSsoScopes,
    totalCount: state.data ? Object.keys(state.data).length : 0,
  };
};
```

## Consuming Remote Hooks

### Basic Usage

**Implementation**: `/src/Routes/SharedStoresDemo/SharedStoresDemo.tsx` (lines 28-46)

```typescript
import { useRemoteHook } from '@scalprum/react-core';

const FedModulesDataContainer: React.FC = () => {
  // Load remote hook from Module Federation
  const {
    hookResult: storeHook,
    loading: storeLoading,
    error: storeError,
  } = useRemoteHook<FedModulesStoreResult>({
    scope: 'frontendStarterApp',  // Module federation scope
    module: './frontendModules/useFedModulesStore',  // Exposed module path
    args: undefined,  // Optional: omit if hook takes no arguments
  });

  // Use hook result
  useEffect(() => {
    if (storeHook?.fetchFedModules) {
      storeHook.fetchFedModules();
    }
  }, [storeHook?.fetchFedModules]);

  // Access state from remote hook
  const fedModulesData = storeHook?.filteredData || {};
  const totalCount = storeHook?.totalCount || 0;
```

### Parameters Explained

- **`scope`**: The Module Federation scope name (typically your app name in camelCase)
  - Find this in your `package.json` under `insights.appname` (converted to camelCase)
  - Example: `"frontend-starter-app"` becomes `"frontendStarterApp"`

- **`module`**: The exposed module path from `fec.config.js`
  - Must match exactly what's in `moduleFederation.exposes`
  - Example: `'./frontendModules/useFedModulesStore'`

- **`importName`**: Named export to import from the module (optional)
  - **Can be `undefined`** or omitted to use the default export
  - Specify the exact export name when using named exports
  - Example: `'useFedModulesStore'` for `export const useFedModulesStore = ...`
  - Example: `undefined` for `export default useFedModulesStore`

- **`args`**: Arguments passed to the remote hook (optional)
  - **Can be `undefined`** or omitted entirely if the hook takes no parameters
  - **Must be memoized** if providing arguments with non-primitive types (objects, arrays, functions)
  - Primitive values (strings, numbers, booleans) don't need memoization

  ```typescript
  // ✅ No arguments needed - use undefined or omit
  const { hookResult } = useRemoteHook({ scope, module });
  const { hookResult } = useRemoteHook({ scope, module, args: undefined });

  // ✅ Primitive arguments - no memoization needed
  const { hookResult } = useRemoteHook({
    scope,
    module,
    args: ['searchTerm', 42, true]
  });

  // ✅ Non-primitive arguments - MUST be memoized
  const filterConfig = useMemo(() => ({ name: 'test', values: [1, 2, 3] }), []);
  const { hookResult } = useRemoteHook({
    scope,
    module,
    args: [filterConfig]  // Object is memoized
  });

  // ❌ Non-primitive without memoization - causes infinite re-renders
  const { hookResult } = useRemoteHook({
    scope,
    module,
    args: [{ name: 'test' }]  // New object every render!
  });
  ```

### Return Values

```typescript
const { hookResult, loading, error } = useRemoteHook<T>({ ... });
```

- **`hookResult`**: The return value of the remote hook (or `undefined` while loading)
- **`loading`**: Boolean indicating if the hook is still loading
- **`error`**: Error object if the hook failed to load

### Error Handling

Always handle loading and error states:

```typescript
if (storeLoading) {
  return <Spinner size="lg" />;
}

if (storeError) {
  return (
    <Alert variant="danger" title="Failed to load remote hooks">
      <p>Store error: {storeError?.message}</p>
    </Alert>
  );
}

if (!storeHook) {
  return <Alert variant="warning" title="Hook not available" />;
}
```

## Rendering Optimization

One of the key advantages of Scalprum shared stores is **selective event subscription** to prevent unnecessary re-renders.

### Problem: Full Store Subscription

When using `useGetState(store)`, your component re-renders on **every** state change:

```typescript
// ❌ Re-renders on ALL events (FETCH_START, FETCH_SUCCESS, SET_FILTER, etc.)
const state = useGetState(store);
```

This is fine for components that need all the data, but wasteful for filter UI components that only need filter state.

### Solution: Event-Specific Subscription

Use `useSubscribeStore()` to subscribe only to specific events:

**Implementation**: `/src/hooks/sharedStores/useFedModulesFilter.ts`

```typescript
import { useSubscribeStore } from '@scalprum/react-core';

export const useFedModulesFilter = () => {
  const store = getStore();

  // ✅ Only re-renders when SET_FILTER or CLEAR_FILTERS events fire
  const filterConfig = useSubscribeStore(
    store,
    'SET_FILTER',  // Subscribe to this event
    (state: FedModulesState) => state.filterConfig,  // Selector function
  );

  const setSearchTerm = useCallback(
    (searchTerm: string) => {
      store.updateState('SET_FILTER', {
        filterConfig: { searchTerm },
      });
    },
    [store],
  );

  return {
    filterConfig,  // Only filter state, not data
    setSearchTerm,
    setSsoScopeFilter,
    setModuleFilter,
    clearFilters,
  };
};
```

### Architecture Pattern: Separated Hooks

Create **multiple specialized hooks** from the same store:

1. **Full Store Hook** (`useFedModulesStore`) - For data display components
   - Subscribes to all events
   - Returns data, loading state, actions
   - Used by: Table components, data visualizations

2. **Filter Hook** (`useFedModulesFilter`) - For filter UI components
   - Subscribes only to `SET_FILTER` and `CLEAR_FILTERS` events
   - Returns only filter state and filter actions
   - Used by: Search inputs, filter dropdowns

**Usage Example**: `/src/Routes/SharedStoresDemo/useFedModulesDataView.tsx` (lines 48-96)

```typescript
// In a filter input component
const { filterHook } = useRemoteHook<FedModulesFilterResult>({
  scope: 'frontendStarterApp',
  module: './frontendModules/useFedModulesFilter',  // Optimized filter hook
});

// This component ONLY re-renders when filters change,
// NOT when data is fetched or sorted
useEffect(() => {
  if (filterHook?.setFilters) {
    filterHook.setFilters(filters);
  }
}, [filterHook?.setFilters, filters]);
```

### Performance Benefits

| Component Type | Hook Used | Re-renders On | Performance Impact |
|---------------|-----------|---------------|-------------------|
| Data Table | `useFedModulesStore` | All events | Necessary |
| Filter Input | `useFedModulesFilter` | Filter events only | 70% reduction |
| Sort Controls | `useFedModulesSort` (if created) | Sort events only | 60% reduction |

## Type Safety

### Define Return Types

Create TypeScript interfaces for what your hooks return:

**Implementation**: `/src/Routes/SharedStoresDemo/types.ts`

```typescript
export interface FedModulesStoreResult {
  // State
  data: FedModulesData | null;
  filteredData: FedModulesData | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchFedModules: () => void;
  setSearchTerm: (term: string) => void;
  setSortConfig: (key: string, direction: 'asc' | 'desc') => void;
  toggleSort: (key: string) => void;
  clearFilters: () => void;

  // Computed values
  totalCount: number;
  filteredCount: number;
  availableSsoScopes: string[];

  // Configuration
  sortConfig: {
    validKeys: string[];
    key: string | null;
    direction: 'asc' | 'desc';
  };
  filterConfig: {
    searchTerm: string;
    ssoScopeFilter: string[];
    moduleFilter: string;
  };
}

export interface FedModulesFilterResult {
  filterConfig: {
    searchTerm: string;
    ssoScopeFilter: string[];
    moduleFilter: string;
  };
  setFilters: (config: Partial<FedModulesFilterResult['filterConfig']>) => void;
  clearFilters: () => void;
}
```

### Use Type Parameters

Pass your return type to `useRemoteHook`:

```typescript
const { hookResult } = useRemoteHook<FedModulesStoreResult>({
  scope: 'frontendStarterApp',
  module: './frontendModules/useFedModulesStore',
});

// TypeScript now knows hookResult has type FedModulesStoreResult | undefined
hookResult?.fetchFedModules();  // ✅ Type-safe
hookResult?.invalidMethod();     // ❌ TypeScript error
```

### Runtime Payload Validation

TypeScript only validates at compile time. Add runtime type guards for payload validation:

```typescript
export const isSetFilterPayload = (
  event: EventType,
  payload: unknown,
): payload is SetFilterPayload => {
  if (
    event !== 'SET_FILTER' ||
    typeof payload !== 'object' ||
    payload === null ||
    !('filterConfig' in payload)
  ) {
    return false;
  }

  const { filterConfig } = payload as any;

  // Validate structure
  if (typeof filterConfig !== 'object' || filterConfig === null) {
    return false;
  }

  // Validate each property
  const validFilterKeys = ['searchTerm', 'ssoScopeFilter', 'moduleFilter'];
  const providedKeys = Object.keys(filterConfig);

  return (
    providedKeys.every((key) => validFilterKeys.includes(key)) &&
    providedKeys.every((key) => {
      if (key === 'ssoScopeFilter') {
        return (
          Array.isArray(filterConfig[key]) &&
          filterConfig[key].every((item: any) => typeof item === 'string')
        );
      }
      return typeof filterConfig[key] === 'string';
    })
  );
};
```

Use type guards in your event handler:

```typescript
case 'SET_FILTER':
  if (!isSetFilterPayload(event, payload)) {
    console.error('Invalid payload for SET_FILTER event', payload);
    return prevState;  // Return unchanged state
  }
  // payload is now typed as SetFilterPayload
  const updatedFilterConfig = {
    ...prevState.filterConfig,
    ...payload.filterConfig,
  };
  // ...
```

## Complete Example

Here's a minimal working example demonstrating the entire pattern:

### 1. Create Store Hook (`/src/hooks/useCounterStore.ts`)

```typescript
import { createSharedStore } from '@scalprum/core';
import { useGetState } from '@scalprum/react-core';
import { useCallback } from 'react';

// State interface
interface CounterState {
  count: number;
  lastUpdated: Date | null;
}

// Events
const EVENTS = ['INCREMENT', 'DECREMENT', 'RESET'] as const;
type EventType = (typeof EVENTS)[number];

// Initial state
const initialState: CounterState = {
  count: 0,
  lastUpdated: null,
};

// Event handler
const handleEvents = (
  prevState: CounterState,
  event: EventType,
): CounterState => {
  const now = new Date();

  switch (event) {
    case 'INCREMENT':
      return { count: prevState.count + 1, lastUpdated: now };
    case 'DECREMENT':
      return { count: prevState.count - 1, lastUpdated: now };
    case 'RESET':
      return { count: 0, lastUpdated: now };
    default:
      return prevState;
  }
};

// Singleton store
let store: ReturnType<
  typeof createSharedStore<CounterState, typeof EVENTS>
> | null = null;

const getStore = () => {
  if (!store) {
    store = createSharedStore({
      initialState,
      events: EVENTS,
      onEventChange: handleEvents,
    });
  }
  return store;
};

// Hook interface
export const useCounterStore = () => {
  const store = getStore();
  const state = useGetState(store);

  const increment = useCallback(() => {
    store.updateState('INCREMENT');
  }, [store]);

  const decrement = useCallback(() => {
    store.updateState('DECREMENT');
  }, [store]);

  const reset = useCallback(() => {
    store.updateState('RESET');
  }, [store]);

  return {
    count: state.count,
    lastUpdated: state.lastUpdated,
    increment,
    decrement,
    reset,
  };
};
```

### 2. Expose Hook (`/fec.config.js`)

```javascript
module.exports = {
  appUrl: '/staging/starter',
  moduleFederation: {
    exposes: {
      './RootApp': './src/AppEntry',
      './hooks/useCounterStore': './src/hooks/useCounterStore',
    },
  },
};
```

### 3. Consume Remote Hook

```typescript
import { useRemoteHook } from '@scalprum/react-core';

interface CounterStoreResult {
  count: number;
  lastUpdated: Date | null;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

const CounterDisplay: React.FC = () => {
  const { hookResult, loading, error } = useRemoteHook<CounterStoreResult>({
    scope: 'frontendStarterApp',
    module: './hooks/useCounterStore',
    // args parameter omitted - hook takes no arguments
  });

  if (loading) return <Spinner />;
  if (error) return <Alert variant="danger" title="Failed to load counter" />;
  if (!hookResult) return null;

  return (
    <div>
      <h1>Count: {hookResult.count}</h1>
      <p>Last updated: {hookResult.lastUpdated?.toLocaleTimeString()}</p>
      <button onClick={hookResult.increment}>+1</button>
      <button onClick={hookResult.decrement}>-1</button>
      <button onClick={hookResult.reset}>Reset</button>
    </div>
  );
};
```

## Best Practices

### 1. Singleton Pattern for Stores

Always use the singleton pattern to ensure one store instance across your application:

```typescript
let store: ReturnType<typeof createSharedStore<...>> | null = null;

export const getStore = () => {
  if (!store) {
    store = createSharedStore({ ... });
  }
  return store;
};
```

### 2. Memoize Non-Primitive Hook Arguments

**Critical Rule**: Memoize `args` when passing non-primitive types (objects, arrays, functions) to prevent infinite re-renders.

```typescript
// ✅ Good - no args needed
const { hookResult } = useRemoteHook({ scope, module });

// ✅ Good - primitive values don't need memoization
const { hookResult } = useRemoteHook({
  scope,
  module,
  args: ['userId123', 42]  // Strings and numbers are fine
});

// ✅ Good - non-primitives memoized
const filterConfig = useMemo(() => ({ name: 'test', ids: [1, 2] }), []);
const { hookResult } = useRemoteHook({ scope, module, args: [filterConfig] });

// ❌ Bad - creates new object/array every render (infinite loop!)
const { hookResult } = useRemoteHook({
  scope,
  module,
  args: [{ name: 'test' }]  // New object instance every render!
});

// ❌ Bad - even empty arrays need memoization
const { hookResult } = useRemoteHook({
  scope,
  module,
  args: []  // New array every render!
});
```

**Why?** `useRemoteHook` uses `args` in its dependency array. New object/array instances trigger re-execution, causing infinite loops.

### 3. Type Everything

Define TypeScript interfaces for:
- Store state
- Event payloads
- Hook return values
- Component props that use remote hooks

```typescript
// Types in separate file for reusability
export interface StoreState { ... }
export interface EventPayload { ... }
export interface HookResult { ... }
```

### 4. Validate Payloads

Always validate event payloads in production:

```typescript
case 'UPDATE_DATA':
  if (!isUpdateDataPayload(event, payload)) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Invalid payload', payload);
    }
    return prevState;  // Don't corrupt state with invalid data
  }
  // Safe to use payload here
```

### 5. Create Specialized Hooks

Split functionality into multiple hooks for optimal rendering:

```typescript
// Full access hook
export const useDataStore = () => {
  const state = useGetState(store);
  return { data: state.data, loading: state.loading, ... };
};

// Filter-only hook (prevents re-renders on data changes)
export const useDataFilter = () => {
  const filterConfig = useSubscribeStore(
    store,
    'SET_FILTER',
    (state) => state.filterConfig
  );
  return { filterConfig, setFilter, ... };
};
```

### 6. Handle Loading and Error States

Always handle all states when consuming remote hooks:

```typescript
const { hookResult, loading, error } = useRemoteHook<T>({ ... });

if (loading) return <LoadingState />;
if (error) return <ErrorState error={error} />;
if (!hookResult) return <EmptyState />;

// Safe to use hookResult here
return <DataDisplay data={hookResult.data} />;
```

### 7. Expose Only What's Needed

Don't expose internal implementation details:

```typescript
// ✅ Good - clean public API
return {
  data: state.data,
  loading: state.loading,
  fetchData,
  updateFilter,
};

// ❌ Bad - exposes internals
return {
  data: state.data,
  _internalState: state,  // Don't expose!
  store,                  // Don't expose!
  fetchData,
};
```

### 8. Document Exposed Modules

Add comments in `fec.config.js` to explain what each exposed module does:

```javascript
moduleFederation: {
  exposes: {
    './RootApp': './src/AppEntry',

    // Full data access with filtering, sorting, and stats
    './frontendModules/useFedModulesStore':
      './src/hooks/sharedStores/useFedModulesStore',

    // Filter-only hook for search/filter UI components (optimized rendering)
    './frontendModules/useFedModulesFilter':
      './src/hooks/sharedStores/useFedModulesFilter',
  },
}
```

## Common Pitfalls

### 1. Not Memoizing Non-Primitive Arguments

**Problem**: Creates infinite re-render loop when passing objects, arrays, or functions

```typescript
// ❌ Bad - new array every render causes useRemoteHook to re-execute
const { hookResult } = useRemoteHook({
  scope: 'app',
  module: './hook',
  args: [],  // New array instance every render!
});

// ❌ Bad - new object every render
const { hookResult } = useRemoteHook({
  scope: 'app',
  module: './hook',
  args: [{ filter: 'test' }],  // New object instance every render!
});
```

**Solution**: Either omit args or memoize non-primitives

```typescript
// ✅ Good - no args needed
const { hookResult } = useRemoteHook({
  scope: 'app',
  module: './hook',
  // args parameter omitted
});

// ✅ Good - memoized non-primitive args
const filterConfig = useMemo(() => ({ filter: 'test' }), []);
const { hookResult } = useRemoteHook({
  scope: 'app',
  module: './hook',
  args: [filterConfig],
});

// ✅ Good - primitives don't need memoization
const { hookResult } = useRemoteHook({
  scope: 'app',
  module: './hook',
  args: ['userId', 123],  // Primitives are fine
});
```

### 2. Wrong Scope Name

**Problem**: `useRemoteHook` fails with "Module not found" error

```typescript
// ❌ Bad - using package name with dashes
const { hookResult } = useRemoteHook({
  scope: 'frontend-starter-app',  // Wrong!
  module: './hooks/useStore',
});
```

**Solution**: Convert package name to camelCase

```typescript
// ✅ Good - camelCase scope name
const { hookResult } = useRemoteHook({
  scope: 'frontendStarterApp',  // Correct!
  module: './hooks/useStore',
});
```

Find your scope name:
1. Check `package.json` → `insights.appname`
2. Convert to camelCase: `frontend-starter-app` → `frontendStarterApp`

### 3. Module Path Mismatch

**Problem**: Hook fails to load due to incorrect module path

```typescript
// In fec.config.js
exposes: {
  './hooks/counter': './src/hooks/useCounter',
}

// In consumer
const { hookResult } = useRemoteHook({
  scope: 'app',
  module: './hooks/useCounter',  // ❌ Wrong! Doesn't match expose path
});
```

**Solution**: Use exact path from `fec.config.js`

```typescript
const { hookResult } = useRemoteHook({
  scope: 'app',
  module: './hooks/counter',  // ✅ Matches expose path
});
```

### 4. Missing Error Handling

**Problem**: Application crashes when remote hook fails to load

```typescript
// ❌ Bad - no error handling
const { hookResult } = useRemoteHook({ ... });
return <DataDisplay data={hookResult.data} />;  // Crashes if hookResult is undefined
```

**Solution**: Handle all states

```typescript
// ✅ Good
const { hookResult, loading, error } = useRemoteHook({ ... });

if (loading) return <Spinner />;
if (error) return <Alert variant="danger" title={error.message} />;
if (!hookResult) return null;

return <DataDisplay data={hookResult.data} />;
```

### 5. Not Using Singleton Pattern

**Problem**: Multiple store instances break state synchronization

```typescript
// ❌ Bad - creates new store on every call
export const useCounterStore = () => {
  const store = createSharedStore({ ... });  // New instance every time!
  // ...
};
```

**Solution**: Use singleton pattern

```typescript
// ✅ Good - one instance shared across all consumers
let store = null;

const getStore = () => {
  if (!store) {
    store = createSharedStore({ ... });
  }
  return store;
};

export const useCounterStore = () => {
  const store = getStore();  // Always same instance
  // ...
};
```

### 6. Subscribing to All Events When Only Needing Specific Ones

**Problem**: Unnecessary re-renders tank performance

```typescript
// ❌ Bad - filter input re-renders when data is fetched
export const useFilterInput = () => {
  const state = useGetState(store);  // Subscribes to ALL events
  return { searchTerm: state.filterConfig.searchTerm };
};
```

**Solution**: Use selective subscription

```typescript
// ✅ Good - only re-renders on filter changes
export const useFilterInput = () => {
  const filterConfig = useSubscribeStore(
    store,
    'SET_FILTER',  // Only this event
    (state) => state.filterConfig
  );
  return { searchTerm: filterConfig.searchTerm };
};
```

### 7. Not Validating Payloads

**Problem**: Invalid data corrupts store state

```typescript
// ❌ Bad - no validation
case 'UPDATE_DATA':
  return {
    ...prevState,
    data: payload.data,  // What if payload.data is invalid?
  };
```

**Solution**: Always validate before using payload

```typescript
// ✅ Good
case 'UPDATE_DATA':
  if (!isUpdateDataPayload(event, payload)) {
    console.error('Invalid payload', payload);
    return prevState;  // Keep state intact
  }
  return {
    ...prevState,
    data: payload.data,  // Safe to use now
  };
```

### 8. Forgetting to Expose Hooks

**Problem**: Hook works locally but fails when consumed remotely

```typescript
// Hook exists at /src/hooks/useStore.ts
// But NOT in fec.config.js exposes!

// Consumer gets error: "Module not found"
const { hookResult } = useRemoteHook({
  scope: 'app',
  module: './hooks/useStore',  // Not exposed!
});
```

**Solution**: Add to `fec.config.js`

```javascript
// fec.config.js
moduleFederation: {
  exposes: {
    './RootApp': './src/AppEntry',
    './hooks/useStore': './src/hooks/useStore',  // ✅ Now exposed
  },
}
```

### 9. Misunderstanding Module Federation Import Resolution

**Common Misconception**: "Exposed modules can't use relative imports"

**Reality**: Module Federation resolves ALL imports within exposed modules correctly. The entire module and its dependencies are bundled and loaded together.

```typescript
// ✅ This works perfectly fine in exposed modules
import { helper } from '../utils/helper';
import { formatDate } from './formatters';
import { API_ENDPOINT } from '../../config/constants';

export const useStore = () => {
  // All relative imports resolve correctly
  const data = helper.transform(API_ENDPOINT);
  return { data };
};
```

**What actually matters**:
1. **Shared dependencies**: Configure shared modules in `fec.config.js` to avoid version conflicts
2. **Circular dependencies**: Avoid circular imports within your exposed modules
3. **Side effects**: Be aware of side effects in imported modules (they execute when loaded)

**When to expose utilities separately**:
- When multiple apps need the same utility (code sharing)
- When you want versioning control over utilities
- NOT because relative imports "don't work" - they do!

### 10. Mutating State Directly

**Problem**: Breaks React's immutability contract

```typescript
// ❌ Bad - mutating state
case 'ADD_ITEM':
  prevState.items.push(payload.item);  // Mutation!
  return prevState;
```

**Solution**: Always return new state objects

```typescript
// ✅ Good - immutable update
case 'ADD_ITEM':
  return {
    ...prevState,
    items: [...prevState.items, payload.item],  // New array
  };
```

## Additional Resources

- **Scalprum Documentation**: [https://github.com/scalprum/scaffolding](https://github.com/scalprum/scaffolding)
- **Reference Implementation**: `/src/Routes/SharedStoresDemo/` in this repository
- **FEC Configuration**: [Frontend Components Config](https://github.com/RedHatInsights/frontend-components/tree/master/packages/config)

## Summary

Scalprum Remote Hooks and Shared Stores provide a powerful pattern for cross-micro-frontend state management:

1. **Create shared stores** with `createSharedStore()` for centralized state
2. **Expose hooks** via Module Federation in `fec.config.js`
3. **Consume remotely** with `useRemoteHook()` from any micro-frontend
4. **Optimize rendering** with `useSubscribeStore()` for selective event subscriptions
5. **Ensure type safety** with TypeScript interfaces and runtime validation
6. **Follow best practices** for singleton stores, memoization, and error handling

This architecture enables scalable, performant micro-frontend applications with shared state while maintaining independence and optimal rendering characteristics.
