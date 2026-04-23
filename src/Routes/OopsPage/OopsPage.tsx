import { useEffect } from 'react';
import { Unavailable } from '@redhat-cloud-services/frontend-components/Unavailable';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

const OopsPage = () => {
  const { appAction } = useChrome();

  useEffect(() => {
    appAction('oops-page');
  }, []);

  return (
    <section>
      <Unavailable />
    </section>
  );
};

export default OopsPage;
