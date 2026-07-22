import { createContext, useContext } from 'react';
import type { AppServices } from './AppServices.types';

const ServiceContext = createContext<AppServices | null>(null);

export const ServiceProvider = ServiceContext.Provider;

export function useAppServices(): AppServices {
  const ctx = useContext(ServiceContext);
  if (!ctx) {
    throw new Error('useAppServices must be used within a ServiceProvider');
  }
  return ctx;
}
