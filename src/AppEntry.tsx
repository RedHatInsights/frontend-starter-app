import React from 'react';
import NotificationsProvider from '@redhat-cloud-services/frontend-components-notifications/NotificationsProvider';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { useAddNotification } from '@redhat-cloud-services/frontend-components-notifications/hooks';
import { ServiceProvider } from './shared/ServiceContext';
import { QueryClientSetup } from './shared/QueryClientSetup';
import {
  type AddNotificationFn,
  createBrowserServices,
} from './shared/AppServices.browser';
import type { Environment } from './shared/AppServices.types';
import { App } from './App';

const AppWithServices: React.FC = () => {
  const chrome = useChrome();
  const addNotification = useAddNotification() as AddNotificationFn;

  const services = createBrowserServices({
    addNotification,
    getToken: chrome.auth.getToken as () => Promise<string>,
    environment: (chrome.getEnvironment?.() || 'stage') as Environment,
  });

  return (
    <ServiceProvider value={services}>
      <QueryClientSetup>
        <App />
      </QueryClientSetup>
    </ServiceProvider>
  );
};

const AppEntry: React.FC = () => (
  <NotificationsProvider>
    <AppWithServices />
  </NotificationsProvider>
);

export default AppEntry;
