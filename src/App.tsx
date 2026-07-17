import { useEffect } from 'react';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

import Routing from './Routing';
import './App.scss';

const App = () => {
  const { updateDocumentTitle } = useChrome();

  useEffect(() => {
    updateDocumentTitle('Starter app');
  }, []);

  return <Routing />;
};

export { App };
