import type { Meta, StoryObj } from '@storybook/react-webpack5';
import CVEList from './CVEList';

const meta: Meta<typeof CVEList> = {
  title: 'features/sample/CVEList',
  component: CVEList,
  parameters: {
    services: {
      fetchCVEs: async () => [
        {
          CVE: 'CVE-2024-12345',
          severity: 'important',
          public_date: '2024-07-15T12:00:00Z',
          bugzilla_description: 'kernel: use-after-free in netfilter subsystem',
          cvss3_score: '7.8',
          CWE: 'CWE-416',
          resource_url: '#',
        },
        {
          CVE: 'CVE-2024-67890',
          severity: 'moderate',
          public_date: '2024-07-10T08:30:00Z',
          bugzilla_description:
            'openssl: buffer overread in certificate verification',
          cvss3_score: '5.3',
          CWE: 'CWE-125',
          resource_url: '#',
        },
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof CVEList>;

export const Default: Story = {};
