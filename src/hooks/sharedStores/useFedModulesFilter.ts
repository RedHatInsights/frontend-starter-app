import { useSubscribeStore } from '@scalprum/react-core';
import { useCallback } from 'react';
import { type FedModulesState, getStore } from './useFedModulesStore';

/**
 * Isolated hook for managing only filter state.
 * This hook subscribes only to SET_FILTER events, making it perfect for
 * filter input components that don't need to know about the data itself.
 *
 * Components using this hook will only re-render when filter state changes,
 * not when data is fetched or sorted.
 */
export const useFedModulesFilter = () => {
  const store = getStore();

  // Subscribe only to SET_FILTER events
  const filterConfig = useSubscribeStore(
    store,
    'SET_FILTER',
    (state: FedModulesState) => state.filterConfig,
  );

  // Filter methods - these will trigger SET_FILTER events
  const setSearchTerm = useCallback(
    (searchTerm: string) => {
      store.updateState('SET_FILTER', {
        filterConfig: { searchTerm },
      });
    },
    [store],
  );

  const setSsoScopeFilter = useCallback(
    (ssoScopeFilter: string[]) => {
      store.updateState('SET_FILTER', {
        filterConfig: { ssoScopeFilter },
      });
    },
    [store],
  );

  const setModuleFilter = useCallback(
    (moduleFilter: string) => {
      store.updateState('SET_FILTER', {
        filterConfig: { moduleFilter },
      });
    },
    [store],
  );

  const setFilters = useCallback(
    (newFilterConfig: Partial<FedModulesState['filterConfig']>) => {
      store.updateState('SET_FILTER', { filterConfig: newFilterConfig });
    },
    [store],
  );

  const clearFilters = useCallback(() => {
    store.updateState('CLEAR_FILTERS');
  }, [store]);

  return {
    // Filter state - only the filter config, not the data
    filterConfig,

    // Filter actions
    setSearchTerm,
    setSsoScopeFilter,
    setModuleFilter,
    setFilters,
    clearFilters,
  };
};

export default useFedModulesFilter;
