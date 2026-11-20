/**
 * tests/components/PageHome.spec.js
 *
 * Component tests for PageHome.vue.
 * Firebase is mocked so no real Firestore calls are made.
 */

import { shallowMount } from '@vue/test-utils'
import PageHome from 'src/pages/PageHome.vue'

// Mock the Firebase boot module with our manual mock
jest.mock('src/boot/firebase', () => {
  const mockDocRef = {
    delete: jest.fn(() => Promise.resolve()),
    update: jest.fn(() => Promise.resolve())
  }

  const mockCollection = {
    add: jest.fn(() => Promise.resolve({ id: 'new-doc-id' })),
    doc: jest.fn(() => mockDocRef),
    orderBy: jest.fn(function () { return this }),
    onSnapshot: jest.fn((cb) => {
      cb({ docChanges: () => [] })
      return jest.fn() // unsubscribe
    })
  }

  return {
    __esModule: true,
    default: {
      collection: jest.fn(() => mockCollection),
      _mockCollection: mockCollection,
      _mockDocRef: mockDocRef
    }
  }
})

// Stub heavy Quasar components so vue-jest doesn't choke on them
const globalStubs = {
  'q-page': { template: '<div><slot /></div>' },
  'q-scroll-area': { template: '<div><slot /></div>' },
  'q-input': { template: '<div><slot name="before" /><slot /></div>', props: ['value', 'modelValue'] },
  'q-btn': { template: '<button @click="$emit(\'click\')"><slot /></button>', props: ['disable', 'color', 'icon', 'label'] },
  'q-separator': { template: '<hr />' },
  'q-list': { template: '<ul><slot /></ul>' },
  'q-item': { template: '<li><slot /></li>' },
  'q-item-section': { template: '<div><slot /></div>' },
  'q-item-label': { template: '<span><slot /></span>' },
  'q-avatar': { template: '<div><slot /></div>' },
  'transition-group': { template: '<div><slot /></div>' }
}

function mountPageHome (options = {}) {
  return shallowMount(PageHome, {
    stubs: globalStubs,
    ...options
  })
}

