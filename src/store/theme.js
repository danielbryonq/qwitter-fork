/**
 * Simple reactive theme store using Vue.observable.
 * Persists the user's theme preference to localStorage.
 */
import Vue from 'vue'

const STORAGE_KEY = 'qwitter-theme'

const state = Vue.observable({
  isDark: false
})

function applyTheme (isDark) {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
}

export function initTheme () {
  const saved = localStorage.getItem(STORAGE_KEY)
  // If a preference has been saved use it, otherwise default to light
  const isDark = saved === 'dark'
  state.isDark = isDark
  applyTheme(isDark)
}

export function toggleTheme () {
  state.isDark = !state.isDark
  applyTheme(state.isDark)
  localStorage.setItem(STORAGE_KEY, state.isDark ? 'dark' : 'light')
}

export function setTheme (isDark) {
  state.isDark = isDark
  applyTheme(isDark)
  localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light')
}

export default state
