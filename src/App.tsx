import React, { Fragment, useEffect } from 'react';
import { Reducer } from 'redux';

import Routing from './Routing';
import './App.scss';

import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/Registry';
import NotificationsPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import { notificationsReducer } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

const App = () => {
  const { updateDocumentTitle } = useChrome();

  useEffect(() => {
    const registry = getRegistry();
    registry.register({ notifications: notificationsReducer as Reducer });
    // You can use directly the name of your app
    updateDocumentTitle('Starter app');
  }, []);

  return (
    <Fragment>
      <NotificationsPortal />
      <Routing />
    </Fragment>
  );
};

export default App;
