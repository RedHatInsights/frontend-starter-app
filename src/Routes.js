import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import some from 'lodash/some';
import asyncComponent from './Utils/asyncComponent';

/**
 * Aysnc imports of components
 *
 * https://webpack.js.org/guides/code-splitting/
 * https://reactjs.org/docs/code-splitting.html
 *
 * pros:
 *      1) code splitting
 *      2) can be used in server-side rendering
 * cons:
 *      1) nameing chunk names adds unnecessary docs to code,
 *         see the difference with DashboardMap and InventoryDeployments.
 *
 */
const DashboardMap = asyncComponent(() => import('./SmartComponents/overview/DashboardMap'));
const InventoryDeployments = asyncComponent(() => import(/* webpackChunkName: "InventoryDeployments" */ './SmartComponents/inventory/InventoryDeployments'));
const paths = {
    overview_map: '/dashboard/map',
    inventory_deployments: '/deployments'
};

type Props = {
  childProps: any
};

const InsightsRoute = ({ component: Component, rootClass, ...rest}) => {
    const root = document.getElementById('root');
    root.removeAttribute('class');
    root.classList.add(`page__${rootClass}`);

    return (<Component {...rest} />);
};

/**
 * the Switch component changes routes depending on the path.
 *
 * Route properties:
 *      exact - path must match exactly,
 *      path - localhost:8002/dashboard/map
 *      component - component to be rendered when a route has been chosen.
 */
export const Routes = (props: Props) => {
    const path = props.childProps.location.pathname;

    return (
        <Switch>
            <InsightsRoute exact path={paths.overview_map} component={DashboardMap} rootClass='map' />
            <InsightsRoute exact path={paths.inventory_deployments} component={InventoryDeployments} rootClass='inventory' />

            {/* Finally, catch all unmatched routes */}
            <Route render={() => some(paths, p => p === path) ? null : (<Redirect to={paths.overview_map} />)} />
        </Switch>
    );
};