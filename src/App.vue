<template>
  <div id="app">
    <NavBar class="fixed-navBar"></NavBar>
    <div class="right-side">
      <HeadBar></HeadBar>
      <router-view/>
    </div>
  </div>
</template>

<script>
import NavBar from './components/global/navBar'
import HeadBar from './components/global/headBar'

export default {
  name: 'app',
  components: {
    NavBar,
    HeadBar
  }
}
</script>

<style lang="sass">
</style>>
