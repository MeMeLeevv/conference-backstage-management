<template>
  <div id="app">
      <NavBar class="navBar"></NavBar>
    <div class="right-side">
      <HeadBar class="headBar" manager="ManagerME"></HeadBar>
        <router-view class="content" />
    </div>
  </div>
</template>

<script>
import NavBar from './components/global/navBar'
import HeadBar from './components/global/headBar'

export default {
  name: 'app',
  created () {
    // this.getDevice()
  },
  methods: {
    getDevice () {
      window.deviceWidth = document.body.clientWidth
      window.deviceHeight = document.body.clientHeight
    }
  },
  components: {
    NavBar,
    HeadBar
  }
}
</script>

<style lang="sass">
*
  box-sizing: border-box
body
  height: 100vh
  background: #f2f2f2
a
  text-decoration: none
  color: black
span
  display: inline-block
.clearify::after
  content: ''
  height: 0
  overflow: hidden
  display: block
  visibility: hidden
  clear: both
.navBar
  width: 12.5%
  float: left
  display: inline-block
.right-side
  width: 87.5%
  float: left
  display: inline-block
  .headBar
    position: relative
    z-index: -1
  .content
    padding: 50px
</style>
