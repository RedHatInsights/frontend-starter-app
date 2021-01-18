const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const { config: webpackConfig, plugins } = config({
    rootFolder: resolve(__dirname, '../'),
    debug: true,
    https: true
});

plugins.push(
    require('@redhat-cloud-services/frontend-components-config/federated-modules')(
      {
        root: resolve(__dirname, '../'),
      }
    )
  );  

module.exports = {
    ...webpackConfig,
    plugins
};
