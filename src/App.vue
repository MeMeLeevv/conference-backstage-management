<template>
  <div id="app">
      <NavBar ref="navbar" v-if="(getHasLogin&&!isIndex) && !isLoginPage" class="navBar"></NavBar><!-- 已登录且不是首页或者不是登录页的时候显示navbar -->
      <div class="right-side" :style="`width: ${(isIndex||!getHasLogin) || isLoginPage ? '100%' : '87.5%'}`"><!-- 处于首页或者登录页（getHasLogin=false）时right-sight宽度要处于全屏 -->
        <HeadBar v-if="getHasLogin && !isLoginPage" :showAvatar="isIndex" @exitAccount="exitAccount"  :title="getBackStageTitle ? '管理后台 —— '+getBackStageTitle: '大会管理后台'"
        class="headBar" :manager="getAccount.username"></HeadBar><!-- 这里需要传props：title来变换大会header的值，
        取值方法是首页的组件监测到用户点击项目后触发传参给父组件，也就是调用这里的title改变 -->
        <router-view v-if="isRouterAlive" class="content" />
      </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { storeLocalData, getLocalData } from './assets/js/base'
import { axiosPost } from './assets/js/axios';

const NavBar = () => import('./components/common/navBar')
const HeadBar = () => import('./components/common/headBar')
export default {
  name: 'app',
  provide () {
    return {
      changeAgendaStatus: this.changeAgendaStatus
    }
  },
  data () {
    return {
      isIndex: true, /* 是否是首页 */
      to: '',
      from: '',
      isLoginPage: false,
      isRouterAlive: true
    };
  },
  created () { // 第一次加载或者刷新的时候判断路由
    document.title = '大会管理后台'
    this.$router.push('/login')
    this.checkLogin(); // 判断登录状态
    this.isLoginPage = this.$route.path === '/login'; // 如果是登录页面 ，不显示navbar
    this.isIndex = this.$route.path === '/'; // 如果是首页，不显示navbar
  },
  mounted () {
    let _this = this// 保存this指向，在window.onbeforeunload可以成功找到route的path
    window.onbeforeunload = function (e) { // 页面卸载的时候保留之前的路由值，例如刷新的时候可以保留之前的页面
      e.preventDefault()
      e.returnValue = 'hello1';
      storeLocalData([['oldRouter', _this.$route.path]])
    }
  },
  watch: {
    '$route' (to, from) { // 记录路由的来源和去路
      this.from = from.path;
      this.to = to.path;
      this.isIndex = to.path === '/';
      this.isLoginPage = to.path === '/login';
      if (this.isIndex) { // 如果是首页需要把大会标题初始化
        this.setBackStageTitle('');
      }
      /* if (this.from !== '/' && this.to.search(/(\/\d+)$/) !== -1) { // 如果要返回首页，页面会停留在http://localhost:8000/#/117，此时页面会出现空白，要需要加以判断
        this.$router.push('/'); // 返回首页
      } else { */
      // vue不同路由使用同一组件会造成不刷新的情况，即监测到this.from和this.to使用同一组件时不刷新，所以这里就监测path:columnConfig/***/:c_id,
      // 如果/c_id之前的路径是相通的则刷新并重新定义路由
      let toIndex = this.to.lastIndexOf('/')
      let fromIndex = this.from.lastIndexOf('/')
      if (this.to.slice(0, toIndex) === this.from.slice(0, fromIndex)) {
        this.reload(this.to)
      }
      // }
    }
  },
  computed: {
    ...mapGetters(['getOriginPage', 'getHasLogin', 'getBackStageTitle', 'getAccount', 'getColumnMsg'])
  },
  methods: {
    ...mapMutations([
      'setOriginPage',
      'setHasLogin',
      'setAccount',
      'setBackStageTitle',
      'setColumnMsg'
    ]),
    /*
    作用：agenda具体页面修改name或者删除栏目的时候，navbar也要跟着改变
    @params url String 刷新后页面的路由
    @return null
    */
    changeAgendaStatus (deleteAid) {
      this.$refs.navbar.requestAgenda(deleteAid) // 调用子组件的方法，重新请求agenda列表
    },
    /*
    作用：刷新并重新定义路由，防止同一组件的不同路由不刷新
    @params url String 刷新后页面的路由
    @return null
    */
    reload (url) {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
        this.$router.push(url)
      })
    },
    /*
    作用：检查登录状态,并作出处理
    @return null
    */
    checkLogin () {
      let that = this
      // 查询大会信息并展示在预览区，如果没有值要有初始化
      axiosPost(`${this.$store.state.api}/user/logingetState`, null, (res) => {
        let data = res.data;
        // eslint-disable-next-line eqeqeq
        if (data.code == 1) {
          this.setHasLogin(true); // 设置登录状态
          this.setAccount(data.data);// 设置用户账号
          let oldRouter = getLocalData(['oldRouter']) // 获取跳转到登录页面前的路径
          // 如果上一个路径是登录或者没有，则默认返回首页
          if (oldRouter === '/login' || !oldRouter) {
            this.$router.push('/')
          } else {
            this.$router.push(oldRouter[0])
          }
        } else {
          this.setHasLogin(false);
          this.setOriginPage(this.from); // 先保存之前的页面链接
          // this.$router.push('/login'); // 去往登录页面
        }
      }, (err) => {
        that.$message.error('加载大会列表失败！建议重新加载页面！' + err);
      });
    },
    /*
    作用：处理退出登录，返回登录页面
    @return null
    */
    exitAccount () {
      axiosPost(`${this.$store.state.api}/user/loginout`, null, (res) => {
        let data = res.data;
        console.log(data, 'logindata')
        // eslint-disable-next-line eqeqeq
        if (data.code == 1) {
          this.$message({
            message: data.msg,
            type: 'success',
            duration: '1000',
            onClose: () => {
              this.setAccount('');
              this.setHasLogin(false);
              this.setOriginPage('');
              this.$router.push('/login');
            }
          });
        } else {
          this.$message({
            message: data.msg,
            type: 'error',
            duration: '1000'
          });
        }
      }, (err) => {
        this.$message({
          message: '退出登陆失败,请重试！' + err,
          type: 'error',
          duration: '1000'
        });
      });
    }
  },
  components: {
    NavBar,
    HeadBar
  }
};
</script>

<style lang="sass">
*
  box-sizing: border-box
.ellipsis
  overflow: hidden
  text-overflow: ellipsis
  white-space: nowrap
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
  height: 0px
  .headBar
    position: relative
    z-index: 0
  .content
    padding: 50px

</style>
