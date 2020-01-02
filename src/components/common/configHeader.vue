<template>
    <div id="header">
      <span class="title">{{title}}管理</span>
      <span v-if="needDeleteBtn" class="button" @click="$emit('deleteAgenda')">
        <i class="iconfont icon-delete"></i>
        删除{{title}}
        </span>
      <span v-if="needInnerDialog" class="button" @click="$emit(addGroupDetail)">
        <i class="iconfont icon-plus"></i>
        新增{{title}}
        </span>
        <!-- 弹窗 -->
      </div>
</template>

<script>

export default {/* 信息如果都已经验证成功，则用formData结合上传后台，触发父元素刷新表格 */
  name: 'configHeader',
  props: {
    title: {
      type: String,
      default: ''
    },
    needDeleteBtn: {
      type: Boolean,
      default: false
    },
    needInnerDialog: {
      type: Boolean,
      default: true
    }
  },
  data () { /* 新发现！ */
    return {
      url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
    }
  },
  methods: {
  },
  components: {
  }
};
</script>

<style lang="sass" scoped>
$inputHeight: 100px
.relativePos
  position: relative
  width: 100%
  height: $inputHeight
.absolutePos
  position: absolute
.hidden
  opacity: 0
.absoluteCenter
  width: 100%
  position: absolute
  left: 50%
  top: 50%
  transform: translate(-50%, -50%)
  .uploadWord
    width: 100%
    display: inline-block
    position: relative
    text-align: center
    line-height: 20px
    font-size: 14px
  .pic
    top: 10px
  .word
    bottom: 10px
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
  .fileInput
    width: 100%
    position: absolute
    left: 0
    top: 50%
    transform: translate(0,-50%)
    z-index: 1
  .el-image
    position: absolute
    left: 0
    top: 50%
    transform: translate(0, -50%)
    margin: 0 auto
    background: #f2f2f2
  .el-form-item__label
    vertical-align: top
  .el-form-item__content
    vertical-align: top
    line-height: 20px
    span
      margin: 5px 5px
      font-size: 15px
  .tip
    margin: 10px 0 0 0
    height: 20px
    line-height: 20px
    font-size: 14px
  .el-switch+span
      line-height: 30px
</style>
