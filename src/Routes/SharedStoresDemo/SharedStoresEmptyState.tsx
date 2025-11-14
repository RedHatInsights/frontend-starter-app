import React from 'react';
import { DataViewTh } from '@patternfly/react-data-view/dist/dynamic/DataViewTable';
import { CubesIcon } from '@patternfly/react-icons';
import {
  Button,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
} from '@patternfly/react-core';
import { Tbody, Td, Tr } from '@patternfly/react-table';

const EmptySharedStore = ({
  columns,
  clearAllFilters,
}: {
  columns: DataViewTh[];
  clearAllFilters: () => void;
}) => (
  <Tbody>
    <Tr key="loading">
      <Td colSpan={columns.length}>
        <EmptyState
          headingLevel="h4"
          icon={CubesIcon}
          titleText="No data found"
        >
          <EmptyStateBody>
            There are no matching data to be displayed.
          </EmptyStateBody>
          <EmptyStateFooter>
            <EmptyStateActions>
              <Button variant="primary" onClick={clearAllFilters}>
                Clear filters
              </Button>
            </EmptyStateActions>
          </EmptyStateFooter>
        </EmptyState>
      </Td>
    </Tr>
  </Tbody>
);

export default EmptySharedStore;
