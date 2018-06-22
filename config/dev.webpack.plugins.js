/* global require, module */
/* eslint-disable space-unary-ops */

const { plugins } = require('./base.webpack.plugins');

/**
 * Generates html that shows an analysis of code bundles.
 *
 * @type {var}
 */
plugins.push(new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)({
    openAnalyzer: false
}));

module.exports = { plugins };
