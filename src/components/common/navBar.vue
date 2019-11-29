<template>
  <div id="navBar" class="clearify"><!-- 可利用transition进行过度 -->
    <el-col :span="3">
      <el-menu
        :default-active="$route.path"
        :default-opened="openColumn"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        router
      >
      <div class="avatar">
        <img src="../../assets/images/avatar.jpg" alt="Your Avatar">
      </div>
      <div v-for="nav in navMsg" :key="nav.id">
        <el-menu-item v-if="nav.subTitle.length===0" :index="nav.url">
          <i :class="nav.icon + ' iconfont'"></i>
          <span>{{nav.name}}</span>
        </el-menu-item>
        <el-submenu v-else :index="nav.url">
          <template slot="title">
           <i :class="nav.icon + ' iconfont'"></i>
           <span>{{nav.name}}</span>
          </template>
          <el-menu-item-group>
            <div v-for="sub in nav.subTitle" @click="saveColumnMsg(sub)" :key="sub.id">
              <el-menu-item :index="sub.url">{{sub.name}}</el-menu-item>
            </div>
          </el-menu-item-group>
        </el-submenu>
      </div>
      </el-menu>
    </el-col>
  </div>
</template>

<script>
import { axiosGet } from '../../assets/js/axios';
import { storeLocalData } from '../../assets/js/base';

export default {
  name: 'navBar',
  data () {
    var id = this.$route.params.id; //   /117/columnConfig/headImage
    var openColumn = id.substr(0, id.lastIndexOf('/')); // 获取/117/columnConfig，来自动展开激活的那一栏
    return {
      navMsg: [
        {
          name: '首页',
          url: '/',
          icon: 'icon-index',
          subTitle: []
        },
        {
          name: '大会信息',
          url: `/${id}/conferenceMsg`,
          icon: 'iconwodedahuiyuan',
          subTitle: []
        },
        {
          name: '栏目配置',
          url: `/${id}/columnConfig`,
          icon: 'icon-more',
          subTitle: []
        },
        {
          name: '议程管理',
          url: '/meetingManage',
          icon: 'icon-meeting',
          subTitle: [{
            name: '大会头图',
            url: '/meetingManage/headImage'
          },
          {
            name: '大会亮点',
            url: '/meetingManage/highlight'
          },
          {
            name: '大会嘉宾',
            url: '/meetingManage/guests'
          },
          {
            name: '合作伙伴',
            url: '/meetingManage/partners'
          },
          {
            name: '合作媒体',
            url: '/meetingManage/cooperativeMedia'
          },
          {
            name: '大会地址',
            url: '/meetingManage/address'
          }]
        },
        {
          name: '订单管理',
          url: '/orderManage',
          icon: 'icon-order',
          subTitle: [{
            name: '大会头图',
            url: '/orderManage/headImage'
          },
          {
            name: '大会亮点',
            url: '/orderManage/highlight'
          },
          {
            name: '大会嘉宾',
            url: '/orderManage/guests'
          },
          {
            name: '合作伙伴',
            url: '/orderManage/partners'
          },
          {
            name: '合作媒体',
            url: '/orderManage/cooperativeMedia'
          },
          {
            name: '大会地址',
            url: '/orderManage/address'
          }]
        },
        {
          name: '客户反馈',
          url: '/clientFeedback',
          icon: 'icon-feedback',
          subTitle: [{
            name: '大会头图',
            url: '/clientFeedback/headImage'
          },
          {
            name: '大会亮点',
            url: '/clientFeedback/highlight'
          },
          {
            name: '大会嘉宾',
            url: '/clientFeedback/guests'
          },
          {
            name: '合作伙伴',
            url: '/clientFeedback/partners'
          },
          {
            name: '合作媒体',
            url: '/clientFeedback/cooperativeMedia'
          },
          {
            name: '大会地址',
            url: '/clientFeedback/address'
          }]
        }
      ],
      openColumn: [openColumn]
    };
  },
  created () {
    /* 获取子栏目列表,初始化子栏目
    subTitle: [{
            name: '大会头图',
            url: `/${id}/columnConfig/headImage`,
            cid: '',
            id: ''
          }],
    */
    axiosGet('/api/conferencegetColumnListByCid', {
      projectid: this.$route.params.id
    }, (res) => {
      let data = JSON.parse(res.data);
      if (data.code === '1') {
        let subTitle = data.data;
        subTitle.map(item => {
          item.url = `/${item.cid}/columnConfig/column${item.type}`;
        });
        this.navMsg[2].subTitle = subTitle;
        console.log(this.navMsg[2], '查找列表成功');
      } else {
        console.log('请求成功！但是查找列表失败');
      }
    }, (err) => {
      console.log(err, '查找列表失败');
    });
  },
  components: {},
  methods: {
    handleOpen (key, keyPath) {
      // console.log(key, keyPath, 'open')
    },
    handleClose (key, keyPath) {
      // console.log(key, keyPath, 'close')
    },
    saveColumnMsg (msg) {
      storeLocalData([['columnMsg', msg]]);/* navbar被点击后在localStorage中储存栏目信息 */
    }
  }
};
</script>

<style lang="sass">
*
  box-sizing: border-box
.center
  text-align: center
#navBar
  .el-col-3
    width: 100%
  .avatar
    height: 100px
    position: relative
    img
      display: inline-block
      width: 50px
      height: 50px
      position: absolute
      top: 50%
      left: 50%
      margin: auto
      transform: translate(-50%, -50%)
      border-radius: 50%
  .el-col-3>ul
    height: 100vh
    background: #545c64
  a
    color: white
  .el-menu-item i, .el-submenu i
    margin: 0 8% 0 13%
    color: white
  .el-menu-item span, .el-submenu__title span
    font-weight: 700
  .el-submenu .el-submenu__icon-arrow
    position: static
  .el-submenu .el-menu-item
    min-width: auto
    padding-left: 30% !important
    font-size: 12px
  .el-menu-item-group__title
    padding: 0
</style>
