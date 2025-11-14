import { createSharedStore } from '@scalprum/core';
import { useGetState } from '@scalprum/react-core';
import { useCallback, useMemo } from 'react';

// Types for the fed-modules data structure
export interface FedModuleRoute {
  pathname: string;
}

export interface FedModule {
  id: string;
  module: string;
  routes: FedModuleRoute[];
}

export interface FedModuleEntry {
  // Config is optional and can have different structures
  config?: {
    ssoScopes?: string[];
    supportCaseData?: {
      product: string;
      version: string;
    };
  };
  // Some entries use moduleConfig instead
  moduleConfig?: {
    ssoScopes?: string[];
    supportCaseData?: {
      product: string;
      version: string;
    };
  };
  manifestLocation: string;
  modules?: FedModule[];
  // Additional optional properties from real API
  cdnPath?: string;
  fullProfile?: boolean;
  analytics?: {
    APIKey?: string;
    APIKeyDev?: string;
  };
  defaultDocumentTitle?: string;
  isFedramp?: boolean;
}

export interface FedModulesData {
  [key: string]: FedModuleEntry;
}

// Sort key types
const sortKeys = [
  'id',
  'manifestLocation',
  'moduleCount',
  'ssoScopesCount',
] as const;

type SortKeys = typeof sortKeys;
type SortKey = SortKeys[number];

// Store state interface
export interface FedModulesState {
  data: FedModulesData | null;
  loading: boolean;
  error: string | null;
  filteredData: FedModulesData | null;
  sortConfig: {
    validKeys: SortKeys;
    key: SortKey | null;
    direction: 'asc' | 'desc';
  };
  filterConfig: {
    searchTerm: string;
    ssoScopeFilter: string[];
    moduleFilter: string;
  };
}

// Events for the store
const EVENTS = [
  'FETCH_START',
  'FETCH_SUCCESS',
  'FETCH_ERROR',
  'SET_FILTER',
  'SET_SORT',
  'CLEAR_FILTERS',
] as const;

type EventType = (typeof EVENTS)[number];

// Event payload types
export interface FetchSuccessPayload {
  data: FedModulesData;
}

export interface FetchErrorPayload {
  error: string;
}

export interface SetFilterPayload {
  filterConfig: Partial<FedModulesState['filterConfig']>;
}

export interface SetSortPayload {
  sortConfig: {
    key: SortKey;
    direction: 'asc' | 'desc';
  };
}

// Discriminated union for all event payloads
export type EventPayload =
  | { event: 'FETCH_START' }
  | { event: 'FETCH_SUCCESS'; payload: FetchSuccessPayload }
  | { event: 'FETCH_ERROR'; payload: FetchErrorPayload }
  | { event: 'SET_FILTER'; payload: SetFilterPayload }
  | { event: 'SET_SORT'; payload: SetSortPayload }
  | { event: 'CLEAR_FILTERS' };

/* eslint-disable @typescript-eslint/no-explicit-any */
// Type guards for payload validation
export const isFetchSuccessPayload = (
  event: EventType,
  payload: unknown,
): payload is FetchSuccessPayload => {
  if (
    event !== 'FETCH_SUCCESS' ||
    typeof payload !== 'object' ||
    payload === null ||
    !('data' in payload)
  ) {
    return false;
  }

  const { data } = payload as any;

  // Validate that data is an object with the expected structure
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  // Basic validation that data contains fed module entries
  // We'll do a lightweight check to ensure it has the right shape
  // Note: Not all entries have 'config' or 'modules', so we make them optional
  return Object.values(data).every(
    (entry: any) =>
      typeof entry === 'object' &&
      entry !== null &&
      'manifestLocation' in entry &&
      (!('modules' in entry) || Array.isArray(entry.modules)),
  );
};

