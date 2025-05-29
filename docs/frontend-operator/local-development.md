# Local development

When using the FEC binary or the webpack development proxy directly (see specified versions in [Pre requisites](./pre-requisites.md)), the configuration that appears in [`deploy/frontend.yaml` file](../../deploy/frontend.yaml) will automatically be intercepted and substituted when running the development server locally. This automatic interception includes modules, search results, service tiles, and navigation.

`[fec] Info:  Watching frontend CRC file for changes` when running the FEC utility indicates the file is being watched and the necessary version of FEC is in use.

`[fec] Info:  Frontend CRD has changed, reloading the file` when changes are made and saved to the [`deploy/frontend.yaml` file](../../deploy/frontend.yaml) indicates the new values will be used (page refresh may be required).
