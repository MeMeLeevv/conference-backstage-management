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
        <el-menu-item v-if="nav.subTitle.length===0 && !nav.needAddBtn" :index="nav.url">
          <i :class="nav.icon + ' iconfont'"></i>
          <span>{{nav.name}}</span>
        </el-menu-item>
        <!-- 栏目配置 -->
        <el-submenu v-if="nav.subTitle.length > 0 && !nav.needAddBtn" :index="nav.url">
          <template slot="title">
           <i :class="nav.icon + ' iconfont'"></i>
           <span>{{nav.name}}</span>
          </template>
          <el-menu-item-group>
            <div v-for="sub in nav.subTitle" @click="saveColumnMsg(sub)" @mouseenter="sub.showEditIcon=true" @mouseleave="sub.showEditIcon=false" :key="sub.id">
              <el-menu-item :index="sub.url" >
                <div v-if="!sub.showInput">
                  {{sub.name}}
                  <i v-if="sub.showEditIcon" class="iconfont iconedit" @click="sub.showInput=true"></i>
                </div>
                <div @click.stop.once="sub.oldTitle=sub.name" v-else class="inputArea">
                  <input placeholder="请输入标题" v-model="sub.name" />
                  <span class="icon">
                    <span title="确定" @click="(sub.showInput=false)&&submit(sub.id,sub.name)" class="iconfont icongou"></span>
                    <span title="取消" @click="(sub.name=sub.oldTitle)&&(sub.showInput=false)" class="iconfont iconquxiao"></span>
                  </span>
                </div>
              </el-menu-item>
            </div>
          </el-menu-item-group>
        </el-submenu>
        <!-- 议程管理模块，这里打算不用input直接更改title的值，标题太长了 -->
        <el-submenu v-if="nav.needAddBtn" :index="nav.url">
          <template slot="title">
           <i :class="nav.icon + ' iconfont'"></i>
           <span>{{nav.name}}</span>
          </template>
          <el-menu-item-group>
            <div v-if="nav.subTitle.length > 0">
              <div v-for="sub in nav.subTitle" @click="saveColumnMsg(sub)" :key="sub.id">
                <el-menu-item :index="sub.url" >
                  <div>
                    {{sub.name}}
                  </div>
                </el-menu-item>
              </div>
            </div>
            <el-button class="addBtn" @click="addNewAgenda" plain>新增议程</el-button>
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
          needAddBtn: false,
          icon: 'icon-index',
          subTitle: []
        },
        {
          name: '大会信息',
          url: `/${id}/conferenceMsg`,
          needAddBtn: false,
          icon: 'iconwodedahuiyuan',
          subTitle: []
        },
        {
          name: '栏目配置',
          url: `/${id}/columnConfig`,
          icon: 'icon-more',
          needAddBtn: false,
          subTitle: []
        },
        {
          name: '议程管理',
          url: '/agendaManage',
          icon: 'icon-meeting',
          needAddBtn: true,
          subTitle: [
            { id: '333',
              url: '/789/agendaManage_333',
              name: '123'
            }
          ]
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
          item.showEditIcon = false /* 是否显示编辑图标 */
          item.showInput = false /* 是否显示编辑input */
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
  mounted () {
    this.$nextTick(() => {
      /* let icon = document.querySelectorAll('.icongou')
      icon.forEach(item => {
        icon.style.width = '20px'
        icon.style.height = '20px'
      }) */
    })
  },
  components: {},
  methods: {
    addNewAgenda () { /* 新增议程的时候先往subTitle那里push临时的议程路由对象路径/xxx/agendaManage/:agenda，agenda最好随机，
    利用agenda来区分本地保存的和后台请求的数据，只要新建就在store文件里保存agenda并初始化所有数据为空，保存按钮便更新store数据，但页面需要格式检查。只要一发布议程，便摧毁后台的对应数据。
    只要在store中找到agenda，就不在后台中查找，否则去后台查找。
    加载页面时先去后台取数据，之后再去本地查找
    */

    },
    submit (id, name) { /* 这里需要栏目id和title的更改值然后传到数据库 */
      console.log(id, 'id', name, 'name')
    },
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
.addBtn
  margin-left: 55px

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
.inputArea
  position: relative
  height: 50px
  input
    position: absolute
    width: 120px
    height: 50px
    outline: none
    border: none
    appearance: none
    background: transparent
    color: white
    font-weight: 700
  .icon
    position: absolute
    z-index: 1
    right: 0
    display: inline-block
    width: 30px
    height: 50px
    line-height: 50px
    .iconfont.icongou,.iconfont.iconquxiao
      display: inline-block
      padding: 0 5px
      color: white

</style>
