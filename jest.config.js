module.exports = {
  preset: 'jest-expo',
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native' +
      '|@react-native' +
      '|react-native-paper' +
      '|react-native-vector-icons' +
      '|expo(nent)?' +
      '|@expo(nent)?/.*' +
      '|expo-.*' +
      '|@expo/.*' +
      '|@unimodules/.*' +
      '|unimodules|@unimodules/.*' +
      '|sentry-expo' +
      '|native-base' +
      ')/)'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  },
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!**/node_modules/**', '!**/dist/**'],
  coverageThreshold: {
    global: { branches: 70, functions: 70, lines: 80, statements: 80 }
  }
};
