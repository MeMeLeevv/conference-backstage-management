<template>
    <div id="header">
      <span class="title">{{title}}管理</span>
      <span class="button" @click="dialogFormVisible = true">
        <i class="iconfont icon-plus"></i>
        新增{{title}}
      </span>
      <!-- 弹窗 -->
      <el-dialog :title="`请编辑${title}信息`" center :visible.sync="dialogFormVisible">
        <el-form :model="form" ref="ruleForm" :rules="rules">
          <div v-for="item in initDialog" :key="item.id">
            <!-- 文本框类 -->
            <el-form-item v-if="item.type === 'text'" prop="name"
            :label="item.label" :label-width="formLabelWidth" :required="item.required">
              <el-input style="width: 95%" v-model="form[item.key]" autocomplete="off" ></el-input>
            </el-form-item>
            <!-- 开关类 -->
            <el-form-item v-if="item.type === 'Switch'" :label="item.label" :label-width="formLabelWidth">
              <el-switch
                v-model="form[item.key]"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
              <span>{{form[item.key] ? '显示' : '隐藏'}}</span>
            </el-form-item>
            <!-- 图片类 -->
            <el-form-item v-if="item.type === 'image'" prop="image" :label="item.label" :label-width="formLabelWidth" required>
              <el-upload
                action="/api/filesaveImg"
                list-type="picture-card"
                name="img"
                :on-success="uploadSuccess"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :limit="1"
                :on-exceed="handExceed"
                >
                <i class="el-icon-plus"></i>
                <div slot="tip" class="el-upload__tip">只能上传一张图片文件，且不超过500kb</div>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible"><!-- 预览图片 -->
                <img width="100%" :src="form[item.key]" alt="">
              </el-dialog>
              <el-input type="text" style="width: 20%; visibility: hidden" class="hidden fileInput"
              v-model="form[item.key]"><!-- 此处可以伪装，如果上传图片成功，input填满，如果验证不合格，清空input，提交时便可以全部都能验证了 -->
              </el-input>
              <!-- <div class="relativePos">
                <el-input type="file" style="width: 20%" class="hidden fileInput"
              v-model="form[item.key]">
              </el-input>
              <el-image
                :style="`width: 100px; height: 100px`"
                fit="contain"
                src=""
                >
                <div slot="error" class="">
                  <div class="absoluteCenter" v-if="!form[item.key]">
                    <i class="el-icon-picture-outline uploadWord pic" style=""></i>
                    <span class="uploadWord word" style="">上传照片</span>
                  </div>
                </div>
              </el-image>
              </div>
              <div class="tip">建议尺寸为200*200像素，大小小于200k</div> -->

            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
export default {/* 信息如果都已经验证成功，则用formData结合上传后台，触发父元素刷新表格 */
  name: 'configHeader',
  props: {
    title: {/* 用于编辑header里的‘xxx管理’文字 */
      type: String,
      default: '轮播图'
    },
    initDialog: {/* 初始化弹窗数据 */
      type: Array,
      default: function () { // 对象或数组默认值必须从一个工厂函数获取
        return [
          {
            label: '名称',
            type: 'text',
            key: 'name', /* 对应tableData里的key值 */
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
    },
    form: {/* 提交到后台的数据 */
      type: Object,
      default: function () {
        return {
          id: 1, /* id生成方法，前端生成还是后端？ */
          thumbnail: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg', /* 图片 */
          name: '',
          desc: '',
          edit: false,
          state: true
        }
      }
    }
  },
  data () { /* 新发现！ */
    var validateName = (rule, value, callback) => { /* 检测input = text的，要不为空 */
      if (!value) {
        return callback(new Error('内容不能为空！'))
      }
    }
    var validateImage = (rule, value, callback) => { /* 检测图片地址，除了要是图片，而且还应该检测是否为合格的存在的可以展示的图片 */
      console.log(value, 'value')
      if (!value) {
        return callback(new Error('请选择一张图片'))
      }
      if (!this.isImage(value)) {
        return callback(new Error('文件格式需要是图片！请重新选择'))
      }
    }
    return {
      url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      dialogFormVisible: false,
      formLabelWidth: '100px',
      dialogVisible: false,
      rules: {
        name: [
          { validator: validateName, trigger: 'blur' } /* 对应上面的var声明的数据 */
        ],
        image: [
          { validator: validateImage, trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    uploadSuccess (response, file, fileList) {
      console.log(response, 'res')
      console.log(file, 'file')
      console.log(fileList, 'fileList')
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview (file) {
      this.form.thumbnail = file.url
      this.dialogVisible = true
      this.$refs['ruleForm'].validateField('image') // 主动去验证image字段
    },
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload (file) {
      const isJPG = this.isImage(file.type)
      const isLt2M = file.size / 500 < 1
      if (!isJPG) {
        this.$message.error('请上传图片格式的文件!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    handExceed () {
      this.$message.error('只能选择一张图!重新上传请删除前一张图！')
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
          this.emitAdd()// 触发父组件方法
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    emitAdd () { /* 触发父组件的addMsg方法 */
      console.log('子组件开始触发父组件方法')
      this.dialogFormVisible = false
      this.$emit('addMsg')
    },
    isImage (ext) {
      return ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff', 'image/jpeg', 'image/png', 'image/gif'].indexOf(ext) !== -1
    }
    /* isImage (url) {
      let index = url.lastIndexOf('.')
      let ext = url.substr(index + 1)
      return ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'].indexOf(ext.toLowerCase()) !== -1
    } */
  }
}
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
