import React, { Component } from 'react';
import { RouteComponentProps as RouteProps, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import asyncComponent from '../../Utils/asyncComponent';
import { getSystems } from "../../api/System/getSystems";
import './InventoryDeployments.scss';
import Tabs from '../../SmartComponents/tabs/tabs.js';
import TabPane from '../../DumbComponents/Tabs/tab-pane.js';

const HelloWorld = asyncComponent(() => import('../../DumbComponents/HelloWorld/hello-world'));
const Card = asyncComponent(() => import('../../DumbComponents/Card/card'));
const CardHeader = asyncComponent(() => import('../../DumbComponents/Card/card-header'));
const CardContent = asyncComponent(() => import('../../DumbComponents/Card/card-content'));
const CardCTA = asyncComponent(() => import('../../DumbComponents/Card/card-cta'));
const PfButton = asyncComponent(() => import('../../DumbComponents/Card/pf-button'));
const PageHeader = asyncComponent(() => import('../../DumbComponents/PageHeader/page-header'));
const PageHeaderTitle = asyncComponent(() => import('../../DumbComponents/PageHeader/page-header-title'));

const Alert = asyncComponent(() => import('../../DumbComponents/Alert/alert'));
const Button = asyncComponent(() => import('../../DumbComponents/Button/button'));


type Props = {};
type State = {};

/**
 * A smart component that handles all the api calls and data needed by the dumb components.
 * Smart components are usually classes.
 *
 * https://reactjs.org/docs/components-and-props.html
 * https://medium.com/@thejasonfile/dumb-components-and-smart-components-e7b33a698d43
 */
class InventoryDeployments extends Component<RouteProps<any> & Props, State> {
    componentDidMount() {
        this.props.getSystems();
    }

    render() {
        const cards = this.props.systems.map((system) => {
            return (
                <Card key={system.system_id}>
                    <CardHeader>
                        {system.toString}
                    </CardHeader>
                    <CardContent>
                        {system.system_id}
                    </CardContent>
                </Card>
            )
        });

        return (
            <React.Fragment>
                <PageHeader>
                    <PageHeaderTitle> Inventory </PageHeaderTitle>
                </PageHeader>
                <Alert type='success'> This is a successful alert</Alert>
                <Tabs selected={0}>
                    <TabPane label='Tab 1'>
                        <Card>
                            <CardHeader>
                                <HelloWorld> Welcome! </HelloWorld>
                            </CardHeader>
                            <CardContent>
                                <span> Here is some content for this dank card </span>
                                <CardCTA> Call to Action</CardCTA>
                            </CardContent>
                        </Card>
                    </TabPane>
                    <TabPane label='Tab 2'>
                        <Card>
                            <CardHeader>
                                <HelloWorld> Welcome! </HelloWorld>
                            </CardHeader>
                            <CardContent>
                                <span> Here is some content for special patternfly </span>
                                <PfButton bsStyle="danger">Some smart text</PfButton>
                                <Button type='danger' size='small'>Some smart text</Button>
                            </CardContent>
                        </Card>
                    </TabPane>
                    <TabPane label='Tab 3'>
                        {cards}
                    </TabPane>
                </Tabs>
            </React.Fragment>
        );
    }
}

/**
 * Lets you pick the properties from the state that are
 * needed for this component.
 *
 * @param state redux store state
 * @param props the props for the current component
 */
const mapStateToProps = (state, props) => {
    return {...props, ...state};
};

/**
 * withRouter: https://reacttraining.com/react-router/web/api/withRouter
 * connect: https://github.com/reactjs/react-redux/blob/master/docs/api.md
 *
 * The second argument for connect is and action creator that dispatches and action.
 * https://redux.js.org/advanced/async-actions
 */
export default withRouter(connect(mapStateToProps, { getSystems })(InventoryDeployments));
