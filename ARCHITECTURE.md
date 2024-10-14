# Architecture

This repo's source code builds a static React app to be served on https://cloud.redhat.com.

The React app bundled using [Webpack](https://webpack.js.org) includes:
  - [@patternfly/react-core](https://github.com/patternfly/patternfly-react) as the component library
  - A [react-router-dom BrowserRouter](https://reacttraining.com/react-router/web/api/BrowserRouter) for routing pages
    - Uses the HTML5 history API (pushState, replaceState and the popstate event) to keep UI in sync with the URL
    - @redhat-cloud-services/frontend-components-notifications/redux is provided for chromed notifications
  - [React.lazy and React.Suspense](https://reactjs.org/docs/code-splitting.html#reactlazy) for asynchronously loading components

These assets are loaded via [Insights chrome](https://github.com/RedHatInsights/insights-chrome) which provides user auth, top and side nav (aka chroming), and a `<main id="root">` to inject into.

## Webpack

This repo uses a [shared common config](https://www.npmjs.com/package/@redhat-cloud-services/frontend-components-config) with sensible defaults to build and run your application.

This repo uses [federated modules](https://webpack.js.org/concepts/module-federation/) to seamlessly load multiple applications at runtime.

