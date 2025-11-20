import React from 'react';
import {
  DataView,
  DataViewTable,
  DataViewToolbar,
} from '@patternfly/react-data-view';
import { DataViewFilters } from '@patternfly/react-data-view/dist/dynamic/DataViewFilters';
import { DataViewTextFilter } from '@patternfly/react-data-view/dist/dynamic/DataViewTextFilter';
import { DataViewCheckboxFilter } from '@patternfly/react-data-view/dist/dynamic/DataViewCheckboxFilter';
import { Stack, StackItem, Title } from '@patternfly/react-core';

import { useFedModulesDataView } from './useFedModulesDataView';
import { FedModulesData } from './types';
import EmptySharedStore from './SharedStoresEmptyState';
import ErrorSharedStore from './SharedStoresErrorState';
import LoadingSharedStore from './SharedStoresLoadingState';

interface FedModulesDataViewComponentProps {
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

export const FedModulesDataViewComponent: React.FC<
  FedModulesDataViewComponentProps
> = ({
  fedModulesData,
  availableSsoScopes,
  totalCount,
  filteredCount,
  loading,
  sortConfig,
  setSortConfig,
}) => {
  const {
    filters,
    onSetFilters,
    clearAllFilters,
    pagination,
    dataViewState,
    columns,
    rows,
  } = useFedModulesDataView({
    fedModulesData,
    availableSsoScopes,
    totalCount,
    filteredCount,
    loading,
    sortConfig,
    setSortConfig,
  });

  return (
    <DataView activeState={dataViewState}>
      <DataViewToolbar
        clearAllFilters={() => {
          clearAllFilters();
        }}
        filters={
          <DataViewFilters
            onChange={(_key, values) => {
              onSetFilters(values);
            }}
            values={filters}
          >
            <DataViewTextFilter
              key="searchTerm"
              filterId="searchTerm"
              title="Search"
              placeholder="Search modules..."
            />
            <DataViewCheckboxFilter
              key="ssoScopeFilter"
              filterId="ssoScopeFilter"
              title="SSO Scopes"
              placeholder="Select SSO scope..."
              options={availableSsoScopes.map((scope) => ({
                label: scope,
                value: scope,
              }))}
            />
            <DataViewTextFilter
              key="moduleFilter"
              filterId="moduleFilter"
              title="Module Search"
              placeholder="Search modules..."
            />
          </DataViewFilters>
        }
      />

      <DataViewTable
        aria-label="Federated modules table"
        columns={columns}
        rows={rows}
        bodyStates={{
          loading: <LoadingSharedStore columns={columns} />,
          empty: (
            <EmptySharedStore
              columns={columns}
              clearAllFilters={clearAllFilters}
            />
          ),
          error: <ErrorSharedStore columns={columns} />,
        }}
        {...pagination}
      />

      <Stack hasGutter>
        <StackItem>
          <Title headingLevel="h3" size="lg">
            Statistics: {filteredCount} of {totalCount} modules
          </Title>
        </StackItem>
      </Stack>
    </DataView>
  );
};
