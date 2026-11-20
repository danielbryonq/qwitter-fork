// Manual mock for src/boot/firebase.js
// Provides a chainable Firestore mock so components can be tested without a real Firebase project.

const mockDocRef = {
  id: 'mock-doc-id'
}

const mockUnsubscribe = jest.fn()

const mockCollection = {
  add: jest.fn(() => Promise.resolve(mockDocRef)),
  doc: jest.fn(() => mockDocRef),
  orderBy: jest.fn(() => mockCollection),
  onSnapshot: jest.fn((cb) => {
    // Immediately call with an empty snapshot so mounted() doesn't hang
    cb({ docChanges: () => [] })
    return mockUnsubscribe
  })
}

mockDocRef.delete = jest.fn(() => Promise.resolve())
mockDocRef.update = jest.fn(() => Promise.resolve())

const db = {
  collection: jest.fn(() => mockCollection)
}

export { mockCollection, mockDocRef, mockUnsubscribe }
export default db
