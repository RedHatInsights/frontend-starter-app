import React, { Suspense, lazy, useEffect } from 'react';

import {
  Button,
  Spinner,
  Stack,
  StackItem,
  Title,
} from '@patternfly/react-core';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

const SampleComponent = lazy(
  () => import('../../Components/SampleComponent/sample-component'),
);

import './sample-page.scss';
import AppLink from '../../Components/AppLink';
import { useAddNotification } from '@redhat-cloud-services/frontend-components-notifications/hooks';

const SamplePage = () => {
  const { appAction } = useChrome();
  const addNotification = useAddNotification();

  useEffect(() => {
    appAction('sample-page');
  }, []);

  const handleAlert = () => {
    addNotification({
      variant: 'success',
      title: 'Notification title',
      description: 'notification description',
    });
  };

  return (
    <React.Fragment>
      <PageHeader>
        <PageHeaderTitle title="Sample Insights App" />
        <p> This is page header text </p>
      </PageHeader>
      <Main>
        <Stack hasGutter>
          <StackItem>
            <Title headingLevel="h2" size="3xl">
              {' '}
              Alerts{' '}
            </Title>
            <Button variant="primary" onClick={handleAlert}>
              {' '}
              Add alert{' '}
            </Button>
          </StackItem>
          <StackItem>
            <Suspense fallback={<Spinner />}>
              <SampleComponent />
            </Suspense>
          </StackItem>
          <StackItem>
            <Stack hasGutter>
              <StackItem>
                <Title headingLevel="h2" size="3xl">
                  {' '}
                  Links{' '}
                </Title>
              </StackItem>
              <StackItem>
                <AppLink to="/oops"> How to handle 500s in app </AppLink>
              </StackItem>
              <StackItem>
                <AppLink to="/no-permissions">
                  How to handle 403s in app
                </AppLink>
              </StackItem>
            </Stack>
          </StackItem>
        </Stack>
      </Main>
    </React.Fragment>
  );
};

export default SamplePage;
