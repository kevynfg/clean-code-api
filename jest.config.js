/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,
  coverageDirectory: "coverage",
  collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
  roots: ["<rootDir>/src"],
  transform: {
    ".+\\.ts": "ts-jest",
  },
  preset: "@shelf/jest-mongodb",
  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",
};
