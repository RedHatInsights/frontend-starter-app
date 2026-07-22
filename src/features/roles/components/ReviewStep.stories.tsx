import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { ReviewStep, type RoleFormData } from './RoleWizardBody';

const SAMPLE_DATA: RoleFormData = {
  name: 'Custom Admin',
  displayName: 'Custom Administrator',
  description: 'A custom role for testing',
};

const meta: Meta<typeof ReviewStep> = {
  component: ReviewStep,
};

export default meta;
type Story = StoryObj<typeof ReviewStep>;

export const WithData: Story = {
  args: {
    formData: SAMPLE_DATA,
  },
};

export const EmptyFields: Story = {
  args: {
    formData: { name: '', displayName: '', description: '' },
  },
};