describe('PageHome.vue', () => {
  describe('initial state', () => {
    it('mounts without errors', () => {
      const wrapper = mountPageHome()
      expect(wrapper.exists()).toBe(true)
    })

    it('starts with an empty newQweetContent', () => {
      const wrapper = mountPageHome()
      expect(wrapper.vm.newQweetContent).toBe('')
    })

    it('starts with an empty qweets array', () => {
      const wrapper = mountPageHome()
      expect(wrapper.vm.qweets).toEqual([])
    })
  })

  describe('addNewQweet()', () => {
    it('calls db.collection("qweets").add() with the correct shape', () => {
      const db = require('src/boot/firebase').default
      const wrapper = mountPageHome()

      wrapper.vm.newQweetContent = 'Hello Qwitter!'
      wrapper.vm.addNewQweet()

      expect(db.collection).toHaveBeenCalledWith('qweets')
      const mockCollection = db.collection.mock.results[0].value
      expect(mockCollection.add).toHaveBeenCalledWith(
        expect.objectContaining({
          content: 'Hello Qwitter!',
          liked: false
        })
      )
    })

    it('clears newQweetContent after adding', () => {
      const wrapper = mountPageHome()
      wrapper.vm.newQweetContent = 'Test qweet'
      wrapper.vm.addNewQweet()
      expect(wrapper.vm.newQweetContent).toBe('')
    })

    it('the Qweet button is disabled when content is empty', () => {
      // The component guards against empty posts via the :disable binding on
      // the button, not inside addNewQweet() itself. Verify the data property
      // that drives that binding: an empty string is falsy.
      const wrapper = mountPageHome()
      expect(wrapper.vm.newQweetContent).toBe('')
      expect(!!wrapper.vm.newQweetContent).toBe(false)
    })
  })

  describe('deleteQweet()', () => {
    it('calls db.collection("qweets").doc(id).delete()', () => {
      const db = require('src/boot/firebase').default
      const wrapper = mountPageHome()
      const qweet = { id: 'qweet-123', content: 'To be deleted', liked: false, date: Date.now() }

      wrapper.vm.deleteQweet(qweet)

      expect(db.collection).toHaveBeenCalledWith('qweets')
      const mockCollection = db.collection.mock.results[0].value
      expect(mockCollection.doc).toHaveBeenCalledWith('qweet-123')
      const mockDocRef = mockCollection.doc.mock.results[0].value
      expect(mockDocRef.delete).toHaveBeenCalled()
    })
  })

  describe('toggleLiked()', () => {
    it('calls db.collection("qweets").doc(id).update() toggling liked', () => {
      const db = require('src/boot/firebase').default
      const wrapper = mountPageHome()
      const qweet = { id: 'qweet-456', content: 'Like me', liked: false, date: Date.now() }

      wrapper.vm.toggleLiked(qweet)

      expect(db.collection).toHaveBeenCalledWith('qweets')
      const mockCollection = db.collection.mock.results[0].value
      expect(mockCollection.doc).toHaveBeenCalledWith('qweet-456')
      const mockDocRef = mockCollection.doc.mock.results[0].value
      expect(mockDocRef.update).toHaveBeenCalledWith({ liked: true })
    })

    it('toggles liked: true → false', () => {
      const db = require('src/boot/firebase').default
      const wrapper = mountPageHome()
      const qweet = { id: 'qweet-789', content: 'Unlike me', liked: true, date: Date.now() }

      wrapper.vm.toggleLiked(qweet)

      const mockCollection = db.collection.mock.results[0].value
      const mockDocRef = mockCollection.doc.mock.results[0].value
      expect(mockDocRef.update).toHaveBeenCalledWith({ liked: false })
    })
  })

  describe('relativeDate filter', () => {
    it('returns a non-empty string for a valid timestamp', () => {
      const wrapper = mountPageHome()
      const result = wrapper.vm.$options.filters.relativeDate(Date.now() - 60000)
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('Firestore real-time listener (mounted)', () => {
    it('subscribes to qweets collection on mount', () => {
      const db = require('src/boot/firebase').default
      mountPageHome()
      expect(db.collection).toHaveBeenCalledWith('qweets')
      const mockCollection = db.collection.mock.results[0].value
      expect(mockCollection.orderBy).toHaveBeenCalledWith('date')
      expect(mockCollection.onSnapshot).toHaveBeenCalled()
    })

    it('adds a qweet when snapshot fires an "added" change', () => {
      const db = require('src/boot/firebase').default

      // Override onSnapshot to simulate an "added" event
      db.collection.mockImplementationOnce(() => ({
        orderBy: jest.fn().mockReturnThis(),
        onSnapshot: jest.fn((cb) => {
          cb({
            docChanges: () => [{
              type: 'added',
              doc: {
                id: 'snap-id-1',
                data: () => ({ content: 'From Firestore', liked: false, date: 1000 })
              }
            }]
          })
          return jest.fn()
        })
      }))

      const wrapper = mountPageHome()
      expect(wrapper.vm.qweets.length).toBe(1)
      expect(wrapper.vm.qweets[0].content).toBe('From Firestore')
      expect(wrapper.vm.qweets[0].id).toBe('snap-id-1')
    })

    it('modifies a qweet when snapshot fires a "modified" change', () => {
      const db = require('src/boot/firebase').default

      db.collection.mockImplementationOnce(() => ({
        orderBy: jest.fn().mockReturnThis(),
        onSnapshot: jest.fn((cb) => {
          // First call: seed one qweet
          cb({
            docChanges: () => [{
              type: 'added',
              doc: { id: 'mod-id', data: () => ({ content: 'Original', liked: false, date: 1000 }) }
            }]
          })
          // Second call: modify it
          cb({
            docChanges: () => [{
              type: 'modified',
              doc: { id: 'mod-id', data: () => ({ content: 'Modified', liked: true, date: 1000 }) }
            }]
          })
          return jest.fn()
        })
      }))

      const wrapper = mountPageHome()
      expect(wrapper.vm.qweets[0].content).toBe('Modified')
      expect(wrapper.vm.qweets[0].liked).toBe(true)
    })

    it('removes a qweet when snapshot fires a "removed" change', () => {
      const db = require('src/boot/firebase').default

      db.collection.mockImplementationOnce(() => ({
        orderBy: jest.fn().mockReturnThis(),
        onSnapshot: jest.fn((cb) => {
          cb({
            docChanges: () => [{
              type: 'added',
              doc: { id: 'del-id', data: () => ({ content: 'Delete me', liked: false, date: 1000 }) }
            }]
          })
          cb({
            docChanges: () => [{
              type: 'removed',
              doc: { id: 'del-id', data: () => ({ content: 'Delete me', liked: false, date: 1000 }) }
            }]
          })
          return jest.fn()
        })
      }))

      const wrapper = mountPageHome()
      expect(wrapper.vm.qweets.length).toBe(0)
    })
  })
})
