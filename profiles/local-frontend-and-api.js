/*global module*/

const SECTION = 'insights';
const APP_ID = 'starter';
const FRONTEND_PORT = 8002;
const API_PORT = 8888;
const routes = {};

// Hack so that Mac OSX docker can sub in host.docker.internal instead of localhost
// see https://docs.docker.com/docker-for-mac/networking/#i-want-to-connect-from-a-container-to-a-service-on-the-host
const localhost = (process.env.PLATFORM === 'linux') ? 'localhost' : 'host.docker.internal';

routes[`/beta/${SECTION}/${APP_ID}`] = { host: `http://${localhost}:${FRONTEND_PORT}` };
routes[`/${SECTION}/${APP_ID}`]      = { host: `http://${localhost}:${FRONTEND_PORT}` };
routes[`/beta/apps/${APP_ID}`]       = { host: `http://${localhost}:${FRONTEND_PORT}` };
routes[`/apps/${APP_ID}`]            = { host: `http://${localhost}:${FRONTEND_PORT}` };

routes[`/api/${APP_ID}`] = { host: `http://${localhost}:${API_PORT}` };

module.exports = { routes };
