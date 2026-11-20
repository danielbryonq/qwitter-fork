# Testing Guide

This project uses [Jest](https://jestjs.io/) with [Vue Test Utils](https://v1.test-utils.vuejs.org/) for unit and component testing.

## Running Tests

```bash
# Run all tests once
npm test

# Run in watch mode (re-runs on file changes)
npm run test:watch

# Run with coverage report
npm run test:coverage
```

## Directory Structure

```
tests/
├── __mocks__/
│   ├── firebase.js      # Manual mock for src/boot/firebase.js
│   ├── fileMock.js      # Stubs binary file imports (images, fonts)
│   └── styleMock.js     # Stubs CSS/SASS imports
├── components/
│   └── PageHome.spec.js # Component tests for PageHome.vue
├── unit/
│   ├── firebase.spec.js # Unit tests for the Firebase boot module
│   └── router.spec.js   # Unit tests for Vue Router setup
├── setup.js             # Global test setup (Vue plugins, mock resets)
└── README.md            # This file
```

## Writing New Tests

### Component Tests

Use `shallowMount` from `@vue/test-utils` to mount Vue components. Stub Quasar
components that are not relevant to the test:

```js
import { shallowMount } from '@vue/test-utils'
import MyComponent from 'src/components/MyComponent.vue'

it('renders correctly', () => {
  const wrapper = shallowMount(MyComponent, {
    stubs: { 'q-btn': true }
  })
  expect(wrapper.exists()).toBe(true)
})
```

### Mocking Firebase

Firebase is mocked in every test via an inline `jest.mock()` call or by importing
from `tests/__mocks__/firebase.js`. Never import the real `src/boot/firebase.js`
in tests without mocking it first — there is no real Firebase project connected.

```js
jest.mock('src/boot/firebase', () => ({
  __esModule: true,
  default: {
    collection: jest.fn(() => ({
      add: jest.fn(() => Promise.resolve({ id: 'test-id' })),
      // ...other methods
    }))
  }
}))
```

### Path Aliases

The Jest config maps Quasar's webpack aliases so you can use them in tests:

| Alias | Resolves to |
|---|---|
| `src/` | `<root>/src/` |
| `layouts/` | `<root>/src/layouts/` |
| `pages/` | `<root>/src/pages/` |
| `components/` | `<root>/src/components/` |
| `boot/` | `<root>/src/boot/` |

### Coverage

Coverage is collected from all files under `src/`. After running
`npm run test:coverage`, open `coverage/index.html` in your browser for a
detailed line-by-line report.

## FAQ

**Q: Why are Quasar components stubbed?**  
Quasar registers its components via a Vue plugin that requires the full Quasar
boot process. In unit tests we stub them to keep tests fast and focused on
component logic rather than Quasar internals.

**Q: Should I use a Firestore emulator for integration tests?**  
For pure unit/component tests, the Jest mock is sufficient. If you later add
integration tests that exercise real Firestore behaviour, consider the
[Firebase Local Emulator Suite](https://firebase.google.com/docs/emulator-suite).
