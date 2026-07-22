/**
 * ESLint Rule: require-use-table-state
 *
 * Errors when a file imports `TableView` but does not also import `useTableState`.
 *
 * Matches on imported specifier names — not source paths — so it catches
 * barrel re-exports (`from '../table-view'`), direct imports
 * (`from './TableView'`), and aliases (`from '@/components/table-view'`)
 * equally.
 *
 * Rationale: TableView consumers should use useTableState for state management
 * to avoid duplicated logic and subtle bugs (e.g., broken multi-select,
 * missing sort direction). Exceptions exist for components that receive
 * tableState from a parent — those should suppress with eslint-disable.
 */

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require useTableState when using TableView to prevent hand-rolled table state bugs',
    },
    messages: {
      missingUseTableState:
        'TableView is imported without useTableState. Use useTableState for state management (or receive tableState from a parent and suppress this warning).',
    },
    schema: [],
  },
  create(context) {
    let tableViewImportNode = null;
    let hasUseTableState = false;

    return {
      ImportDeclaration(node) {
        for (const specifier of node.specifiers) {
          // Named import: import { TableView } from '...'
          if (specifier.type === 'ImportSpecifier' && specifier.imported.name === 'TableView') {
            tableViewImportNode = node;
          }
          // Named import: import { useTableState } from '...'
          if (specifier.type === 'ImportSpecifier' && specifier.imported.name === 'useTableState') {
            hasUseTableState = true;
          }
        }
      },
      'Program:exit'() {
        if (tableViewImportNode && !hasUseTableState) {
          context.report({
            node: tableViewImportNode,
            messageId: 'missingUseTableState',
          });
        }
      },
    };
  },
};
