import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { init } from './store';
import App from './App';

const pathName = window.location.pathname.split('/');
pathName.shift();

if (pathName[0] === 'beta') {
    pathName.shift();
}

ReactDOM.render(
    <Provider store={ init().getStore() }>
        <Router basename={ `${pathName[0]}/${pathName[1]}` }>
            <App />
        </Router>
    </Provider>,

    document.getElementById('root')
);
