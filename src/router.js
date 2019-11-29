/* eslint-disable */
import Vue from 'vue';
import Router from 'vue-router';
import HeadImage from './components/columnConfig/headImage';
import Highlight from './components/columnConfig/highlight';
import Partners from './components/columnConfig/partners';
import Guests from './components/columnConfig/guests';
import CooperativeMedia from './components/columnConfig/cooperativeMedia';
import Background from './components/columnConfig/background';
import Home from './components/home';
import Login from './components/login';
import BackStage from './components/backStage';
import ConferenceMsg from './components/conferenceMsg';

Vue.use(Router);

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
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/:id',
      component: BackStage,
      children: [
        {
          path: 'conferenceMsg',
          name: 'conferenceMsg',
          component: ConferenceMsg
        },
        {
          path: 'columnConfig/column0', /* 这里不能填 /columnConfig/headImage ,第一个“/”会被认为是根目录，而这里应该是继承上一级的id目录 */
          component: HeadImage

        },
        {
          path: 'columnConfig/column1', /* 这里不能填 /columnConfig/headImage ,第一个“/”会被认为是根目录，而这里应该是继承上一级的id目录 */
          component: Background

        },
        {
          path: 'columnConfig/column2',
          name: 'highlight',
          component: Highlight
        },
        {
          path: 'columnConfig/column5',
          name: 'guests',
          component: Guests
        },
        {
          path: 'columnConfig/column9',
          name: 'partners',
          component: Partners
        },
        {
          path: 'columnConfig/column10',
          name: 'cooperativeMedia',
          component: CooperativeMedia
        }
      ]
    }
  ]
});
