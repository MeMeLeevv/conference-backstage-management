<template>
    <div id="header">
      <span class="title">{{title}}管理</span>
      <span class="button" @click="dialogFormVisible = true">
        <i class="iconfont icon-plus"></i>
        新增{{title}}
      </span>
      <el-dialog :title="`请编辑${title}信息`" center :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <div v-for="item in initDialog" :key="item.id">
            <el-form-item v-if="item.type === 'text'" :label="`${item.label}${item.required ? '*' : ''} : `" :label-width="formLabelWidth">
              <el-input style="width: 95%" v-model="form[item.key]" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item v-if="item.type === 'Switch'" :label="`${item.label}${item.required ? '*' : ''} : `" :label-width="formLabelWidth">
              <el-switch
                v-model="form[item.key]"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
              <span>{{form[item.key] ? '显示' : '隐藏'}}</span>
            </el-form-item>
            <el-form-item v-if="item.type === 'image'" :label="`${item.label}${item.required ? '*' : ''} : `" :label-width="formLabelWidth">
              <div class="relativePos">
                <el-input type="file" style="width: 20%" class="hidden fileInput"
              v-model="form[item.key]">
              </el-input>
              <el-image
                :style="`width: 100px; height: 100px`"
                fit="contain"
                src=""
                >
                <div slot="error" class="image-slot">
                  <div class="absoluteCenter">
                    <i class="el-icon-picture-outline "></i>
                    <span class="">上传照片</span>
                  </div>
                </div>
              </el-image>
              </div>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'configHeader',
  props: {
    title: {
      type: String,
      default: '轮播图'
    },
    initMsg: {
      type: Object,
      default: function () { /// // 对象或数组默认值必须从一个工厂函数获取
        return {
          name: '名称',
          thumbnail: '',
          state: true,
          link: '',
          id: 5,
          edit: false
        }
      }
    },
    initDialog: {
      type: Array,
      default: function () {
        return [
          {
            label: '名称',
            type: 'text',
            key: 'name',
            required: true
          },
          {
            label: '缩略图',
            type: 'image',
            key: 'thumbnail',
            required: true
          },
          {
            label: '状态',
            type: 'Switch',
            key: 'state',
            required: true
          },
          {
            label: '跳转链接',
            type: 'text',
            key: 'link',
            required: false
          }]
      }
    }
  },
  data () {
    return {
      url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      form: {
        state: true,
        name: '',
        thumbnail: '',
        link: '',
        edit: false
      },
      dialogFormVisible: false,
      formLabelWidth: '100px'
    }
  },
  methods: {
  }
}
</script>

<style lang="sass" scoped>
$inputHeight: 76px
.relativePos
  position: relative
  width: 100%
  height: $inputHeight
.absolutePos
  position: absolute
.hidden
  opacity: 0
.absoluteCenter
  position: absolute
  left: 50%
  top: 50%
  transform: translate(-50%, -50%)
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
  .el-form-item__content
    span
      margin: 0 10px
      font-size: 15px
</style>
