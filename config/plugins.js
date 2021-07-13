const webpack = require('webpack');
const { resolve } = require('path');
const fedModulePlugin = require('@redhat-cloud-services/frontend-components-config/federated-modules');

const plugins = [fedModulePlugin({ root: resolve(__dirname, '../') })];

// Save 20kb of bundle size in prod
if (process.env.NODE_ENV === 'production') {
  plugins.push(
    new webpack.NormalModuleReplacementPlugin(
      /redux-logger/,
      resolve(__dirname, './empty.js')
    )
  );
}

module.exports = plugins;
