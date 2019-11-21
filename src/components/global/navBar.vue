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
          <span>{{nav.title}}</span>
        </el-menu-item>
        <el-submenu v-else :index="nav.url">
          <template slot="title">
           <i :class="nav.icon + ' iconfont'"></i>
           <span>{{nav.title}}</span>
          </template>
          <el-menu-item-group>
            <div v-for="sub in nav.subTitle" :key="sub.id">
              <el-menu-item :index="sub.url">{{sub.title}}</el-menu-item>
            </div>
          </el-menu-item-group>
        </el-submenu>
      </div>
      </el-menu>
    </el-col>
  </div>
</template>

<script>
export default {
  name: 'navBar',
  data () {
    var id = this.$route.params.id //   /117/columnConfig/headImage
    var openColumn = id.substr(0, id.lastIndexOf('/')) // 获取/117/columnConfig，来自动展开激活的那一栏
    return {
      navMsg: [
        {
          title: '首页',
          url: '/',
          icon: 'icon-index',
          subTitle: []
        },
        {
          title: '栏目配置',
          url: `/${id}/columnConfig`,
          icon: 'icon-more',
          subTitle: [{
            title: '大会头图',
            url: `/${id}/columnConfig/headImage`
          },
          {
            title: '大会亮点',
            url: `/${id}/columnConfig/highlight`
          },
          {
            title: '大会嘉宾',
            url: `/${id}/columnConfig/guests`
          },
          {
            title: '合作伙伴',
            url: `/${id}/columnConfig/partners`
          },
          {
            title: '合作媒体',
            url: `/${id}/columnConfig/cooperativeMedia`
          },
          {
            title: '大会地址',
            url: `/${id}/columnConfig/address`
          }]
        },
        {
          title: '议程管理',
          url: '/meetingManage',
          icon: 'icon-meeting',
          subTitle: [{
            title: '大会头图',
            url: '/meetingManage/headImage'
          },
          {
            title: '大会亮点',
            url: '/meetingManage/highlight'
          },
          {
            title: '大会嘉宾',
            url: '/meetingManage/guests'
          },
          {
            title: '合作伙伴',
            url: '/meetingManage/partners'
          },
          {
            title: '合作媒体',
            url: '/meetingManage/cooperativeMedia'
          },
          {
            title: '大会地址',
            url: '/meetingManage/address'
          }]
        },
        {
          title: '订单管理',
          url: '/orderManage',
          icon: 'icon-order',
          subTitle: [{
            title: '大会头图',
            url: '/orderManage/headImage'
          },
          {
            title: '大会亮点',
            url: '/orderManage/highlight'
          },
          {
            title: '大会嘉宾',
            url: '/orderManage/guests'
          },
          {
            title: '合作伙伴',
            url: '/orderManage/partners'
          },
          {
            title: '合作媒体',
            url: '/orderManage/cooperativeMedia'
          },
          {
            title: '大会地址',
            url: '/orderManage/address'
          }]
        },
        {
          title: '客户反馈',
          url: '/clientFeedback',
          icon: 'icon-feedback',
          subTitle: [{
            title: '大会头图',
            url: '/clientFeedback/headImage'
          },
          {
            title: '大会亮点',
            url: '/clientFeedback/highlight'
          },
          {
            title: '大会嘉宾',
            url: '/clientFeedback/guests'
          },
          {
            title: '合作伙伴',
            url: '/clientFeedback/partners'
          },
          {
            title: '合作媒体',
            url: '/clientFeedback/cooperativeMedia'
          },
          {
            title: '大会地址',
            url: '/clientFeedback/address'
          }]
        }
      ],
      openColumn: [openColumn]
    }
  },
  created () {
  },
  components: {},
  methods: {
    handleOpen (key, keyPath) {
      // console.log(key, keyPath, 'open')
    },
    handleClose (key, keyPath) {
      // console.log(key, keyPath, 'close')
    }
  }
}
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
