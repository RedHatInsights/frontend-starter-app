# Basic configuration

This configuration ensures the frontend module is properly deployed to the cluster. Only attributes that can be changed from the starter app template are described.

## Basic API

The following section describes the individual attributes available for customization. Attributes that have a set value are not described.

### **`metadata.name`**
*string*

A unique name for your frontend template. It has to be changed after creating a new module from the template. It is recommended not to change it during the project lifecycle even if the project is renamed.

### **`objects`**
*array*

Frontend resource specification. Even though defined as an array, only one item is allowed.

### **`objects[0].metadata.name`**
*string*

A unique name for your frontend resource. It can be the same as the `metadata.name` value.

### **`objects[0].spec.frontend.paths`**
*array*

Define a network pathname for the static assets. Multiple pathnames can be defined. In HCC, the pathname is always prefixed with `/app`.

```yaml
objects:
  - spec:
      frontend:
        paths:
          - /apps/ui-module
```

### **`objects[0].spec.feoConfigEnabled`**
*bool*
*(optional)*

Enables Chrome UI configuration generation for the Frontend resource. 

#### **`akamaiCacheBustPaths`**
*array*
*(optional)*

Additional configuration for CDN cache refresh. By default only the manifest files are refresh after deployment.

```yaml
objects:
  - spec:
      akamaiCacheBustPaths:
        - '/apps/foo/bar'
        - '/apps/foo/baz.css'
```
