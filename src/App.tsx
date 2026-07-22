import { useEffect, useMemo } from 'react';
import NotificationsProvider from '@redhat-cloud-services/frontend-components-notifications/NotificationsProvider';
import { useAddNotification } from '@redhat-cloud-services/frontend-components-notifications/hooks';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

import Routing from './Routing';
import { ServiceProvider } from './shared/ServiceContext';
import { createBrowserServices } from './shared/AppServices.browser';
import './App.scss';

const AppWithServices = () => {
  const chrome = useChrome();
  const addNotification = useAddNotification();
  const services = useMemo(
    () => createBrowserServices(chrome, addNotification),
    [chrome, addNotification],
  );

  return (
    <ServiceProvider value={services}>
      <Routing />
    </ServiceProvider>
  );
};

const App = () => {
  const { updateDocumentTitle } = useChrome();

  useEffect(() => {
    updateDocumentTitle('Starter app');
  }, []);

  return (
    <NotificationsProvider>
      <AppWithServices />
    </NotificationsProvider>
  );
};

export default App;
