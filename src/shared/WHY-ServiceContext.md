# Why ServiceContext (Dependency Injection)

## The problem
Components that import `useChrome()` directly cannot be tested without
mocking Chrome. Chrome mocks are fragile, break on Chrome updates, and
don't test your component's logic — they test your ability to replicate
Chrome's API surface.

## The solution
ServiceContext provides dependencies through React context. Production
uses `AppServices.browser.ts` (calls Chrome). Tests use Storybook's
preview.tsx (controlled mocks). The component never knows the difference.

## Before (in this repo — see SamplePage.tsx git history)
```tsx
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

function SamplePage() {
  const { appAction } = useChrome();  // ← can't render without Chrome
  // ...
}
```

## After
```tsx
import { useAppServices } from '../../shared/ServiceContext';

function SamplePage() {
  const { appAction } = useAppServices();  // ← testable, mockable
  // ...
}
```

The diff in this PR shows this exact refactor on the real SamplePage.