export const isFetchErrorPayload = (
  event: EventType,
  payload: unknown,
): payload is FetchErrorPayload => {
  return (
    event === 'FETCH_ERROR' &&
    typeof payload === 'object' &&
    payload !== null &&
    'error' in payload &&
    typeof (payload as any).error === 'string'
  );
};

export const isSetFilterPayload = (
  event: EventType,
  payload: unknown,
): payload is SetFilterPayload => {
  if (
    event !== 'SET_FILTER' ||
    typeof payload !== 'object' ||
    payload === null ||
    !('filterConfig' in payload)
  ) {
    return false;
  }

  const { filterConfig } = payload as any;

  if (typeof filterConfig !== 'object' || filterConfig === null) {
    return false;
  }

  // Validate that filterConfig only contains valid properties
  const validFilterKeys = ['searchTerm', 'ssoScopeFilter', 'moduleFilter'];
  const providedKeys = Object.keys(filterConfig);

  return (
    providedKeys.every((key) => validFilterKeys.includes(key)) &&
    providedKeys.every((key) => {
      if (key === 'ssoScopeFilter') {
        return (
          Array.isArray(filterConfig[key]) &&
          filterConfig[key].every((item: any) => typeof item === 'string')
        );
      }
      return typeof filterConfig[key] === 'string';
    })
  );
};

export const isSetSortPayload = (
  event: EventType,
  payload: unknown,
): payload is SetSortPayload => {
  if (
    event !== 'SET_SORT' ||
    typeof payload !== 'object' ||
    payload === null ||
    !('sortConfig' in payload)
  ) {
    return false;
  }

  const { sortConfig } = payload as any;

  return (
    typeof sortConfig === 'object' &&
    sortConfig !== null &&
    'key' in sortConfig &&
    'direction' in sortConfig &&
    sortKeys.includes(sortConfig.key) &&
    ['asc', 'desc'].includes(sortConfig.direction)
  );
};

/* eslint-enable @typescript-eslint/no-explicit-any */

// Initial state
const initialState: FedModulesState = {
  data: null,
  loading: false,
  error: null,
  filteredData: null,
  sortConfig: {
    validKeys: sortKeys,
    key: null,
    direction: 'asc',
  },
  filterConfig: {
    searchTerm: '',
    ssoScopeFilter: [],
    moduleFilter: '',
  },
};

