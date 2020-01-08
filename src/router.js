/* eslint-disable */
import Vue from 'vue';
import Router from 'vue-router';
import HeadImage from './components/columnConfig/headImage';
import Highlight from './components/columnConfig/highlight';
import Partners from './components/columnConfig/partners';
import Guests from './components/columnConfig/guests';
import Scale from './components/columnConfig/scale';
import ExcellenceAward from './components/columnConfig/excellenceAward';
import CooperativeMedia from './components/columnConfig/cooperativeMedia';
import Agenda from './components/columnConfig/agenda';
import Registration from './components/columnConfig/registration';
import News from './components/columnConfig/news';
import Background from './components/columnConfig/background';
import Home from './components/home';
import Login from './components/login';
import BackStage from './components/backStage';
import ConferenceMsg from './components/conferenceMsg';
import AgendaManage from './components/agendaManage';

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
      path: '/:id(\\d+)',/* 只匹配数字 */
      component: BackStage,
      children: [
        {
          path: 'conferenceMsg',
          name: 'conferenceMsg',
          component: ConferenceMsg
        },
        {
          path: 'columnConfig/headImage/:c_id', /* 这里不能填 /columnConfig/headImage ,第一个“/”会被认为是根目录，而这里应该是继承上一级的id目录 */
          component: HeadImage
        },
        {
          path: 'columnConfig/background/:c_id', /* 这里不能填 /columnConfig/headImage ,第一个“/”会被认为是根目录，而这里应该是继承上一级的id目录 */
          component: Background

        },
        {
          path: 'columnConfig/highlight/:c_id',
          name: 'highlight',
          component: Highlight
        },
        {
          path: 'columnConfig/guests/:c_id',
          name: 'guests',
          component: Guests
        },
        {
          path: 'columnConfig/scale/:c_id',
          name: 'scale',
          component: Scale
        },
        {
          path: 'columnConfig/registration/:c_id',
          name: 'registration',
          component: Registration
        },
        {
          path: 'columnConfig/excellenceAward/:c_id',
          name: 'excellenceAward',
          component: ExcellenceAward
        },
        {
          path: 'columnConfig/agenda/:c_id',
          name: 'agenda',
          component: Agenda
        },
        {
          path: 'columnConfig/news/:c_id',
          name: 'news',
          component: News
        },
        {
          path: 'columnConfig/partners/:c_id',
          name: 'partners',
          component: Partners
        },
        {
          path: 'columnConfig/cooperativeMedia/:c_id',
          name: 'cooperativeMedia',
          component: CooperativeMedia
        },
        {
          path: 'agendaManage/:c_id',
          name: 'agendaManage',
          component: AgendaManage
        }
      ]
    },
  ]
});
