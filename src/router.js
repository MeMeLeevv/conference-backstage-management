import Vue from 'vue'
import Router from 'vue-router'
import HeadImage from './components/columnConfig/headImage'
import Home from './components/home'

Vue.use(Router)

export default new Router({
/*   mode: Hash, */
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/columnConfig/headImage',
      name: 'headImage',
      component: HeadImage
    }
  ]
})
