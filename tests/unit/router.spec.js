/**
 * tests/unit/router.spec.js
 *
 * Tests for the Vue Router configuration (routes.js + index.js).
 */

import VueRouter from 'vue-router'
import routes from 'src/router/routes'
import createRouter from 'src/router/index'

describe('routes.js', () => {
  it('exports an array of route definitions', () => {
    expect(Array.isArray(routes)).toBe(true)
    expect(routes.length).toBeGreaterThan(0)
  })

  it('defines a root path "/"', () => {
    const root = routes.find(r => r.path === '/')
    expect(root).toBeDefined()
  })

  it('root route has children including the Home page', () => {
    const root = routes.find(r => r.path === '/')
    expect(Array.isArray(root.children)).toBe(true)
    const home = root.children.find(c => c.name === 'Home')
    expect(home).toBeDefined()
  })

  it('root route has an About child at /about', () => {
    const root = routes.find(r => r.path === '/')
    const about = root.children.find(c => c.path === '/about' && c.name === 'About')
    expect(about).toBeDefined()
  })

  it('defines a wildcard "*" catch-all route as the last route', () => {
    const last = routes[routes.length - 1]
    expect(last.path).toBe('*')
  })

  it('all top-level routes have a component loader or component', () => {
    routes.forEach(route => {
      expect(route.component).toBeDefined()
    })
  })
})

describe('router/index.js factory', () => {
  it('is a function that returns a VueRouter instance', () => {
    expect(typeof createRouter).toBe('function')
    const router = createRouter()
    expect(router).toBeInstanceOf(VueRouter)
  })

  it('router contains all defined routes', () => {
    const router = createRouter()
    // VueRouter stores matcher options; we can verify via the options
    expect(router.options.routes).toEqual(routes)
  })

  it('scrollBehavior returns { x: 0, y: 0 }', () => {
    const router = createRouter()
    const result = router.options.scrollBehavior()
    expect(result).toEqual({ x: 0, y: 0 })
  })
})
