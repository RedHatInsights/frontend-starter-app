import type {
  AppServices,
  Environment,
  Notification,
} from './AppServices.types';

export function createBrowserServices(
  chrome: {
    appAction: (action: string) => void;
    auth: { getToken: () => Promise<string | undefined> };
    isBeta: () => boolean;
    isProd: () => boolean;
  },
  addNotification: (notification: Notification) => void,
): AppServices {
  const environment: Environment = chrome.isProd() ? 'production' : 'stage';

  return {
    appAction: chrome.appAction,
    addNotification,
    getToken: async () => (await chrome.auth.getToken()) ?? '',
    environment,
  };
}
