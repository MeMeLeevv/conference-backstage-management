<template>
  <div id="headBar" class="clearify">
    <div v-if="showAvatar" class="avatar"><!-- 用户退出登录后清除相应记录 -->
      <el-avatar :size="30" style="vertical-align:middle" src="http://img.iimedia.cn/10001ef0ab5dd0553c0d6711fb324c6467ee996aa58eda9e3ce5a1655f15e98092874"
      @error="errorHandler">
      <img src="http://img.iimedia.cn/10001ef0ab5dd0553c0d6711fb324c6467ee996aa58eda9e3ce5a1655f15e98092874"/>
    </el-avatar>
    </div>
      <span class="title" :style="`left: ${showAvatar ? '15%' : '5%'}`">{{title}}</span><!-- 这里title需要和用户点击的大会项目有关 -->
      <div class="rightSize">
        <span class="manager"><i class="iconfont icon-people"></i>{{manager}}</span>
        <span class="exit" @click="$emit('exitAccount')"><i class="iconfont icon-exit"></i>退出</span>
      </div>
  </div>
</template>

<script>
export default {
  name: 'headBar',
  props: {
    showAvatar: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: '大会管理后台'
    },
    manager: {
      type: String,
      default: '管理员XXX'
    }
  },
  data () {
    return {
      url: '123'
    }
  },
  methods: {
    errorHandler () { // 头像加载失败
      return true;
    }
  },
  components: {
  }
};
</script>

<style lang="sass">
*
  box-sizing: border-box
#headBar
  width: 100%
  height: 60px
  position: relative
  padding: 0 10%
  background: white
  .avatar
    position: absolute
    left: 13%
    top: 0
    height: 60px
    line-height: 60px
  .title
    position: absolute
    line-height: 60px
    font-size: 24px
    font-weight: 700
  .rightSize
    position: absolute
    right: 13%
    top: 0
    cursor: pointer
    .manager
      color: rgba(170, 71, 108, 1)
    .manager,.exit
      margin: 0 10px 0 0
      line-height: 60px
      .iconfont
        margin: 0 5px 0 10px
        font-size: 18px
</style>
