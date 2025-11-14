import React from 'react';
import { DataViewTh } from '@patternfly/react-data-view/dist/dynamic/DataViewTable';
import { ErrorState } from '@patternfly/react-component-groups';
import { Tbody, Td, Tr } from '@patternfly/react-table';

const ErrorSharedStore = ({ columns }: { columns: DataViewTh[] }) => (
  <Tbody>
    <Tr key="loading">
      <Td colSpan={columns.length}>
        <ErrorState
          titleText="Unable to load data"
          bodyText="There was an error retrieving data. Check your connection and reload the page."
        />
      </Td>
    </Tr>
  </Tbody>
);

export default ErrorSharedStore;
