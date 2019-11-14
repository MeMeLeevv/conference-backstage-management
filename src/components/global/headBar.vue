<template>
  <div id="headBar" class="clearify">
      <span class="title">管理后台 —— 2019全球未来科技大会·广州站</span>
      <div class="rightSize">
        <span class="manager"><i class="iconfont icon-people"></i>{{manager}}</span>
        <span class="exit"><i class="iconfont icon-exit"></i>退出</span>
      </div>
  </div>
</template>

<script>

export default {
  name: 'headBar',
  props: {
    manager: {
      type: String,
      default: '管理员XXX'
    }
  },
  components: {
  }
}
</script>

<style lang="sass">
*
  box-sizing: border-box
#headBar
  width: 100%
  height: 60px
  padding: 0 10%
  background: white
  .title
    line-height: 60px
    font-size: 24px
    font-weight: 700
  .rightSize
    float: right
    cursor: pointer
    .manager,.exit
      margin: 0 10px 0 0
      line-height: 60px
      .iconfont
        margin: 0 5px 0 10px
        font-size: 18px
</style>
