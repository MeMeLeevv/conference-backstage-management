<template>
    <div id="home">
        <span class="middle">
          <div class="block" @click="gotoHeadImage" v-for="meeting in meetingData" :key="meeting.id">
            <span class="avatar">
              <el-avatar :size="100" :src="meeting.avatar" @error="errorHandler">
                <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
              </el-avatar>
            </span>
            <div class="title">{{meeting.title}}</div>
        </div>
        </span>
    </div>
</template>

<script>
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
  methods: {
    errorHandler () { /* 头像加载失败 */
      return true
    }, /* '/columnConfig/headImage' */
    gotoHeadImage () {
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
