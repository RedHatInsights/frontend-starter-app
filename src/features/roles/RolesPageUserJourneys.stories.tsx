/**
 * User Journey Stories — Roles CRUD
 *
 * Tests the full Roles lifecycle through the UI: browsing, creating,
 * editing, and deleting roles. All journeys start from the roles list
 * page (homepage) and navigate through the app like a real user.
 *
 * @feature Roles (src/features/roles/)
 * @api GET/POST/PUT/DELETE /api/rbac/v1/roles/
 * @mocks createRolesHandlers (data/mocks/handlers.ts)
 * @seed createRolesMockDb — 8 roles (3 system, 5 custom)
 * @patterns step() closures, waitForModal, waitForNotification, spy assertions
 */

import type { Meta, StoryFn, StoryObj } from '@storybook/react-webpack5';
import { expect, fn, userEvent, within } from 'storybook/test';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { SEED_ROLES, createRolesMockDb } from './data/mocks/db';
import { createRolesHandlers } from './data/mocks/handlers';
import {
  clearAndType,
  waitForContentReady,
  waitForModal,
  waitForModalClose,
  waitForNotification,
} from '../../shared/interactionHelpers';
import Routing from '../../Routing';

const db = createRolesMockDb();

const onListSpy = fn();
const onReadSpy = fn();
const onCreateSpy = fn();
const onUpdateSpy = fn();
const onDeleteSpy = fn();

const meta: Meta = {
  parameters: {
    msw: {
      handlers: createRolesHandlers(db, {
        onList: onListSpy,
        onRead: onReadSpy,
        onCreate: onCreateSpy,
        onUpdate: onUpdateSpy,
        onDelete: onDeleteSpy,
      }),
    },
  },
  decorators: [
    (Story: StoryFn) => {
      db.reset();
      onListSpy.mockClear();
      onReadSpy.mockClear();
      onCreateSpy.mockClear();
      onUpdateSpy.mockClear();
      onDeleteSpy.mockClear();
      return (
        <MemoryRouter initialEntries={['/staging/starter/roles']}>
          <Routes>
            <Route path={'/staging/starter/*'} element={<Story />} />
          </Routes>
        </MemoryRouter>
      );
    },
  ],
};

export default meta;
type Story = StoryObj;

const FIRST_SYSTEM_ROLE = SEED_ROLES[0];
const FIRST_CUSTOM_ROLE = SEED_ROLES.find((r) => !r.system)!;

/**
 * Journey 1: Browse Roles
 *
 * User lands on the roles list, sees data, filters by name,
 * verifies system/custom badges.
 */
export const BrowseRoles: Story = {
  render: () => <Routing />,
  play: async ({ canvasElement, step }) => {
    const user = userEvent.setup();

    await step('Wait for the table to load', async () => {
      await waitForContentReady(canvasElement);
    });

    await step('Verify roles are displayed', async () => {
      const canvas = within(canvasElement);
      await expect(
        canvas.getByText(FIRST_SYSTEM_ROLE.display_name!),
      ).toBeInTheDocument();
      await expect(
        canvas.getByText(FIRST_CUSTOM_ROLE.display_name!),
      ).toBeInTheDocument();
    });

    await step('Verify system and custom badges', async () => {
      const canvas = within(canvasElement);
      const systemLabels = canvas.getAllByText('System');
      const customLabels = canvas.getAllByText('Custom');
      expect(systemLabels.length).toBeGreaterThan(0);
      expect(customLabels.length).toBeGreaterThan(0);
    });

    await step('Filter by name', async () => {
      const canvas = within(canvasElement);
      await clearAndType(
        user,
        () => canvas.getByPlaceholderText('Filter by name...'),
        'advisor',
      );
      await waitForContentReady(canvasElement);
    });

    await step('Verify filtered results', async () => {
      const canvas = within(canvasElement);
      await expect(
        canvas.getByText('Advisor Administrator'),
      ).toBeInTheDocument();
      expect(
        canvas.queryByText(FIRST_SYSTEM_ROLE.display_name!),
      ).not.toBeInTheDocument();
    });
  },
};

/**
 * Journey 2: Create Role
 *
 * User clicks "Create role", fills the wizard (2 steps),
 * submits, and sees the new role in the table.
 */
export const CreateRole: Story = {
  render: () => <Routing />,
  play: async ({ canvasElement, step }) => {
    const user = userEvent.setup();

    await step('Wait for the table to load', async () => {
      await waitForContentReady(canvasElement);
    });

    await step('Click "Create role"', async () => {
      const canvas = within(canvasElement);
      const createButton = canvas.getByRole('link', { name: 'Create role' });
      await user.click(createButton);
    });

    await step('Fill in wizard step 1 — Details', async () => {
      const modal = await waitForModal();
      await clearAndType(
        user,
        () => modal.getByLabelText('Role name'),
        'My Test Role',
      );
      await clearAndType(
        user,
        () => modal.getByLabelText('Role display name'),
        'My Test Role Display',
      );
      await clearAndType(
        user,
        () => modal.getByLabelText('Role description'),
        'A role created during testing',
      );
    });

    await step('Navigate to step 2 — Review', async () => {
      const modal = await waitForModal();
      const nextButton = modal.getByRole('button', { name: 'Next' });
      await user.click(nextButton);
    });

    await step('Verify review shows entered data', async () => {
      const modal = await waitForModal();
      await expect(modal.getByText('My Test Role')).toBeInTheDocument();
      await expect(
        modal.getByText('A role created during testing'),
      ).toBeInTheDocument();
    });

    await step('Submit the wizard', async () => {
      const modal = await waitForModal();
      const createButton = modal.getByRole('button', { name: 'Create' });
      await user.click(createButton);
    });

    await step('Verify creation', async () => {
      await waitForModalClose();
      await waitForNotification('Role created');
      expect(onCreateSpy).toHaveBeenCalled();
    });
  },
};

