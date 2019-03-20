import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { init } from './store';
import App from './App';
import logger from 'redux-logger';

const pathName = window.location.pathname.split('/');
pathName.shift();

let release = '/';
if (pathName[0] === 'beta') {
    release = `/beta/${pathName.shift()}`;
}

ReactDOM.render(
    <Provider store={ init(logger).getStore() }>
        <Router basename={ `${release}${pathName[0]}/${pathName[1]}` }>
            <App/>
        </Router>
    </Provider>,

    document.getElementById('root')
);
