/**
 * In-memory stand-in for the Firestore `db` exported by src/boot/firebase.js.
 *
 * jest.config.js maps every import of `src/boot/firebase` to this file, so
 * tests never initialise Firebase or touch real data.
 *
 * It only implements what the app uses:
 *   db.collection(name).add(data)
 *   db.collection(name).doc(id).update(data)
 *   db.collection(name).doc(id).delete()
 *   db.collection(name).orderBy(field).onSnapshot(callback)
 *
 * Tests can inspect the calls (db.add, db.update, db.delete are jest.fn()s
 * that receive the collection name and doc id first) and push live updates
 * with db.__emit([{ type: 'added' | 'modified' | 'removed', id, data }]).
 */

let listeners = []

const db = {
  add: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),

  collection(collectionName) {
    return {
      add(data) {
        db.add(collectionName, data)
        return Promise.resolve({ id: 'new-id' })
      },
      doc(id) {
        return {
          update(data) {
            db.update(collectionName, id, data)
            return Promise.resolve()
          },
          delete() {
            db.delete(collectionName, id)
            return Promise.resolve()
          }
        }
      },
      orderBy() {
        return {
          onSnapshot(callback) {
            const listener = { collectionName, callback }
            listeners.push(listener)
            return () => {
              listeners = listeners.filter(l => l !== listener)
            }
          }
        }
      }
    }
  },

  /**
   * Send a snapshot containing the given changes to every listener of the
   * collection, the way Firestore's onSnapshot does.
   */
  __emit(changes, collectionName = 'qweets') {
    const docChanges = changes.map(({ type, id, data }) => ({
      type,
      doc: {
        id,
        data: () => ({ ...data })
      }
    }))
    listeners
      .filter(l => l.collectionName === collectionName)
      .forEach(l => l.callback({ docChanges: () => docChanges }))
  },

  __listenerCount() {
    return listeners.length
  },

  __reset() {
    listeners = []
    db.add.mockReset()
    db.update.mockReset()
    db.delete.mockReset()
  }
}

export default db
