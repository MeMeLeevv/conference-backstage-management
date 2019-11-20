import Vue from 'vue'
import Router from 'vue-router'
import HeadImage from './components/columnConfig/headImage'
import Highlight from './components/columnConfig/highlight'
import Partners from './components/columnConfig/partners'
import Guests from './components/columnConfig/guests'
import CooperativeMedia from './components/columnConfig/cooperativeMedia'
import Home from './components/home'

Vue.use(Router)

export default new Router({
  mode: 'hash',
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
    },
    {
      path: '/columnConfig/highlight',
      name: 'highlight',
      component: Highlight
    },
    {
      path: '/columnConfig/guests',
      name: 'guests',
      component: Guests
    },
    {
      path: '/columnConfig/partners',
      name: 'partners',
      component: Partners
    },
    {
      path: '/columnConfig/cooperativeMedia',
      name: 'cooperativeMedia',
      component: CooperativeMedia
    }
  ]
})
