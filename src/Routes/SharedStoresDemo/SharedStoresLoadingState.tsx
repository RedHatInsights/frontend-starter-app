import React from 'react';
import { DataViewTh } from '@patternfly/react-data-view/dist/dynamic/DataViewTable';
import { SkeletonTableBody } from '@patternfly/react-component-groups';

const LoadingSharedStore = ({ columns }: { columns: DataViewTh[] }) => (
  <SkeletonTableBody rowsCount={5} columnsCount={columns.length} />
);

export default LoadingSharedStore;
