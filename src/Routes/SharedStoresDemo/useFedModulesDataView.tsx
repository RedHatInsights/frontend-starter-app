import React, { useEffect, useMemo } from 'react';
import {
  useDataViewFilters,
  useDataViewPagination,
  useDataViewSort,
} from '@patternfly/react-data-view';
import { DataViewTh, DataViewTr } from '@patternfly/react-data-view';
import { DataViewState } from '@patternfly/react-data-view/dist/dynamic/DataView';
import { Label, Stack, StackItem } from '@patternfly/react-core';
import { useSearchParams } from 'react-router-dom';
import { ThProps } from '@patternfly/react-table';
import { useRemoteHook } from '@scalprum/react-core';
import {
  FedModule,
  FedModuleEntry,
  FedModuleRoute,
  FedModulesData,
  FedModulesFilterResult,
  columnsData,
} from './types';

interface UseFedModulesDataViewProps {
  fedModulesData: FedModulesData;
  availableSsoScopes: string[];
  totalCount: number;
  filteredCount: number;
  loading?: boolean;
  sortConfig?: {
    validKeys: string[];
    key: string | null;
    direction: 'asc' | 'desc';
  };
  setSortConfig?: (key: string, direction: 'asc' | 'desc') => void;
}

export const useFedModulesDataView = ({
  fedModulesData,
  availableSsoScopes,
  totalCount,
  filteredCount,
  loading,
  sortConfig,
  setSortConfig,
}: UseFedModulesDataViewProps) => {
  const pagination = useDataViewPagination({ perPage: 20 });
  const [searchParams, setSearchParams] = useSearchParams();

  // Remote hook for filter management
  const {
    hookResult: filterHook,
    error: filterError,
    loading: filterLoading,
  } = useRemoteHook<FedModulesFilterResult>({
    scope: 'frontendStarterApp',
    module: './frontendModules/useFedModulesFilter',
  });

  // DataView filters
  const { filters, onSetFilters, clearAllFilters } = useDataViewFilters<{
    searchTerm: string;
    ssoScopeFilter: string[];
    moduleFilter: string;
  }>({
    searchParams,
    setSearchParams,
    initialFilters: {
      searchTerm: '',
      ssoScopeFilter: [],
      moduleFilter: '',
    },
  });

  // DataView sorting
  const { sortBy, direction, onSort } = useDataViewSort({
    searchParams,
    setSearchParams,
  });

  const sortByIndex = useMemo(
    () => columnsData.findIndex((item) => item.key === sortBy),
    [sortBy],
  );

  // Sync filters with remote hook
  useEffect(() => {
    if (!filterLoading && !filterError && filterHook?.setFilters) {
      filterHook.setFilters(filters);
    }
  }, [filterHook?.setFilters, filterLoading, filters]);

  // Sync sorting with remote hook
  useEffect(() => {
    if (sortBy && direction && setSortConfig) {
      setSortConfig(sortBy, direction);
    }
  }, [sortBy, direction, setSortConfig]);

  // Generate sort params for columns
  const getSortParams = (columnIndex: number): ThProps['sort'] => {
    const key = columnsData[columnIndex].key;
    if (!sortConfig || !setSortConfig) {
      return undefined;
    }
    if (!sortConfig.validKeys.includes(key)) {
      return undefined;
    }
    return {
      sortBy: {
        index: sortByIndex,
        direction,
        defaultDirection: 'asc',
      },
      onSort: (_event, _index, direction) => onSort(_event, key, direction),
      columnIndex,
    };
  };

  // Define table columns with sort params
  const columns: DataViewTh[] = columnsData.map((column, index) => ({
    cell: column.label,
    props: {
      sort: getSortParams(index),
    },
  }));

  // Transform data into rows format
  const rows: DataViewTr[] = Object.entries(fedModulesData).map(
    ([moduleId, moduleData]: [string, FedModuleEntry]) => [
      { cell: <strong>{moduleId}</strong> },
      { cell: <code>{moduleData.manifestLocation}</code> },
      {
        cell: (
          <Stack hasGutter>
            {moduleData.modules ? (
              moduleData.modules.map((mod: FedModule) => (
                <StackItem key={mod.id}>
                  <Label color="blue" variant="filled">
                    {mod.id} ({mod.module})
                  </Label>
                </StackItem>
              ))
            ) : (
              <StackItem>
                <Label color="grey" variant="outline">
                  No modules
                </Label>
              </StackItem>
            )}
          </Stack>
        ),
      },
      {
        cell: (
          <Stack hasGutter>
            {(() => {
              // Get SSO scopes from either config or moduleConfig
              const ssoScopes =
                moduleData.config?.ssoScopes ||
                moduleData.moduleConfig?.ssoScopes ||
                [];

              return ssoScopes.length > 0 ? (
                ssoScopes.map((scope: string) => (
                  <StackItem key={scope}>
                    <Label color="green" variant="filled">
                      {scope}
                    </Label>
                  </StackItem>
                ))
              ) : (
                <StackItem>
                  <Label color="grey" variant="outline">
                    No SSO scopes
                  </Label>
                </StackItem>
              );
            })()}
          </Stack>
        ),
      },
      {
        cell: (
          <Stack>
            {moduleData.modules ? (
              moduleData.modules.flatMap((mod: FedModule) =>
                mod.routes.map((route: FedModuleRoute, index: number) => (
                  <StackItem key={`${mod.id}-${index}`}>
                    <code>{route.pathname}</code>
                  </StackItem>
                )),
              )
            ) : (
              <StackItem>
                <Label color="grey" variant="outline">
                  No routes
                </Label>
              </StackItem>
            )}
          </Stack>
        ),
      },
    ],
  );

  // Determine DataView state
  const dataViewState = useMemo(() => {
    if (filterError) {
      return DataViewState.error;
    }
    if (loading) {
      return DataViewState.loading;
    }
    if (filteredCount === 0) {
      return DataViewState.empty;
    }
    return undefined;
  }, [loading, filteredCount, filterError]);

  return {
    // DataView state management
    filters,
    onSetFilters,
    clearAllFilters,
    pagination,
    dataViewState,

    // Table structure
    columns,
    rows,

    // Filter options
    availableSsoScopes,

    // Stats
    totalCount,
    filteredCount,

    // Remote hook error handling
    filterError,
    filterLoading,
  };
};
