/**
 * enforce-story-patterns
 *
 * Enforces Storybook story conventions in *.stories.tsx files:
 * 1. Stories must have a `title` in the meta object
 * 2. Stories must export a default meta object
 */

/* eslint-disable @typescript-eslint/no-require-imports */

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce Storybook story patterns for consistency',
    },
    messages: {
      missingDefaultExport:
        'Story files must have a default export with a meta object.',
      missingTitle: 'Story meta must include a `title` property.',
    },
    schema: [],
  },
  create(context) {
    const filename = context.filename || context.getFilename();
    if (!filename.endsWith('.stories.tsx') && !filename.endsWith('.stories.ts')) {
      return {};
    }

    let hasDefaultExport = false;
    let metaVariableName = null;
    let metaHasTitle = false;

    return {
      ExportDefaultDeclaration(node) {
        hasDefaultExport = true;
        if (node.declaration.type === 'Identifier') {
          metaVariableName = node.declaration.name;
        }
      },

      VariableDeclarator(node) {
        if (
          node.id.type === 'Identifier' &&
          node.init &&
          node.init.type === 'ObjectExpression'
        ) {
          const hasTitle = node.init.properties.some(
            (prop) =>
              prop.type === 'Property' &&
              prop.key.type === 'Identifier' &&
              prop.key.name === 'title',
          );
          if (hasTitle) {
            metaHasTitle = true;
          }
        }
      },

      'Program:exit'() {
        if (!hasDefaultExport) {
          context.report({
            loc: { line: 1, column: 0 },
            messageId: 'missingDefaultExport',
          });
        }
        if (hasDefaultExport && !metaHasTitle) {
          context.report({
            loc: { line: 1, column: 0 },
            messageId: 'missingTitle',
          });
        }
      },
    };
  },
};
