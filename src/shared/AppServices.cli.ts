/**
 * CLI AppServices factory — stub for non-browser environments.
 *
 * This file demonstrates why the ServiceContext DI pattern exists:
 * the same data hooks (useRolesQuery, useCreateRoleMutation, etc.)
 * can run in both the browser and a CLI tool — they only depend on
 * the AppServices interface, not on Chrome or DOM APIs.
 *
 * To build a CLI that reuses your app's data layer:
 *
 * 1. Install axios and any auth library you need (e.g., node-fetch, oidc-client)
 *
 * 2. Implement createCliServices():
 *
 *    import axios from 'axios';
 *    import type { AppServices } from './AppServices.types';
 *
 *    export function createCliServices(token: string): AppServices {
 *      return {
 *        axios: axios.create({
 *          headers: { Authorization: `Bearer ${token}` },
 *        }),
 *        notify: (variant, title, description) => {
 *          // Use chalk or console output instead of toast notifications
 *          console.log(`[${variant}] ${title}${description ? `: ${description}` : ''}`);
 *        },
 *        getToken: async () => token,
 *        environment: 'stage',
 *      };
 *    }
 *
 * 3. Wrap your CLI entry point with ServiceProvider:
 *
 *    const services = createCliServices(myToken);
 *    <ServiceProvider value={services}>
 *      <YourCliApp />
 *    </ServiceProvider>
 *
 * See insights-rbac-ui for a full working CLI implementation using this pattern.
 */
