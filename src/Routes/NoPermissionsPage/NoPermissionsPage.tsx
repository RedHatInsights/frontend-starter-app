import { useEffect } from 'react';

import { NotAuthorized } from '@redhat-cloud-services/frontend-components/NotAuthorized';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

const NoPermissionsPage = () => {
  const { appAction } = useChrome();

  useEffect(() => {
    appAction('no-permissions');
  }, []);

  return (
    <section>
      <NotAuthorized serviceName="Sample app" />
    </section>
  );
};

export default NoPermissionsPage;
