import { Redirect, Route, Switch, useLocation } from 'react-router-dom';

import PropTypes from 'prop-types';
import React, { Suspense, lazy } from 'react';
import some from 'lodash/some';
import { routes as paths } from '../package.json';
import { Bullseye, Spinner } from '@patternfly/react-core';

const SamplePage = lazy(() => import(/* webpackChunkName: "SamplePage" */ './Routes/SamplePage/SamplePage'));
const OopsPage = lazy(() => import(/* webpackChunkName: "OopsPage" */ './Routes/OopsPage/OopsPage'));
const NoPermissionsPage = lazy(() => import(/* webpackChunkName: "NoPermissionsPage" */ './Routes/NoPermissionsPage/NoPermissionsPage'));

const InsightsRoute = ({ component: Component, rootClass, ...rest }) => {
    const root = document.getElementById('root');
    root.removeAttribute('class');
    root.classList.add(`page__${rootClass}`, 'pf-c-page__main');
    root.setAttribute('role', 'main');

    return (<Route {...rest} component={Component} />);
};

InsightsRoute.propTypes = {
    component: PropTypes.func,
    rootClass: PropTypes.string
};

/**
 * the Switch component changes routes depending on the path.
 *
 * Route properties:
 *      exact - path must match exactly,
 *      path - https://prod.foo.redhat.com:1337/insights/advisor/rules
 *      component - component to be rendered when a route has been chosen.
 */
export const Routes = () => {
    const path = useLocation().pathname;

    return (
        <Suspense fallback={<Bullseye>
            <Spinner />
        </Bullseye>}>
            <Switch>
                <InsightsRoute path={paths.samplePage} component={SamplePage} rootClass='samplePage' />
                <InsightsRoute path={paths.oops} component={OopsPage} rootClass='oopsPage' />
                <InsightsRoute path={paths.noPermissions} component={NoPermissionsPage} rootClass='noPermissionsPage' />
                { /* Finally, catch all unmatched routes */}
                <Route render={() => some(paths, p => p === path) ? null : (<Redirect to={paths.samplePage} />)} />
            </Switch>
        </Suspense>
    );
};

Routes.propTypes = {
    childProps: PropTypes.shape({
        history: PropTypes.shape({
            push: PropTypes.func
        })
    })
};
