const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
});

plugins.push(
  require('@redhat-cloud-services/frontend-components-config/federated-modules')(
    {
      root: resolve(__dirname, '../'),
    }
  )
);

module.exports = function (env) {
  if (env && env.analyze === 'true') {
    plugins.push(new BundleAnalyzerPlugin());
  }
  return {
    ...webpackConfig,
    plugins,
  };
};