/**
 * Journey 3: Edit Role
 *
 * User opens the kebab on a custom role, clicks "Edit",
 * modifies the description in the wizard, and submits.
 */
export const EditRole: Story = {
  render: () => <Routing />,
  play: async ({ canvasElement, step }) => {
    const user = userEvent.setup();

    await step('Wait for the table to load', async () => {
      await waitForContentReady(canvasElement);
    });

    await step('Open row actions for a custom role', async () => {
      const canvas = within(canvasElement);
      const rows = canvas.getAllByRole('row');
      const targetRow = rows.find((row: HTMLElement) =>
        row.textContent?.includes(FIRST_CUSTOM_ROLE.display_name!),
      );
      expect(targetRow).toBeTruthy();
      const kebab = within(targetRow!).getByRole('button', {
        name: 'Kebab toggle',
      });
      await user.click(kebab);
    });

    await step('Click "Edit"', async () => {
      const editMenuItem = await within(document.body).findByRole('menuitem', {
        name: 'Edit',
      });
      await user.click(editMenuItem);
    });

    await step(
      'Wait for wizard to load and verify pre-populated data',
      async () => {
        const modal = await waitForModal();
        const nameInput = await modal.findByLabelText(
          'Role name',
          {},
          { timeout: 10000 },
        );
        expect((nameInput as HTMLInputElement).value).toBe(
          FIRST_CUSTOM_ROLE.name,
        );
      },
    );

    await step('Change the description', async () => {
      const modal = await waitForModal();
      await clearAndType(
        user,
        () => modal.getByLabelText('Role description'),
        'Updated description for testing',
      );
    });

    await step('Navigate to Review and submit', async () => {
      let modal = await waitForModal();
      const nextButton = modal.getByRole('button', { name: 'Next' });
      await user.click(nextButton);
      modal = await waitForModal();
      const saveButton = await modal.findByRole('button', { name: 'Save' });
      await user.click(saveButton);
    });

    await step('Verify update', async () => {
      await waitForModalClose();
      await waitForNotification('Role updated');
      expect(onUpdateSpy).toHaveBeenCalled();
    });
  },
};

/**
 * Journey 4: Delete Role
 *
 * User opens the kebab on a custom role, clicks "Delete",
 * confirms in the modal, and sees the role removed.
 */
export const DeleteRole: Story = {
  render: () => <Routing />,
  play: async ({ canvasElement, step }) => {
    const user = userEvent.setup();

    await step('Wait for the table to load', async () => {
      await waitForContentReady(canvasElement);
    });

    await step('Open row actions for a custom role', async () => {
      const canvas = within(canvasElement);
      const rows = canvas.getAllByRole('row');
      const targetRow = rows.find((row: HTMLElement) =>
        row.textContent?.includes(FIRST_CUSTOM_ROLE.display_name!),
      );
      expect(targetRow).toBeTruthy();
      const kebab = within(targetRow!).getByRole('button', {
        name: 'Kebab toggle',
      });
      await user.click(kebab);
    });

    await step('Click "Delete"', async () => {
      const deleteMenuItem = await within(document.body).findByRole(
        'menuitem',
        { name: 'Delete' },
      );
      await user.click(deleteMenuItem);
    });

    await step('Confirm deletion in the modal', async () => {
      const modal = await waitForModal();
      await expect(
        modal.getByText(FIRST_CUSTOM_ROLE.display_name!),
      ).toBeInTheDocument();
      const deleteButton = modal.getByRole('button', { name: 'Delete' });
      await user.click(deleteButton);
    });

    await step('Verify deletion', async () => {
      await waitForModalClose();
      await waitForNotification('Role deleted');
      expect(onDeleteSpy).toHaveBeenCalledWith(FIRST_CUSTOM_ROLE.uuid);
    });
  },
};

/**
 * Journey 5: Empty State
 *
 * When there are no roles, the table shows an empty state.
 */
export const EmptyState: Story = {
  render: () => <Routing />,
  decorators: [
    (Story: StoryFn) => {
      db.reset();
      db.items.splice(0, db.items.length);
      return <Story />;
    },
  ],
  play: async ({ canvasElement, step }) => {
    await step('Wait for the empty state', async () => {
      await waitForContentReady(canvasElement);
    });

    await step('Verify empty state is displayed', async () => {
      const canvas = within(canvasElement);
      await expect(canvas.getByText('No data available')).toBeInTheDocument();
    });
  },
};
