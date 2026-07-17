# Data Queries — DI Contract

React Query hooks in this directory get **all** dependencies from `useAppServices()` (ServiceContext). This makes them environment-agnostic: they work in the browser (Chrome SDK), Storybook (MSW mocks), and any future runtime without code changes.

## Banned imports

The following must **never** be imported in files under `data/queries/`:

- `useChrome` — use `useAppServices().getToken` or `useAppServices().environment` instead
- `useAddNotification` — use `useAppServices().notify` instead
- `useFlag` — pass feature flag values as parameters from the component layer
- Any package from `@redhat-cloud-services/frontend-components` — these are platform-specific

## Pattern

```ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppServices } from '../../../../shared/contexts/ServiceContext';

export function useMyQuery() {
  const { axios } = useAppServices();
  return useQuery({
    queryKey: myKeys.list(),
    queryFn: () => axios.get('/api/...').then(r => r.data),
  });
}

export function useMyMutation() {
  const { axios, notify } = useAppServices();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => axios.post('/api/...', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: myKeys.all });
      notify('success', 'Created');
    },
    onError: (error: Error) => {
      notify('danger', 'Failed', error.message);
    },
  });
}
```

## Why

Data hooks are the most reused code in the app. If they import platform-specific hooks, they can't be tested in Storybook without mocking Chrome internals. The ServiceContext pattern lets each environment wire its own implementation once at the provider level.
