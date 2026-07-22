export interface Notification {
  variant: 'success' | 'danger' | 'warning' | 'info' | 'custom';
  title: React.ReactNode;
  description?: React.ReactNode;
}

export type Environment = 'production' | 'stage' | 'qa';

export interface AppServices {
  appAction: (action: string) => void;
  addNotification: (notification: Notification) => void;
  getToken: () => Promise<string>;
  environment: Environment;
}
