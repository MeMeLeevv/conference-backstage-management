/* eslint-disable */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {// 初始化状态设置要全局访问的state对象
    deviceWidth: document.body.clientWidth,
    deviceHeight: document.body.clientHeight,
    originPage: '', /* 保存要进入登录页时的来源页面，登录完成后继续返回那个页面 */
    hasLogin: false,
    backStageTitle: '',
    account: '', // 管理者的账户信息
    columnMsg: {}, /* 保存当前被点击时候的栏目id */
    temporaryAgenda: {},/* 保存本地临时 */
    agendaBtnDisabled: false, /* 新增议程按钮的可编辑状态 */
    api: '' // 请求链接的跨域前缀
  },
  getters: {// 来实时监听state值的变化(最新状态)
    getDeviceWidth (state) {
      return state.deviceWidth;
    },
    getDeviceHeight (state) {
      return state.deviceHeight;
    },
    getOriginPage (state) {
      return state.originPage;
    },
    getHasLogin (state) {
      return state.hasLogin;
    },
    getBackStageTitle (state) {
      return state.backStageTitle;
    },
    getAccount (state) {
      return state.account;
    },
    getColumnMsg (state) {
      return state.columnMsg;
    },
    getTemporaryAgenda (state) {
      return state.temporaryAgenda
    },
    getAgendaBtnDisabled (state) {
      return state.agendaBtnDisabled
    }
  },
  mutations: {// 一个对像可以放改变state初始值的方法，也可以进行改变state里的值
    setOriginPage (state, path) {
      state.originPage = path;
    },
    setHasLogin (state, boolean) {
      state.hasLogin = boolean;
    },
    setBackStageTitle (state, title) {
      state.backStageTitle = title;
    },
    setAccount (state, acc) {
      state.account = acc;
    },
    setColumnMsg (state, msg) {
      state.columnMsg = msg;
    },
    setTemporaryAgenda (state, data) {
      state.temporaryAgenda = data
     },
     setaAgendaBtnDisabled (state, data) {
      state.agendaBtnDisabled = data
     }
  },
  actions: {// 这个actions也是个对象变量，最大的作用就是里面的action方法 可以包含任意多个异步操作
    activityTab (context) { // 一个函数连续触发多个mutation的函数
      context.commit('activity');
    },
    getNewNum (context, num) {
      context.commit('newNum', num);
    },
    // 设置state的初值
    initIndexMsg (context, index) {
      context.commit('setActivites', index.activites);
      context.commit('setItems', index.items);
      context.commit('setInspire', index.inspire);
      context.commit('setVideo', index.video);
      context.commit('setBanner', index.banner);
      context.commit('setIndexMsgReady');
      console.log('首页数据初始化成功');
    },
    getIndexMsg (context) {
      let indexMsg = {};
      indexMsg.banner = this.state.banner;
      indexMsg.activites = this.state.activites;
      indexMsg.items = this.state.items;
      indexMsg.inspire = this.state.inspire;
      indexMsg.video = this.state.video;
      return indexMsg
    }
  }
})
