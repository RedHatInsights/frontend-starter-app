import Axios from 'axios';
import type { AppServices } from './AppServices.types';

export function createCliServices(): AppServices {
  return {
    appAction: (action) => console.log(`[cli] appAction: ${action}`),
    addNotification: (n) =>
      console.log(`[cli] notification: ${n.variant} - ${n.title}`),
    getToken: async () => 'cli-stub-token',
    environment: 'stage',
    axios: Axios.create(),
    notify: (variant, title, description) =>
      console.log(`[cli] ${variant}: ${title} ${description ?? ''}`),
    fetchCVEs: async () => {
      console.log('[cli] fetchCVEs called');
      return [];
    },
  };
}
