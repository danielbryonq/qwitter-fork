const esModules = ['quasar/lang', 'lodash-es'].join('|')

module.exports = {
  globals: {
    __DEV__: true,
    // TODO: Remove if resolved natively https://github.com/vuejs/vue-jest/issues/175
    'vue-jest': {
      pug: { doctype: 'html' }
    }
  },
  setupFilesAfterEnv: ['<rootDir>/test/jest/jest.setup.js'],
  collectCoverage: false,
  coverageDirectory: '<rootDir>/test/jest/coverage',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.vue',
    '<rootDir>/src/**/*.js',
    '<rootDir>/src/**/*.jsx'
  ],
  coveragePathIgnorePatterns: ['/node_modules/', '.d.ts$'],
  testMatch: [
    '<rootDir>/test/jest/__tests__/**/*.(spec|test).js',
    '<rootDir>/src/**/*.jest.(spec|test).js'
  ],
  moduleFileExtensions: ['vue', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    // The real Firebase boot file is never loaded in tests: every import of
    // it gets the in-memory stand-in from test/jest/mocks instead.
    '^src/boot/firebase$': '<rootDir>/test/jest/mocks/firebase.js',
    '^boot/firebase$': '<rootDir>/test/jest/mocks/firebase.js',
    '^vue$': 'vue/dist/vue.common.js',
    '^test-utils$': '@vue/test-utils/dist/vue-test-utils.js',
    '^quasar$': 'quasar/dist/quasar.common.js',
    '^~/(.*)$': '<rootDir>/$1',
    '^src/(.*)$': '<rootDir>/src/$1',
    '.*css$': '@quasar/quasar-app-extension-testing-unit-jest/dist/stub.css'
  },
  transform: {
    '.*\\.vue$': 'vue-jest',
    '.*\\.js$': 'babel-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub'
  },
  transformIgnorePatterns: [`node_modules/(?!(${esModules}))`],
  snapshotSerializers: ['jest-serializer-vue']
}
