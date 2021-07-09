const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const commonPlugins = require('./plugins');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  ...(process.env.BETA && { deployment: 'beta/apps' }),
});
plugins.push(...commonPlugins);

module.exports = (env) => {
  if (env && env.analyze === 'true') {
    plugins.push(new BundleAnalyzerPlugin());
  }
  return {
    ...webpackConfig,
    plugins,
  };
};
