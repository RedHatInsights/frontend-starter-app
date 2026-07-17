import type { Preview } from '@storybook/react-webpack5';
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/patternfly/patternfly-addons.css';
import React from 'react';
import { createPortal } from 'react-dom';
import { IntlProvider } from 'react-intl';
import { QueryClientSetup } from '../src/shared/QueryClientSetup';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import NotificationsProvider from '@redhat-cloud-services/frontend-components-notifications/NotificationsProvider';
import { useAddNotification } from '@redhat-cloud-services/frontend-components-notifications/hooks';
import {
  StorybookMockProvider,
  hccPreviewDefaults,
  useMockState,
} from '@redhat-cloud-services/hcc-storybook-hub';
import { ServiceProvider } from '../src/shared/ServiceContext';
import type { AddNotificationFn } from '../src/shared/AppServices.browser';
import { createBrowserServices } from '../src/shared/AppServices.browser';
import type { Environment } from '../src/shared/AppServices.types';

const ComponentProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const addNotification = useAddNotification() as AddNotificationFn;
  const { environment: hubEnv } = useMockState();

  const environment: Environment = hubEnv === 'production' ? 'production' : 'stage';

  const services = createBrowserServices({
    addNotification,
    getToken: async () => 'mock-token',
    environment,
  });

  return (
    <ServiceProvider value={services}>
      <QueryClientSetup testMode>
        {typeof document !== 'undefined' && createPortal(<ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />, document.body)}
        {children}
      </QueryClientSetup>
    </ServiceProvider>
  );
};

const preview: Preview = {
  ...hccPreviewDefaults,
  parameters: {
    ...hccPreviewDefaults.parameters,
    options: {
      storySort: {
        method: 'alphabetical' as const,
        order: ['Documentation', 'User Journeys', 'Features', 'Components', '*'],
      },
    },
  },
  decorators: [
    (Story, { parameters }) => {
      if (parameters.noWrapping) {
        return (
          <StorybookMockProvider
            bundle="staging"
            app="starter"
            environment={parameters.environment === 'production' ? 'production' : 'stage'}
          >
            <Story />
          </StorybookMockProvider>
        );
      }

      return (
        <StorybookMockProvider
          bundle="staging"
          app="starter"
          environment={parameters.environment === 'production' ? 'production' : 'stage'}
        >
          <IntlProvider locale="en">
            <NotificationsProvider>
              <ComponentProviders>
                <Story />
              </ComponentProviders>
            </NotificationsProvider>
          </IntlProvider>
        </StorybookMockProvider>
      );
    },
  ],
};

export default preview;
