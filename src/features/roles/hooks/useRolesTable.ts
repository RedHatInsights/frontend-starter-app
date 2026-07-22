import { useTableState } from '@redhat-cloud-services/frontend-components/TableView';
import type { RoleOut } from '@redhat-cloud-services/rbac-client';
import { type RolesListParams, useRolesQuery } from '../data/queries/roles';

const COLUMNS = ['name', 'description', 'modified', 'system'] as const;

export function useRolesTable() {
  const tableState = useTableState<
    typeof COLUMNS,
    RoleOut,
    'name' | 'modified'
  >({
    columns: COLUMNS,
    sortableColumns: ['name', 'modified'] as const,
    initialSort: { column: 'name', direction: 'asc' },
    initialPerPage: 10,
    getRowId: (row) => row.uuid,
  });

  const nameFilter = tableState.filters['name'];
  const queryParams: RolesListParams = {
    offset: tableState.apiParams.offset,
    limit: tableState.apiParams.limit,
    orderBy: tableState.apiParams.orderBy,
    name: typeof nameFilter === 'string' ? nameFilter : undefined,
  };

  const query = useRolesQuery(queryParams);

  return {
    columns: COLUMNS,
    tableState,
    query,
    data: query.data?.data,
    totalCount: query.data?.meta?.count,
  };
}
