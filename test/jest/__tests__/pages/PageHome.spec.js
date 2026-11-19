import { mount, createLocalVue } from '@vue/test-utils'
import { qLayoutInjections } from '@quasar/quasar-app-extension-testing-unit-jest'
import * as All from 'quasar'
import PageHome from 'src/pages/PageHome.vue'
import db from 'src/boot/firebase' // mapped to test/jest/mocks/firebase.js

const { Quasar } = All

const components = Object.keys(All).reduce((object, key) => {
  const val = All[key]
  if (val && val.component && val.component.name != null) {
    object[key] = val
  }
  return object
}, {})

const localVue = createLocalVue()
localVue.use(Quasar, { components })

const NOW = new Date('2021-01-26T12:00:00Z').getTime()
const MINUTE = 60 * 1000

function mountPage() {
  return mount(PageHome, {
    localVue,
    // QPage expects to sit inside a QLayout
    provide: qLayoutInjections(),
    stubs: {
      // skip enter/leave animations so items are added/removed straight away
      'transition-group': { render(h) { return h('div', this.$slots.default) } }
    }
  })
}

function qweetButton(wrapper) {
  return wrapper.findAll('button').filter(b => b.text() === 'Qweet').at(0)
}

function qweetItems(wrapper) {
  return wrapper.findAll('.qweet')
}

function iconButton(item, iconName) {
  return item.findAll('button').filter(b => b.find('i').classes().includes(iconName)).at(0)
}

