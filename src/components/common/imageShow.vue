<template>
  <div id="imageShow">
    <div class="avatar" @mouseenter="showShape = true" @mouseleave="showShape = false">
      <span v-if="showShape && url" class="shape">
        <span class="icon" style="position: absolute; left: 50%;top: 50%; transform: translate(-50%,-50%)">
          <i class="iconfont iconfangda " @click="dialogVisible = true"></i>
          <i v-if="isEdit" class="iconfont icon-delete" @click="deleteImg"></i>
        </span>
      </span>
      <el-avatar shape="square" :size="size" fit="fill" :src="url"></el-avatar>
      <div v-if="!!imgW" class="showMsg">{{`( ${imgW} * ${imgH} )`}}</div>
    </div>
    <el-dialog :visible.sync="dialogVisible"><!-- 预览图片,dialog标签不能在avatar类所在的标签下作为子元素，因为dialog显示时是以avatar类标签为父元素而撑满整个屏幕，点击关闭dialog时他会冒泡触发avatar类标签的click导致dialog无法被关闭 -->
      <img @click.stop="" width="100%" :src="url" alt="" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'imageShow',
  props: {
    imgId: {
      type: Number,
      default: 0
    },
    url: {
      type: String,
      default: ''
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
    },
    jump_url: {
      type: String,
      default: ''
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    imgName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dialogVisible: false,
      showShape: false
    };
  },
  methods: {
    /*
    点击删除图标将该图片的信息清空
    return void
    */
    deleteImg () {
      let obj = {}
      let originImg = {}
      let name = this.imgName
      originImg[name] = this.url // 保存被删除的图片信息，防止用户需要恢复
      originImg[`${name}_jumpurl`] = this.jump_url
      originImg[`${name}_width`] = this.imgW
      originImg[`${name}_height`] = this.imgH
      originImg[`${name}_id`] = this.imgId

      obj[name] = '' // 图片信息清空
      obj[`${name}_jumpurl`] = ''
      obj[`${name}_width`] = ''
      obj[`${name}_height`] = ''
      obj[`${name}_id`] = ''
      this.$emit('deleteImg', obj, originImg)
    }
  }
};
</script>

<style lang="sass" scoped>
$mapSize: 146px
#imageShow
  text-align:center
  .avatar
    position: relative
    .el-avatar:hover
      cursor: pointer
    .shape
      position: absolute
      top: 0
      left: 0
      width: $mapSize
      height: $mapSize
      background: rgba(0,0,0,.3)
      font-family: "iconfont" !important
      font-size:18px
      color: white
      font-style: normal
      -webkit-font-smoothing:antialiased
      -moz-osx-font-smoothing:grayscale
      .icon
        .iconfont
          margin: 0 5px
      .icon:hover
        cursor: pointer
    .showMsg
      margin-top:4px
      padding-top: 7px
      text-align: center
      color: gray
      font-size: 14px
</style>
