import React, { Suspense, lazy, useEffect } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { Button, StackItem, Stack, Title, Spinner } from '@patternfly/react-core';
import { Main, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/';

const SampleComponent = lazy(() => import('../../Components/SampleComponent/sample-component'));

import './sample-page.scss';

/**
 * A smart component that handles all the api calls and data needed by the dumb components.
 * Smart components are usually classes.
 *
 * https://reactjs.org/docs/components-and-props.html
 * https://medium.com/@thejasonfile/dumb-components-and-smart-components-e7b33a698d43
 */
const SamplePage = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        insights?.chrome?.appAction?.('sample-page');
    }, []);

    const handleAlert = () => {
        dispatch(
            addNotification({
                variant: 'success',
                title: 'Notification title',
                description: 'notification description'
            })
        );
    };

    return (
        <React.Fragment>
            <PageHeader>
                <PageHeaderTitle title='Sample Insights App'/>
                <p> This is page header text </p>
            </PageHeader>
            <Main>
                <Stack hasGutter>
                    <StackItem>
                        <Title headingLevel="h2" size="3xl"> Alerts </Title>
                        <Button variant='primary' onClick={handleAlert}> Dispatch alert </Button>
                    </StackItem>
                    <StackItem>
                        <Suspense fallback={<Spinner />}>
                            <SampleComponent/>
                        </Suspense>
                    </StackItem>
                    <StackItem>
                        <Stack hasGutter>
                            <StackItem>
                                <Title headingLevel="h2" size="3xl"> Links </Title>
                            </StackItem>
                            <StackItem><Link to='/oops'> How to handle 500s in app </Link></StackItem>
                            <StackItem><Link to='/no-permissions'> How to handle 403s in app </Link></StackItem>
                        </Stack>
                    </StackItem>
                </Stack>
            </Main>
        </React.Fragment>
    );
};

export default withRouter(SamplePage);
