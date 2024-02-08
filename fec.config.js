module.exports = {
  appUrl: '/${{ values.bundle }}/${{ values.app_name }}',
  debug: true,
  useProxy: true,
  proxyVerbose: true,
  /**
   * Change accordingly to your app_name in package.json.
   * The `sassPrefix` attribute is only required if your `app_name` includes the dash `-` characters.
   * If the dash character is present, you will have add a camelCase version of it to the sassPrefix.
   * If it does not contain the dash character, remove this configuration.
   */
  {%- if (values.camel_case) %}
  sassPrefix: '.${{ values.app_name }}, .${{ values.camel_case }}',
  {%- else  %}
  sassPrefix: '.${{ values.app_name }}',
  {%- endif %}
  /**
   * Change to false after your app is registered in configuration files
   */
  interceptChromeConfig: false,
  /**
   * Add additional webpack plugins
   */
  plugins: [],
  _unstableHotReload: process.env.HOT === 'true',
  moduleFederation: {
    exclude: ['react-router-dom'],
    shared: [
      {
        'react-router-dom': {
          singleton: true,
          import: false,
          version: '^6.3.0',
        },
      },
    ],
  },
};
