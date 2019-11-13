<template>
  <div id="headBar">
      <span class="title">管理后台 —— 2019全球未来科技大会·广州站</span>
      <span class="manager"><i class="iconfont iconpeople"></i>管理员XXX</span>
      <span class="exit"><i class="iconfont iconexit"></i>退出</span>
  </div>
</template>

<script>

export default {
  name: 'headBar',
  components: {
  }
}
</script>

<style lang="sass">

#headBar
  width: 100%
  height: 60px
  padding: 0 20px
  .title
    line-height: 60px
    font-size: 24px
    font-weight: 700
  .manager,.exit
    line-height: 60px
</style>
