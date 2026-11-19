/**
 * Unit tests for PageHome.vue
 *
 * The component uses Firebase Firestore via `import db from 'src/boot/firebase'`
 * where `db` is a Firestore-like instance with a `.collection()` method.
 *
 * We mock the firebase module completely.  The factory function passed to
 * jest.mock() is hoisted before ANY variable initialization, so we cannot
 * reference module-level variables from it.  Instead, the factory creates
 * its own jest.fn() stubs internally, and we retrieve them via
 * jest.requireMock() after the hoisting is complete.
 */

jest.mock('src/boot/firebase', () => {
  // All jest.fn() calls here are inside the factory, so they always exist.
  const mockOnSnapshot = jest.fn(() => () => {})
  const mockOrderBy    = jest.fn(() => ({ onSnapshot: mockOnSnapshot }))
  const mockAdd        = jest.fn(() => Promise.resolve({ id: 'new-id' }))
  const mockDelete     = jest.fn(() => Promise.resolve())
  const mockUpdate     = jest.fn(() => Promise.resolve())
  const mockDoc        = jest.fn(() => ({ delete: mockDelete, update: mockUpdate }))
  const mockCollection = jest.fn(() => ({ add: mockAdd, orderBy: mockOrderBy, doc: mockDoc }))

  return {
    __esModule: true,
    default: { collection: mockCollection },
    // Expose stubs so tests can reach them via jest.requireMock()
    _mocks: { mockCollection, mockOrderBy, mockOnSnapshot, mockAdd, mockDelete, mockUpdate, mockDoc }
  }
})

// ─── Vue / component imports ──────────────────────────────────────────────────
import { shallowMount, createLocalVue } from '@vue/test-utils'
import PageHome from 'src/pages/PageHome.vue'
import { formatDistance } from 'date-fns'

const localVue = createLocalVue()

// Pull the mock stubs out so tests can inspect and reconfigure them.
const {
  mockCollection,
  mockOrderBy,
  mockOnSnapshot,
  mockAdd,
  mockDelete,
  mockUpdate,
  mockDoc
} = jest.requireMock('src/boot/firebase')._mocks

// ─── Shared component stubs ───────────────────────────────────────────────────
const STUBS = {
  QPage:           { template: '<div><slot /></div>' },
  QScrollArea:     { template: '<div><slot /></div>' },
  QInput:          { template: '<div />' },
  QBtn:            { template: '<button @click="$emit(\'click\')" />' },
  QSeparator:      { template: '<hr />' },
  QList:           { template: '<div><slot /></div>' },
  QItem:           { template: '<div class="qweet"><slot /></div>' },
  QItemSection:    { template: '<div><slot /></div>' },
  QItemLabel:      { template: '<div><slot /></div>' },
  QAvatar:         { template: '<div><slot /></div>' },
  TransitionGroup: { template: '<div><slot /></div>' }
}

function mountComponent () {
  return shallowMount(PageHome, { localVue, stubs: STUBS })
}

// ─── relativeDate filter ──────────────────────────────────────────────────────

