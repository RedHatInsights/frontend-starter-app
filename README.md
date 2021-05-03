[![Build Status](https://travis-ci.org/RedHatInsights/frontend-starter-app.svg?branch=master)](https://travis-ci.org/RedHatInsights/frontend-starter-app)

# frontend-starter-app

React.js starter app for Red Hat Insights products that includes Patternfly 4 and shared Red Hat cloud service frontend components.

## Getting started

1. ```npm install```

2. ```npm run start:proxy``` / ```npm run start:beta:proxy```

Update `config/dev.webpack.config.js` according to your application URL. [Read more](https://github.com/RedHatInsights/frontend-components/tree/master/packages/config#useproxy).

## Run with insights-proxy

You'll need to clone:

- [Insights Proxy](https://github.com/RedHatInsights/insights-proxy)
- Frontend Starter App (this repo)

1. Run [insights-proxy](https://github.com/RedHatInsights/insights-proxy) (requires [Docker](https://www.docker.com/) and modifying /etc/hosts). It's recommended to set a PROXY_PATH environment variable in your .bashrc to avoid having to write the full path to where you clone the repo.

```shell
SPANDX_CONFIG="./profiles/local-frontend.js" bash $PROXY_PATH/scripts/run.sh
```

2. ```npm install```

3. ```npm run start```

4. Open one of the following environments behind the Red Hat VPN and accept the certs:
  - https://ci.foo.redhat.com:1337/beta/staging/starter
  - https://qa.foo.redhat.com:1337/beta/staging/starter
  - https://stage.foo.redhat.com:1337/beta/staging/starter
  - https://prod.foo.redhat.com:1337/beta/staging/starter

Should you need more help, there is a [comprehensive quick start guide in the Storybook Documentation.](https://github.com/RedHatInsights/insights-frontend-storybook/blob/master/src/docs/welcome/quickStart/DOC.md)

### Testing

`npm run verify` will run `npm run lint` (eslint) and `npm test` (Jest)

## Deploying

- The starter repo uses Travis to deploy the webpack build to another Github repo defined in `.travis.yml`
  - That Github repo has the following branches:
    - `ci-beta` (deployed by pushing to `master` or `main` on this repo)
    - `ci-stable` (deployed by pushing to `ci-stable` on this repo)
    - `qa-beta` (deployed by pushing to `qa-beta` on this repo)
    - `qa-stable` (deployed by pushing to `qa-stable` on this repo)
    - `prod-beta` (deployed by pushing to `prod-beta` on this repo)
    - `prod-stable` (deployed by pushing to `prod-stable` on this repo)
- Travis uploads results to RedHatInight's [codecov](https://codecov.io) account. To change the account, modify CODECOV_TOKEN on https://travis-ci.com/.

