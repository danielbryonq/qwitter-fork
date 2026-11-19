module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\.js$': 'babel-jest'
  },
  moduleFileExtensions: ['js', 'vue', 'json'],
  snapshotSerializers: ['jest-serializer-vue'],
  testMatch: ['**/tests/unit/**/*.spec.js'],
  moduleNameMapper: {
    // Resolve Quasar's "src/" alias used in imports like `src/boot/firebase`
    '^src/(.*)$': '<rootDir>/src/$1'
  },
  // Prevent Jest from trying to transform firebase/quasar ESM internals
  transformIgnorePatterns: [
    '/node_modules/(?!(quasar|@quasar)/)'
  ]
}
