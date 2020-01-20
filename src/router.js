/* eslint-disable */
import Vue from 'vue';
import Router from 'vue-router';

const parnerOrMedia = () => import('./components/columnConfig/parnerOrMedia')
const Scale = () => import('./components/columnConfig/scale')
const agOrCoOrReOrHlOrGuOrNe = () => import('./components/columnConfig/agOrCoOrReOrHlOrGuOrNe')
const heOrBaOrExOrAd = () => import('./components/columnConfig/heOrBaOrExOrAd')
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
          path: 'columnConfig/heOrBaOrExOrAd/:c_id', /* 这里不能填 /columnConfig/headImage ,第一个“/”会被认为是根目录，而这里应该是继承上一级的id目录 */
          component: heOrBaOrExOrAd

        },
        {
          path: 'columnConfig/scale/:c_id',
          name: 'scale',
          component: Scale
        },
        {
          path: 'columnConfig/agOrCoOrReOrHlOrGuOrNe/:c_id',
          name: 'agOrCoOrReOrHlOrGuOrNe',
          component: agOrCoOrReOrHlOrGuOrNe
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
