/* eslint-disable @typescript-eslint/no-require-imports */
const { defineConfig } = require('eslint/config');
const fecPlugin = require('@redhat-cloud-services/eslint-config-redhat-cloud-services');
const tsParser = require('@typescript-eslint/parser');
const tseslint = require('typescript-eslint');
const enforceStoryPatterns = require('./eslint-rules/enforce-story-patterns');

const localRulesPlugin = {
  plugins: {
    'local-rules': {
      rules: {
        'enforce-story-patterns': enforceStoryPatterns,
      },
    },
  },
};

module.exports = defineConfig(
  fecPlugin,
  {
    languageOptions: {
      globals: {
        insights: 'readonly',
      },
    },
    ignores: ['node_modules/*', 'dist/*'],
    rules: {
      requireConfigFile: 'off',
      'sort-imports': [
        'error',
        {
          ignoreDeclarationSort: true,
        },
      ],
    },
  },
  tseslint.configs.recommended,
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
    },
  },
  localRulesPlugin,
  {
    files: ['src/**/*.stories.ts', 'src/**/*.stories.tsx'],
    rules: {
      'local-rules/enforce-story-patterns': 'error',
    },
  },
);
