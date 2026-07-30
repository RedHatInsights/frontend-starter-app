import React, { useMemo, useState } from 'react';
import {
  Outlet,
  Route,
  Link as RouterLink,
  Routes,
  useMatch,
  useParams,
} from 'react-router-dom';
import type { NavigateOptions } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CodeBlock,
  CodeBlockCode,
  Content,
  PageSection,
  Stack,
  StackItem,
  Tab,
  TabTitleText,
  Tabs,
  Title,
} from '@patternfly/react-core';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import { useRemoteHook } from '@scalprum/react-core';

const BASE_PATH = '/staging/starter/breadcrumb-demo';

type AppBreadcrumbSegment = {
  pathname: string;
  title: string;
  options?: NavigateOptions;
};

const REPLACE_MODE_EXAMPLE = `import { useRemoteHook } from '@scalprum/react-core';

const { id, tab } = useParams();

const breadcrumbs = useMemo(() => {
  const crumbs = [
    { pathname: '/staging/starter/breadcrumb-demo', title: 'Breadcrumb Demo' }
  ];
  if (id) {
    crumbs.push({
      pathname: \`/staging/starter/breadcrumb-demo/items/\${id}\`,
      title: \`Item \${id}\`,
      options: { state: { filters, returnPath } }
    });
  }
  return crumbs;
}, [id, tab]);

// Pass breadcrumbs via args — RemoteHookProvider calls the hook
useRemoteHook({
  scope: 'chrome',
  module: './breadcrumbs/useReplaceBreadcrumbs',
  args: [breadcrumbs],
});`;

const INCREMENTAL_MODE_EXAMPLE = `import { useRemoteHook } from '@scalprum/react-core';

// Root component — pass args to useRemoteHook
function IncrementalRoot() {
  useRemoteHook({
    scope: 'chrome',
    module: './breadcrumbs/useBreadcrumbs',
    args: ['/staging/starter/breadcrumb-demo/nested', 'Breadcrumb Demo'],
  });
  return <Outlet />;
}

// Detail component (child route)
function IncrementalDetail() {
  const { id } = useParams();
  useRemoteHook({
    scope: 'chrome',
    module: './breadcrumbs/useBreadcrumbs',
    args: [
      \`/staging/starter/breadcrumb-demo/nested/items/\${id}\`,
      \`Item \${id}\`,
      { state: { filters, returnPath } }
    ],
  });
  return <Outlet />;
}`;

const TAB_NAMES: Record<string, string> = {
  overview: 'Overview',
  details: 'Details',
  settings: 'Settings',
};

// ─── Replace Mode Demo ───────────────────────────────────────────────

