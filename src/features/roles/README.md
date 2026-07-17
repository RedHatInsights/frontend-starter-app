# Roles Feature Island

Example feature demonstrating a full CRUD workflow using real `@redhat-cloud-services/rbac-client` types. Showcases TanStack Query hooks, ServiceContext DI, TableView with useTableState, wizard-in-modal for create/edit, MSW handler factories, and user journey Storybook stories.

## What this island owns

- **Roles CRUD** — list, create, edit, delete operations against `/api/rbac/v1/roles/`
- **RolesPage** — list page with TableView, system/custom badges, row actions
- **CreateRoleWizard** — 2-step wizard in modal (Details → Review)
- **EditRoleWizard** — same wizard, pre-populated from API
- **DeleteRoleModal** — destructive confirmation dialog

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/roles` | RolesPage | Roles list with table |
| `/roles/create` | CreateRoleWizard (modal over list) | Create a new role |
| `/roles/:uuid/edit` | EditRoleWizard (modal over list) | Edit an existing role |

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/rbac/v1/roles/` | List roles with filtering, sorting, offset pagination |
| GET | `/api/rbac/v1/roles/:uuid/` | Get a single role |
| POST | `/api/rbac/v1/roles/` | Create a new role |
| PUT | `/api/rbac/v1/roles/:uuid/` | Update a role |
| DELETE | `/api/rbac/v1/roles/:uuid/` | Delete a role |

## Data layer

- `data/queries/roles.ts` — Query hooks (`useRolesQuery`, `useRoleQuery`, `useCreateRoleMutation`, `useUpdateRoleMutation`, `useDeleteRoleMutation`) and keys factory (`roleKeys`)
- `data/mocks/db.ts` — Mock database with 8 seed roles (3 system, 5 custom)
- `data/mocks/handlers.ts` — MSW handler factory (`createRolesHandlers`) with spy callbacks for all 5 endpoints

## Stories

- `RolesPage.stories.tsx` — Five user journey stories, all starting from the roles list:
  1. **BrowseRoles** — Filter by name, verify system/custom badges
  2. **CreateRole** — Create via 2-step wizard, verify notification
  3. **EditRole** — Edit via wizard pre-populated from API, verify update
  4. **DeleteRole** — Delete via row action, confirm in modal
  5. **EmptyState** — No roles, shows empty state

## Constraints

- Query hooks only use `useAppServices()` for dependencies
- All MSW handlers come from the factory — no inline handlers
- Mock DB resets in story decorators for test isolation
- System roles cannot be edited or deleted (row actions disabled)
- Types come from `@redhat-cloud-services/rbac-client` — no custom type definitions
