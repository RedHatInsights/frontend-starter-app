import type { Meta, StoryObj } from '@storybook/react-webpack5';
import SampleComponent from './sample-component';

const meta: Meta<typeof SampleComponent> = {
  title: 'features/sample/SampleComponent',
  component: SampleComponent,
};

export default meta;
type Story = StoryObj<typeof SampleComponent>;

export const Default: Story = {
  args: {
    children: 'Hello from Storybook!',
  },
};

export const WithLongText: Story = {
  args: {
    children:
      'This is a sample component with a longer piece of text to see how it renders.',
  },
};
