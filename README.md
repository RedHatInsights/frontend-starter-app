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

### Scalprum Remote Hooks and Shared Stores

This project demonstrates cross-micro-frontend state management using Scalprum's remote hooks and shared stores pattern. This enables event-driven state synchronization across independently deployed applications with optimal rendering performance.

See the complete implementation in `/src/Routes/SharedStoresDemo/` and read the documentation:
- [Full Guide](./docs/scalprum-remote-hooks-shared-stores.md) - Comprehensive documentation
- [Quick Reference](./docs/scalprum-quick-reference.md) - Code snippets and cheat sheet

### Federated HelloWorld preview

`./HelloWorld` is a default-exported React component. Its required `runId` string
is appended after its optional `text` string, which defaults to `Hello World`.
Both strings must be nonempty when supplied. The same module exposes a named
`getContract` function describing its inputs and read-only output as JSON.
The generated `fed-mods.json` names the container
`frontendStarterApp`; Chrome must also have that scope registered in its
fed-modules configuration.

To verify with [Astro PR #426](https://github.com/RedHatInsights/astro-virtual-assistant-frontend/pull/426):

1. On a machine with the usual Console hosts setup, container runtime, stage
   access and a Red Hat login, check out this starter app change. Run
   `npm install` and `npm run static -- --port=8005`; leave it running until
   the build completes. This serves the generated manifest and chunks at
   `http://localhost:8005/apps/frontend-starter-app/`.
2. Check out Astro PR #426 in a separate checkout. Temporarily add the following
   route inside `getRoutes()` in Astro's `fec.config.js` (keep any existing
   routes). This routes both the manifest and its chunks to the local build:

   ```js
   routes['/apps/frontend-starter-app'] = { host: 'http://127.0.0.1:8005' };
   ```

   Install Astro's dependencies and run `npm run start -- --clouddotEnv=stage`.
   Revert this local-only config change after testing.
3. Open `https://stage.foo.redhat.com:1337/staging/starter?masComponentPreview=1`,
   authenticate, and open the enabled chat. In browser DevTools, disable cache
   and reload before loading the starter module. Confirm the network response for
   `/apps/frontend-starter-app/fed-mods.json` is the local manifest, with
   `name: "frontendStarterApp"` and `baseURL: "/apps/frontend-starter-app/"`.
   Check that Chrome's `/api/chrome-service/v1/static/fed-modules-generated.json`
   contains the `frontendStarterApp` key with that manifest location. If it does
   not, use an environment where Chrome registers that scope; the manifest's
   container name alone does not register it.
4. With the chat open, dispatch this in the browser console:

   ```js
   window.dispatchEvent(new CustomEvent('mas-component-preview', {
     detail: {
       scope: 'frontendStarterApp',
       module: './HelloWorld',
       props: JSON.stringify({ text: 'Hello from the starter app', runId: 'preview-123' }),
     },
   }));
   ```

   `importName` is deliberately omitted to select the default export. Confirm a
   chat reply displays `Hello from the starter app preview-123`, and check the network and
   console for loading errors. Stop both local servers when finished.

### Testing

`npm run verify` will run `npm run lint` (eslint) and `npm test` (Jest)

#### Cypress Component Testing

This project includes component tests using Cypress for testing React components in isolation:

- `npm run test:cypress` - Run all component tests headlessly
- `npm run test:cypress:open` - Open Cypress UI for interactive component testing
- `npm run test:cypress:component` - Run component tests (same as test:cypress)

Component tests are fast, reliable, and don't require a running server. They're perfect for testing individual UI components with different props and states.
