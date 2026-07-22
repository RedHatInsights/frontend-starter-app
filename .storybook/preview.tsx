import type { Preview } from '@storybook/react-webpack5';
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/patternfly/patternfly-addons.css';
import React from 'react';
import NotificationsProvider from '@redhat-cloud-services/frontend-components-notifications/NotificationsProvider';
import {
  StorybookMockProvider,
  hccPreviewDefaults,
} from '@redhat-cloud-services/hcc-storybook-hub';
import { ServiceProvider } from '../src/shared/ServiceContext';
import type { AppServices } from '../src/shared/AppServices.types';

const mockServices: AppServices = {
  appAction: () => {},
  addNotification: () => {},
  getToken: async () => 'mock-token',
  environment: 'stage',
};

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
          <ServiceProvider value={parameters.services ?? mockServices}>
            <Story />
          </ServiceProvider>
        </NotificationsProvider>
      </StorybookMockProvider>
    ),
  ],
};

export default preview;
