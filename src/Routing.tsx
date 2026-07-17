import { Suspense, lazy } from 'react';
import {
  Navigate,
  Route as RouterRoute,
  Routes as RouterRoutes,
} from 'react-router-dom';
import { InvalidObject } from '@redhat-cloud-services/frontend-components/InvalidObject';
import { Bullseye, Spinner } from '@patternfly/react-core';

const RolesPage = lazy(
  () =>
    import(/* webpackChunkName: "RolesPage" */ './features/roles/RolesPage'),
);
const CreateRoleWizard = lazy(
  () =>
    import(
      /* webpackChunkName: "CreateRoleWizard" */ './features/roles/components/CreateRoleWizard'
    ),
);
const EditRoleWizard = lazy(
  () =>
    import(
      /* webpackChunkName: "EditRoleWizard" */ './features/roles/components/EditRoleWizard'
    ),
);
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
      <RouterRoute path="roles" element={<RolesPage />}>
        <RouterRoute path="create" element={<CreateRoleWizard />} />
        <RouterRoute path=":uuid/edit" element={<EditRoleWizard />} />
      </RouterRoute>
      <RouterRoute path="shared-stores-demo" element={<SharedStoresDemo />} />
      <RouterRoute path="oops" element={<OopsPage />} />
      <RouterRoute path="no-permissions" element={<NoPermissionsPage />} />
      <RouterRoute path="/" element={<Navigate to="roles" replace />} />
      <RouterRoute path="*" element={<InvalidObject />} />
    </RouterRoutes>
  </Suspense>
);

export default Routing;
