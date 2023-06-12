import React, { useEffect } from 'react';

import { Main } from '@redhat-cloud-services/frontend-components/Main';
import { NotAuthorized } from '@redhat-cloud-services/frontend-components/NotAuthorized';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

const NoPermissionsPage = () => {
  const { appAction } = useChrome();

  useEffect(() => {
    appAction('no-permissions');
  }, []);

  return (
    <Main>
      <NotAuthorized serviceName="Sample app" />
    </Main>
  );
};

export default NoPermissionsPage;
