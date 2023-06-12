import React, { useEffect } from 'react';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import { Unavailable } from '@redhat-cloud-services/frontend-components/Unavailable';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

const OopsPage = () => {
  const { appAction } = useChrome();

  useEffect(() => {
    appAction('oops-page');
  }, []);

  return (
    <Main>
      <Unavailable />
    </Main>
  );
};

export default OopsPage;
