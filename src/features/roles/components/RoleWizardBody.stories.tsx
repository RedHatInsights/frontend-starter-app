import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, fn, userEvent, within } from 'storybook/test';
import { DetailsStep, type RoleFormData } from './RoleWizardBody';
import { clearAndType } from '../../../shared/interactionHelpers';

const SAMPLE_DATA: RoleFormData = {
  name: 'Custom Admin',
  displayName: 'Custom Administrator',
  description: 'A custom role for testing',
};

const detailsMeta: Meta<typeof DetailsStep> = {
  component: DetailsStep,
};

export default detailsMeta;
type DetailsStory = StoryObj<typeof DetailsStep>;

export const Empty: DetailsStory = {
  args: {
    formData: { name: '', displayName: '', description: '' },
    onChange: fn(),
  },
};

export const Filled: DetailsStory = {
  args: {
    formData: SAMPLE_DATA,
    onChange: fn(),
  },
};

export const TypeInFields: DetailsStory = {
  args: {
    formData: { name: '', displayName: '', description: '' },
    onChange: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);

    await step('Type in the name field', async () => {
      await clearAndType(
        user,
        () => canvas.getByLabelText('Role name'),
        'New Role',
      );
      expect(args.onChange).toHaveBeenCalled();
    });
  },
};
