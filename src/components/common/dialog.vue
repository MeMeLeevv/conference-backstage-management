<template>
  <div id="dislog">
    <!-- 栏目弹窗 -->
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
              clearable
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

          <!-- 数字类 -->
          <el-form-item
            v-if="item.type === 'number'"
            :label="item.label"
            :label-width="formLabelWidth"
          >
            <el-input-number v-model="form[item.key]" :min="1" :max="100" label="请输入内容"></el-input-number>
          </el-form-item>
          <!-- 图片类 -->
          <el-form-item
            v-if="item.type === 'image'"
            prop="image"
            :label="item.label"
            :label-width="formLabelWidth"
          >
            <UploadImage
              :action="`${$store.state.api}/common/uploadImg`"
              :inputName="item.key"
              @getImgMsg="getImgMsg"
              :limit="imgLimit"
            ></UploadImage>
          </el-form-item>
        </div>
      </el-form>

      <!-- 批量上传界面 -->
      <el-form v-if="isBatch&&batchOptions.length > 0">
        <div>
        <!-- 批量上传图片 - 选择哪类图片上传 -->
          <el-form-item
            label="图片类型"
            :label-width="formLabelWidth"
          >
            <el-select v-model="formData.img_type"> <!-- 根据form.key来动态加载图片uploadImage -->
              <el-option
                v-for="item in batchOptions"
                :key="item.img_type"
                :label="item.label"
                :value="item.img_type">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 批量上传开关类 -->
          <el-form-item
            v-if="formData.img_type"
            label="批量方式"
            :label-width="formLabelWidth"
          >
            <el-switch
              v-model="formData.new_type"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :disabled="switchDisabled"
            >
            </el-switch>
            <span>{{ formData.new_type ? "同一张图片新建多组数据" : "多张不同图片新建多组数据" }}</span>
          </el-form-item>
          <!-- 需要使用相同图片新建的个数 -->
          <el-form-item
            v-if="formData.img_type&&formData.new_type"
            label="新增个数"
            :label-width="formLabelWidth"
          >
            <el-input-number v-model="formData.new_num" :min="1" :max="imgLimit" label="描述文字"
            ></el-input-number>
          </el-form-item>
          <!-- 图片类 -->
          <el-form-item
            v-if="formData.img_type"
            label="选择图片"
            :label-width="formLabelWidth"
          >
            <UploadImage
              :action="`${$store.state.api}/common/uploadImg`"
              :inputName="formData.img_type"
              @getImgMsg="getImgMsg"
              :limit="formData.new_type ? 1 : imgLimit"
              :addMsg="`可选择${formData.new_type ? 1 : imgLimit}张图，大小不超过200k`"
            ></UploadImage>
          </el-form-item>
      </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel" type="default">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getImgMsg } from '../../assets/js/base';

const UploadImage = () => import('./uploadImage')

export default {
  // 信息如果都已经验证成功，则用formData结合上传后台，触发父元素刷新表格
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
    initTableHeader: {
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
      formData: { // 对象json化字符串
        img_type: '', // title_img_id
        new_type: true, // 后台接收1或者2
        new_num: 1
      },
      form: {
        status: 0,
        imgsArr: [] // [imgid1,imgid2,imgid3,….] json化字符串
      },
      batchOptions: [], // 根据传进来的initTableHeader去key=image的字段
      switchDisabled: false // 批量上传dialog的switch是否禁用
    };
  },
  mounted () {
    this.$nextTick(function () {
      // 根据initTableHeader初始化批量上传时的图片选择
      for (let value of this.initTableHeader) { // 在每次迭代中，将不同属性的值分配给变量
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
    /*
    作用： 上传图片成功后，将图片信息(id/width/height/url)合并到this.form,这里只能上传一张
    @params name: String 该图片的url的key值名称
    @params imgMsgList Array 已上传的图片信息组
    @params isRemove Boolean 如果是移除操作，则需要剔除该图片信息
    @return void
    */
    getImgMsg (name, imgMsgList, isRemove) {
      if (this.isBatch) { // 多图上传
        if (isRemove) { // 如果是移除的话就将this.form.imgsArr全部替换为移除后剩下的图片数组
          let imgsArr = getImgMsg(name, imgMsgList, true) //
          let filterImgArr = []
          for (let i = 0; i < imgsArr.length; i++) {
            filterImgArr.push(imgsArr[i][`${name}_id`])
          }
          this.form.imgsArr = filterImgArr
        } else {
          let imgsArr = getImgMsg(name, imgMsgList, true) //
          this.form.imgsArr = []
          for (let i = 0; i < imgsArr.length; i++) {
            this.form.imgsArr.push(imgsArr[i][`${name}_id`])
          }
        }
        if (this.form.imgsArr.length > 1) { // 限制，如果已经选了多图，那么switch就要有所限制
          this.switchDisabled = true
        } else {
          this.switchDisabled = false
        }
      } else {
        Object.assign(this.form, getImgMsg(name, imgMsgList)); // Object.assign(target, ...sources)合并图片对象
      }
    },
    /*
    作用： 提交数据
    @return void
    */
    submitForm () {
      this.dialogFormVisible = false;
      if (this.isBatch) {
        if (this.formData.new_type) { // 重复上传多张图片
          for (let i = 0; i < this.formData.new_num - 1; i++) {
            this.form.imgsArr.push(this.form.imgsArr[0])
          }
        }
        this.formData.new_type = this.formData.new_type ? 1 : 2
        this.formData.img_type = this.formData.img_type + '_id'
        this.form.data = this.formData
      }
      this.$emit('addbackStageMsg', this.form); /// 触发父组件的addbackStageMsg方法,提交数据给后台
      this.formData = { // 初始化数据
        img_type: '',
        new_type: false,
        new_num: 1
      }
      this.form = {
        status: 0,
        imgsArr: []
      }
      this.switchDisabled = false
    },
    /*
    作用： 取消提交数据
    @return void
    */
    cancel () {
      this.dialogFormVisible = false
      // 初始化
      this.formData = {
        img_type: '',
        new_type: false,
        new_num: 1
      }
      this.form = {
        status: 0,
        imgsArr: []
      }
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
#dislog
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
