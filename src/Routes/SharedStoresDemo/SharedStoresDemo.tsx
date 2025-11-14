import React, { useEffect, useMemo } from 'react';
import {
  Alert,
  Bullseye,
  Spinner,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { useRemoteHook } from '@scalprum/react-core';

import { FedModulesStoreResult } from './types';
import { FedModulesDataViewComponent } from './FedModulesDataViewComponent';

/**
 * Data fetching component that demonstrates Scalprum Shared Stores integration.
 *
 * This component showcases:
 * - useRemoteHook for accessing shared store across micro-frontend boundaries
 * - Remote hooks exposed via Module Federation
 * - Clean separation of data fetching from UI presentation
 */
const FedModulesDataContainer: React.FC = () => {
  const storeArgs = useMemo(() => [], []);

  // 🎯 Main demonstration: useRemoteHook accessing shared store
  const {
    hookResult: storeHook,
    loading: storeLoading,
    error: storeError,
  } = useRemoteHook<FedModulesStoreResult>({
    scope: 'frontendStarterApp',
    module: './frontendModules/useFedModulesStore',
    args: storeArgs,
  });

  // Fetch data on component mount
  useEffect(() => {
    if (storeHook?.fetchFedModules) {
      storeHook.fetchFedModules();
    }
  }, [storeHook?.fetchFedModules]);

  // Loading state
  if (storeLoading) {
    return (
      <Bullseye>
        <Spinner size="lg" />
      </Bullseye>
    );
  }

  // Error state
  if (storeError) {
    return (
      <Alert variant="danger" title="Failed to load remote hooks">
        <p>Store error: {storeError?.message}</p>
      </Alert>
    );
  }

  // Extract data from shared store
  const fedModulesData = storeHook?.filteredData || {};
  const totalCount = storeHook?.totalCount || 0;
  const filteredCount = Object.keys(fedModulesData).length;
  const availableSsoScopes = storeHook?.availableSsoScopes || [];
  const sortConfig = storeHook?.sortConfig;
  const setSortConfig = storeHook?.setSortConfig || (() => undefined);

  return (
    <FedModulesDataViewComponent
      fedModulesData={fedModulesData}
      availableSsoScopes={availableSsoScopes}
      totalCount={totalCount}
      filteredCount={filteredCount}
      loading={storeHook?.loading}
      sortConfig={sortConfig}
      setSortConfig={setSortConfig}
    />
  );
};

/**
 * Main demo component showcasing Scalprum Shared Stores and Remote Hooks.
 *
 * Key Features Demonstrated:
 * - Cross-micro-frontend state management
 * - Module Federation hook exposure
 * - Event-driven state synchronization
 * - Type-safe remote hook integration
 * - Rendering optimization through separated concerns
 */
const SharedStoresDemo: React.FC = () => {
  const { appAction } = useChrome();

  useEffect(() => {
    appAction('shared-stores-demo');
  }, []);

  return (
    <React.Fragment>
      <PageHeader>
        <PageHeaderTitle title="Shared Stores Demo" />
        <p>
          Demonstrating cross-micro-frontend state management with Scalprum
          Shared Stores. This page uses remote hooks to access shared state,
          showcasing rendering optimization with separated concerns.
        </p>
      </PageHeader>

      <section className="pf-v6-u-p-md">
        <Stack hasGutter>
          <StackItem>
            <Alert
              variant="info"
              title="Remote Hooks & Shared Stores Integration"
              isInline
            >
              <p>This demo showcases cross-micro-frontend state management:</p>
              <ul>
                <li>
                  <strong>Remote Store Hook:</strong>{' '}
                  <code>./frontendModules/useFedModulesStore</code> - Full data
                  access, filtering, and sorting functionality
                </li>
                <li>
                  <strong>Remote Filter Hook:</strong>{' '}
                  <code>./frontendModules/useFedModulesFilter</code> - Isolated
                  filter management for optimal rendering
                </li>
                <li>
                  <strong>Module Federation:</strong> Hooks exposed via webpack
                  federation for cross-app consumption
                </li>
                <li>
                  <strong>Event-driven Sync:</strong> Filter changes propagate
                  via Scalprum events across components
                </li>
              </ul>
            </Alert>
          </StackItem>

          <StackItem>
            <FedModulesDataContainer />
          </StackItem>

          <StackItem>
            <Alert
              variant="success"
              title="Shared Store Features Demonstrated"
              isInline
            >
              <ul>
                <li>
                  <strong>Remote Hooks:</strong> Using Module Federation to
                  access hooks across micro-frontend boundaries
                </li>
                <li>
                  <strong>Rendering Optimization:</strong> Separated components
                  with isolated subscriptions prevent unnecessary re-renders
                </li>
                <li>
                  <strong>Persistent State:</strong> Filter and sort state
                  managed in shared store, persists across component lifecycles
                </li>
                <li>
                  <strong>Event-driven Updates:</strong> Real-time state
                  synchronization via Scalprum event system
                </li>
                <li>
                  <strong>Type Safety:</strong> Full TypeScript support with
                  payload validation for remote hook results
                </li>
              </ul>
            </Alert>
          </StackItem>
        </Stack>
      </section>
    </React.Fragment>
  );
};

export default SharedStoresDemo;
