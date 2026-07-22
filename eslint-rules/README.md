# Custom ESLint Rules

Project-specific ESLint rules that enforce the patterns used in this starter app. These rules catch common mistakes at lint time rather than at runtime or in code review.

## Rules

### `no-direct-user-type`

**Severity:** error

Bans `user.type()` in stories and test files. Direct `user.type()` is flaky in data-driven-forms because re-renders can steal focus mid-typing. Use `clearAndType(user, input, text)` from `src/shared/interactionHelpers.ts` instead — it clicks the input first to guarantee focus, then clears and types atomically.

The only file exempt from this rule is `interactionHelpers.ts` itself.

### `require-use-table-state`

**Severity:** warning

Flags files that import `TableView` without also importing `useTableState`. Hand-rolling table state leads to subtle bugs (broken multi-select, missing sort direction). Components that receive `tableState` from a parent should suppress with `eslint-disable`.

### `enforce-story-patterns`

**Severity:** warning

Catches two anti-patterns in Storybook play functions:

1. **`canvasElement.querySelector()` / `querySelectorAll()`** — use `within()` + role/text queries instead. DOM queries bypass Testing Library's accessibility-aware selectors and break when markup changes.

2. **`getBy*` / `getAllBy*` inside `waitFor`** — these throw immediately on mismatch, preventing `waitFor` from retrying. Use `queryBy*` + `expect` inside `waitFor`, or `findBy*` outside it.
