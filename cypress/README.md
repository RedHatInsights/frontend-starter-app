# Cypress Component Testing

This folder contains Cypress component tests for the frontend starter app.

## Folder Structure

```
cypress/
├── components/          # Component tests (.cy.tsx files)
├── fixtures/           # Test data files
├── support/            # Support files and configurations
└── tsconfig.json       # TypeScript configuration for Cypress
```

## Component Tests (`/components/`)
- Test individual React components in isolation
- Use `cy.mount()` to render components
- Fast execution, no server required
- Perfect for testing UI components with various props and states

## Fixtures (`/fixtures/`)
- `empty.json` - Empty API response template for mocking API calls

## Support Files (`/support/`)
- `commands.ts` - Custom Cypress commands (currently minimal)
- `component.ts` - Component testing setup and mount command
- `component-index.html` - HTML template for component tests

## Running Tests

```bash
# Run all component tests
npm run test:cypress

# Interactive mode for component testing
npm run test:cypress:open

# Component tests only (same as test:cypress)
npm run test:cypress:component
```

## Writing Component Tests

Create test files in the `components/` folder with the `.cy.tsx` extension:

```typescript
import MyComponent from '../../src/Components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    cy.mount(<MyComponent prop="value" />);
    cy.contains('Expected Text').should('be.visible');
  });
});
```
