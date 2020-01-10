<template>
  <div id="navBar" class="clearify">
    <!-- 可利用transition进行过度 -->
    <el-dialog title="栏目信息" :visible.sync="dialogFormVisible">
      <!-- 新建栏目dialog -->
      <el-form v-if="isAddNewC" :model="form" :rules="rules" ref="ruleForm">
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
      <!-- 新建议程dialog -->
      <el-form v-if="isAddNewA" :model="form" ref="ruleForm">
        <el-form-item
          label="议程名称"
          :label-width="formLabelWidth"
          prop="name"
        >
          <el-input
            v-model="form.agenda_name"
            autocomplete="off"
            placeholder="请输入议程名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="议程时间" :label-width="formLabelWidth">
          <el-date-picker
            :title="form.agenda_time"
            v-model="form.agenda_time"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="议程地点"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="form.agenda_department"
            autocomplete="off"
            placeholder="请输入议程地点"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.stop="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click.stop="
            isAddNewA ? addNewAgenda('ruleForm') : isAddNewC ? addNewColumn('ruleForm') : editColumn('ruleForm')
          "
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
        active-text-color="white"
      >
        <!-- 头像 -->
        <div class="avatar">
          <img src="../../assets/images/avatar.jpg" alt="Your Avatar" />
        </div>
        <div v-for="nav in navMsg" :key="nav.id">
          <el-menu-item
            v-if="nav.subTitle.length === 0 && !nav.needAddBtn"
            :index="nav.jump_url"
            @click="$router.push(nav.jump_url)"
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
              <span :class="columnTitleActive ? 'activeColor' : ''">{{
                nav.name
              }}</span>
              <i
                class="iconfont iconwenhao"
                title="栏目可拖动以调整网页展示顺序"
              ></i>
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
                  <el-menu-item
                    :index="item.jump_url"
                    class="router"
                    :class="item.active ? 'activeColor' : ''"
                  >
                    <div class="ellipsis">
                      {{ item.name }}
                      <i
                        v-if="item.showEditIcon"
                        class="iconfont iconedit"
                        title="编辑栏目名称"
                        @click="clickEditC(item, index)"
                      ></i>
                      <el-popover placement="top" width="160" v-model="item.visible">
                        <p>确定删除改栏目吗？</p>
                        <div style="text-align: right; margin: 0">
                          <el-button
                            size="mini"
                            type="text"
                            @click="item.visible = false"
                            >取消</el-button
                          >
                          <el-button
                            type="primary"
                            size="mini"
                            @click="clickDeleteC(item, index)"
                            >确定</el-button
                          >
                        </div>
                        <i
                          v-if="item.showEditIcon"
                          class="iconfont icon-delete"
                          title="删除栏目"
                          slot="reference"
                          @click.stop="item.visible = true"
                        ></i>
                      </el-popover>
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
              <span :class="agendaTitleActive ? 'activeColor' : ''">{{
                nav.name
              }}</span>
              <i
                class="iconfont iconwenhao"
                title="议程可拖动以调整展示顺序，状态有‘草稿’或者‘已发布’两种"
              ></i>
            </template>
            <el-menu-item-group>
              <div v-if="nav.subTitle.length > 0">
              </div>
              <draggable
                :list="nav.subTitle"
                :disabled="!enabled"
                class="list-group"
                ghost-class="ghost"
                @start="dragging = true"
                @end="dropColumn(true)"
              >
                <div
                  v-for="(item, index) in nav.subTitle"
                  :key="item.c_id"
                  :data-index="index"
                  @click.stop="saveColumnMsg(item)"
                  style="padding-left: 0"
                >
                  <el-menu-item
                    :index="item.jump_url"
                    :class="item.active ? 'activeColor' : ''"

                  >
                  <i style="position:absolute; left: 10px" class="iconfont" :class="item.status === 1 ? 'iconlinshi' : 'iconyifabu'"
                      :title="item.status === 1 ? '草稿' : '已发布'"
                      ></i>
                    <div class="ellipsis" :title="item.agenda_name">
                      {{ item.agenda_name }}
                    </div>
                  </el-menu-item>
                </div>
              </draggable>
              <el-button
                class="addBtn"
                @click.stop="clickAddA"
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
import { storeLocalData, deepCopy } from '../../assets/js/base';
import { mapMutations, mapGetters } from 'vuex';
import draggable from 'vuedraggable';

