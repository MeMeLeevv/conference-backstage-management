import Vue from 'vue'
import Router from 'vue-router'
import HeadImage from './components/columnConfig/headImage'
import Highlight from './components/columnConfig/highlight'
import Partners from './components/columnConfig/partners'
import Guests from './components/columnConfig/guests'
import CooperativeMedia from './components/columnConfig/cooperativeMedia'
import Home from './components/home'
import BackStage from './components/backStage'

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
      path: '/:id',
      component: BackStage,
      children: [
        {
          path: 'columnConfig/headImage', /* 这里不能填 /columnConfig/headImage ,第一个“/”会被认为是根目录，而这里应该是继承上一级的id目录 */
          component: HeadImage

        },
        {
          path: 'columnConfig/highlight',
          name: 'highlight',
          component: Highlight
        },
        {
          path: 'columnConfig/guests',
          name: 'guests',
          component: Guests
        },
        {
          path: 'columnConfig/partners',
          name: 'partners',
          component: Partners
        },
        {
          path: 'columnConfig/cooperativeMedia',
          name: 'cooperativeMedia',
          component: CooperativeMedia
        }
      ]
    }
  ]
})
