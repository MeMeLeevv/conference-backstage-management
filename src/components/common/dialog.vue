<template>
  <div id="dislog">
    <!-- 弹窗 -->
    <el-dialog
      v-if="needDialog"
      :title="`请编辑${title}信息`"
      center
      :visible.sync="dialogFormVisible"
      @closed="$emit('closeDialog')"
    >
      <el-form v-if="!isBatch" :model="form" ref="ruleForm">
        <div v-for="item in initDialog" :key="item.id">
          <!-- 文本框类 -->
          <el-form-item
            v-if="item.type === 'text'"
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
              :limit="imgLimit"
            ></UploadImage>
          </el-form-item>
        </div>
      </el-form>

      <!-- 批量上传界面 -->
      <el-form v-if="isBatch">
        <div>
        <!-- 批量上传图片 - 选择哪类图片上传 -->
          <el-form-item
            label="图片类型"
            :label-width="formLabelWidth"
          >
            <el-select v-model="form.data.img_type" @change="changeBatchOption"> <!-- 根据form.key来动态加载图片uploadImage -->
              <el-option
                v-for="item in batchOptions"
                :key="item.img_type"
                :label="item.label"
                :value="item.img_type">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 图片类 -->
          <el-form-item
            label="选择图片"
            :label-width="formLabelWidth"
          >
            <UploadImage
              :inputName="form.data.img_type"
              @getImgMsg="getImgMsg"
              :limit="imgLimit"
            ></UploadImage>
          </el-form-item>
          <!-- 批量上传开关类 -->
          <el-form-item
            label="批量方式"
            :label-width="formLabelWidth"
          >
            <el-switch
              v-model="form.data.new_type"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="newTypeChange"
            >
            </el-switch>
            <span>{{ form.data.new_type ? "使用同一张图片新建" : "使用多张不同图片新建" }}</span>
          </el-form-item>
          <!-- 需要使用相同图片新建的个数 -->
          <el-form-item
            label="新增个数"
            :label-width="formLabelWidth"
          >
            <el-input-number v-model="form.data.new_num" :min="1" :max="10" label="描述文字"></el-input-number>
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
    isBatch: { // 是否是多选
      type: Boolean,
      default: false
    },
    needDialog: {
      type: Boolean,
      default: true
    },
    title: {
      /* 用于编辑header里的‘xxx管理’文字 */
      type: String,
      default: '轮播图'
    },
    imgLimit: {
      type: Number,
      default: 1
    },
    initDialog: {
      /* 初始化弹窗数据 */
      type: Array,
      default: function () {
        // 对象或数组默认值必须从一个工厂函数获取
        return [];
      }
    },
    initTable: {
      /* 初始化表格数据 */
      type: Array,
      default: function () {
        return [];
      }
    }
  },
  watch: {
    needDialog (newV) {
      this.dialogFormVisible = newV
      this.form = {
        status: 0
      }
    }
  },
  data () {
    return {
      dialogFormVisible: false,
      formLabelWidth: '100px',
      dialogVisible: false,
      form: {
        status: 0
      },
      batchOptions: []
    };
  },
  created () {

  },
  mounted () {
    this.$nextTick(function () {
      // 根据initTable初始化批量上传时的图片选择
      for (let value of this.initTable) { // 在每次迭代中，将不同属性的值分配给变量
        if (value.type === 'image') {
          this.batchOptions.push({
            img_type: value.key,
            label: value.label
          })
        }
      }
      console.log(this.batchOptions, 'batchOptions')
    })
  },
  methods: {
    newTypeChange () {
      if (this.form.new_type) {
        this.$emit('toggleNewNum', this.form.new_type)
      }
    },
    /*
    作用： 修改batchOptions选项时，触发父组件更改initTable
    return void
    */
    changeBatchOption () {
      let opt
      for (let i = 0; i < this.batchOptions.length; i++) {
        if (this.batchOptions[i].img_type === this.form.img_type) {
          opt = this.batchOptions[i]
          opt.type = 'image'
          opt.required = true
        }
      }
      this.$emit('changeInitTable', opt)
    },
    getImgMsg (name, imgMsgArr) {
      Object.assign(this.form, getImgMsg(name, imgMsgArr)); // Object.assign(target, ...sources)合并图片对象
    },
    submitForm (formName) {
      /* 触发父组件的addMsg方法 */
      this.dialogFormVisible = false;
      this.$emit('addbackStageMsg', this.form);
    }
  },
  components: {
    UploadImage
  }
};
</script>

<style lang="sass" scoped>
$inputHeight:100px
.relativePos
  position:relative
  width:100%
  height:$inputHeight
.hidden
  opacity:0
.absoluteCenter
  position:absolute
  top:50%
  left:50%
  width:100%
  transform:translate(-50%, -50%)
  .uploadWord
    display:inline-block
    position:relative
    width:100%
    font-size:14px
    line-height:20px
    text-align:center
  .pic
    top:10px
  .word
    bottom:10px
#header
  height:30px
  .title
    position:relative
    height:30px
    padding-left:20px
    font-size:16px
    line-height:30px
    font-weight:700
  .title::before
    content:''
    display:inline-block
    position:absolute
    left:0
    width:4px
    height:100%
    background:#bf4080
  .button:hover
    cursor:pointer
  .button
    float:right
    margin-right:10%
    padding:5px
    border:1px solid #bf4080
    font-size:14px
    color:#bf4080
    background:white
    border-radius:5px
    .iconfont
      color:white
      background:#bf4080
      border-radius:50%
    .fileInput
    position:absolute
    top:50%
    left:0
    z-index:1
    width:100%
    transform:translate(0,-50%)
  .el-image
    position:absolute
    top:50%
    left:0
    margin:0 auto
    background:#f2f2f2
    transform:translate(0, -50%)
  .el-form-item__label
    vertical-align:top
  .el-form-item__content
    line-height:20px
    vertical-align:top
    span
      margin:5px 5px
      font-size:15px
    .tip
    height:20px
    margin:10px 0 0 0
    font-size:14px
    line-height:20px
  .el-switch+ span
    line-height:30px

</style>