describe('PageHome feed', () => {
  let wrapper

  beforeEach(() => {
    db.__reset()
    jest.spyOn(Date, 'now').mockReturnValue(NOW)
    wrapper = mountPage()
  })

  afterEach(() => {
    wrapper.destroy()
    Date.now.mockRestore()
  })

  async function emit(changes) {
    db.__emit(changes)
    await wrapper.vm.$nextTick()
  }

  describe('posting', () => {
    it('disables the Qweet button while the box is empty', () => {
      expect(qweetButton(wrapper).classes()).toContain('disabled')
      expect(qweetButton(wrapper).attributes('aria-disabled')).toBe('true')
    })

    it('enables the Qweet button once text is typed', async () => {
      await wrapper.find('textarea').setValue('Hello world')
      expect(qweetButton(wrapper).classes()).not.toContain('disabled')
    })

    it('does not post when the box is empty', async () => {
      await qweetButton(wrapper).trigger('click')
      expect(db.add).not.toHaveBeenCalled()
    })

    it('saves a new qweet with the text, current time and not liked, then clears the box', async () => {
      await wrapper.find('textarea').setValue('My first qweet')
      await qweetButton(wrapper).trigger('click')

      expect(db.add).toHaveBeenCalledTimes(1)
      expect(db.add).toHaveBeenCalledWith('qweets', {
        content: 'My first qweet',
        date: NOW,
        liked: false
      })
      expect(wrapper.vm.newQweetContent).toBe('')
      expect(wrapper.find('textarea').element.value).toBe('')
      expect(qweetButton(wrapper).classes()).toContain('disabled')
    })
  })

  describe('liking and deleting', () => {
    beforeEach(async () => {
      await emit([
        { type: 'added', id: 'ID1', data: { content: 'First', date: NOW - 10 * MINUTE, liked: false } },
        { type: 'added', id: 'ID2', data: { content: 'Second', date: NOW - 5 * MINUTE, liked: true } }
      ])
    })

    it('saves liked: true when the heart of an unliked qweet is pressed', async () => {
      const first = qweetItems(wrapper).filter(i => i.text().includes('First')).at(0)
      await iconButton(first, 'fa-heart').trigger('click')

      expect(db.update).toHaveBeenCalledTimes(1)
      expect(db.update).toHaveBeenCalledWith('qweets', 'ID1', { liked: true })
    })

    it('saves liked: false when the heart of a liked qweet is pressed', async () => {
      const second = qweetItems(wrapper).filter(i => i.text().includes('Second')).at(0)
      await iconButton(second, 'fa-heart').trigger('click')

      expect(db.update).toHaveBeenCalledTimes(1)
      expect(db.update).toHaveBeenCalledWith('qweets', 'ID2', { liked: false })
    })

    it('shows a filled pink heart only for liked qweets', () => {
      const [second, first] = qweetItems(wrapper).wrappers
      expect(iconButton(second, 'fa-heart').find('i').classes()).toContain('fas')
      expect(iconButton(second, 'fa-heart').classes()).toContain('text-pink')
      expect(iconButton(first, 'fa-heart').find('i').classes()).toContain('far')
      expect(iconButton(first, 'fa-heart').classes()).toContain('text-grey')
    })

    it('deletes the right qweet when the bin is pressed', async () => {
      const first = qweetItems(wrapper).filter(i => i.text().includes('First')).at(0)
      await iconButton(first, 'fa-trash').trigger('click')

      expect(db.delete).toHaveBeenCalledTimes(1)
      expect(db.delete).toHaveBeenCalledWith('qweets', 'ID1')
    })
  })

  describe('live updates from the database', () => {
    it('listens to the qweets collection once mounted', () => {
      expect(db.__listenerCount()).toBe(1)
    })

    it('shows a newly added qweet at the top of the list', async () => {
      await emit([{ type: 'added', id: 'ID1', data: { content: 'Older', date: NOW - 2 * MINUTE, liked: false } }])
      await emit([{ type: 'added', id: 'ID2', data: { content: 'Newer', date: NOW - MINUTE, liked: false } }])

      const items = qweetItems(wrapper)
      expect(items).toHaveLength(2)
      expect(items.at(0).text()).toContain('Newer')
      expect(items.at(1).text()).toContain('Older')
      expect(wrapper.vm.qweets.map(q => q.id)).toEqual(['ID2', 'ID1'])
    })

    it('updates a changed qweet in place', async () => {
      await emit([
        { type: 'added', id: 'ID1', data: { content: 'One', date: NOW, liked: false } },
        { type: 'added', id: 'ID2', data: { content: 'Two', date: NOW, liked: false } },
        { type: 'added', id: 'ID3', data: { content: 'Three', date: NOW, liked: false } }
      ])
      await emit([{ type: 'modified', id: 'ID2', data: { content: 'Two (edited)', date: NOW, liked: true } }])

      expect(wrapper.vm.qweets.map(q => q.id)).toEqual(['ID3', 'ID2', 'ID1'])
      expect(wrapper.vm.qweets[1]).toEqual({ id: 'ID2', content: 'Two (edited)', date: NOW, liked: true })
      const middle = qweetItems(wrapper).at(1)
      expect(middle.text()).toContain('Two (edited)')
      expect(iconButton(middle, 'fa-heart').classes()).toContain('text-pink')
      expect(qweetItems(wrapper).at(0).text()).toContain('Three')
      expect(qweetItems(wrapper).at(2).text()).toContain('One')
    })

    it('removes a deleted qweet from the list', async () => {
      await emit([
        { type: 'added', id: 'ID1', data: { content: 'Keep me', date: NOW, liked: false } },
        { type: 'added', id: 'ID2', data: { content: 'Remove me', date: NOW, liked: false } }
      ])
      await emit([{ type: 'removed', id: 'ID2', data: { content: 'Remove me', date: NOW, liked: false } }])

      const items = qweetItems(wrapper)
      expect(items).toHaveLength(1)
      expect(items.at(0).text()).toContain('Keep me')
      expect(wrapper.text()).not.toContain('Remove me')
    })
  })

  describe('post times', () => {
    it('shows how long ago a qweet was posted in plain words', async () => {
      // the filter compares against `new Date()`, so pin the clock
      jest.useFakeTimers('modern')
      jest.setSystemTime(NOW)
      try {
        await emit([
          { type: 'added', id: 'ID1', data: { content: 'Old', date: NOW - 5 * MINUTE, liked: false } },
          { type: 'added', id: 'ID2', data: { content: 'Older', date: NOW - 3 * 60 * MINUTE, liked: false } }
        ])
        const items = qweetItems(wrapper)
        expect(items.at(0).text()).toContain('about 3 hours')
        expect(items.at(1).text()).toContain('5 minutes')
      } finally {
        jest.useRealTimers()
      }
    })

    it('formats dates with the relativeDate filter', () => {
      jest.useFakeTimers('modern')
      jest.setSystemTime(NOW)
      try {
        const { relativeDate } = PageHome.filters
        expect(relativeDate(NOW - 5 * MINUTE)).toBe('5 minutes')
        expect(relativeDate(NOW - 2 * 24 * 60 * MINUTE)).toBe('2 days')
      } finally {
        jest.useRealTimers()
      }
    })
  })
})
