// jest.config.js
// Sync object
// eslint-disable-next-line no-undef
module.exports = {
    testEnvironment: "jsdom", //jsdom
    preset: "jest-expo",
    globals: {
      "ts-jest": {
        tsconfig: {
          jsx: "react"
        }
      }
    },
    transform: {
      "^.+\\.js$": "<rootDir>/node_modules/react-native/jest/preprocessor.js",
      "^.+\\.tsx?$": "ts-jest"
    },
    testMatch: [
      "**/?(*.)+(spec|test).ts?(x)"
    ],
    collectCoverageFrom: [
      "**/*.{ts,tsx}",
      "!**/coverage/**",
      "!**/node_modules/**",
      "!**/babel.config.js",
      "!**/jest.setup.js"
    ],
    moduleFileExtensions: [
      "js",
      "ts",
      "tsx"
    ],
    transformIgnorePatterns: [
      "node_modules/(?!(jest-)?@?react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|sentry-expo|native-base|react-router-native)"
    ],
    coverageReporters: [
      "json-summary",
      "text",
      "lcov"
    ],
    setupFiles: [
      './src/__tests__/mocks/asyncStorageMock.js'
    ]
  };