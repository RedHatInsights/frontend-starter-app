# Breadcrumb Demo

Demonstrates Chrome global breadcrumbs API usage in a real application.

## Features Shown

1. **Root breadcrumb** - `/starter/breadcrumb-demo`
2. **Nested breadcrumbs** - `/starter/breadcrumb-demo/items/:id`
3. **Tab breadcrumbs** - `/starter/breadcrumb-demo/items/:id/:tab`
4. **State preservation** - NavigateOptions with state for filters/context

## How to Use

### 1. Import the hook via Scalprum

```tsx
import { useRemoteHook } from '@scalprum/react-core';

const { hookResult: useBreadcrumbs } = useRemoteHook({
  scope: 'chrome',
  module: './breadcrumbs/useBreadcrumbs',
});
```

### 2. Register breadcrumbs in each route

```tsx
// Root route
useBreadcrumbs?.('/starter/breadcrumb-demo', 'Breadcrumb Demo');

// Detail route with state
const filters = { status: 'active', view: 'detail' };
useBreadcrumbs?.(
  `/starter/breadcrumb-demo/items/${id}`,
  `Item ${id}`,
  { state: { filters, returnPath: '/starter/breadcrumb-demo' } }
);
```

### 3. Access state when navigating back

```tsx
import { useLocation } from 'react-router-dom';

const location = useLocation();
const { filters, returnPath } = location.state || {};

// Restore filters when returning from breadcrumb click
useEffect(() => {
  if (filters) {
    applyFilters(filters);
  }
}, [filters]);
```

## API Reference

### `useBreadcrumbs(pathname, title, options?)`

**Parameters:**
- `pathname` (string) - Full pathname including bundle prefix (e.g., `/starter/breadcrumb-demo/items/123`)
- `title` (string) - Breadcrumb title to display
- `options` (NavigateOptions, optional) - React Router navigation options:
  - `state` - Any data to pass when navigating via breadcrumb
  - `replace` - Replace current history entry
  - `preventScrollReset` - Prevent scroll to top on navigation
  - `relative` - Relative path resolution

**Returns:** `void`

## Feature Flag

Breadcrumbs API is gated by feature flag: `platform.chrome.app-breadcrumbs`

When disabled, hooks are no-ops and only Chrome breadcrumbs render.

## Implementation Notes

- Each route independently calls `useBreadcrumbs()` - no coordination needed
- Chrome builds breadcrumb trail by matching current pathname against storage
- Cleanup happens automatically on component unmount
- State is preserved via React Router's location.state

## Testing

Run the app and navigate:
1. Click "Breadcrumb Demo" from home
2. Click "View Item 1"
3. Click "Overview Tab"
4. Click breadcrumbs in header to navigate back
5. Verify state is preserved (filters, context, etc.)
