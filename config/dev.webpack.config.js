/* global require, module */

const _ = require('lodash');
const webpackConfig = require('./base.webpack.config');
const config = require('./webpack.common.js');
const history = require('connect-history-api-fallback');
const convert = require('koa-connect');

webpackConfig.serve = {
    content: config.paths.public,
    port: 8002,
    dev: {
        publicPath: '/insights'
    },
    // https://github.com/webpack-contrib/webpack-serve/blob/master/docs/addons/history-fallback.config.js
    add: app => app.use(convert(history({})))
};

module.exports = _.merge({},
    webpackConfig,
    require('./dev.webpack.plugins.js')
);
