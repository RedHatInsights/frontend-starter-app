/**
 * REFERENCE GUIDE — This feature demonstrates the starter app's patterns.
 * Replace src/features/roles/ with your own features when creating a new app.
 */
import React, { useState } from 'react';
import { Flex, FlexItem, Label } from '@patternfly/react-core';
import { ActionsColumn, type IAction } from '@patternfly/react-table';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
// eslint-disable-next-line starter-local/require-use-table-state -- tableState provided by useRolesTable hook
import {
  type CellRendererMap,
  type ColumnConfigMap,
  type FilterConfig,
  TableView,
} from '@redhat-cloud-services/frontend-components/TableView';
import type { RoleOut } from '@redhat-cloud-services/rbac-client';
import { Outlet } from 'react-router-dom';
import { AppLink } from '../../Components/AppLink';
import { useAppNavigate } from '../../hooks/useAppNavigate';
import { useRolesTable } from './hooks/useRolesTable';
import { DeleteRoleModal } from './components/DeleteRoleModal';

const COLUMNS = ['name', 'description', 'modified', 'system'] as const;

const columnConfig: ColumnConfigMap<typeof COLUMNS> = {
  name: { label: 'Name', width: 25, sortable: true },
  description: { label: 'Description', width: 35 },
  modified: {
    label: 'Last modified',
    width: 20,
    sortable: true,
    format: 'date',
  },
  system: { label: 'Type', width: 20 },
};

const filterConfig: FilterConfig[] = [
  { type: 'search', id: 'name', placeholder: 'Filter by name...' },
];

const cellRenderers: CellRendererMap<typeof COLUMNS, RoleOut> = {
  name: (row) => row.display_name || row.name,
  description: (row) => row.description || '—',
  modified: (row) => row.modified,
  system: (row) =>
    row.system ? (
      <Label color="blue">System</Label>
    ) : (
      <Label color="grey">Custom</Label>
    ),
};

export const RolesPage: React.FC = () => {
  const { tableState, data, totalCount, query } = useRolesTable();
  const navigate = useAppNavigate();
  const [deleteTarget, setDeleteTarget] = useState<RoleOut | null>(null);

  const renderActions = (row: RoleOut) => {
    const actions: IAction[] = [
      {
        title: 'Edit',
        onClick: () => navigate(`/roles/${row.uuid}/edit`),
        isDisabled: row.system,
      },
      {
        title: 'Delete',
        onClick: () => setDeleteTarget(row),
        isDisabled: row.system,
      },
    ];
    return <ActionsColumn items={actions} />;
  };

  return (
    <>
      <PageHeader>
        <Flex
          justifyContent={{ default: 'justifyContentSpaceBetween' }}
          alignItems={{ default: 'alignItemsCenter' }}
        >
          <FlexItem>
            <PageHeaderTitle title="Roles" />
            <p>
              Reference example &mdash; demonstrates CRUD patterns with TanStack
              Query, ServiceContext, and TableView. Requires Org Admin
              permissions.
            </p>
          </FlexItem>
          <FlexItem>
            <AppLink to="/roles/create" className="pf-v6-c-button pf-m-primary">
              Create role
            </AppLink>
          </FlexItem>
        </Flex>
      </PageHeader>

      <main>
        <TableView
          columns={COLUMNS}
          columnConfig={columnConfig}
          data={data}
          totalCount={totalCount}
          getRowId={(row) => row.uuid}
          cellRenderers={cellRenderers}
          sort={tableState.sort}
          onSortChange={tableState.onSortChange}
          page={tableState.page}
          perPage={tableState.perPage}
          perPageOptions={tableState.perPageOptions}
          onPageChange={tableState.onPageChange}
          onPerPageChange={tableState.onPerPageChange}
          filterConfig={filterConfig}
          filters={tableState.filters}
          onFiltersChange={tableState.onFiltersChange}
          clearAllFilters={tableState.clearAllFilters}
          renderActions={renderActions}
          error={query.error}
          ariaLabel="Roles table"
          ouiaId="roles-table"
        />
      </main>

      <DeleteRoleModal
        role={deleteTarget}
        onClose={() => setDeleteTarget(null)}
      />

      <Outlet />
    </>
  );
};

export default RolesPage;
