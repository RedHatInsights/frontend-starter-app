import type { AxiosInstance } from 'axios';

export interface Notification {
  variant: 'success' | 'danger' | 'warning' | 'info' | 'custom';
  title: React.ReactNode;
  description?: React.ReactNode;
}

export type Environment = 'production' | 'stage' | 'qa';

export type NotificationVariant = 'success' | 'danger' | 'warning' | 'info';

export type NotifyFn = (
  variant: NotificationVariant,
  title: string,
  description?: string,
) => void;

export interface CVE {
  CVE: string;
  severity: string;
  public_date: string;
  bugzilla_description: string;
  cvss3_score: string | null;
  CWE: string;
  resource_url: string;
}

export interface AppServices {
  appAction: (action: string) => void;
  addNotification: (notification: Notification) => void;
  getToken: () => Promise<string>;
  environment: Environment;
  fetchCVEs: (params?: { per_page?: number }) => Promise<CVE[]>;
  axios: AxiosInstance;
  notify: NotifyFn;
}
