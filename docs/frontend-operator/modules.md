# UI module configuration

This configuration is used to initialize the Chrome UI remote module registry and routing structure. If a UI module does not have this configuration, it will never be rendered via Chrome UI as it will not know of its existence.

The configuration is located under the **`objects[0].spec.module`** property in the `frontend.yaml` file.

## **`objects[0].spec.module`**

Configures the module registry and HCC browser routing.

### **`manifest-location`**

Location of the main module federation metadata file. This is used to initialize the Scalprum module registry.

### **`modules`**
*array*
*(optional)*

Module routing configuration. Each Frontend can expose multiple modules on multiple routes. Frontends don't request to have exposed routes. Their modules can be used directly in other Frontends.

### **`modules[].id`**
*string*

Unique identifier of the exposed UI module.

### **`modules[].module`**
*string*

The name of the federated module to be used on routes. By default, the name is `./RootApp`. Any exposed module defined in `fec.config.js` can be used as a route.

### **`modules[].routes`**
*array*

An array of routes to which the federated modules should be injected. A route has multiple attributes to help configure each route.

### **`modules[].routes[].pathname`**
*string*

The frontend pathname on which the defined module should be rendered.

### **`modules[].routes[].exact`**
*bool*
*(optional)*

Mark the pathname as exact. The Chrome router will not match any nested routes of this module.

```yaml
objects:
  - spec:
      module:
        modules:
          routes:
            - pathname: /foo/bar
              exact: true

# Chrome UI will only match /foo/bar pathname
# Chrome UI will not match /foo/bar/* -> /foo/bar/baz
```

### **`modules[].routes[].props`**
*object*
*(optional)*

Props to be injected to the React component. Useful when single module is re-used in multiple routes but requires additional context to properly initialize the route.

### **`modules[].routes[].supportCaseData`**
*object*
*(optional)*

Adds additional context to support case payload based on active route, when user creates a support case.

This is a local route configuration for support case context. If a UI module has global support context defined, it will be ignored, and local context is used.

### **`modules[].routes[].supportCaseData.version`**
*string*

Current version of the module.

### **`modules[].routes[].supportCaseData.product`**
*string*

A human readable product label.

### **`modules[].routes[].permissions`**
*array*
*(optional)*

A list of permission checks. If any check fails, the route will not render. The permissions function are listed in [Chrome UI docs](https://github.com/RedHatInsights/insights-chrome/blob/master/docs/navigation.md#permissions)

Each permission needs a permission method identifier and arguments if there are any.

```yaml
objects:
  - spec:
      module:
        modules:
          routes:
            - pathname: /foo/bar
              permissions:
                - method: hasPermissions
                  args: [["sources:foo:bar"]]
```

### **`config`**
*object*
*deprecated*
*(optional)*

Use the [`moduleConfig instead`](#moduleconfig)

### **`moduleConfig`**
*object*
*(optional)*

Additional global configuration for the entire UI module 

### **`moduleConfig.supportCaseData`**
*object*
*(optional)*

See [`modules[].routes[].supportCaseData`](#modulesroutessupportcasedata)

This is a global configuration for support case context. If a route has support defined, it will override the global support config.

### **`moduleConfig.ssoScopes`**
*array*
*(optional)*

Define additional KC scopes required for the UI module. Chrome will re-authenticate current user, if defined scopes were not yet used during the user session.

```yaml
objects:
  - spec:
      module:
        moduleConfig:
          ssoScopes:
            - scopeA
            - scopeB
```

**`defaultDocumentTitle`**
*string*
*(optional)*

A default browser title used when module is loaded. Can be further changed via browser API.

**`analytics`**
*object*
*(optional)*

COnfiguration to provide additional context to the Chrome UI analytics tooling

**`analytics.APIKey`**

*string*

APIKey used by segment.io to forward user metrics to one or multiple targets. If none, is provided, default settings are used.


