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
      <!-- 头像 -->
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
            <!-- <div v-for="sub in nav.subTitle" @click="saveColumnMsg(sub)" @mouseenter="sub.showEditIcon=true" @mouseleave="sub.showEditIcon=false" :key="sub.c_id">
              <el-menu-item :index="sub.url" >
                <div v-if="!sub.showInput">
                  {{sub.name}}
                  <i v-if="sub.showEditIcon" class="iconfont iconedit" @click="(sub.showInput=true) && (sub.oldTitle=sub.name)"></i>
                </div>
                <div @click.stop v-else class="inputArea">
                  <input placeholder="请输入标题" v-model="sub.name" />
                  <span class="icon">
                    <span title="确定" @click="(sub.showInput=false)&&submit(sub.c_id,sub.name)" class="iconfont icongou"></span>
                    <span title="取消" @click="(sub.name=sub.oldTitle)&&(sub.showInput=false)" class="iconfont iconquxiao"></span>
                  </span>
                </div>
              </el-menu-item>
            </div> -->

            <draggable
              :list="nav.subTitle"
              :disabled="!enabled"
              class="list-group"
              ghost-class="ghost"
              :move="checkMove"
              @start="dragging = true"
              @end="dropColumn"
            >
              <div
                class="list-group-item"
                v-for="(element) in nav.subTitle"
                :key="element.c_id"
                @click="saveColumnMsg(element)"
                @mouseenter="element.showEditIcon=true" @mouseleave="element.showEditIcon=false"
              >
              <el-menu-item :index="element.url" >
                <div v-if="!element.showInput">
                  {{element.name}}
                  <i v-if="element.showEditIcon" class="iconfont iconedit" @click="(element.showInput=true) && (element.oldTitle=element.name)"></i>
                </div>
                <div @click.stop v-else class="inputArea">
                  <input placeholder="请输入标题" v-model="element.name" />
                  <span class="icon">
                    <span title="确定" @click="(element.showInput=false)&&submit(element.c_id,element.name)" class="iconfont icongou"></span>
                    <span title="取消" @click="(element.name=element.oldTitle)&&(element.showInput=false)" class="iconfont iconquxiao"></span>
                  </span>
                </div>
                </el-menu-item>
              </div>
            </draggable>

            <el-button class="addBtn" @click="dialogFormVisible = true" >新增栏目</el-button>
            <el-dialog title="栏目信息" :visible.sync="dialogFormVisible">
              <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="栏目名称" :label-width="formLabelWidth" prop="name">
                  <el-input v-model="form.name" autocomplete="off" placeholder="请输入栏目名称"></el-input>
                </el-form-item>
                <el-form-item label="栏目类型" :label-width="formLabelWidth">
                  <el-select v-model="form.type" placeholder="请选择栏目类型">
                    <el-option value="0" label="headImage"></el-option>
                    <el-option value="1" label="background"></el-option>
                    <el-option value="2" label="highlight"></el-option>
                    <el-option value="3" label="scale"></el-option>
                    <el-option value="4" label="excellenceAward"></el-option>
                    <el-option value="5" label="guests"></el-option>
                    <el-option value="6" label="agenda"></el-option>
                    <el-option value="7" label="news"></el-option>
                    <el-option value="8" label="registration"></el-option>
                    <el-option value="9" label="partners"></el-option>
                    <el-option value="10" label="cooperativeMedia"></el-option>
                    <el-option value="11" label="address"></el-option>
                    <el-option value="12" label="contact"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addNewColumn('form')">确 定</el-button>
              </div>
            </el-dialog>
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
            <el-button class="addBtn" @click="addNewAgenda" :disabled="getAgendaBtnDisabled">新增议程</el-button>
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
import { mapMutations, mapGetters } from 'vuex'
import draggable from 'vuedraggable'

/* 现在栏目navbar的需求是，1、能新增，新增时候可编辑name和type（必填,type给select框）确定后给后台，后台返回栏目id，新增之后相同type排序,同时button隐藏，出现确定和取消来确定用户想要的位置，此时可拖动？
注意同type的url要归为一类；2、能拖动 */

