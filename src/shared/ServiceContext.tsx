import React, { type ReactNode, createContext, useContext } from 'react';
import type { AxiosInstance } from 'axios';
import type { AppServices, NotifyFn } from './AppServices.types';

export type {
  AppServices,
  NotifyFn,
  NotificationVariant,
} from './AppServices.types';

const ServiceContext = createContext<AppServices | null>(null);

export function ServiceProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: AppServices;
}): React.ReactElement {
  return (
    <ServiceContext.Provider value={value}>{children}</ServiceContext.Provider>
  );
}

export function useAppServices(): AppServices {
  const services = useContext(ServiceContext);
  if (!services) {
    throw new Error(
      'useAppServices must be used within a ServiceProvider. ' +
        'Ensure your app is wrapped with <ServiceProvider value={services}>.',
    );
  }
  return services;
}

export function useAxios(): AxiosInstance {
  return useAppServices().axios;
}

export function useNotify(): NotifyFn {
  return useAppServices().notify;
}
