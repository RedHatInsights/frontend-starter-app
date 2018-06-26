import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import asyncComponent from '../../Utilities/asyncComponent';
import './sample-page.scss';
import { PageHeader } from '@red-hat-insights/insights-frontend-components';
import { PageHeaderTitle } from '@red-hat-insights/insights-frontend-components';
import { Section } from '@red-hat-insights/insights-frontend-components';

import { Button } from '@patternfly/react-core';

const SampleComponent = asyncComponent(() => import('../../PresentationalComponents/SampleComponent/sample-component'));

/**
 * A smart component that handles all the api calls and data needed by the dumb components.
 * Smart components are usually classes.
 *
 * https://reactjs.org/docs/components-and-props.html
 * https://medium.com/@thejasonfile/dumb-components-and-smart-components-e7b33a698d43
 */
class SamplePage extends Component {

    render() {
        return (
            <React.Fragment>
                <PageHeader>
                    <PageHeaderTitle>Sample Insights App</PageHeaderTitle>
                </PageHeader>
                <Section type='content'>
                    <h1> Sample Component </h1>
                    <SampleComponent> Sample Component </SampleComponent>
                    <h1> Cards </h1>
                    <h1> Buttons </h1>
                    <Section type='button-group'>
                        <Button variant='primary'> PF-Next Primary Button </Button>
                        <Button variant='secondary'> PF-Next Secondary Button </Button>
                        <Button variant='tertiary'> PF-Next Tertiary Button </Button>
                        <Button variant='danger'> PF-Next Danger Button </Button>
                    </Section>
                </Section>
            </React.Fragment>
        );
    }
}

export default withRouter(SamplePage);
