/*global module*/

const SECTION = 'insights';
const APP_ID = 'starter';
const API_PORT = 8888;
const routes = {};

routes[`/beta/${SECTION}/${APP_ID}`] = { host: 'http://localhost:8002' };
routes[`/${SECTION}/${APP_ID}`] = { host: 'http://localhost:8002' };
routes[`/beta/apps/${APP_ID}`] = { host: 'http://localhost:8002' };
routes[`/apps/${APP_ID}`] = { host: 'http://localhost:8002' };

routes[`/api/${APP_ID}`] = { host: `http://localhost:${API_PORT}` };

module.exports = { routes };
