import { Suspense, lazy, useMemo } from 'react';
import type { ComponentType } from 'react';
import { Route as RouterRoute, Routes as RouterRoutes } from 'react-router-dom';
import { InvalidObject } from '@redhat-cloud-services/frontend-components/InvalidObject';
import { Bullseye, Spinner } from '@patternfly/react-core';

const SamplePage = lazy(
  () =>
    import(/* webpackChunkName: "SamplePage" */ './features/sample/SamplePage'),
);
const SharedStoresDemo = lazy(
  () =>
    import(
      /* webpackChunkName: "SharedStoresDemo" */ './Routes/SharedStoresDemo/SharedStoresDemo'
    ),
);
const OopsPage = lazy(
  () => import(/* webpackChunkName: "OopsPage" */ './Routes/OopsPage/OopsPage'),
);
const NoPermissionsPage = lazy(
  () =>
    import(
      /* webpackChunkName: "NoPermissionsPage" */ './Routes/NoPermissionsPage/NoPermissionsPage'
    ),
);
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

const routes = [
  {
    path: 'no-permissions',
    element: NoPermissionsPage,
  },
  {
    path: 'oops',
    element: OopsPage,
  },
  {
    path: 'shared-stores-demo',
    element: SharedStoresDemo,
  },
  {
    path: '/',
    element: SamplePage,
  },
  {
    path: 'roles',
    element: RolesPage,
    childRoutes: [
      { path: 'create', element: CreateRoleWizard },
      { path: ':uuid/edit', element: EditRoleWizard },
    ],
  },
  /* Catch all unmatched routes */
  {
    path: '*',
    element: InvalidObject,
  },
];

interface RouteType {
  path?: string;
  element: ComponentType;
  childRoutes?: RouteType[];
  elementProps?: Record<string, unknown>;
}

const renderRoutes = (routes: RouteType[] = []) =>
  routes.map(({ path, element: Element, childRoutes, elementProps }) => (
    <RouterRoute key={path} path={path} element={<Element {...elementProps} />}>
      {renderRoutes(childRoutes)}
    </RouterRoute>
  ));

const Routing = () => {
  const renderedRoutes = useMemo(() => renderRoutes(routes), [routes]);
  return (
    <Suspense
      fallback={
        <Bullseye>
          <Spinner />
        </Bullseye>
      }
    >
      <RouterRoutes>{renderedRoutes}</RouterRoutes>
    </Suspense>
  );
};

export default Routing;
