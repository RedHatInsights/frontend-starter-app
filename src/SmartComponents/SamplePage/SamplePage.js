import React, { Component } from 'react';
import { RouteComponentProps as RouteProps, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import asyncComponent from '../../Utils/asyncComponent';
import './sample-page.scss';

const SampleComponent = asyncComponent(() => import('../../DumbComponents/SampleComponent/sample-component'));
const PageHeader = asyncComponent(() => import('../../DumbComponents/PageHeader/page-header'));
const PageHeaderTitle = asyncComponent(() => import('../../DumbComponents/PageHeader/page-header-title'));

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
                <SampleComponent> Testing </SampleComponent>
            </React.Fragment>
        );
    }
}

export default withRouter(SamplePage);
