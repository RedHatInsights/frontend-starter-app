/* global require, module */

const _ = require('lodash');
const webpackConfig = require('./base.webpack.config');
const config = require('./webpack.common.js');

webpackConfig.devServer = {
    contentBase: config.paths.public,
    hot: true,
    https: false,
    port: 8002,
    disableHostCheck: true,
    historyApiFallback: true
};

module.exports = _.merge({},
    webpackConfig,
    require('./dev.webpack.plugins.js')
);
