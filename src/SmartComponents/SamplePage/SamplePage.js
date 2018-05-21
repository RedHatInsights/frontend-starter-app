import React, { Component } from 'react';
import { RouteComponentProps as RouteProps, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import asyncComponent from '../../Utils/asyncComponent';
import './sample-page.scss';

const SampleComponent = asyncComponent(() => import('../../DumbComponents/SampleComponent/sample-component'));

const PageHeader = asyncComponent(() => import('../../DumbComponents/PageHeader/page-header'));
const PageHeaderTitle = asyncComponent(() => import('../../DumbComponents/PageHeader/page-header-title'));

const Card = asyncComponent(() => import('../../DumbComponents/Card/card'));
const CardHeader = asyncComponent(() => import('../../DumbComponents/Card/card-header'));
const CardContent = asyncComponent(() => import('../../DumbComponents/Card/card-content'));
const CardFooter = asyncComponent(() => import('../../DumbComponents/Card/card-footer'));

const Button = asyncComponent(() => import('../../DumbComponents/Button/button'));
const PF3Button = asyncComponent(() => import('../../DumbComponents/Button/pf-button'));

const Section = asyncComponent(() => import('../../DumbComponents/Section/section'));

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
                <PageHeader>
                    <PageHeaderTitle>Sample Insights App</PageHeaderTitle>
                </PageHeader>
                <section className='ins-l-content'>
                    <h1> Sample Component </h1>
                        <SampleComponent> Testing </SampleComponent>
                    <h1> Cards </h1>
                    <Card>
                        <CardHeader> Card Header </CardHeader>
                        <CardContent> Card Content </CardContent>
                        <CardFooter> Card Footer </CardFooter>
                    </Card>
                    <h1> Buttons </h1>
                    <Button> PF-Next Primary Button </Button>
                    <Button type='primary'> PF-Next Primary Button </Button>
                    <Button type='secondary'> PF-Next Secondary Button </Button>
                    <Button type='tertiary'> PF-Next Tertiary Button </Button>
                    <Button type='danger'> PF-Next Danger Button </Button>
                    <Section type='content'>
                        <PF3Button> PF-3 Default </PF3Button>
                        <PF3Button bsStyle='primary'> PF-3 Primary </PF3Button>
                        <PF3Button bsStyle='success'> PF-3 Success </PF3Button>
                        <PF3Button bsStyle='info'> PF-3 Info </PF3Button>
                        <PF3Button bsStyle='warning'> PF-3 Warning </PF3Button>
                        <PF3Button bsStyle='danger'> PF-3 Danger </PF3Button>
                        <PF3Button bsStyle='link'> PF-3 Link </PF3Button>
                    </Section>
                </section>
            </React.Fragment>
        );
    }
}

export default withRouter(SamplePage);
