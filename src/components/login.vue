<template>
  <div id="login">
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
          <el-input name="password" prefix-icon="el-icon-lock" type="text" v-model="form.password" autocomplete="off" placeholder="请输入您的密码"></el-input>
        </el-form-item>
          <el-button class="loginBtn" type="primary" @click="submitForm('form')">登录</el-button>
      </el-form>
      <div class="tips">忘记密码请联系管理员</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    var validateUser = (rule, value, callback) => { /* 检测input = text的，要不为空 */
      if (!value) {
        return callback(new Error('内容不能为空！'))
      }
    }
    /*     var validatePassword = (rule, value, callback) => {
      console.log(value, 'value')
      if (!value) {
        return callback(new Error('内容不能为空！'))
      }
    } */
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
    }
  },
  created () {
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
          this.$axios.post('/api/loginCheck', this.form).then((res) => {
            let data = JSON.parse(res.data)
            console.log(data, '登录成功')
            this.$router.push('/') // 跳转到首页
          }).catch((err) => {
            console.log(err, '登陆失败')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="sass" scoped>
#login
  width: 100%
  height: 100vh
  position: relative
  background: center / cover no-repeat url(https://mir-s3-cdn-cf.behance.net/project_modules/1400_opt_1/69fb7187711043.5dc0b3f75df49.jpg)
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