const BreadcrumbDemo = () => {
  const { id, tab } = useParams<{ id?: string; tab?: string }>();
  const [activeTab, setActiveTab] = useState(0);

  const breadcrumbs = useMemo<AppBreadcrumbSegment[]>(() => {
    const crumbs: AppBreadcrumbSegment[] = [
      { pathname: BASE_PATH, title: 'Breadcrumb Demo' },
    ];

    if (id) {
      const filters = { status: 'active', view: 'detail' };
      crumbs.push({
        pathname: `${BASE_PATH}/items/${id}`,
        title: `Item ${id}`,
        options: { state: { filters, returnPath: BASE_PATH } },
      });
    }

    if (id && tab) {
      crumbs.push({
        pathname: `${BASE_PATH}/items/${id}/${tab}`,
        title: TAB_NAMES[tab] || tab,
        options: { state: { activeTab: tab } },
      });
    }

    return crumbs;
  }, [id, tab]);

  useRemoteHook<void>({
    scope: 'chrome',
    module: './breadcrumbs/useReplaceBreadcrumbs',
    args: [breadcrumbs],
  });

  if (id && tab) {
    return (
      <>
        <PageHeader>
          <PageHeaderTitle title={`Item ${id} - ${tab}`} />
        </PageHeader>
        <PageSection>
          <Stack hasGutter>
            <StackItem>
              <Content>
                <p>
                  This is the <strong>{tab}</strong> tab for Item {id}.
                </p>
                <p>
                  Click breadcrumbs above to navigate back. State is preserved
                  via NavigateOptions.
                </p>
              </Content>
            </StackItem>
            <StackItem>
              <Button
                variant="secondary"
                component={(props) => (
                  <RouterLink {...props} to={`${BASE_PATH}/items/${id}`} />
                )}
              >
                Back to Item {id}
              </Button>
            </StackItem>
          </Stack>
        </PageSection>
      </>
    );
  }

  if (id) {
    return (
      <>
        <PageHeader>
          <PageHeaderTitle title={`Item ${id}`} />
        </PageHeader>
        <PageSection>
          <Stack hasGutter>
            <StackItem>
              <Title headingLevel="h2">Item Details</Title>
              <Content>
                <p>Demonstrates nested breadcrumbs with state preservation.</p>
                <p>
                  When you click a breadcrumb, the component can access
                  navigation state to restore filters, scroll position, etc.
                </p>
              </Content>
            </StackItem>
            <StackItem>
              <Title headingLevel="h3" size="lg">
                Navigate to tabs
              </Title>
              <Stack hasGutter>
                {Object.entries(TAB_NAMES).map(([key, label]) => (
                  <StackItem key={key}>
                    <Button
                      variant="link"
                      component={(props) => (
                        <RouterLink
                          {...props}
                          to={`${BASE_PATH}/items/${id}/${key}`}
                        />
                      )}
                    >
                      {label} Tab
                    </Button>
                  </StackItem>
                ))}
              </Stack>
            </StackItem>
          </Stack>
        </PageSection>
      </>
    );
  }

  return (
    <>
      <PageHeader>
        <PageHeaderTitle title="Breadcrumb Demo" />
        <p>
          Demo of Chrome global breadcrumbs API — Replace &amp; Incremental
          modes
        </p>
      </PageHeader>
      <PageSection>
        <Tabs
          activeKey={activeTab}
          onSelect={(_e, key) => setActiveTab(key as number)}
        >
          <Tab eventKey={0} title={<TabTitleText>Replace Mode</TabTitleText>}>
            <Stack hasGutter>
              <StackItem>
                <Card>
                  <CardBody>
                    <Title headingLevel="h2">How it works (Replace Mode)</Title>
                    <Content>
                      <p>
                        Uses <code>useReplaceBreadcrumbs(breadcrumbs)</code> to
                        set the entire breadcrumb array at once.
                      </p>
                      <p>
                        Single component computes breadcrumbs based on route
                        params (id, tab). Good for apps with conditional routing
                        logic in one component.
                      </p>
                      <p>
                        Navigation state can be passed via{' '}
                        <code>options.state</code> to restore filters, scroll
                        position, etc. when clicking breadcrumbs.
                      </p>
                    </Content>
                  </CardBody>
                </Card>
              </StackItem>
              <StackItem>
                <Title headingLevel="h2">Try it</Title>
                <Content>
                  <p>
                    Click an item below to see nested breadcrumbs in action:
                  </p>
                </Content>
                <Stack hasGutter>
                  {[1, 2, 3].map((num) => (
                    <StackItem key={num}>
                      <Button
                        variant="link"
                        component={(props) => (
                          <RouterLink
                            {...props}
                            to={`${BASE_PATH}/items/${num}`}
                          />
                        )}
                      >
                        View Item {num}
                      </Button>
                    </StackItem>
                  ))}
                </Stack>
              </StackItem>
              <StackItem>
                <Card>
                  <CardBody>
                    <Title headingLevel="h3">Code Example</Title>
                    <CodeBlock>
                      <CodeBlockCode>{REPLACE_MODE_EXAMPLE}</CodeBlockCode>
                    </CodeBlock>
                  </CardBody>
                </Card>
              </StackItem>
            </Stack>
          </Tab>
          <Tab
            eventKey={1}
            title={<TabTitleText>Incremental Mode</TabTitleText>}
          >
            <Stack hasGutter>
              <StackItem>
                <Card>
                  <CardBody>
                    <Title headingLevel="h2">
                      How it works (Incremental Mode)
                    </Title>
                    <Content>
                      <p>
                        Each route component calls{' '}
                        <code>useBreadcrumbs(pathname, title, options)</code>{' '}
                        independently.
                      </p>
                      <p>
                        Nested routes use React Router&apos;s{' '}
                        <code>&lt;Outlet /&gt;</code> so parent and child
                        components are both mounted. Each registers its
                        breadcrumb entry.
                      </p>
                      <p>
                        Good for apps with proper route nesting and separate
                        components per route.
                      </p>
                    </Content>
                  </CardBody>
                </Card>
              </StackItem>
              <StackItem>
                <Title headingLevel="h2">Try it</Title>
                <Content>
                  <p>Click below to see incremental breadcrumbs in action:</p>
                </Content>
                <Button
                  variant="primary"
                  component={(props) => (
                    <RouterLink {...props} to={`${BASE_PATH}/nested/items`} />
                  )}
                >
                  View Items List
                </Button>
              </StackItem>
              <StackItem>
                <Card>
                  <CardBody>
                    <Title headingLevel="h3">Code Example</Title>
                    <CodeBlock>
                      <CodeBlockCode>{INCREMENTAL_MODE_EXAMPLE}</CodeBlockCode>
                    </CodeBlock>
                  </CardBody>
                </Card>
              </StackItem>
            </Stack>
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};

export default BreadcrumbDemo;

// ─── Incremental Mode Demo (nested routes) ───────────────────────────

const NESTED_BASE = `${BASE_PATH}/nested`;

export const IncrementalRoot = () => {
  useRemoteHook<void>({
    scope: 'chrome',
    module: './breadcrumbs/useBreadcrumbs',
    args: [NESTED_BASE, 'Breadcrumb Demo'],
  });

  return (
    <Routes>
      <Route path="items" element={<IncrementalItems />}>
        <Route path=":id" element={<IncrementalDetail />}>
          <Route path=":tab" element={<IncrementalTab />} />
        </Route>
      </Route>
    </Routes>
  );
};

const IncrementalItems = () => {
  useRemoteHook<void>({
    scope: 'chrome',
    module: './breadcrumbs/useBreadcrumbs',
    args: [`${NESTED_BASE}/items`, 'Items'],
  });
  const isExactPath = useMatch(`${NESTED_BASE}/items`);

  return (
    <>
      {isExactPath && (
        <>
          <PageHeader>
            <PageHeaderTitle title="Items" />
          </PageHeader>
          <PageSection>
            <Stack hasGutter>
              <StackItem>
                <Title headingLevel="h2">Items List</Title>
                <Content>
                  <p>
                    Items list page. Demonstrates intermediate breadcrumb
                    segment.
                  </p>
                </Content>
              </StackItem>
              <StackItem>
                <Title headingLevel="h3" size="lg">
                  Available Items
                </Title>
                <Stack hasGutter>
                  {[1, 2, 3].map((num) => (
                    <StackItem key={num}>
                      <Button
                        variant="link"
                        component={(props) => (
                          <RouterLink
                            {...props}
                            to={`${NESTED_BASE}/items/${num}`}
                          />
                        )}
                      >
                        View Item {num}
                      </Button>
                    </StackItem>
                  ))}
                </Stack>
              </StackItem>
            </Stack>
          </PageSection>
        </>
      )}
      <Outlet />
    </>
  );
};

const IncrementalDetail = () => {
  const { id } = useParams<{ id: string }>();
  const isExactPath = useMatch(`${NESTED_BASE}/items/:id`);

  const filters = { status: 'active', view: 'detail' };
  useRemoteHook<void>({
    scope: 'chrome',
    module: './breadcrumbs/useBreadcrumbs',
    args: [
      `${NESTED_BASE}/items/${id}`,
      `Item ${id}`,
      { state: { filters, returnPath: NESTED_BASE } },
    ],
  });

  return (
    <>
      {isExactPath && (
        <>
          <PageHeader>
            <PageHeaderTitle title={`Item ${id}`} />
          </PageHeader>
          <PageSection>
            <Stack hasGutter>
              <StackItem>
                <Title headingLevel="h2">Item Details</Title>
                <Content>
                  <p>
                    Demonstrates nested breadcrumbs with state preservation.
                  </p>
                  <p>
                    Both the root component and this detail component are
                    mounted, each calling <code>useBreadcrumbs</code>{' '}
                    independently.
                  </p>
                </Content>
              </StackItem>
              <StackItem>
                <Title headingLevel="h3" size="lg">
                  Navigate to tabs
                </Title>
                <Stack hasGutter>
                  {Object.entries(TAB_NAMES).map(([key, label]) => (
                    <StackItem key={key}>
                      <Button
                        variant="link"
                        component={(props) => (
                          <RouterLink
                            {...props}
                            to={`${NESTED_BASE}/items/${id}/${key}`}
                          />
                        )}
                      >
                        {label} Tab
                      </Button>
                    </StackItem>
                  ))}
                </Stack>
              </StackItem>
            </Stack>
          </PageSection>
        </>
      )}
      <Outlet />
    </>
  );
};

const IncrementalTab = () => {
  const { id, tab } = useParams<{ id: string; tab: string }>();
  const tabTitle = (tab && TAB_NAMES[tab]) || tab || 'Unknown';

  useRemoteHook<void>({
    scope: 'chrome',
    module: './breadcrumbs/useBreadcrumbs',
    args: [
      `${NESTED_BASE}/items/${id}/${tab}`,
      tabTitle,
      { state: { activeTab: tab } },
    ],
  });

  return (
    <PageSection>
      <Stack hasGutter>
        <StackItem>
          <Content>
            <p>
              This is the <strong>{tab}</strong> tab for Item {id}.
            </p>
            <p>
              Three components are mounted: Root → Detail → Tab. Each called{' '}
              <code>useBreadcrumbs</code> with its own pathname.
            </p>
            <p>
              Click breadcrumbs above to navigate back. State is preserved via
              NavigateOptions.
            </p>
          </Content>
        </StackItem>
        <StackItem>
          <Button
            variant="secondary"
            component={(props) => (
              <RouterLink {...props} to={`${NESTED_BASE}/items/${id}`} />
            )}
          >
            Back to Item {id}
          </Button>
        </StackItem>
      </Stack>
    </PageSection>
  );
};
