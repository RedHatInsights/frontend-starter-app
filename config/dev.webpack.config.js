const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const commonPlugins = require('./plugins');

if (!process.env.BETA) {
  console.warn(
    '\u001b[31mUntil 2021-07-29 ci-stable is broken. Try `npm run start:beta` instead.\n\u001b[0m'
  );
}

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
