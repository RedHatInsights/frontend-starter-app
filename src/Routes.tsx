import React, { Suspense, lazy } from 'react';
import { Route, Routes as RouterRoutes } from 'react-router-dom';
import { InvalidObject } from '@redhat-cloud-services/frontend-components/InvalidObject';

import { Bullseye, Spinner } from '@patternfly/react-core';

const SamplePage = lazy(
  () =>
    import(
      /* webpackChunkName: "SamplePage" */ './Routes/SamplePage/SamplePage'
    )
);
const OopsPage = lazy(
  () => import(/* webpackChunkName: "OopsPage" */ './Routes/OopsPage/OopsPage')
);
const NoPermissionsPage = lazy(
  () =>
    import(
      /* webpackChunkName: "NoPermissionsPage" */ './Routes/NoPermissionsPage/NoPermissionsPage'
    )
);

export const Routes = () => (
  <Suspense
    fallback={
      <Bullseye>
        <Spinner />
      </Bullseye>
    }
  >
    <RouterRoutes>
      <Route path="no-permissions" element={<NoPermissionsPage />} />
      <Route path="oops" element={<OopsPage />} />
      <Route path="/" element={<SamplePage />} />
      {/* Finally, catch all unmatched routes */}
      <Route path="*" element={<InvalidObject />} />
    </RouterRoutes>
  </Suspense>
);
