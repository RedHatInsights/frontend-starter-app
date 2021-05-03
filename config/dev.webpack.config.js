const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  debug: true,
  https: true,
  useFileHash: false,
  deployment: process.env.BETA ? 'beta/apps' : 'apps',
  ...(process.env.PROXY && {
    useProxy: true,
    appUrl: process.env.BETA ? '/beta/staging/starter' : '/staging/starter',
  }),
});

plugins.push(
  require('@redhat-cloud-services/frontend-components-config/federated-modules')(
    {
      root: resolve(__dirname, '../'),
      useFileHash: false,
      exposes: {
        './RootApp': resolve(__dirname, '../src/DevEntry'),
      },
    }
  )
);

module.exports = {
  ...webpackConfig,
  plugins,
};
