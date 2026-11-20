<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { initTheme } from './store/theme'

export default {
  name: 'App',

  mounted () {
    initTheme()
  }
}
</script>
