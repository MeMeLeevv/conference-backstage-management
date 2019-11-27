<template>
    <div id="home">
        <span class="middle">
          <div class="block" v-for="meeting in meetingData" @click="gotoHeadImage($event,meeting.projectName,meeting.id)" :key="meeting.id">
            <span class="avatar">
              <el-avatar :size="100" :src="meeting.avatar" @error="errorHandler"><!-- meeting.commonImg.imgurl -->
                <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
              </el-avatar>
            </span>
            <div class="title">{{meeting.projectName}}</div>
        </div>
        </span>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'home',
  data () {
    return {
      meetingData: [
        {
          avatar: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/da132c85978729.5d8bbe537d947.gif',
          title: '2019年全球未来科技大会·广州站'
        },
        {
          avatar: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/da132c85978729.5d8bbe537d947.gif',
          title: '2019年全球未来科技大会·广州站'
        },
        {
          avatar: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/da132c85978729.5d8bbe537d947.gif',
          title: '2019年全球未来科技大会·广州站'
        },
        {
          avatar: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/da132c85978729.5d8bbe537d947.gif',
          title: '2019年全球未来科技大会·广州站'
        }
      ]
    }
  },
  created () {
    let that = this
    this.setBackStageTitle('')
    this.$axios.get('/api/conferencegetProjectAll').then(function (res) {
      // console.log(typeof (res.data)) // srting
      let data = JSON.parse(res.data)/* 返回字段是字符串序列，需要把它转换成对象格式 判断是否是字符串，是才要转！！！ */
      console.log(data, 'data')
      if (data.code !== '1') return false
      // 请求成功
      that.meetingData = data.data
    }).catch(function (error) {
      console.log(error)
    }).finally(function () {

    })
  },
  computed: {
    ...mapGetters(['getBackStageTitle'])
  },
  mounted () {
    this.$nextTick(function () {
      /* if (window.history && window.history.pushState) {
        // 向历史记录中插入了当前页
        history.pushState(null, null, document.URL)
        window.addEventListener('popstate', this.goBack, false)
      } */
    })
  },
  /*   destroyed () {
    window.removeEventListener('popstate', this.goBack, false)
  }, */
  methods: {
    ...mapMutations([
      'setBackStageTitle'
    ]),
    /* goBack () {
      // console.log("点击了浏览器的返回按钮");
      sessionStorage.clear()
      window.history.back()
    }, */
    errorHandler () { /* 头像加载失败 */
      return true
    }, /* '/columnConfig/headImage' */
    gotoHeadImage (e, title, id) { /* 点击图片跳转 */
      this.setBackStageTitle(title)
      this.$router.push(`/${id}`)
    }
  }
}
</script>

<style lang="sass" scoped>
#home
  paddng: 0 6.5%
  position: relative
  .middle
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
</style>
