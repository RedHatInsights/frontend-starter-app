import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import ReducerRegistry from './Utilities/ReducerRegistry';
import App from './App';

ReactDOM.render(
    <Provider store={ReducerRegistry.getStore()}>
        <Router basename='/insights/platform/advisor'>
            <App />
        </Router>
    </Provider>,
    document.getElementById('root')
);
