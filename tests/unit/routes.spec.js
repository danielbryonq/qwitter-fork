/**
 * Unit tests for src/router/routes.js
 *
 * Tests verify the static route configuration without spinning up Vue Router.
 */

import routes from 'src/router/routes'

describe('routes configuration', () => {
  it('exports an array', () => {
    expect(Array.isArray(routes)).toBe(true)
  })

  it('has exactly two top-level route entries', () => {
    // One main layout route + one wildcard 404 route
    expect(routes).toHaveLength(2)
  })

  describe('main layout route ("/")', () => {
    const mainRoute = () => routes.find(r => r.path === '/')

    it('exists', () => {
      expect(mainRoute()).toBeDefined()
    })

    it('has a component loader function', () => {
      expect(typeof mainRoute().component).toBe('function')
    })

    it('has two children (Home and About)', () => {
      expect(mainRoute().children).toHaveLength(2)
    })

    it('contains a Home child at path ""', () => {
      const home = mainRoute().children.find(c => c.name === 'Home')
      expect(home).toBeDefined()
      expect(home.path).toBe('')
      expect(typeof home.component).toBe('function')
    })

    it('contains an About child at path "/about"', () => {
      const about = mainRoute().children.find(c => c.name === 'About')
      expect(about).toBeDefined()
      expect(about.path).toBe('/about')
      expect(typeof about.component).toBe('function')
    })
  })

  describe('wildcard / 404 route ("*")', () => {
    const notFoundRoute = () => routes.find(r => r.path === '*')

    it('exists as the last route', () => {
      expect(routes[routes.length - 1].path).toBe('*')
    })

    it('has a component loader function', () => {
      expect(typeof notFoundRoute().component).toBe('function')
    })

    it('does not have named children', () => {
      expect(notFoundRoute().children).toBeUndefined()
    })
  })
})
