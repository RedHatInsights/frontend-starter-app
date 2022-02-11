const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const commonPlugins = require('./plugins');

const env = () => {
  const type = process.env.USE_PROD ? 'prod' : 'stage';
  const stable = process.env.BETA ? 'beta' : 'stable';
  return `${type}-${stable}`;
};

const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  debug: true,
  deployment: process.env.BETA ? 'beta/apps' : 'apps',
  useProxy: true,
  appUrl: process.env.BETA ? '/beta/staging/starter' : '/staging/starter',
  env: env(),
  routesPath: process.env.ROUTES_PATH
});
plugins.push(...commonPlugins);

module.exports = {
  ...webpackConfig,
  plugins,
};
