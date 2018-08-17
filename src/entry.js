import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import promiseMiddleware from 'redux-promise-middleware';
import App from './App';

function todos(state = [], action) {
    switch (action.type) {
        case 'ADD_TODO':
            return state.concat([action.text]);
        default:
            return state;
    }
}

const store = createStore(todos, applyMiddleware(promiseMiddleware()));

ReactDOM.render(
    <Provider store={ReducerRegistry.getStore()}>
        <Router basename='/insights/platform/advisor'>
            <App />
        </Router>
    </Provider>,
    document.getElementById('root')
);