/*
这里的elementUI的memu组件省略了router属性，由于我们需要保存每个navbar点击后的msg，然后再跳转页面，如果加上router，执行顺序会相反
防止代码太耦合，记得判断高亮的router的公共字段要放在store中形成变量！！！！！！！！！！

议程逻辑如下：
1、先查询所有议程信息，然后展示在navbar中，要注意临界条件(空数据),navbar中展示的功能还包括可拖动、可新增、标题太长要省略。
2、在上1时已经把所有议程信息（名称、时间、地点）都拉出来了，所以navbar每个议程bar里都要保存好那三点信息，然后点击某一栏就在议程基本信息里赋值，然后再根据8.3 ag _id去获取议程内容，
每次修改议程内容的表格时要通过ag_content_id来更新数据
注意删除议程，既要把navbar里对应的要删掉，router也要即使跳转到上一或者下一或者直接大会信息那里
*/

export default {
  name: 'navBar',
  data () {
    /* 排序字段跟他的index挂钩！！！ */
    var id = this.$route.params.id; //   /117/columnConfig/headImage
    var openColumn = this.$route.path.indexOf('columnConfig') !== -1 ? `/${id}/columnConfig` : `/${id}/agendaManage` // 加载时候navbar展开情况
    return {
      enabled: true,
      columnTitleActive: false, // 栏目配置是否高亮，ElementUI默认不高亮
      agendaTitleActive: false, // 栏目配置是否高亮，ElementUI默认不高亮
      dragging: false,
      isAddNewC: true, // 是否是新建栏目
      isAddNewA: false, // 是否是新建议程
      visible: false, // 删除的弹出框显示状态
      deleteCID: '', // 删除栏目id
      editIndex: 0,
      p_id: id,
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      },
      dialogFormVisible: false,
      form: {
        // 新增栏目请求需要的数据
        p_id: id,
        name: '',
        type: 1,
        agenda_name: '',
        agenda_time: '',
        agenda_department: ''
      },
      formLabelWidth: '120px',
      typeMap: {
        // 请求栏目时根据后台的type来规划router.path
        // 栏目类型
        1: 'headImage',
        2: 'background',
        3: 'highlight',
        4: 'scale',
        5: 'excellenceAwardOrAddress',
        6: 'guests',
        7: 'agendaOrContactOrRegis',
        8: 'news',
        9: 'agendaOrContactOrRegis',
        10: 'parnerOrMedia',
        11: 'parnerOrMedia',
        12: 'excellenceAwardOrAddress',
        13: 'agendaOrContactOrRegis'
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
          jump_url: `/${id}/agendaManage`,
          icon: 'icon-meeting',
          needAddBtn: true,
          subTitle: []
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
    $route (to, from) {
      // 记录路由的来源和去路
      this.from = from.path;
      this.to = to.path;
      // 在修改栏目信息之后，再次点击无法高亮！，但是页面有正确跳转，所以这里手动赋予color，并更改栏目配置的路由使其高亮
      if (to.path.indexOf('columnConfig') === -1) {
        this.columnTitleActive = false;
      } else {
        this.columnTitleActive = true;
      }
      if (to.path.indexOf('agendaManage') === -1) {
        this.agendaTitleActive = false;
      } else {
        this.agendaTitleActive = true;
      }
      for (let i = 0; i < this.navMsg[2].subTitle.length; i++) {
        this.navMsg[2].subTitle[i].active =
          this.navMsg[2].subTitle[i].jump_url === to.path;
      }
      for (let i = 0; i < this.navMsg[3].subTitle.length; i++) {
        this.navMsg[3].subTitle[i].active =
          this.navMsg[3].subTitle[i].jump_url === to.path;
      }
    }
  },
  computed: {
    ...mapGetters(['getAgendaBtnDisabled'])
  },
  created () {
    let that = this;
    this.columnTitleActive = this.$route.path.indexOf('/columnConfig') !== -1; // 刷新网页监测路由以是否高亮栏目配置
    this.agendaTitleActive = this.$route.path.indexOf('/agendaManage') !== -1; // 刷新网页监测路由以是否高亮议程配置
    this.p_id = Number(this.$route.params.id)
    let p1 = this.$axios.get('/api/column/getColumnList', {
      params: { p_id: this.$route.params.id }
    });
    let p2 = this.$axios.get('/api/agenda/getAgenda', {
      params: { p_id: this.$route.params.id }
    });
      // 同时请求栏目列表和议程列表
    Promise.all([p1, p2])
      .then(([columnList, agendaList]) => {
        return {
          columnList: columnList.data,
          agendaList: agendaList.data
        };
      })
      .then(showData => {
        if (
          showData.columnList.code !== '1' ||
          showData.agendaList.code !== '1'
        ) {
          that.$message.error('请求错误，请刷新！');
          return;
        }
        // 栏目
        let subTitle = showData.columnList.data;
        subTitle.map(item => {
          item.jump_url = `/${item.p_id}/columnConfig/${
            this.typeMap[item.type]
          }/column${item.c_id}`; // 根据大会id、栏目类型、栏目id拼接对应的jump_url，同一type的jump_url跳转到同一样式组件
          item.showEditIcon = false; // 是否显示编辑图标
          item.visible = false; // 是否显示提示删除弹出框
        });
        this.navMsg[2].subTitle = subTitle;
        // 议程
        let subTitles = showData.agendaList.data;
        subTitles.map(item => {
          item.jump_url = `/${item.p_id}/agendaManage/${item.a_id}`; // 根据大会id、议程id拼接对应的jump_url
        });
        this.navMsg[3].subTitle = subTitles;
        console.log(subTitles, '查找议程列表成功');

        for (let i = 0; i < this.navMsg[2].subTitle.length; i++) {
          this.navMsg[2].subTitle[i].active =
          this.navMsg[2].subTitle[i].jump_url === this.$route.path;
        }
        for (let i = 0; i < this.navMsg[3].subTitle.length; i++) {
          this.navMsg[3].subTitle[i].active =
          this.navMsg[3].subTitle[i].jump_url === this.$route.path;
        }
      })
      .catch(function (err) {
        console.log(err, '根据栏目id查找栏目信息失败');
        that.$message.error(err);
      });
  },
  mounted () {
    this.$nextTick(() => {});
  },
  methods: {
    /*
    作用：重新请求agenda
    @return void
    */
    requestAgenda (deleteAid) {
      let subTitle = deepCopy(this.navMsg[3].subTitle) // 提前储存议程列表

      axiosGet('/api/agenda/getAgenda', { p_id: this.$route.params.id }, (res) => { /* 查询大会信息并展示在预览区，如果没有值要有初始化 */
        let data = res.data
        console.log(data, '查找列表成功');

        if (data.code === '1') {
          data.data.map(item => {
            item.jump_url = `/${item.p_id}/agendaManage/${item.a_id}`; // 根据大会id、议程id拼接对应的jump_url
          });
          console.log(data.data, 'agendaData');

          this.navMsg[3].subTitle = data.data;

          if (deleteAid) { // 如果是删除议程
            let activeIndex
            let len = subTitle.length
            subTitle.forEach((item, index) => {
              if (item.a_id === deleteAid) activeIndex = index // 找到当前被删除的index
            })
            console.log()
            if (len === 1) { // 如果列表只有一个，删除后默认跳转到大会信息页
              this.$router.push(`/${this.$route.params.id}/conferenceMsg`)
            } else {
              if (activeIndex + 1 < len) {
                activeIndex += 1
              } else if (activeIndex - 1 >= 0) {
                activeIndex -= 1
              }
              storeLocalData([['columnMsg', subTitle[activeIndex]]]);

              this.$router.push(subTitle[activeIndex].jump_url)
            }
          } else {
            for (let i = 0; i < this.navMsg[3].subTitle.length; i++) { // 使navbar对应议程高亮
              this.navMsg[3].subTitle[i].active = this.navMsg[3].subTitle[i].jump_url === this.$route.path;
            }
          }
        } else {
          this.$message.error(data.msg)
        }
      }, (err) => {
        this.$message.error(err)
        console.log(err, '根据大会id查找大会信息失败');
      });
    },
    /* 关于鼠标直接拖拽排序的，navbar列表改变后直接将排序后的数据发请求给后台，下次再次请求时发送更换后的数据即可 */
    ...mapMutations(['setTemporaryAgenda', 'setaAgendaBtnDisabled']),
    /*
    作用：点击新增栏目btn
    @return void
    */
    clickAddC () {
      this.form = {
        // 初始化栏目信息
        p_id: this.p_id,
        name: '',
        type: 1
      };
      this.isAddNewC = true;
      this.isAddNewA = false;
      this.dialogFormVisible = true;
    },

    /*
    作用：点击编辑栏目图标
    @item: Object 对应新增表单的ref
    @return void
    */
    clickEditC (item, index) {
      this.form = item; // 保留栏目信息
      this.isAddNewC = false;
      this.isAddNewA = false;
      this.editIndex = index;
      this.dialogFormVisible = true;
    },
    /*
    作用：点击删除栏目图标
    @item: Object 对应新增表单的ref
    @return void
    */
    clickDeleteC (item, index) {
      item.visible = false
      console.log(item, 'deleteItem');
      let that = this;
      axiosPost(
        '/api/column/updateColumn',
        {
          status: 0,
          c_id: item.c_id
        },
        res => {
          let data = res.data;
          console.log(data, '删除信息');
          if (data.code === '1') {
            that.$message({
              message: data.msg,
              type: 'success'
            });
            this.navMsg[2].subTitle.splice(index, 1);
          } else {
            this.$message.error(data.msg);
          }
        },
        err => {
          console.log(err);
          this.$message.error('新增栏目失败，请重试！' + err);
        }
      );
    },
    /*
    作用：点击新增议程btn
    @return void
    */
    clickAddA () {
      this.form = {
        // 初始化栏目信息
        p_id: this.p_id,
        agenda_name: '',
        agenda_time: '',
        agenda_department: '',
        status: 1
      };
      this.isAddNewC = false;
      this.isAddNewA = true;
      this.dialogFormVisible = true;
    },
    /*
    作用：新增议程
    @return void
    */
    addNewAgenda (formName) {
      let that = this
      this.dialogFormVisible = false;
      console.log(
        this.form,
        '发送新增栏目请求给后台，后台返回栏目id，然后push进栏目的subTitle中'
      );
      // 更新栏目排序
      axiosPost(
        '/api/agenda/newAgenda',
        this.form,
        res => {
          //
          let data = res.data;
          if (data.code === '1') {
            let result = data.data;
            that.$message({
              message: data.msg,
              type: 'success'
            });
            // 初始化栏目信息
            result.jump_url = `/${result.p_id}/agendaManage/${result.a_id}`; // 根据大会id、栏目类型、栏目id拼接对应的jump_url，同一type的jump_url跳转到同一样式组件
            this.navMsg[3].subTitle.push(result);
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
                let result = data.data[0];
                that.$message({
                  message: data.msg,
                  type: 'success'
                });
                // 初始化栏目信息
                result.jump_url = `/${result.p_id}/columnConfig/${
                  this.typeMap[result.type]
                }/column${result.c_id}`; // 根据大会id、栏目类型、栏目id拼接对应的jump_url，同一type的jump_url跳转到同一样式组件
                result.showEditIcon = false; // 是否显示编辑图标
                result.visible = false; // 是否显示删除弹出框
                this.navMsg[2].subTitle.push(result);
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
                this.form.jump_url = `/${this.form.p_id}/columnConfig/${
                  this.typeMap[this.form.type]
                }/column${this.form.c_id}`; // 根据大会id、栏目类型、栏目id拼接对应的jump_url，同一type的jump_url跳转到同一样式组件
                this.form.showEditIcon = false; // 是否显示编辑图标
                this.form.visible = false; // 是否显示删除弹出框
                this.navMsg[2].subTitle.splice(this.editIndex, 1, this.form); // 替换该栏目信息
                this.$router.push(this.form.jump_url);
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
    dropColumn (isAgenda) {
      let sortData = []; let type
      let that = this;
      this.dragging = false;
      if (isAgenda) {
        // 改变每个栏目的sort信息，对应索引值
        this.navMsg[3].subTitle = this.navMsg[3].subTitle.map((item, index) => {
          item.sort = index + 1;
          sortData.push(item.a_id);
          return item;
        });
        type = 4
      } else {
        // 改变每个栏目的sort信息，对应索引值
        this.navMsg[2].subTitle = this.navMsg[2].subTitle.map((item, index) => {
          item.sort = index + 1;
          sortData.push(item.c_id);
          return item;
        });
        type = 1
      }
      // 更新栏目排序
      axiosPost(
        '/api/column/sortColumn',
        {
          sortData: JSON.stringify(sortData),
          type
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
      console.log(msg, 'navBar -msg');
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
  .el-submenu:first-child .el-menu-item
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
