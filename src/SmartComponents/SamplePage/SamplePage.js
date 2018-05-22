import React, { Component } from 'react';
import { RouteComponentProps as RouteProps, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import asyncComponent from '../../Utilities/asyncComponent';
import './sample-page.scss';

const SampleComponent = asyncComponent(() => import('../../PresentationalComponents/SampleComponent/sample-component'));

const PageHeader = asyncComponent(() => import('../../PresentationalComponents/PageHeader/page-header'));
const PageHeaderTitle = asyncComponent(() => import('../../PresentationalComponents/PageHeader/page-header-title'));

const Alert = asyncComponent(() => import('../../PresentationalComponents/Alert/alert'));

const Card = asyncComponent(() => import('../../PresentationalComponents/Card/card'));
const CardHeader = asyncComponent(() => import('../../PresentationalComponents/Card/card-header'));
const CardContent = asyncComponent(() => import('../../PresentationalComponents/Card/card-content'));
const CardFooter = asyncComponent(() => import('../../PresentationalComponents/Card/card-footer'));

const Button = asyncComponent(() => import('../../PresentationalComponents/Button/button'));
const PF3Button = asyncComponent(() => import('../../PresentationalComponents/Button/pf-button'));

const Section = asyncComponent(() => import('../../PresentationalComponents/Section/section'));

type Props = {};
type State = {};

/**
 * A smart component that handles all the api calls and data needed by the dumb components.
 * Smart components are usually classes.
 *
 * https://reactjs.org/docs/components-and-props.html
 * https://medium.com/@thejasonfile/dumb-components-and-smart-components-e7b33a698d43
 */
class SamplePage extends Component<RouteProps<any> & Props, State> {

    render() {
        return (
            <React.Fragment>
                <Alert type='info'> This is a template for you to build your Insights app</Alert>
                <PageHeader>
                    <PageHeaderTitle>Sample Insights App</PageHeaderTitle>
                </PageHeader>
                <Section type='content'>
                    <h1> Sample Component </h1>
                        <SampleComponent> Sample Component </SampleComponent>
                    <h1> Cards </h1>
                    <Card>
                        <CardHeader> Card Header </CardHeader>
                        <CardContent> Card Content </CardContent>
                        <CardFooter> Card Footer </CardFooter>
                    </Card>
                    <h1> Buttons </h1>
                    <Section type='button-group'>
                        <Button> PF-Next Primary Button </Button>
                        <Button type='primary'> PF-Next Primary Button </Button>
                        <Button type='secondary'> PF-Next Secondary Button </Button>
                        <Button type='tertiary'> PF-Next Tertiary Button </Button>
                        <Button type='danger'> PF-Next Danger Button </Button>
                    </Section>
                    <Section type='button-group'>
                        <PF3Button> PF-3 Default </PF3Button>
                        <PF3Button bsStyle='primary'> PF-3 Primary </PF3Button>
                        <PF3Button bsStyle='success'> PF-3 Success </PF3Button>
                        <PF3Button bsStyle='info'> PF-3 Info </PF3Button>
                        <PF3Button bsStyle='warning'> PF-3 Warning </PF3Button>
                        <PF3Button bsStyle='danger'> PF-3 Danger </PF3Button>
                        <PF3Button bsStyle='link'> PF-3 Link </PF3Button>
                    </Section>
                </Section>
            </React.Fragment>
        );
    }
}

export default withRouter(SamplePage);
