import type { AppServices } from './AppServices.types';

export function createCliServices(): AppServices {
  return {
    appAction: (action) => console.log(`[cli] appAction: ${action}`),
    addNotification: (n) =>
      console.log(`[cli] notification: ${n.variant} - ${n.title}`),
    getToken: async () => 'cli-stub-token',
    environment: 'stage',
  };
}
