const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const commonPlugins = require('./plugins');

const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  debug: true,
  deployment: process.env.BETA ? 'beta/apps' : 'apps',
  useProxy: true,
  useCloud: true, // Until console.redhat.com is working
  appUrl: process.env.BETA ? '/beta/staging/starter' : '/staging/starter',
  env: process.env.BETA ? 'ci-beta' : 'ci-stable',
  standalone: Boolean(process.env.STANDALONE),
});
plugins.push(...commonPlugins);

module.exports = {
  ...webpackConfig,
  plugins,
};
