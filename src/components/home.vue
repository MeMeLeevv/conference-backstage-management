<template>
  <div id="home">

    <div class="block addPro" @click="clickAdd">
      <span class="avatar">
        <i class="iconfont icon-add"></i>
      </span>
      <div class="title">新增大会</div>
    </div>

    <span class="conList">
      <div
        class="block"
        v-for="(meeting,index) in meetingData"
        @click="doTheConference($event, meeting.p_id, index, meeting.name)"
        :key="meeting.p_id"
        :style="`background: ${meeting.status ? '#F0FFF6' : 'white'}`"
      >
        <span class="avatar">
          <el-avatar :size="100" :src="meeting.avatar"
            ><!-- meeting.commonImg.imgurl -->
            <img
              src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
            />
          </el-avatar>
        </span>
        <div class="title">{{ meeting.name }}</div>
        <div class="title">大会状态：<span :style="`color: ${meeting.status ? 'green' : 'gray'}`">{{` ${meeting.status ? '已激活' : '已失效'}`}}</span></div>
        <span class="iconfont iconbianji editConference" title="编辑大会信息"></span>
        <!-- <span class="iconfont icon-delete deleteConference" title="删除大会"></span> -->
      </div>
    </span>
    <el-dialog title="栏目信息" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item
          label="大会名称"
          :label-width="formLabelWidth"
          prop="name"
        >
          <el-input
            v-model="form.name"
            autocomplete="off"
            placeholder="请输入大会名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="大会类型" :label-width="formLabelWidth" required>
          <el-select v-model="form.project_type" placeholder="请选择大会类型">
            <el-option :value="1" label="大会"></el-option>
            <el-option :value="2" label="奖项"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="大会状态" :label-width="formLabelWidth" required>
          <el-switch
            v-model="form.status"
            active-text="激活"
            inactive-text="失效">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="isEdit ? editPro('form') : addPro('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { axiosPost } from '../assets/js/axios';
export default {
  name: 'home',
  data () {
    return {
      isEdit: false,
      rules: {
        name: [{ required: true, message: '请输入栏目名称', trigger: 'blur' }]
      },
      dialogFormVisible: false,
      form: { // 新建大会必传的对象参数
        name: '',
        status: true,
        project_type: 1 // 类型必须是int
      },
      formLabelWidth: '120px',
      meetingData: []
    };
  },
  created () {
    let that = this;
    this.setBackStageTitle('');
    // 请求大会列表
    axiosPost('/project/allProjectList', null,
      res => {
        // 查询大会信息并展示在预览区，如果没有值要有初始化
        let data = res.data;
        console.log(data, '大会列表');
        // eslint-disable-next-line eqeqeq
        if (data.code === '1') {
          if (data.data.length !== 0) { // 防止没有值后执行sort出错
            that.meetingData = data.data;
            this.meetingData.sort((a, b) => b.status - a.status)
          }
        } else {
          this.$message.error(data.msg);
        }
      },
      err => {
        console.log(err);
        this.$message.error('加载大会列表失败！建议重新加载页面！' + err);
      }
    )
  },
  computed: {
    ...mapGetters(['getBackStageTitle'])
  },
  mounted () {
    this.$nextTick(function () {});
  },
  methods: {
    ...mapMutations(['setBackStageTitle']),
    /*
    作用：点击添加大会按钮，初始化form对象
    @return void
    */
    clickAdd () {
      this.dialogFormVisible = true
      this.isEdit = false
      this.form = { // 新建大会必传的对象参数
        name: '',
        status: true,
        project_type: 1 // 类型必须是int
      }
    },
    /*
    作用：进入大会详情管理页面
    @e: event对象
    @id: String 对应大会id
    @index: String 对应大会在meetingData里的索引
    @title: String 对应大会title
    @return void
    */
    doTheConference (e, id, index, title) {
      let className = e.target.className
      console.log(e.target.className, 'e')
      if (className.indexOf('editConference') !== -1) { // 编辑大会
        this.dialogFormVisible = true
        this.isEdit = true
        this.form = this.meetingData[index]
        this.form.status = !!this.form.status
      } else {
        this.setBackStageTitle(title)
        this.$router.push(`/${id}/conferenceMsg`) // 进入大会详细信息页面
      }
    },
    /*
    作用：确认编辑大会信息
    @formName: String 对应form标签的ref="form"
    @id: String 对应大会id
    @return void
    请求需传参数：
    p_id 项目id (必传)
    name 项目名字
    status 项目状态
    project_type 1：大会 2：奖项
    domin_name 域名
    project_desc 大会描述
    begin_time 开始时间
    end_time 结束时间
    schedule 大会议程
    main_color 大会主色
    */
    editPro (formName, id) {
      // 新增大会
      let that = this;
      this.isEdit = true
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          this.form.status = this.form.status ? 1 : 0
          axiosPost('/project/updateProject', this.form,
            res => {
              let data = res.data;
              if (data.code === '1') {
                that.$message({
                  message: data.msg,
                  type: 'success'
                });
                this.meetingData.sort((a, b) => b.status - a.status) // 排序
              } else {
                that.$message.error(data.msg);
              }
            },
            err => {
              this.$message.error('更新大会失败，请重试！' + err);
            });
        } else {
          this.$message.error('信息输入有误！请正确填写信息！');
        }
      });
    },
    /*
    作用：确认添加大会
    @formName: String 对应form标签的ref="form"
    @return void
    请求需传参数：
    name 项目名字 (必传)
    project_type 1：大会 2：奖项 (必传)
    status 项目状态
    domin_name 域名
    project_desc 大会描述
    begin_time 开始时间
    end_time 结束时间
    schedule 大会议程
    main_color 大会主色
    */
    addPro (formName) {
      // 新增大会
      let that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          console.log(
            this.form,
            '发送新增大会请求给后台，后台返回大会信息，然后unshift进大会列表里'
          );
          axiosPost('/project/newProject', {
            name: this.form.name,
            project_type: this.form.project_type,
            status: this.form.status ? 1 : 0
          },
          res => {
            let data = res.data;
            console.log(data, 'new pro')
            if (data.code === '1') {
              that.$message({
                message: data.msg,
                type: 'success'
              });
              console.log(data.data)
              this.meetingData.unshift(data.data);// 网页并发状态较低时可以采取这种形式，否则需要再次请求所有大会项目（刷新）
            } else {
              that.$message.error(data.msg);
            }
          },
          err => {
            this.$message.error('新建大会失败，请重试！' + err);
          }
          );
        } else {
          this.$message.error('信息输入有误！请正确填写信息！');
        }
      });
    }
  }
};
</script>

<style lang="sass" scoped>
#home
  paddng: 0 6.5%
  position: relative
  .block
    display: inline-block
    text-align: center
    margin: 2%
    padding: 20px
    background: white
    box-shadow: 0 0 10px #A8A8A8
    border-radius: 10px
    .title
      font-weight: 700
    .icon-add
      font-size: 100px
      color: #58D5FF
  .block:hover
    cursor: pointer
  .conList
    position: absolute
    left: 50%
    transform: translateX(-50%)
    .block
      display: inline-block
      text-align: center
      width: 29%
      margin: 2.1%
      padding: 20px
      .title
        margin-top: 20px
        font-weight: 700
      .iconfont
        padding: 10px 10px 0 10px
        transition: transform .2s
        font-size: 22px
      .editConference:hover
        transform: scale(1.1)
        cursor: pointer
      .icon-add
        font-size: 100px
        color: lightgreen
    .addPro:hover
        cursor: pointer
</style>
