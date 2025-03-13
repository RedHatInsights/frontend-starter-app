# frontend-starter-app

React.js starter app for Red Hat Hybrid cloud console UI modules that includes Patternfly and shared Red Hat cloud service frontend components.

## Initial etc/hosts setup

In order to access the https://[env].foo.redhat.com in your browser, you have to add entries to your `/etc/hosts` file. This is a **one-time** setup that has to be done only once (unless you modify hosts) on each devel machine.

Best way is to edit manually `/etc/hosts` on your localhost line:

```
127.0.0.1 <your-fqdn> localhost prod.foo.redhat.com stage.foo.redhat.com
```

Alternatively you can do this by running following command:
```bash
npm run patch:hosts
```

If this command throws an error run it as a `sudo`:
```bash
sudo npm run patch:hosts
```

## Getting started

1. ```npm install```

2. ```npm run start```
   1. If you are running the [chrome-service-backend](https://github.com/RedHatInsights/chrome-service-backend) locally, set the environment variable `CHROME_SERVICE` to the port that it is listening on (by default `8000`). For example, `CHROME_SERVICE=8000 npm run start`.

3. Open browser in URL listed in the terminal output

Update `appUrl` string inside `fec.config.js` according to your application URL. [Read more](http://front-end-docs-insights.apps.ocp4.prod.psi.redhat.com/ui-onboarding/fec-binary#TODO:documentalloptions).

### Frontend operator

HCC uses OpenShift frontend operator to collect metadata about individual UI modules and creates environment based UI configuration that is used by the Chrome UI shell application to construct the frontend.

To learn about the operator and its configuration follow [this link](./docs/frontend-operator/index.md)


### Testing

`npm run verify` will run `npm run lint` (eslint) and `npm test` (Jest)

