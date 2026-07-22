/**
 * ESLint Rule: no-direct-user-type
 *
 * Errors when a story/test file calls `user.type()` directly instead of using
 * the `clearAndType` helper from `src/test-utils/interactionHelpers.ts`.
 *
 * Direct `user.type()` is flaky in data-driven-forms because re-renders can
 * steal focus mid-typing. `clearAndType` clicks the input first to guarantee
 * focus, then clears+types atomically.
 *
 * The only allowed call site is inside `clearAndType` itself.
 */

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ban direct user.type() calls in stories — use clearAndType helper instead',
    },
    messages: {
      noDirectType:
        'Direct user.type() is banned in stories and test helpers. Use clearAndType(user, input, text) from shared/interactionHelpers instead — it ensures focus before typing.',
    },
    schema: [],
  },
  create(context) {
    const filename = context.filename || context.getFilename();
    const isInteractionHelpers = filename.includes('interactionHelpers');
    if (isInteractionHelpers) return {};

    return {
      'CallExpression[callee.type="MemberExpression"][callee.property.name="type"]'(node) {
        const obj = node.callee.object;
        if (obj.type === 'Identifier' && obj.name === 'user') {
          context.report({ node, messageId: 'noDirectType' });
        }
      },
    };
  },
};
