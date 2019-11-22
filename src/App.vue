<template>
  <div id="app">
    <login v-if="!hasLogin"></login><!-- 以后可以询问登录状态，如果显示已经登录就hasLogin=true -->
    <div v-else>
      <NavBar v-if="!isIndex" class="navBar"></NavBar>
      <div class="right-side" :style="`width: ${isIndex ? '100%' : '87.5%'}`">
      <HeadBar class="headBar" manager="ManagerME"></HeadBar><!-- 这里需要传props：title来变换大会header的值，
      取值方法是首页的组件监测到用户点击项目后触发传参给父组件，也就是调用这里的title改变 -->
        <router-view class="content" />
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from './components/common/navBar'
import HeadBar from './components/common/headBar'
import Login from './components/login'
import { mapState } from 'vuex'

export default {
  name: 'app',
  data () {
    return {
      isIndex: true,
      hasLogin: true
    }
  },
  created () { /* 第一次加载或者刷新的时候判断路由 */
    // this.getDevice()
    // this.login()
    console.log(this.$route.path, 'this.$route.path')
    this.isIndex = this.$route.path === '/' /* 如果是首页，则不显示navbar */
  },
  watch: {
    '$route' (to, from) {
      console.log(to, 'to') // 此处的from需要赋值给login登陆成功后返回的原始页面，如果没有则默认返回首页
      this.isIndex = to.path === '/'
    }
  },
  computed: {
    ...mapState(['deviceWidth', 'deviceHeight'])
  },
  methods: {
    getDevice () {
    },
    setIsIndex (index) {
      return index === '/'
    },
    checkLogin () { // 检查登录状态
      this.$axios.get('/api/logingetState').then((res) => {
        let state = JSON.parse(res)
        if (state === '1') { // 已登录，继续保留当前页面
        } else {
          this.$router.push('/login') // 返回登录页面
        }
      })
    },
    login () { /* 测试自用函数：先询问登录状态，如果显示已经登录就不需要发登录请求了 */
      this.$axios.get('/api/loginCheck?user=admin2&password=admin').then((res) => {
        console.log(JSON.parse(res.data))
      }).catch((err) => {
        console.log(err)
      }).finally(() => {
        console.log('done')
      })
    }
  },
  components: {
    NavBar,
    HeadBar,
    Login
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