// Helper function to apply filters and sorting
const applyFiltersAndSort = (
  data: FedModulesData | null,
  filterConfig: FedModulesState['filterConfig'],
  sortConfig: FedModulesState['sortConfig'],
): FedModulesData | null => {
  if (!data) return null;

  let filtered = { ...data };

  // Apply filters
  if (
    filterConfig.searchTerm ||
    filterConfig.ssoScopeFilter.length > 0 ||
    filterConfig.moduleFilter
  ) {
    filtered = Object.keys(data).reduce((acc, key) => {
      const entry = data[key];
      let shouldInclude = true;

      // Search term filter (searches in key, module names, and routes)
      if (filterConfig.searchTerm) {
        const searchLower = filterConfig.searchTerm.toLowerCase();
        const keyMatch = key.toLowerCase().includes(searchLower);
        const moduleMatch = entry.modules
          ? entry.modules.some(
              (mod) =>
                mod.id.toLowerCase().includes(searchLower) ||
                mod.module.toLowerCase().includes(searchLower) ||
                mod.routes.some((route) =>
                  route.pathname.toLowerCase().includes(searchLower),
                ),
            )
          : false;
        shouldInclude = shouldInclude && (keyMatch || moduleMatch);
      }

      // SSO scope filter (array of selected scopes)
      if (filterConfig.ssoScopeFilter.length > 0) {
        // Get SSO scopes from either config or moduleConfig
        const ssoScopes =
          entry.config?.ssoScopes || entry.moduleConfig?.ssoScopes || [];

        // Check if any of the entry's scopes match any of the selected filter scopes
        const scopeMatch = ssoScopes.some((scope) =>
          filterConfig.ssoScopeFilter.includes(scope),
        );
        shouldInclude = shouldInclude && scopeMatch;
      }

      // Module filter
      if (filterConfig.moduleFilter) {
        const moduleMatch = entry.modules
          ? entry.modules.some(
              (mod) =>
                mod.id
                  .toLowerCase()
                  .includes(filterConfig.moduleFilter.toLowerCase()) ||
                mod.module
                  .toLowerCase()
                  .includes(filterConfig.moduleFilter.toLowerCase()),
            )
          : false;
        shouldInclude = shouldInclude && moduleMatch;
      }

      if (shouldInclude) {
        acc[key] = entry;
      }
      return acc;
    }, {} as FedModulesData);
  }

  // Apply sorting
  if (sortConfig.key) {
    const sortedEntries = Object.entries(filtered).sort(
      ([keyA, entryA], [keyB, entryB]) => {
        let valueA: string | number | undefined;
        let valueB: string | number | undefined;

        switch (sortConfig.key) {
          case 'id':
            valueA = keyA;
            valueB = keyB;
            break;
          case 'manifestLocation':
            valueA = entryA.manifestLocation;
            valueB = entryB.manifestLocation;
            break;
          case 'moduleCount':
            valueA = entryA.modules?.length || 0;
            valueB = entryB.modules?.length || 0;
            break;
          case 'ssoScopesCount':
            valueA = entryA.config?.ssoScopes?.length;
            valueB = entryB.config?.ssoScopes?.length;
            break;
          default:
            valueA = keyA;
            valueB = keyB;
        }

        if (typeof valueA === 'string' && typeof valueB === 'string') {
          valueA = valueA.toLowerCase();
          valueB = valueB.toLowerCase();
        }

        if (valueA === undefined) valueA = '';
        if (valueB === undefined) valueB = '';

        if (valueA < valueB) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      },
    );

    filtered = Object.fromEntries(sortedEntries);
  }

  return filtered;
};

// Event handler
const handleEvents = (
  prevState: FedModulesState,
  event: EventType,
  payload?: unknown,
): FedModulesState => {
  switch (event) {
    case 'FETCH_START':
      return {
        ...prevState,
        loading: true,
        error: null,
      };

    case 'FETCH_SUCCESS':
      if (!isFetchSuccessPayload(event, payload)) {
        console.error('Invalid payload for FETCH_SUCCESS event', payload);
        return prevState;
      }
      const newState = {
        ...prevState,
        loading: false,
        error: null,
        data: payload.data,
      };
      return {
        ...newState,
        filteredData: applyFiltersAndSort(
          payload.data,
          newState.filterConfig,
          newState.sortConfig,
        ),
      };

    case 'FETCH_ERROR':
      if (!isFetchErrorPayload(event, payload)) {
        console.error('Invalid payload for FETCH_ERROR event', payload);
        return prevState;
      }
      return {
        ...prevState,
        loading: false,
        error: payload.error,
      };

    case 'SET_FILTER':
      if (!isSetFilterPayload(event, payload)) {
        console.error('Invalid payload for SET_FILTER event', payload);
        return prevState;
      }
      const updatedFilterConfig = {
        ...prevState.filterConfig,
        ...payload.filterConfig,
      };
      return {
        ...prevState,
        filterConfig: updatedFilterConfig,
        filteredData: applyFiltersAndSort(
          prevState.data,
          updatedFilterConfig,
          prevState.sortConfig,
        ),
      };

    case 'SET_SORT':
      if (!isSetSortPayload(event, payload)) {
        console.error('Invalid payload for SET_SORT event', payload);
        return prevState;
      }
      const updatedSortConfig = { validKeys: sortKeys, ...payload.sortConfig };
      return {
        ...prevState,
        sortConfig: updatedSortConfig,
        filteredData: applyFiltersAndSort(
          prevState.data,
          prevState.filterConfig,
          updatedSortConfig,
        ),
      };

    case 'CLEAR_FILTERS':
      // No payload expected for CLEAR_FILTERS
      const clearedFilterConfig = {
        searchTerm: '',
        ssoScopeFilter: [],
        moduleFilter: '',
      };
      return {
        ...prevState,
        filterConfig: clearedFilterConfig,
        filteredData: applyFiltersAndSort(
          prevState.data,
          clearedFilterConfig,
          prevState.sortConfig,
        ),
      };

    default:
      return prevState;
  }
};