describe('relativeDate filter', () => {
  const { relativeDate } = PageHome.filters

  it('returns a non-empty string for a past timestamp', () => {
    const result = relativeDate(Date.now() - 60_000)
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('matches date-fns formatDistance output', () => {
    const ts = Date.now() - 2 * 3600_000
    expect(relativeDate(ts)).toBe(formatDistance(ts, new Date()))
  })

  it('handles a very recent timestamp (< 1 minute)', () => {
    expect(relativeDate(Date.now() - 500)).toMatch(/less than a minute/i)
  })

  it('handles a timestamp one day ago', () => {
    expect(relativeDate(Date.now() - 24 * 3600_000)).toMatch(/1 day/i)
  })
})

// ─── addNewQweet() ────────────────────────────────────────────────────────────

describe('addNewQweet()', () => {
  beforeEach(() => jest.clearAllMocks())

  it('calls db.collection("qweets").add() with the right shape', () => {
    const wrapper = mountComponent()
    wrapper.vm.newQweetContent = 'Hello world'
    wrapper.vm.addNewQweet()

    expect(mockCollection).toHaveBeenCalledWith('qweets')
    expect(mockAdd).toHaveBeenCalledTimes(1)
    const [payload] = mockAdd.mock.calls[0]
    expect(payload.content).toBe('Hello world')
    expect(typeof payload.date).toBe('number')
    expect(payload.liked).toBe(false)
  })

  it('resets newQweetContent to an empty string after submission', () => {
    const wrapper = mountComponent()
    wrapper.vm.newQweetContent = 'Some tweet'
    wrapper.vm.addNewQweet()
    expect(wrapper.vm.newQweetContent).toBe('')
  })

  it('stamps the qweet with a date close to Date.now()', () => {
    const wrapper = mountComponent()
    const before = Date.now()
    wrapper.vm.newQweetContent = 'timestamp test'
    wrapper.vm.addNewQweet()
    const after = Date.now()

    const { date } = mockAdd.mock.calls[0][0]
    expect(date).toBeGreaterThanOrEqual(before)
    expect(date).toBeLessThanOrEqual(after)
  })
})

// ─── deleteQweet() ────────────────────────────────────────────────────────────

describe('deleteQweet()', () => {
  beforeEach(() => jest.clearAllMocks())

  it('calls db.collection("qweets").doc(id).delete()', () => {
    const wrapper = mountComponent()
    wrapper.vm.deleteQweet({ id: 'qweet-42', content: 'bye', date: Date.now(), liked: false })

    expect(mockCollection).toHaveBeenCalledWith('qweets')
    expect(mockDoc).toHaveBeenCalledWith('qweet-42')
    expect(mockDelete).toHaveBeenCalledTimes(1)
  })
})

// ─── toggleLiked() ───────────────────────────────────────────────────────────

describe('toggleLiked()', () => {
  beforeEach(() => jest.clearAllMocks())

  it('calls update({ liked: true }) when qweet.liked is false', () => {
    const wrapper = mountComponent()
    wrapper.vm.toggleLiked({ id: 'q1', liked: false })
    expect(mockDoc).toHaveBeenCalledWith('q1')
    expect(mockUpdate).toHaveBeenCalledWith({ liked: true })
  })

  it('calls update({ liked: false }) when qweet.liked is true', () => {
    const wrapper = mountComponent()
    wrapper.vm.toggleLiked({ id: 'q2', liked: true })
    expect(mockDoc).toHaveBeenCalledWith('q2')
    expect(mockUpdate).toHaveBeenCalledWith({ liked: false })
  })
})

// ─── Firestore onSnapshot listener (mounted hook) ────────────────────────────

describe('Firestore onSnapshot listener', () => {
  function makeChange (type, id, data) {
    return { type, doc: { id, data: () => ({ ...data }) } }
  }

  /**
   * Override `mockOnSnapshot` to fire immediately with the given changes, then
   * mount the component (which triggers `mounted()` and the Firestore listener).
   */
  function mountWithChanges (docChanges) {
    jest.clearAllMocks()
    mockOnSnapshot.mockImplementationOnce(cb => {
      cb({ docChanges: () => docChanges })
      return () => {}
    })
    return mountComponent()
  }

  it('prepends added qweets to the front of the list', () => {
    const wrapper = mountWithChanges([
      makeChange('added', 'id-1', { content: 'first',  date: 1000, liked: false }),
      makeChange('added', 'id-2', { content: 'second', date: 2000, liked: false })
    ])
    // id-2 is unshifted last → it ends up at index 0
    const ids = wrapper.vm.qweets.map(q => q.id)
    expect(ids[0]).toBe('id-2')
    expect(ids).toContain('id-1')
  })

  it('assigns the Firestore document id to each added qweet', () => {
    const wrapper = mountWithChanges([
      makeChange('added', 'doc-abc', { content: 'test', date: 999, liked: false })
    ])
    expect(wrapper.vm.qweets[0].id).toBe('doc-abc')
  })

  it('updates the correct qweet in-place on a "modified" event', () => {
    const wrapper = mountWithChanges([
      makeChange('added', 'id-x', { content: 'original', date: 100, liked: false })
    ])
    // Replay a modified event via the already-captured callback
    const [snapshotCb] = mockOnSnapshot.mock.calls[0]
    snapshotCb({ docChanges: () => [
      makeChange('modified', 'id-x', { content: 'updated', date: 100, liked: true })
    ]})

    expect(wrapper.vm.qweets[0].content).toBe('updated')
    expect(wrapper.vm.qweets[0].liked).toBe(true)
  })

  it('removes the correct qweet on a "removed" event', () => {
    const wrapper = mountWithChanges([
      makeChange('added', 'id-keep', { content: 'keep me',   date: 1, liked: false }),
      makeChange('added', 'id-del',  { content: 'delete me', date: 2, liked: false })
    ])
    expect(wrapper.vm.qweets).toHaveLength(2)

    const [snapshotCb] = mockOnSnapshot.mock.calls[0]
    snapshotCb({ docChanges: () => [
      makeChange('removed', 'id-del', { content: 'delete me', date: 2, liked: false })
    ]})

    expect(wrapper.vm.qweets).toHaveLength(1)
    expect(wrapper.vm.qweets[0].id).toBe('id-keep')
  })
})
