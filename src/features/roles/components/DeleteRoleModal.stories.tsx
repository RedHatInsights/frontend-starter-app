import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, fn, userEvent } from 'storybook/test';
import { DeleteRoleModal } from './DeleteRoleModal';
import { SEED_ROLES, createRolesMockDb } from '../data/mocks/db';
import { createRolesHandlers } from '../data/mocks/handlers';
import {
  waitForModal,
  waitForNotification,
} from '../../../shared/interactionHelpers';

const db = createRolesMockDb();
const onDeleteSpy = fn();
const CUSTOM_ROLE = SEED_ROLES.find((r) => !r.system)!;

const meta: Meta<typeof DeleteRoleModal> = {
  component: DeleteRoleModal,
  parameters: {
    msw: {
      handlers: createRolesHandlers(db, { onDelete: onDeleteSpy }),
    },
  },
  decorators: [
    (Story) => {
      db.reset();
      onDeleteSpy.mockClear();
      return <Story />;
    },
  ],
};

export default meta;
type Story = StoryObj<typeof DeleteRoleModal>;

export const Open: Story = {
  args: {
    role: CUSTOM_ROLE,
    onClose: fn(),
  },
};

export const ConfirmDelete: Story = {
  args: {
    role: CUSTOM_ROLE,
    onClose: fn(),
  },
  play: async ({ step }) => {
    const user = userEvent.setup();

    await step('Click Delete button', async () => {
      const modal = await waitForModal();
      const deleteButton = modal.getByRole('button', { name: 'Delete' });
      await user.click(deleteButton);
    });

    await step('Verify deletion was requested', async () => {
      await waitForNotification('Role deleted');
      expect(onDeleteSpy).toHaveBeenCalledWith(CUSTOM_ROLE.uuid);
    });
  },
};

export const Closed: Story = {
  args: {
    role: null,
    onClose: fn(),
  },
};
