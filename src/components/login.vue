<template>
  <div id="login" @keyup.enter="submitForm('form')">
    <div class="wrapper">
      <div class="title">登录</div>
      <el-form :model="form" ref="form" label-width="0px" :rules="rules" class="demo-ruleForm" center>
        <el-form-item
          label=""
          prop="user"
        >
          <el-input name="user" prefix-icon="el-icon-user-solid" type="text" v-model="form.user" autocomplete="off" placeholder="请输入您的账号"></el-input>
        </el-form-item>
        <el-form-item
          label=""
          prop="password"
        >
          <el-input name="password" prefix-icon="el-icon-lock" type="password" show-password v-model="form.password" autocomplete="off" placeholder="请输入您的密码"></el-input>
        </el-form-item>
          <el-button class="loginBtn" type="primary" @click="submitForm('form')">登录</el-button>
      </el-form>
      <div class="tips">忘记密码请联系管理员</div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { axiosPost } from '../assets/js/axios';
export default {
  name: 'login',
  data () {
    var validateUser = (rule, value, callback) => { /* 检测input = text的，要不为空 */
      if (!value) {
        return callback(new Error('内容不能为空！'));
      } else {
        callback();
      }
    }
    return {
      form: {
        user: '',
        password: ''
      },
      rules: {
        user: [
          { validator: validateUser, trigger: 'blur' } /* 对应上面的var声明的数据 */
        ],
        password: [
          { validator: validateUser, trigger: 'blur' }
        ]
      }
    };
  },
  created () {
  },
  computed: {
    ...mapGetters(['getOriginPage', 'getHasLogin', 'getAccount'])
  },
  methods: {
    ...mapMutations([
      'setHasLogin', 'setAccount'
    ]),
    keybordEvent () {
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const loading = this.$loading({ // 加载效果
            lock: true,
            text: '登录中...',
            spinner: 'el-icon-loading',
            background: 'rgba(255, 255, 255, 0.7)'
          });
          axiosPost(`${this.$store.state.api}/user/login`, {
            user: this.form.user,
            password: this.form.password
          }, (res) => { /* 查询大会信息并展示在预览区，如果没有值要有初始化 */
            let data = res.data;
            // eslint-disable-next-line eqeqeq
            if (data.code == 1) {
              this.setAccount(data.data); // 设置用户账号
              if (this.getOriginPage) { // 跳转到原来的页面
                this.setHasLogin(true);
                this.$router.push(this.getOriginPage);
              } else { // 否则默认跳转到首页
                this.setHasLogin(true);
                this.$router.push('/');
              }
              loading.close(); /// 关闭加载
            } else {
              loading.close(); /// 关闭加载
              this.$message({
                message: data.msg,
                type: 'error',
                duration: '1000'
              });
            }
            // 请求成功
            this.meetingData = data.data;
          }, (err) => {
            loading.close(); /// 关闭加载
            this.$message({
              message: '登陆失败,请重试！' + err,
              type: 'error',
              duration: '1000'
            });
          });
        } else {
          this.$message.error('内容不能为空！')
        }
      });
    }
  }
};
</script>
<style lang="sass" scoped>
#login
  width: 100%
  height: 100vh
  position: relative
  background: center / cover no-repeat url(../assets/images/loginBg.png)
  .wrapper
    width: 400px
    padding: 50px
    position: absolute
    left: 50%
    top: 50%
    transform: translate(-50%, -50%)
    background: white
    border-radius: 10px
    text-align: center
    .loginBtn
      width: 50%
      margin-bottom: 10px !important
      border-radius: 20px
      border: 0
      background: orange
    .el-input
      font-size: 16px
    .title
      position: relative
      padding: 0  0 50px 0
      font-size: 20px
      font-weight:700
    .title::after
      content: ''
      position: absolute
      left: 50%
      bottom: 50%
      transform: translateX(-50%)
      display: block
      width: 40px
      height: 2px
      background: orange
    .tips
      font-size: 12px
      color: gray
</style>
