module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'jsx', 'json', 'vue'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\.jsx?$': 'babel-jest'
  },
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^layouts/(.*)$': '<rootDir>/src/layouts/$1',
    '^pages/(.*)$': '<rootDir>/src/pages/$1',
    '^components/(.*)$': '<rootDir>/src/components/$1',
    '^boot/(.*)$': '<rootDir>/src/boot/$1',
    // Stub CSS/SASS/font imports
    '\\.(css|sass|scss)$': '<rootDir>/tests/__mocks__/styleMock.js',
    '\\.(jpg|jpeg|png|gif|svg|webp|ttf|woff|woff2|eot)$': '<rootDir>/tests/__mocks__/fileMock.js'
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: [
    '**/tests/**/*.spec.js',
    '**/tests/**/*.test.js'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,vue}',
    '!src/index.template.html'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html']
}
