/* eslint-disable */
import Vue from 'vue';
import Router from 'vue-router';

const HeadImage = () => import('./components/columnConfig/headImage')
const Highlight = () => import('./components/columnConfig/highlight')
const parnerOrMedia = () => import('./components/columnConfig/parnerOrMedia')
const Guests = () => import('./components/columnConfig/guests')
const Scale = () => import('./components/columnConfig/scale')
const excellenceAwardOrAddress = () => import('./components/columnConfig/excellenceAwardOrAddress')
const agendaOrContactOrRegis = () => import('./components/columnConfig/agendaOrContactOrRegis')
const News = () => import('./components/columnConfig/news')
const Background = () => import('./components/columnConfig/background')
const Home = () => import('./components/home')
const Login = () => import('./components/login')
const BackStage = () => import('./components/backStage')
const ConferenceMsg = () => import('./components/conferenceMsg')
const agendaManage = () => import('./components/agendaManage')


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
          path: 'columnConfig/excellenceAwardOrAddress/:c_id',
          name: 'excellenceAwardOrAddress',
          component: excellenceAwardOrAddress
        },
        {
          path: 'columnConfig/agendaOrContactOrRegis/:c_id',
          name: 'agendaOrContactOrRegis',
          component: agendaOrContactOrRegis
        },
        {
          path: 'columnConfig/news/:c_id',
          name: 'news',
          component: News
        },
        {
          path: 'columnConfig/parnerOrMedia/:c_id',
          name: 'parnerOrMedia',
          component: parnerOrMedia
        },
        {
          path: 'agendaManage/:c_id',
          name: 'agendaManage',
          component: agendaManage
        }
      ]
    },
  ]
});
