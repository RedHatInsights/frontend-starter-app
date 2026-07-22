/**
 * ESLint Rule: enforce-story-patterns
 *
 * Enforces correct query patterns in Storybook play functions.
 * Configured as error — violations must be fixed, not suppressed.
 *
 * Patterns detected:
 *   - canvasElement.querySelector / canvasElement.querySelectorAll
 *     (use within() + role/text queries instead)
 *   - getBy* / getAllBy* inside waitFor callbacks
 *     (use queryBy* + expect inside waitFor, or findBy* outside it)
 */

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Warn about discouraged patterns in Storybook play functions',
    },
    messages: {
      noCanvasElementQuery:
        'canvasElement.{{method}} is discouraged in play functions. Use within() + role/text queries instead.',
      noGetByInWaitFor:
        '{{method}} inside waitFor throws before retry. Use queryBy* + expect inside waitFor, or findBy* outside it.',
    },
    schema: [],
  },
  create(context) {
    return {
      // canvasElement.querySelector() / canvasElement.querySelectorAll()
      CallExpression(node) {
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.object.type === 'Identifier' &&
          node.callee.object.name === 'canvasElement' &&
          node.callee.property.type === 'Identifier' &&
          (node.callee.property.name === 'querySelector' || node.callee.property.name === 'querySelectorAll')
        ) {
          context.report({
            node,
            messageId: 'noCanvasElementQuery',
            data: { method: node.callee.property.name },
          });
        }
      },

      // getBy* / getAllBy* inside waitFor(() => { ... })
      'CallExpression[callee.name="waitFor"] MemberExpression'(node) {
        if (
          node.property.type === 'Identifier' &&
          /^(getBy|getAllBy)/.test(node.property.name)
        ) {
          context.report({
            node,
            messageId: 'noGetByInWaitFor',
            data: { method: node.property.name },
          });
        }
      },
    };
  },
};
