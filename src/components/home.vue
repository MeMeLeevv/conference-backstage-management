<template>
  <div id="home">
    <span class="conList">
      <div
        class="block"
        v-for="meeting in meetingData"
        @click="intoConferece($event, meeting.projectName, meeting.id)"
        :key="meeting.id"
      >
        <span class="avatar">
          <el-avatar :size="200" :src="meeting.avatar"
            ><!-- meeting.commonImg.imgurl -->
            <img
              src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
            />
          </el-avatar>
        </span>
        <div class="title">{{ meeting.name }}</div>
      </div>
      <div class="block addPro" @click="dialogFormVisible = true">
        <span class="avatar">
          <i class="iconfont icon-add"></i>
        </span>
        <div class="title">新增大会</div>
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
              <el-option value="1" label="大会"></el-option>
              <el-option value="2" label="奖项"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addPro('form')"
            >确 定</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { axiosGet, axiosPost } from '../assets/js/axios';

export default {
  name: 'home',
  data () {
    return {
      rules: {
        name: [
          { required: true, message: '请输入栏目名称', trigger: 'blur' }
        ]
      },
      dialogFormVisible: false,
      form: {
        name: '',
        project_type: '大会'
      },
      formLabelWidth: '120px',
      meetingData: []
    };
  },
  created () {
    let that = this;
    this.setBackStageTitle('');

    axiosGet('/api/project/allProjectList', null, (res) => { /* 查询大会信息并展示在预览区，如果没有值要有初始化 */
      let data = res.data;
      console.log(data, '大会列表');
      // 请求失败
      // eslint-disable-next-line eqeqeq
      if (data.code == 1) {

      } else {
        this.$message.error('请求大会列表失败！建议重新加载页面！');
        return false;
      }
      // 请求成功
      that.meetingData = data.data;
    }, (err) => {
      console.log(err);
      this.$message.error('加载大会列表失败！建议重新加载页面！' + err);
    });
  },
  computed: {
    ...mapGetters(['getBackStageTitle'])
  },
  mounted () {
    this.$nextTick(function () {});
  },
  methods: {
    ...mapMutations(['setBackStageTitle']),
    // 进入大会详情管理页面
    intoConferece (e, title, id) {
      /* 点击图片跳转 */
      this.setBackStageTitle(title);
      this.$router.push(`/${id}`);
    },
    /*
    参数：
    name 项目名字 (必传)
    project_type 1：大会 2：奖项 (必传)
    domin_name 域名
    project_desc 大会描述
    begin_time 开始时间
    end_time 结束时间
    schedule 大会议程
    main_color 大会主色

    */
    addPro (formName) {
      // 新增大会
      let that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
          this.dialogFormVisible = false
          console.log(this.form, '发送新增大会请求给后台，后台返回大会信息，然后push进大会列表里')
          axiosPost('/api/project/newProject', this.form, (res) => {
            let data = res.data;
            if (data.code === '1') {
              that.$message({
                message: '恭喜你，新增大会成功',
                type: 'success'
              });
              this.meetingData.unshift(data.data)
            } else {
              that.$message.error('请求成功，但是新增大会失败，请重试！');
            }
          }, (err) => {
            this.$message.error('请求大会列表失败！建议重新加载页面！' + err);
          }, {}, false);
        } else {
          this.$message.error('信息输入有误！请正确填写信息！');
          return false
        }
      })
    }
  }
};
</script>

<style lang="sass" scoped>
#home
  paddng: 0 6.5%
  position: relative
  .conList
    position: absolute
    left: 50%
    transform: translateX(-50%)
    .block
      display: inline-block
      text-align: center
      width: 29%
      margin: 2.1%
      padding: 4%
      border: 1px solid lightgray
      background: white
      .title
        margin-top: 20px
        font-weight: 700
      .icon-add
        font-size: 100px
        color: lightgray
    .addPro:hover
        cursor: pointer
</style>
