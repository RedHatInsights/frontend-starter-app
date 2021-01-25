import React from 'react';
import ReactDOM from 'react-dom';
import AppEntry from './AppEntry';
import logger from 'redux-logger';

const root = document.getElementById('root');

ReactDOM.render(<AppEntry logger={logger} />, root, () =>
  root.setAttribute('data-ouia-safe', true)
);
