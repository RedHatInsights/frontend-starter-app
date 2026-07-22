import Axios from 'axios';
import type {
  AppServices,
  CVE,
  Environment,
  Notification,
} from './AppServices.types';

const CVE_API_URL =
  'https://access.redhat.com/hydra/rest/securitydata/cve.json';

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

  const axiosInstance = Axios.create();
  axiosInstance.interceptors.request.use(async (config) => {
    const token = await chrome.auth.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const notify: AppServices['notify'] = (variant, title, description) => {
    addNotification({ variant, title, description });
  };

  return {
    appAction: chrome.appAction,
    addNotification,
    getToken: async () => (await chrome.auth.getToken()) ?? '',
    environment,
    axios: axiosInstance,
    notify,
    fetchCVEs: async (params = {}) => {
      const url = new URL(CVE_API_URL);
      url.searchParams.set('per_page', String(params.per_page ?? 10));
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`CVE API error: ${response.status}`);
      }
      return response.json() as Promise<CVE[]>;
    },
  };
}
