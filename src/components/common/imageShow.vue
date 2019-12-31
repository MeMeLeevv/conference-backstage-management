<template>
  <div id="imageShow">
    <div class="avatar" @mouseover="showShape = true" @mouseout="showShape = false" @click="dialogVisible = true">
      <el-avatar :class="`${showShape ? 'shape' : ''}`" shape="square" :size="size" fit="fill" :src="url"></el-avatar>
      <div v-if="!!imgW" class="showMsg">{{`( ${imgW} * ${imgH} )`}}</div>
    </div>
    <el-dialog :visible.sync="dialogVisible"><!-- 预览图片,dialog标签不能在avatar类所在的标签下作为子元素，因为dialog显示时是以avatar类标签为父元素而撑满整个屏幕，点击关闭dialog时他会冒泡触发avatar类标签的click导致dialog无法被关闭 -->
      <img @click.stop="" width="100%" :src="url" alt="" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  /* 信息如果都已经验证成功，则用formData结合上传后台，触发父元素刷新表格 */
  name: 'imageShow',
  props: {
    url: {
      type: String,
      default: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
    },
    size: {
      type: Number,
      default: 146
    },
    imgW: {
      type: Number,
      default: 0
    },
    imgH: {
      type: Number,
      default: 0
    }
  },
  data () {
    /* 新发现！ */
    return {
      dialogVisible: false,
      showShape: false
    };
  },
  methods: {
  }
};
</script>

<style lang="sass" scoped>
#imageShow
  text-align:center
  .el-avatar:hover
    cursor: pointer
  .shape
    position: relative
  .shape::before
    content: '\e65d'
    position: absolute
    display: inline-block
    width: 100%
    height: 100%
    background: rgba(0,0,0,.3)
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    font-family: "iconfont" !important
    font-size:18px
    font-style: normal
    -webkit-font-smoothing:antialiased
    -moz-osx-font-smoothing:grayscale
  .showMsg
    margin-top:4px
    padding-top: 7px
    text-align: center
    color: gray
    font-size: 14px
</style>