// Singleton store instance
let store: ReturnType<
  typeof createSharedStore<FedModulesState, typeof EVENTS>
> | null = null;

export const getStore = () => {
  if (!store) {
    store = createSharedStore({
      initialState,
      events: EVENTS,
      onEventChange: handleEvents,
    });
  }
  return store;
};

// Hook for using the fed modules store
export const useFedModulesStore = () => {
  const store = getStore();
  const state = useGetState(store);

  // Fetch fed modules data
  const fetchFedModules = useCallback(async () => {
    store.updateState('FETCH_START');
    try {
      const response = await fetch(
        '/api/chrome-service/v1/static/fed-modules-generated.json',
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { $schema, ...data } = await response.json();
      store.updateState('FETCH_SUCCESS', { data });
    } catch (error) {
      store.updateState('FETCH_ERROR', {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch fed modules',
      });
    }
  }, [store]);

  // Filter methods
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
    (filterConfig: Partial<FedModulesState['filterConfig']>) => {
      store.updateState('SET_FILTER', { filterConfig });
    },
    [store],
  );

  // Sort methods
  const setSortConfig = useCallback(
    (key: SortKey, direction: 'asc' | 'desc') => {
      store.updateState('SET_SORT', {
        sortConfig: { key, direction },
      });
    },
    [store],
  );

  const toggleSort = useCallback(
    (key: SortKey) => {
      const currentDirection =
        state.sortConfig.key === key ? state.sortConfig.direction : 'asc';
      const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
      store.updateState('SET_SORT', {
        sortConfig: { key, direction: newDirection },
      });
    },
    [store, state.sortConfig],
  );

  // Clear filters
  const clearFilters = useCallback(() => {
    store.updateState('CLEAR_FILTERS');
  }, [store]);

  // Get available SSO scopes for filter dropdown
  const availableSsoScopes = useMemo(() => {
    if (!state.data) return [];
    const scopes = new Set<string>();
    Object.values(state.data).forEach((entry) => {
      // Get SSO scopes from either config or moduleConfig
      const ssoScopes =
        entry.config?.ssoScopes || entry.moduleConfig?.ssoScopes || [];
      ssoScopes.forEach((scope) => scopes.add(scope));
    });
    return Array.from(scopes).sort();
  }, [state.data]);

  // Get available modules for filter dropdown
  const availableModules = useMemo(() => {
    if (!state.data) return [];
    const modules = new Set<string>();
    Object.values(state.data).forEach((entry) => {
      if (entry.modules) {
        entry.modules.forEach((module) => {
          modules.add(module.id);
          modules.add(module.module);
        });
      }
    });
    return Array.from(modules).sort();
  }, [state.data]);

  return {
    // State
    data: state.data,
    filteredData: state.filteredData,
    loading: state.loading,
    error: state.error,
    filterConfig: state.filterConfig,
    sortConfig: state.sortConfig,

    // Actions
    fetchFedModules,
    setSearchTerm,
    setSsoScopeFilter,
    setModuleFilter,
    setFilters,
    setSortConfig,
    toggleSort,
    clearFilters,

    // Computed values
    availableSsoScopes,
    availableModules,

    // Statistics
    totalCount: state.data ? Object.keys(state.data).length : 0,
    filteredCount: state.filteredData
      ? Object.keys(state.filteredData).length
      : 0,
  };
};

export default useFedModulesStore;
