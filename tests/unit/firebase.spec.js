/**
 * tests/unit/firebase.spec.js
 *
 * Smoke-tests for the Firebase/Firestore boot module.
 * We mock the firebase package so no real network calls are made.
 */

jest.mock('firebase/app', () => {
  const firestoreMock = {
    collection: jest.fn(() => firestoreMock),
    doc: jest.fn(() => firestoreMock),
    add: jest.fn(() => Promise.resolve({ id: 'new-id' })),
    delete: jest.fn(() => Promise.resolve()),
    update: jest.fn(() => Promise.resolve()),
    orderBy: jest.fn(() => firestoreMock),
    onSnapshot: jest.fn(() => jest.fn())
  }

  const firebaseAppMock = {
    initializeApp: jest.fn(),
    firestore: jest.fn(() => firestoreMock),
    apps: []
  }

  return firebaseAppMock
})

jest.mock('firebase/firestore', () => {})

describe('Firebase boot module', () => {
  let db

  beforeEach(() => {
    jest.resetModules()
  })

  it('exports a Firestore db instance as the default export', () => {
    const firebase = require('firebase/app')
    db = require('src/boot/firebase').default
    expect(firebase.initializeApp).toHaveBeenCalledTimes(1)
    expect(firebase.firestore).toHaveBeenCalledTimes(1)
    expect(db).toBeDefined()
  })

  it('db instance exposes a collection method', () => {
    db = require('src/boot/firebase').default
    expect(typeof db.collection).toBe('function')
  })

  it('calling db.collection returns a chainable object', () => {
    db = require('src/boot/firebase').default
    const ref = db.collection('qweets')
    expect(ref).toBeDefined()
  })
})
