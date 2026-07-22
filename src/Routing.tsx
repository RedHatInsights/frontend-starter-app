import { Suspense, lazy } from 'react';
import {
  Navigate,
  Route as RouterRoute,
  Routes as RouterRoutes,
} from 'react-router-dom';
import { InvalidObject } from '@redhat-cloud-services/frontend-components/InvalidObject';
import { Bullseye, Spinner } from '@patternfly/react-core';

const SharedStoresDemo = lazy(
  () =>
    import(
      /* webpackChunkName: "SharedStoresDemo" */ './features/shared-stores/SharedStoresDemo'
    ),
);
const OopsPage = lazy(
  () => import(/* webpackChunkName: "OopsPage" */ './Components/OopsPage'),
);
const NoPermissionsPage = lazy(
  () =>
    import(
      /* webpackChunkName: "NoPermissionsPage" */ './Components/NoPermissionsPage'
    ),
);

const Routing = () => (
  <Suspense
    fallback={
      <Bullseye>
        <Spinner />
      </Bullseye>
    }
  >
    <RouterRoutes>
      <RouterRoute path="shared-stores-demo" element={<SharedStoresDemo />} />
      <RouterRoute path="oops" element={<OopsPage />} />
      <RouterRoute path="no-permissions" element={<NoPermissionsPage />} />
      <RouterRoute
        path="/"
        element={<Navigate to="shared-stores-demo" replace />}
      />
      <RouterRoute path="*" element={<InvalidObject />} />
    </RouterRoutes>
  </Suspense>
);

export default Routing;
