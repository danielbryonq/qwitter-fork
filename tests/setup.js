import Vue from 'vue'
import VueRouter from 'vue-router'

// Install Vue Router globally for all tests
Vue.use(VueRouter)

// Suppress noisy Vue warnings in test output (e.g. unknown Quasar components)
Vue.config.silent = true
Vue.config.warnHandler = () => {}

// Global beforeEach: clear all mocks between tests so state doesn't leak
beforeEach(() => {
  jest.clearAllMocks()
})
