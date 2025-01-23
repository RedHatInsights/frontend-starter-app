# Frontend operator

This documentation does not include technical details about the operator itself. If you are interested in the operator, rather than the integration of HCC UI modules with it, please follow [this link](https://github.com/RedHatInsights/frontend-operator).

## Migration guide
If your UI modules do not leverage the FEO integration features, please follow the [migration guide](https://github.com/RedHatInsights/chrome-service-backend/blob/main/docs/feo-migration-guide.md).

## Why?

Having the Chroming UI configuration defined in a centralized project is no longer viable solution. Though working and effective, centralized configuration is not efficient. In order to further scale the number of UI modules, the configuration of UI features has to be moved directly to the UI modules repositories.

Moving the UI module configuration directly to the source repositories, will enable individual teams to control and maintain relevant configuration, enabling self servicing the changes.

It will also offload significant work from the platform team and thus decreasing the deployment time of Chrome UI configuration changes.

The frontend operator provides the exact tooling necessary to decentralized the configuration and generate necessary data for the Chrome UI to operate in normal manner.

## Frontend resource

Each frontend module must have a k8s template that defines the Frontend resource. The Frontend resource is used by the operator to not only create deployments but also collect important data that are used to construct the HCC frontend and enhance the user experience.

The Frontend resource is by default located in the [`deploy/frontend.yaml` file](../../deploy/frontend.yaml).

## Documentation topics
- [Deployment configuration](./basic-configuration.md)
- [UI module routing configuration](./modules.md)
- [Main navigation](./navigation.md)
- [Search](./search.md)
- [Services tiles](./services.md)
