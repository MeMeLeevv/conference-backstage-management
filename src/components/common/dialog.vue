<template>
  <div id="dislog">
    <!-- 弹窗 -->
    <el-dialog
      :title="`请编辑${title}信息`"
      center
      :visible.sync="dialogFormVisible"
      @closed="$emit('closeDialog')"
    >
      <el-form :model="form" ref="ruleForm">
        <div v-for="item in initDialog" :key="item.id">
          <!-- 文本框类 -->
          <el-form-item
            v-if="item.type === 'text'"
            prop="name"
            :label="item.label"
            :label-width="formLabelWidth"
          >
            <el-input
              style="width: 95%"
              v-model="form[item.key]"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <!-- 开关类 -->
          <el-form-item
            v-if="item.type === 'Switch'"
            :label="item.label"
            :label-width="formLabelWidth"
          >
            <el-switch
              v-model="form[item.key]"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
            <span>{{ form[item.key] ? "显示" : "隐藏" }}</span>
          </el-form-item>
          <!-- 图片类 -->
          <el-form-item
            v-if="item.type === 'image'"
            prop="image"
            :label="item.label"
            :label-width="formLabelWidth"
          >
            <UploadImage
              :inputName="item.key"
              @getImgMsg="getImgMsg"
            ></UploadImage>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import UploadImage from './uploadImage';
import { getImgMsg } from '../../assets/js/base';

export default {
  /* 信息如果都已经验证成功，则用formData结合上传后台，触发父元素刷新表格 */
  name: 'dislog',
  props: {
    needDialog: {
      type: Boolean,
      default: true
    },
    title: {
      /* 用于编辑header里的‘xxx管理’文字 */
      type: String,
      default: '轮播图'
    },
    initDialog: {
      /* 初始化弹窗数据 */
      type: Array,
      default: function () {
        // 对象或数组默认值必须从一个工厂函数获取
        return [];
      }
    }
  },
  watch: {
    needDialog (newV) {
      this.dialogFormVisible = newV
    }
  },
  data () {
    /* 新发现！ */
    /* var validateName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('内容不能为空！'));
      }
    };
    var validateImage = (rule, value, callback) => {
      // 检测图片地址，除了要是图片，而且还应该检测是否为合格的存在的可以展示的图片
      console.log(value, 'value');
      if (!value) {
        return callback(new Error('请选择一张图片'));
      }
      if (!this.isImage(value)) {
        return callback(new Error('文件格式需要是图片！请重新选择'));
      }
    }; */
    return {
      url:
        'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      dialogFormVisible: false,
      formLabelWidth: '100px',
      dialogVisible: false,
      form: {
        status: 0
      }
    };
  },
  methods: {
    getImgMsg (name, imgMsgArr) {
      Object.assign(this.form, getImgMsg(name, imgMsgArr)); // Object.assign(target, ...sources)合并图片对象
    },
    submitForm (formName) {
      /* 触发父组件的addMsg方法 */
      this.dialogFormVisible = false;
      this.$emit('addMsg', this.form);
    }
  },
  components: {
    UploadImage
  }
};
</script>

<style lang="sass" scoped>
$inputHeight: 100px
.relativePos
  position: relative
  width: 100%
  height: $inputHeight
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
