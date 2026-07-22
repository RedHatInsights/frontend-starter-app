import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { MemoryRouter } from 'react-router-dom';
import SamplePage from './SamplePage';

const meta: Meta<typeof SamplePage> = {
  title: 'features/sample/SamplePage',
  component: SamplePage,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/staging/starter']}>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SamplePage>;

export const Default: Story = {};
