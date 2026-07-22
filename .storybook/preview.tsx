import type { Preview } from '@storybook/react-webpack5';
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/patternfly/patternfly-addons.css';
import React, { useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NotificationsProvider from '@redhat-cloud-services/frontend-components-notifications/NotificationsProvider';
import { useAddNotification } from '@redhat-cloud-services/frontend-components-notifications/hooks';
import {
  StorybookMockProvider,
  hccPreviewDefaults,
} from '@redhat-cloud-services/hcc-storybook-hub';
import { ServiceProvider } from '../src/shared/ServiceContext';
import type { AppServices } from '../src/shared/AppServices.types';

const baseMockServices: Omit<AppServices, 'addNotification' | 'notify'> = {
  appAction: () => {},
  getToken: async () => 'mock-token',
  environment: 'stage',
  fetchCVEs: async () => [],
};

const ServiceProviderWithNotifications: React.FC<{
  overrides?: Partial<AppServices>;
  children: React.ReactNode;
}> = ({ overrides, children }) => {
  const addNotification = useAddNotification();
  const services = useMemo<AppServices>(
    () => ({
      ...baseMockServices,
      addNotification,
      notify: (variant, title, description) =>
        addNotification({ variant, title, description }),
      ...overrides,
    }),
    [addNotification, overrides],
  );
  return <ServiceProvider value={services}>{children}</ServiceProvider>;
};

const preview: Preview = {
  ...hccPreviewDefaults,
  decorators: [
    (Story, { parameters }) => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, staleTime: Infinity },
        },
      });
      return (
        <StorybookMockProvider
          bundle="staging"
          app="starter"
          environment={
            parameters.environment === 'production' ? 'production' : 'stage'
          }
        >
          <NotificationsProvider>
            <ServiceProviderWithNotifications overrides={parameters.services}>
              <QueryClientProvider client={queryClient}>
                <Story />
              </QueryClientProvider>
            </ServiceProviderWithNotifications>
          </NotificationsProvider>
        </StorybookMockProvider>
      );
    },
  ],
};

export default preview;
