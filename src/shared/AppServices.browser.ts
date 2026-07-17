import axios, { type AxiosError, type AxiosInstance } from 'axios';
import type { AppServices, Environment, NotifyFn } from './AppServices.types';

let reloading = false;
const handle401Error = (error: AxiosError) => {
  if (error.response?.status === 401 && !reloading) {
    reloading = true;
    window.location.reload();
  }
  return Promise.reject(error);
};

export function createBrowserAxiosInstance(): AxiosInstance {
  const instance = axios.create();
  instance.interceptors.response.use(undefined, handle401Error);
  return instance;
}

export const browserApiClient = createBrowserAxiosInstance();

export type AddNotificationFn = (notification: {
  variant: string;
  title: string;
  description?: string;
  dismissable?: boolean;
}) => void;

export function createBrowserNotify(
  addNotification: AddNotificationFn,
): NotifyFn {
  return (variant, title, description) => {
    addNotification({ variant, title, description, dismissable: true });
  };
}

export interface BrowserServicesConfig {
  addNotification: AddNotificationFn;
  getToken: () => Promise<string>;
  environment: Environment;
}

export function createBrowserServices(
  config: BrowserServicesConfig,
): AppServices {
  return {
    axios: browserApiClient,
    notify: createBrowserNotify(config.addNotification),
    getToken: config.getToken,
    environment: config.environment,
  };
}
