const transformIgnorePatterns = ['node_modules/(?!(uuid)/)'];

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  coverageDirectory: './coverage/',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js', '!src/**/stories/*'],
  roots: ['<rootDir>/src/'],
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
  },
  transformIgnorePatterns,
  setupFilesAfterEnv: ['<rootDir>/config/jest.setup.js'],
  transform: {
    '^.+\\.(ts|js)x?$': [
      '@swc/jest',
      {
        $schema: 'http://json.schemastore.org/swcrc',
        jsc: {
          experimental: {
            plugins: [['jest_workaround', {}]],
          },
          parser: {
            jsx: true,
            syntax: 'typescript',
            tsx: true,
          },
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
      },
    ],
  },
};
