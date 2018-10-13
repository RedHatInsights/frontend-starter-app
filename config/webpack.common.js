/* global require, module, __dirname */

const path = require('path');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const gitRevisionPlugin = new GitRevisionPlugin({
    branch: true
});
const entry = process.env.NODE_ENV === 'production' ?
    path.resolve(__dirname, '../src/entry.js') :
    path.resolve(__dirname, '../src/entry-dev.js');

let insightsDeployment = 'insights';
const gitBranch = process.env.BRANCH || gitRevisionPlugin.branch();
const betaBranch =
    gitBranch === 'master' ||
    gitBranch === 'qa-beta' ||
    gitBranch === 'prod-beta';
if (process.env.NODE_ENV === 'production' && betaBranch) {
    insightsDeployment = 'insightsbeta';
}

const publicPath = `/${insightsDeployment}/platform/advisor/`;

module.exports = {
    paths: {
        entry,
        public: path.resolve(__dirname, '../dist'),
        src: path.resolve(__dirname, '../src'),
        presentationalComponents: path.resolve(__dirname, '../src/PresentationalComponents'),
        smartComponents: path.resolve(__dirname, '../src/SmartComponents'),
        pages: path.resolve(__dirname, '../src/pages'),
        static: path.resolve(__dirname, '../static'),
        publicPath
    },
    insightsDeployment
};