export default {
  name: 'navBar',
  data () { /* 排序字段跟他的index挂钩！！！ */
    var id = this.$route.params.id; //   /117/columnConfig/headImage
    var openColumn = id.substr(0, id.lastIndexOf('/')); // 获取/117/columnConfig，来自动展开激活的那一栏
    return {
      enabled: true,
      dragging: false,
      rules: {
        name: [
          { required: true, message: '请输入栏目名称', trigger: 'blur' },
          { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }
        ]
      },
      dialogFormVisible: false,
      form: {
        name: '',
        type: '0'
      },
      formLabelWidth: '120px',
      typeMap: {
        1: 'headImage',
        2: 'background',
        3: 'highlight',
        4: 'scale',
        5: 'excellenceAward',
        6: 'guests',
        7: 'agenda',
        8: 'news',
        9: 'registration',
        10: 'partners',
        11: 'cooperativeMedia',
        12: 'address',
        13: 'contact'
      },
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
              url: `/${id}/agendaManage/temp1`,
              name: '123'
            },
            { id: '555',
              url: `/${id}/agendaManage/temp2`,
              name: '456'
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
  computed: {
    ...mapGetters([
      'getAgendaBtnDisabled'
    ])
  },
  created () {
    /* 获取子栏目列表,初始化子栏目 ，同样的我们先获取议程列表，然后新增的时候往subTitle里push进初始化的议程列表对象，id也要，否则销毁的时候无法及时成功
    subTitle: [{
            name: '大会头图',
            url: `/${id}/columnConfig/headImage`,
            cid: '',
            id: ''
          }],
    */
    let that = this
    axiosGet('/api/column/getColumnList', {
      p_id: this.$route.params.id
    }, (res) => {
      let data = res.data
      if (data.code === '1') {
        let subTitle = data.data;
        console.log(subTitle, 'subTitle')
        subTitle.map(item => { // 新增栏目同一type的url都一样，如此一来都可以请求到同一个组件中，然后根据栏目id来拉取不同的数据
          item.url = `/${item.p_id}/columnConfig/${this.typeMap[item.type]}/column${item.c_id}`; // 这里加入栏目id也可以
          item.showEditIcon = false // 是否显示编辑图标
          item.showInput = false // 是否显示编辑input
        });
        this.navMsg[2].subTitle = subTitle;
        console.log(this.navMsg[2], '查找列表成功');
      } else {
        that.$message.error(data.msg);
      }
    }, (err) => {
      that.$message.error(err);
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
  components: {
    draggable
  },
  methods: { /* 关于鼠标直接拖拽排序的，navbar列表改变后直接将排序后的数据发请求给后台，下次再次请求时发送更换后的数据即可 */
    ...mapMutations([
      'setTemporaryAgenda',
      'setaAgendaBtnDisabled'
    ]),
    addNewColumn (formName) { /* 发送新增栏目请求给后台 */
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
          this.dialogFormVisible = false
          console.log(this.form, '发送新增栏目请求给后台，后台返回栏目id，然后push进栏目的subTitle中')
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    checkMove: function (e) {
      // console.log(e, 'emove')
      // console.log(this.navMsg[2].subTitle, 'subTitle')
      // console.log(this.navMsg[2].subTitle)
      window.console.log('Future index: ' + e.draggedContext.futureIndex);
    },
    dropColumn () { /* 新增的时候将sort = this.navMsg[2].subTitle.length */
      this.dragging = false
      /* 这里改变subTitle的sort值 */
      this.navMsg[2].subTitle = this.navMsg[2].subTitle.map((item, index) => {
        item.sort = index
        return item
      })
      console.log(this.navMsg[2].subTitle, 'this.navMsg[2].subTitle')
    },
    addNewAgenda () { /* 一次只能新增一次议程，！！！！新增议程的时候先往subTitle那里push临时的议程路由对象路径/cid/agendaManage/:index，index（议程id）最好与store的temporaryAgenda挂钩，
    利用agenda来区分本地保存的和后台请求的数据，只要新建就在store文件里保存id = index 并初始化所有数据为空，保存按钮便更新store数据，但页面需要格式检查。保存时候不摧毁，但是仍然要发送请求，只要一发布议程，便摧毁后台的对应数据。
    只要在store中找到agenda，就不在后台中查找，否则去后台查找。
    刚加载页面时全部去后台取数据，不需要本地去找，只要进入新增议程页面后离开就提示请保存否则数据将不会被保存，然后销毁store的temporaryAgenda数据
    */
      /*
    12-5
    获需在新增的时候就发送请求要求返回一个议程id，然后去用议程id去编辑url，与发布版的议程列表数据类似（这里可能存在都加载一个组件发生不刷新的状况）并在created的时候去拉取议程数据，没有的话就展示初始状态
    新增的字段再增加temp = true
    */
      // let id = Math.random().toString(36).substr(2).slice(0, 5) // 生成3-32位长度的字母数字组合的随机字符串
      this.setTemporaryAgenda({ /* 每次新增都初始化store的temporaryAgenda数据 */
        // id: id, /* 随机 ,对应后台的议程id */
        name: '请输入议程名称',
        date: '',
        address: '',
        contents: [
          {
            startTime: '',
            endTime: '',
            plate: '',
            content: {
              title: '',
              host: '',
              guests: ''
            },
            editable: false
          }
        ]
      })
      this.navMsg[3].subTitle.push({
        // id: id, /* 随机 ,对应后台的议程id */
        temp: true, // 标知临时数据
        name: '请输入议程名称',
        url: `/${this.$route.params.id}/agendaManage/temp`
      })
      /* 还要将按钮设为不可编辑状态 */
      this.setaAgendaBtnDisabled(true)
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
.addBtn /* 新增议程按钮 */
  margin-left: 55px
  background: transparent
  color: white
.addBtn:hover
  color: black
  background: #f2f2f2
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
