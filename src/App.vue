<template>
  <div id="app">
      <NavBar v-if="getHasLogin&&!isIndex" class="navBar"></NavBar><!-- 已登录且不是首页的时候显示navbar -->
      <div class="right-side" :style="`width: ${isIndex||!getHasLogin ? '100%' : '87.5%'}`"><!-- 处于首页或者登录页（getHasLogin=false）时right-sight宽度要处于全屏 -->
      <HeadBar v-if="getHasLogin" :title="getBackStageTitle ? getBackStageTitle: '大会管理后台'" class="headBar" manager="ManagerME"></HeadBar><!-- 这里需要传props：title来变换大会header的值，
      取值方法是首页的组件监测到用户点击项目后触发传参给父组件，也就是调用这里的title改变 -->
        <router-view class="content" />
      </div>
  </div>
</template>

<script>
import NavBar from './components/common/navBar'
import HeadBar from './components/common/headBar'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'app',
  data () {
    return {
      isIndex: true, /* 是否是首页 */
      to: '',
      from: ''
    }
  },
  created () { /* 第一次加载或者刷新的时候判断路由 */
    // this.getDevice()
    // this.login()
    this.checkLogin()
    console.log(this.$route.path, 'this.$route.path')
    this.isIndex = this.$route.path === '/' /* 如果是首页，则不显示navbar */
  },
  watch: {
    '$route' (to, from) { /* 记录路由的来源和去路 */
      this.from = from
      this.to = to
      console.log(from, 'from')
      console.log(to, 'to') // 此处的from需要赋值给login登陆成功后返回的原始页面，如果没有则默认返回首页
      this.isIndex = to.path === '/'
    }
  },
  computed: {
    ...mapGetters(['getOriginPage', 'getHasLogin', 'getBackStageTitle'])
  },
  methods: {
    // 映射
    ...mapMutations([
      'setOriginPage',
      'setHasLogin'
    ]),
    getDevice () {
    },
    setIsIndex (index) {
      return index === '/'
    },
    checkLogin () { // 检查登录状态
      this.$axios.get('/api/logingetState').then((res) => {
        console.log(this.getHasLogin, 'this.getHasLogin')
        let state = JSON.parse(res.data).code
        console.log(state, 'state')
        if (state === '1') { // 已登录，继续保留当前页面
          this.setHasLogin(true)
        } else {
          this.setHasLogin(false)
          this.setOriginPage(this.from) // 先保存之前的页面链接
          console.log(this.getHasLogin, 'this.getHasLogin')
          this.$router.push('/login') // 去往登录页面
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
