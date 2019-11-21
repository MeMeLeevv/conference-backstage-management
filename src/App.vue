<template>
  <div id="app">
      <NavBar v-if="!isIndex" class="navBar"></NavBar>
    <div class="right-side" :style="`width: ${isIndex ? '100%' : '87.5%'}`">
      <HeadBar class="headBar" manager="ManagerME"></HeadBar><!-- 这里需要传props：title来变换大会header的值，
      取值方法是首页的组件监测到用户点击项目后触发传参给父组件，也就是调用这里的title改变 -->
        <router-view class="content" />
    </div>
  </div>
</template>

<script>
import NavBar from './components/global/navBar'
import HeadBar from './components/global/headBar'

export default {
  name: 'app',
  data () {
    return {
      isIndex: true
    }
  },
  created () { /* 第一次加载或者刷新的时候判断路由 */
    // this.getDevice()
    console.log(this.$route.path, 'this.$route.path')
    this.isIndex = this.$route.path === '/' /* 如果是首页，则不显示navbar */
  },
  watch: {
    '$route' (to, from) {
      // console.log(to, 'to')
      this.isIndex = to.path === '/'
    }
  },
  methods: {
    getDevice () {
      window.deviceWidth = document.body.clientWidth
      window.deviceHeight = document.body.clientHeight
    },
    setIsIndex (index) {
      return index === '/'
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
  float: left
  display: inline-block
  .headBar
    position: relative
    z-index: -1
  .content
    padding: 50px
</style>
