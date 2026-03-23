# Frontend Starter App

HCC (Hybrid Cloud Console) frontend application built with React, TypeScript, PatternFly 6, and the Red Hat Insights frontend framework.

## Tech Stack

- **Framework**: React 18 with TypeScript
- **UI Library**: PatternFly 6 (`@patternfly/react-core`, `@patternfly/react-table`, `@patternfly/react-data-view`)
- **Build**: `@redhat-cloud-services/frontend-components-config` (FEC)
- **Routing**: React Router v6
- **Testing**: Jest + Testing Library, Cypress (component tests), Playwright
- **Linting**: ESLint with `@redhat-cloud-services/eslint-config-redhat-cloud-services`

## Structure

- `src/` - Application source code
- `src/Components/` - Reusable React components
- `src/Routes/` - Page-level route components
- `config/` - Build configuration
- `build-tools/` - Git submodule (`insights-frontend-builder-common`)

## Commands

```shell
npm start          # Dev server (HOT=true fec dev)
npm run build      # Production build (fec build)
npm run lint       # Run all linters
npm test           # Run Jest tests
npm run test:cypress       # Run Cypress component tests
npm run test:cypress:open  # Open Cypress interactive
```

## Conventions

- Use PatternFly 6 components — prefer `@patternfly/react-data-view` for tables over raw `@patternfly/react-table`
- Follow Red Hat Cloud Services frontend patterns for Chrome/Insights integration
- Use `@redhat-cloud-services/frontend-components` for shared UI primitives
- SCSS modules for component-scoped styles (`.scss` files alongside components)
- TypeScript strict mode — no `any` types

## MCP Servers

Custom MCP servers for this project are defined in `.mcp.json` at the repo root. These are loaded automatically by Claude Code when working in this directory. Add new servers there for project-specific tooling.
