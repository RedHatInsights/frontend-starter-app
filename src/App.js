import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Routes } from './Routes';
import './App.scss';

import { Provider } from 'react-redux';
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/files/Registry';
import { NotificationsPortal, notifications } from '@redhat-cloud-services/frontend-components-notifications/';

const registry = getRegistry();
registry.register({ notifications });

class App extends Component {

    componentDidMount () {
        insights.chrome.init();
        // TODO change this to your appname
        insights.chrome.identifyApp('insights');

        this.appNav = insights.chrome.on('APP_NAVIGATION', event => this.props.history.push(`/${event.navId}`));
    }

    componentWillUnmount () {
        this.appNav();
    }

    render () {
        return (
            <Provider store={ registry.getStore() }>
                <NotificationsPortal />
                <Routes childProps={ this.props } />
            </Provider>
        );
    }
}

App.propTypes = {
    history: PropTypes.object
};

/**
 * withRouter: https://reacttraining.com/react-router/web/api/withRouter
 * connect: https://github.com/reactjs/react-redux/blob/master/docs/api.md
 *          https://reactjs.org/docs/higher-order-components.html
 */
export default withRouter (connect()(App));
