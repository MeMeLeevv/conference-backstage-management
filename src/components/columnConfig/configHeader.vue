<template>
    <div id="header">
      <span class="title">轮播图管理</span>
      <span class="button">
        <i class="iconfont icon-plus"></i>
        新增轮播图
      </span>
    </div>
</template>

<script>
export default {
  name: 'configHeader'
}
</script>

<style lang="sass" scoped>
#header
  height: 30px
  .title
    position: relative
    height: 30px
    padding-left: 20px
    line-height: 30px
    font-size: 16px
    font-weight: 700
  .title::before
    content: ''
    position: absolute
    left: 0
    display: inline-block
    width: 4px
    height: 100%
    background: #bf4080
  .button:hover
    cursor: pointer
  .button
    float: right
    padding: 5px
    margin-right: 10%
    color: #bf4080
    border: 1px solid #bf4080
    border-radius: 5px
    background: white
    font-size: 14px
    .iconfont
      color: white
      background: #bf4080
      border-radius: 50%
</style>
