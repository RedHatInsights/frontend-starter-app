import React, { Fragment, useEffect } from 'react';
import NotificationsProvider from '@redhat-cloud-services/frontend-components-notifications/NotificationsProvider';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

import Routing from './Routing';
import './App.scss';

const App = () => {
  const { updateDocumentTitle } = useChrome();

  useEffect(() => {
    // You can use directly the name of your app
    updateDocumentTitle('Starter app');
  }, []);

  return (
    <Fragment>
      <NotificationsProvider>
        <Routing />
      </NotificationsProvider>
    </Fragment>
  );
};

export default App;
