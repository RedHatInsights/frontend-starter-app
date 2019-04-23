/*global module*/

const SECTION = 'insights';
const APP_ID = require('../package.json').insights.appname;
const FRONTEND_PORT = 8002;
const routes = {};

routes[`/beta/${SECTION}/${APP_ID}`] = { host: `http://localhost:${FRONTEND_PORT}` };
routes[`/${SECTION}/${APP_ID}`]      = { host: `http://localhost:${FRONTEND_PORT}` };
routes[`/beta/apps/${APP_ID}`]       = { host: `http://localhost:${FRONTEND_PORT}` };
routes[`/apps/${APP_ID}`]            = { host: `http://localhost:${FRONTEND_PORT}` };

module.exports = { routes };
