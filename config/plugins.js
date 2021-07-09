const { resolve } = require('path');
const fedModulePlugin = require('@redhat-cloud-services/frontend-components-config/federated-modules');

module.exports = [fedModulePlugin({ root: resolve(__dirname, '../') })];
