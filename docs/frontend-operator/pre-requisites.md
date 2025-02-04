# Pre-requisites

In order to use all frontend operator features, your projects must:
- Use containerized builds and deployments for all environments.
- Have the up-to-date version of the build and development configurations:
  - `@redhat-cloud-services/frontend-components-config@6.4.4` if you are using the FEC binary for your build and development, or if you are creating your webpack config using the presets from the package.
  - `@redhat-cloud-services/frontend-components-config-utilities@4.1.3` if you are using the webpack development proxy directly and not via the config package.
- To ensure ephemeral deployments are ready foe the new features, please upgrade your bonfire version to `6.0.3`.
