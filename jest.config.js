const transformIgnorePatterns = ['node_modules/(?!(uuid)/)'];

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest/presets/js-with-babel-esm',
  testEnvironment: 'jsdom',
  coverageDirectory: './coverage/',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js', '!src/**/stories/*'],
  roots: ['<rootDir>/src/'],
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
  },
  transformIgnorePatterns,
  setupFilesAfterEnv: ['<rootDir>/config/jest.setup.ts'],
};
