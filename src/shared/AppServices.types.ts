import type { AxiosInstance } from 'axios';

export type NotificationVariant = 'success' | 'danger' | 'warning' | 'info';

export type NotifyFn = (
  variant: NotificationVariant,
  title: string,
  description?: string,
) => void;

export type Environment = 'production' | 'stage' | 'qa';

export interface AppServices {
  axios: AxiosInstance;
  notify: NotifyFn;
  getToken: () => Promise<string>;
  environment: Environment;
}
