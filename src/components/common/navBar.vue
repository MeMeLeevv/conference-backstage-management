<template>
  <div id="navBar" class="clearify">
    <!-- 可利用transition进行过度 -->
    <el-dialog title="栏目信息" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item
          label="栏目名称"
          :label-width="formLabelWidth"
          prop="name"
        >
          <el-input
            v-model="form.name"
            autocomplete="off"
            placeholder="请输入栏目名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="栏目类型" :label-width="formLabelWidth">
          <el-select v-model="form.type" placeholder="请选择栏目类型">
            <el-option :value="1" label="headImage"></el-option>
            <el-option :value="2" label="background"></el-option>
            <el-option :value="3" label="highlight"></el-option>
            <el-option :value="4" label="scale"></el-option>
            <el-option :value="5" label="excellenceAward"></el-option>
            <el-option :value="6" label="guests"></el-option>
            <el-option :value="7" label="agenda"></el-option>
            <el-option :value="8" label="news"></el-option>
            <el-option :value="9" label="registration"></el-option>
            <el-option :value="10" label="partners"></el-option>
            <el-option :value="11" label="cooperativeMedia"></el-option>
            <el-option :value="12" label="address"></el-option>
            <el-option :value="13" label="contact"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.stop="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click.stop="isAddNewC ? addNewColumn('ruleForm') : editColumn('ruleForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
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
          <img src="../../assets/images/avatar.jpg" alt="Your Avatar" />
        </div>
        <div v-for="nav in navMsg" :key="nav.id">
          <el-menu-item
            v-if="nav.subTitle.length === 0 && !nav.needAddBtn"
            :index="nav.jump_url"
          >
            <i :class="nav.icon + ' iconfont'"></i>
            <span>{{ nav.name }}</span>
          </el-menu-item>
          <!-- 栏目配置 -->
          <el-submenu
            v-if="nav.name.indexOf('栏目') !== -1 && nav.needAddBtn"
            :index="nav.jump_url"
          >
            <template slot="title">
              <i :class="nav.icon + ' iconfont'"></i>
              <span :class="columnTitleActive ? 'activeColor' : ''">{{ nav.name }}</span>
            <i class="iconfont iconwenhao" title="栏目可拖动以调整网页展示顺序"></i>
            </template>
            <el-menu-item-group>
              <draggable
                :list="nav.subTitle"
                :disabled="!enabled"
                class="list-group"
                ghost-class="ghost"
                @start="dragging = true"
                @end="dropColumn"
              >
                <div
                  class="list-group-item"
                  v-for="(item, index) in nav.subTitle"
                  :key="item.c_id"
                  :data-index="index"
                  @click.stop="saveColumnMsg(item)"
                  @mouseenter="item.showEditIcon = true"
                  @mouseleave="item.showEditIcon = false"
                >
                  <el-menu-item :index="item.jump_url" class="router" :class="item.active ? 'activeColor' : ''">
                    <div>
                      {{ item.name }}
                      <i
                        v-if="item.showEditIcon"
                        class="iconfont iconedit"
                        title="编辑栏目名称"
                        @click="clickEditC(item, index)"
                      ></i>
                    </div>
                  </el-menu-item>
                </div>
              </draggable>

              <el-button class="addBtn" @click.stop="clickAddC"
                >新增栏目</el-button
              >
            </el-menu-item-group>
          </el-submenu>
          <!-- 议程管理模块，这里打算不用input直接更改title的值，标题太长了 -->
          <el-submenu
            v-if="nav.name.indexOf('议程') !== -1 && nav.needAddBtn"
            :index="nav.jump_url"
          >
            <template slot="title">
              <i :class="nav.icon + ' iconfont'"></i>
              <span>{{ nav.name }}</span>
            </template>
            <el-menu-item-group>
              <div v-if="nav.subTitle.length > 0">
                <div
                  v-for="sub in nav.subTitle"
                  @click.stop="saveColumnMsg(sub)"
                  :key="sub.id"
                >
                  <el-menu-item :index="sub.jump_url">
                    <div>
                      {{ sub.name }}
                    </div>
                  </el-menu-item>
                </div>
              </div>
              <el-button
                class="addBtn"
                @click.stop="addNewAgenda"
                :disabled="getAgendaBtnDisabled"
                >新增议程</el-button
              >
            </el-menu-item-group>
          </el-submenu>
        </div>
      </el-menu>
    </el-col>
  </div>
</template>

<script>
import { axiosGet, axiosPost } from '../../assets/js/axios';
import { storeLocalData } from '../../assets/js/base';
import { mapMutations, mapGetters } from 'vuex';
import draggable from 'vuedraggable';

/* 现在栏目navbar的需求是，1、能新增，新增时候可编辑name和type（必填,type给select框）确定后给后台，后台返回栏目id,同时button隐藏，出现确定和取消来确定用户想要的位置，此时可拖动？
注意同type的jump_url要归为一类；2、能拖动 */

export default {
  name: 'navBar',
  data () {
    /* 排序字段跟他的index挂钩！！！ */
    var id = this.$route.params.id; //   /117/columnConfig/headImage
    var openColumn = id.substr(0, id.lastIndexOf('/')); // 获取/117/columnConfig，来自动展开激活的那一栏
    return {
      enabled: true,
      columnTitleActive: false, // 栏目配置是否高亮，ElementUI默认不高亮
      dragging: false,
      isAddNewC: true,
      editIndex: 0,
      p_id: id,
      rules: {
        name: [
          { required: true, message: '请输入栏目名称', trigger: 'blur' },
          { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }
        ]
      },
      dialogFormVisible: false,
      form: { // 新增栏目请求需要的数据
        p_id: id,
        name: '',
        type: 1
      },
      formLabelWidth: '120px',
      typeMap: {
        // 栏目类型
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
          jump_url: '/',
          needAddBtn: false,
          icon: 'icon-index',
          subTitle: []
        },
        {
          name: '大会信息',
          jump_url: `/${id}/conferenceMsg`,
          needAddBtn: false,
          icon: 'iconwodedahuiyuan',
          subTitle: []
        },
        {
          name: '栏目配置',
          jump_url: `/${id}/columnConfig`,
          icon: 'icon-more',
          needAddBtn: true,
          subTitle: []
        },
        {
          name: '议程管理',
          jump_url: '/agendaManage',
          icon: 'icon-meeting',
          needAddBtn: true,
          subTitle: [
            { id: '333', jump_url: `/${id}/agendaManage/temp1`, name: '123' },
            { id: '555', jump_url: `/${id}/agendaManage/temp2`, name: '456' }
          ]
        },
        {
          name: '订单管理',
          jump_url: '/orderManage',
          icon: 'icon-order',
          subTitle: [
            {
              name: '大会头图',
              jump_url: '/orderManage/headImage'
            },
            {
              name: '大会亮点',
              jump_url: '/orderManage/highlight'
            },
            {
              name: '大会嘉宾',
              jump_url: '/orderManage/guests'
            },
            {
              name: '合作伙伴',
              jump_url: '/orderManage/partners'
            },
            {
              name: '合作媒体',
              jump_url: '/orderManage/cooperativeMedia'
            },
            {
              name: '大会地址',
              jump_url: '/orderManage/address'
            }
          ]
        },
        {
          name: '客户反馈',
          jump_url: '/clientFeedback',
          icon: 'icon-feedback',
          subTitle: [
            {
              name: '大会头图',
              jump_url: '/clientFeedback/headImage'
            },
            {
              name: '大会亮点',
              jump_url: '/clientFeedback/highlight'
            },
            {
              name: '大会嘉宾',
              jump_url: '/clientFeedback/guests'
            },
            {
              name: '合作伙伴',
              jump_url: '/clientFeedback/partners'
            },
            {
              name: '合作媒体',
              jump_url: '/clientFeedback/cooperativeMedia'
            },
            {
              name: '大会地址',
              jump_url: '/clientFeedback/address'
            }
          ]
        }
      ],
      openColumn: [openColumn]
    };
  },
  watch: {
    '$route' (to, from) { // 记录路由的来源和去路
      this.from = from.path
      this.to = to.path
      // 在修改栏目信息之后，再次点击无法高亮！，但是页面有正确跳转，所以这里手动赋予color，并更改栏目配置的路由使其高亮
      if (to.path.indexOf('columnConfig') === -1) {
        this.columnTitleActive = false
      } else {
        this.columnTitleActive = true
      }
      for (let i = 0; i < this.navMsg[2].subTitle.length; i++) {
        this.navMsg[2].subTitle[i].active = this.navMsg[2].subTitle[i].jump_url === to.path
      }
    }
  },
  computed: {
    ...mapGetters(['getAgendaBtnDisabled'])
  },
  created () {
    let that = this;
    this.columnTitleActive = this.$route.path.indexOf('/columnConfig') !== -1 // 刷新网页监测路由以是否高亮栏目配置
    // 根据大会id获取栏目列表
    axiosGet(
      '/api/column/getColumnList',
      {
        p_id: this.$route.params.id
      },
      res => {
        let data = res.data;
        if (data.code === '1') {
          let subTitle = data.data;
          subTitle.map(item => {
            item.jump_url = `/${item.p_id}/columnConfig/${this.typeMap[item.type]}/column${item.c_id}`; // 根据大会id、栏目类型、栏目id拼接对应的jump_url，同一type的jump_url跳转到同一样式组件
            item.showEditIcon = false; // 是否显示编辑图标
          });
          this.navMsg[2].subTitle = subTitle;
          console.log(subTitle, '查找列表成功');
        } else {
          that.$message.error(data.msg);
        }
      },
      err => {
        that.$message.error(err);
      }
    );
  },
  mounted () {
    this.$nextTick(() => {})
  },
  methods: {
    /* 关于鼠标直接拖拽排序的，navbar列表改变后直接将排序后的数据发请求给后台，下次再次请求时发送更换后的数据即可 */
    ...mapMutations(['setTemporaryAgenda', 'setaAgendaBtnDisabled']),
    /*
    作用：点击新增栏目btn
    @return void
    */
    clickAddC () {
      this.form = { // 初始化栏目信息
        p_id: this.p_id,
        name: '',
        type: 1
      }
      this.isAddNewC = true
      this.dialogFormVisible = true
    },

    /*
    作用：点击编辑栏目图标
    @item: Object 对应新增表单的ref
    @return void
    */
    clickEditC (item, index) {
      this.form = item // 保留栏目信息
      this.isAddNewC = false
      this.editIndex = index
      this.dialogFormVisible = true
    },
    /*
    作用：发送新增栏目请求给后台
    @formName: String 对应新增表单的ref
    @return void
    */
    addNewColumn (formName) {
      let that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          console.log(
            this.form,
            '发送新增栏目请求给后台，后台返回栏目id，然后push进栏目的subTitle中'
          );
          axiosPost(
            '/api/column/newColumn',
            this.form,
            res => {
              let data = res.data;
              console.log(data, '新增信息');
              if (data.code === '1') {
                let result = data.data[0]
                that.$message({
                  message: data.msg,
                  type: 'success'
                });
                // 初始化栏目信息
                result.jump_url = `/${result.p_id}/columnConfig/${this.typeMap[result.type]}/column${result.c_id}`; // 根据大会id、栏目类型、栏目id拼接对应的jump_url，同一type的jump_url跳转到同一样式组件
                result.showEditIcon = false; // 是否显示编辑图标
                this.navMsg[2].subTitle.push(result)
              } else {
                this.$message.error(data.msg);
              }
            },
            err => {
              console.log(err);
              this.$message.error('新增栏目失败，请重试！' + err);
            }
          );
        } else {
          this.$message.error('请正确填写信息！');
        }
      });
    },

    /*
    作用：发送新增栏目请求给后台
    @formName: String 对应新增表单的ref
    @return void
    */
    editColumn (formName) {
      let that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          console.log(
            this.form,
            '发送新增栏目请求给后台，后台返回栏目id，然后push进栏目的subTitle中'
          );
          axiosPost(
            '/api/column/updateColumn',
            this.form,
            res => {
              let data = res.data;
              console.log(data, '编辑信息');
              if (data.code === '1') {
                that.$message({
                  message: data.msg,
                  type: 'success'
                });
                // 初始化栏目信息
                this.form.jump_url = `/${this.form.p_id}/columnConfig/${this.typeMap[this.form.type]}/column${this.form.c_id}`; // 根据大会id、栏目类型、栏目id拼接对应的jump_url，同一type的jump_url跳转到同一样式组件
                this.form.showEditIcon = false; // 是否显示编辑图标
                this.navMsg[2].subTitle.splice(this.editIndex, 1, this.form) // 替换该栏目信息
                this.$router.push(this.form.jump_url)
              } else {
                this.$message.error(data.msg);
              }
            },
            err => {
              console.log(err);
              this.$message.error('新增栏目失败，请重试！' + err);
            }
          );
        } else {
          this.$message.error('请正确填写信息！');
        }
      });
    },
    /*
    作用：发送更新栏目顺序sort请求给后台
    @formName: String 对应新增表单的ref
    @return void
    */
    dropColumn () {
      let sortData = [];
      let that = this;
      this.dragging = false;
      // 改变每个栏目的sort信息，对应索引值
      this.navMsg[2].subTitle = this.navMsg[2].subTitle.map((item, index) => {
        item.sort = index + 1;
        sortData.push(item.c_id);
        return item;
      });
      // 更新栏目排序
      axiosPost(
        '/api/column/sortColumn',
        {
          sortData: JSON.stringify(sortData),
          type: 1
        },
        res => {
          //
          let data = res.data;
          if (data.code === '1') {
            that.$message({
              message: data.msg,
              type: 'success'
            });
          } else {
            this.$message.error(data.msg);
          }
        },
        err => {
          this.$message.error('排序栏目失败，请重试！' + err);
        }
      );
    },
    /*
    作用：新增议程
    @return void
    */
    addNewAgenda () {
      /* 一次只能新增一次议程，！！！！新增议程的时候先往subTitle那里push临时的议程路由对象路径/cid/agendaManage/:index，index（议程id）最好与store的temporaryAgenda挂钩，
    利用agenda来区分本地保存的和后台请求的数据，只要新建就在store文件里保存id = index 并初始化所有数据为空，保存按钮便更新store数据，但页面需要格式检查。保存时候不摧毁，但是仍然要发送请求，只要一发布议程，便摧毁后台的对应数据。
    只要在store中找到agenda，就不在后台中查找，否则去后台查找。
    刚加载页面时全部去后台取数据，不需要本地去找，只要进入新增议程页面后离开就提示请保存否则数据将不会被保存，然后销毁store的temporaryAgenda数据
    */
      /*
    12-5
    获需在新增的时候就发送请求要求返回一个议程id，然后去用议程id去编辑jump_url，与发布版的议程列表数据类似（这里可能存在都加载一个组件发生不刷新的状况）并在created的时候去拉取议程数据，没有的话就展示初始状态
    新增的字段再增加temp = true
    */
      // let id = Math.random().toString(36).substr(2).slice(0, 5) // 生成3-32位长度的字母数字组合的随机字符串
      this.setTemporaryAgenda({
        /* 每次新增都初始化store的temporaryAgenda数据 */
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
      });
      this.navMsg[3].subTitle.push({
        // id: id, /* 随机 ,对应后台的议程id */
        temp: true, // 标知临时数据
        name: '请输入议程名称',
        jump_url: `/${this.$route.params.id}/agendaManage/temp`
      });
      /* 还要将按钮设为不可编辑状态 */
      this.setaAgendaBtnDisabled(true);
    },
    handleOpen (key, keyPath) {
      // console.log(key, keyPath, 'open')
    },
    handleClose (key, keyPath) {
      // console.log(key, keyPath, 'close')
    },
    /*
    作用：navbar被点击后在localStorage中储存栏目信息,以便在每次跳转到对应栏目的页面时可以及时获取到对应的栏目id去拉取数据或者是用户取消修改栏目名称时可以恢复原来的名称
    @msg: String 对应栏目信息
    @return void
    */
    saveColumnMsg (msg) {
      storeLocalData([['columnMsg', msg]]);
      this.$router.push(msg.jump_url);
    }
  },
  components: {
    draggable
  }
};
</script>

<style lang="sass" scoped>
*
  box-sizing: border-box
.activeColor
  color: #ffd04b !important
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
