import type { Preview } from '@storybook/react-webpack5';
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/patternfly/patternfly-addons.css';
import React from 'react';
import NotificationsProvider from '@redhat-cloud-services/frontend-components-notifications/NotificationsProvider';
import {
  StorybookMockProvider,
  hccPreviewDefaults,
} from '@redhat-cloud-services/hcc-storybook-hub';

const preview: Preview = {
  ...hccPreviewDefaults,
  decorators: [
    (Story, { parameters }) => (
      <StorybookMockProvider
        bundle="staging"
        app="starter"
        environment={
          parameters.environment === 'production' ? 'production' : 'stage'
        }
      >
        <NotificationsProvider>
          <Story />
        </NotificationsProvider>
      </StorybookMockProvider>
    ),
  ],
};

export default preview;
