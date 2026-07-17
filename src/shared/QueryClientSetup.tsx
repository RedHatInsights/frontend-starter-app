import React, { type ReactNode, useState } from 'react';
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import type { AxiosError } from 'axios';

const TEST_QUERY_OPTIONS = {
  queries: { retry: false, staleTime: 0, gcTime: 0 },
  mutations: { retry: false },
} as const;

function shouldRetry(failureCount: number, error: unknown): boolean {
  if (failureCount >= 1) return false;
  if (error && typeof error === 'object' && 'response' in error) {
    const status = (error as AxiosError).response?.status;
    if (status === 401 || status === 403 || status === 404) return false;
  }
  return true;
}

const PRODUCTION_QUERY_OPTIONS = {
  queries: {
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: shouldRetry,
  },
  mutations: { retry: false },
} as const;

interface QueryClientSetupProps {
  children: ReactNode;
  testMode?: boolean;
}

export const QueryClientSetup: React.FC<QueryClientSetupProps> = ({
  children,
  testMode = false,
}) => {
  const [queryClient] = useState(() => {
    const options = testMode ? TEST_QUERY_OPTIONS : PRODUCTION_QUERY_OPTIONS;
    return new QueryClient({
      queryCache: new QueryCache(),
      mutationCache: new MutationCache(),
      defaultOptions: options,
    });
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
