<template>
  <div id="background">
    <div class="previewArea">
      <div class="block">
        <span class="title">标题图：  </span>
        <ImageShow title="标题图和标题只需提供一项即可"  :url="display.title_img" :imgW="display.title_img_width"
        :imgH="display.title_img_height"></ImageShow>
          <UploadImage v-if="isEdit" inputName="title_img" @getImgMsg="getImgMsg"></UploadImage>
      </div>
      <div class="swatch">
        <span class="title">标题：  </span>
        <span v-if="!isEdit" class="titledis">{{display.title}}</span>
        <el-input style="width: 60%" v-else v-model="form.title"></el-input>
      </div>

      <!-- 新增logo图 -->
    </div>
    <!-- 大会背景集合 claim: 标题图/标题文字/内容文字-->
    <ConfigHeader class="headTitle" title="背景描述" :needDialog="false" :needInnerDialog="false"></ConfigHeader>
    <quill-editor :content="isEdit? form.desc_content : display.desc_content"
                :options="editorOption"
                @blur="onEditorBlur($event)"
                @focus="onEditorFocus($event)"
                @ready="onEditorReady($event)"
                @change="onEditorChange($event)">
    </quill-editor>
    <div class="submit">
      <el-button type="primary" @click="isEdit? submitForm() : (isEdit = true)">{{isEdit ? '保存':'编辑'}}</el-button>
      <el-button v-if="isEdit" type="primary" @click="isEdit = false">取消</el-button>
    </div>
  </div>
</template>

<script>
import ConfigHeader from '../common/configHeader';
import UploadImage from '../common/uploadImage';
import { axiosPost, axiosGet } from '../../assets/js/axios';
import { mapGetters } from 'vuex';
import { getImgMsg, getLocalData, deepCopy } from '../../assets/js/base';
import ImageShow from '../common/imageShow';

export default {
  name: 'guests',
  data () {
    return {/* 只要所属数据跟栏目的关系不是一对一，就放在栏目内容那里，否则放在栏目信息那里 */
      c_id: '',
      p_id: '',
      isEdit: false,
      display: {
        desc_content: ''
      },
      form: {},
      hideEditorPanel: true, // 是否隐藏编辑面板
      editorOption: {
        // some quill options
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // toggled buttons
            [{ 'size': ['small', false, 'large'] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }]
          ]
        }
      },
      columnMsg: {}/* 这里需要防止拉到数据后有些确实是没有值的但是在data收集栏目数据还是取取他的值，这样会造成取了undefined的造成error */
    };
  },
  created () {
    /* 取得当前栏目的信息 */
    /// let that = this;
    let cData = getLocalData(['columnMsg']); // 取出点击保存在本地后的栏目信息
    this.c_id = cData[0].c_id
    this.p_id = cData[0].p_id
    axiosGet('/api/column/getColumnList', { c_id: this.c_id }, (res) => {
      let data = res.data
      if (data.code === '1') {
        this.display = data.data[0];
        console.log(this.display, 'display')
        this.form = deepCopy(this.display)
      } else {
        this.$message.error(data.msg)
      }
    }, (err) => {
      this.$message.error(err)
      console.log(err, '根据栏目id查找栏目信息失败');
    });
  },
  computed: {
    ...mapGetters([
      'getColumnMsg'
    ])
  },
  mounted () {
    this.$nextTick(() => {
      // 初始化编辑器
      let editor = document.querySelector('.ql-container.ql-snow');
      let editorPanel = document.querySelector('.ql-toolbar.ql-snow');
      if (this.hideEditorPanel) { /* 是否隐藏editor面板 */
        editorPanel.style.columnMsg = 'none';
      }
      this.initStyle(editor, {
        'background': 'white',
        'height': '300px',
        'margin-top': '20px',
        'border-top': '1px solid #ccc'
      });
    });
  },
  methods: {/* 增加数据，由子组件触发 */
    /*
    作用：批量修改图片字段信息，基于后台字段统一，如果不统一反而会更麻烦，需要一个一个赋值
    @name: String 图片url字段，其他字段都是在这个基础上加上_xxx
    @imgMsgArr: Array 图片信息
    @return void
    */
    getImgMsg (name, imgMsgArr) {
      Object.assign(this.form, getImgMsg(name, imgMsgArr)); // Object.assign(target, ...sources)合并图片对象
    },
    initStyle (dom, styleArr) { // 更改编辑器默认样式
      for (let item in styleArr) {
        dom.style[item] = styleArr[item];
      }
    },
    /*
    作用：更新栏目数据
    @return void
    */
    submitForm (formName) {
      let that = this
      axiosPost('/api/column/updateColumn', this.form,
        res => {
          let data = res.data;
          if (data.code === '1') {
            this.display = deepCopy(this.form)
            this.isEdit = false
            // console.log(this.display, 'result')
            that.$message({
              message: data.msg,
              type: 'success'
            });
          } else {
            that.$message.error(data.msg);
          }
        },
        err => {
          this.$message.error('更新大会头图失败，请重试！' + err);
        });
    },
    onEditorBlur (editor) {
    },
    onEditorFocus (editor) {
      if (!this.isEdit) { // 如果不是编辑状态，编辑器默认不可编辑
        editor.enable(false)
      } else {
        editor.enable(true)
      }
    },
    onEditorReady (editor) {
    },
    onEditorChange ({ editor, html, text }) {
      this.form.desc_content = html;
    }
  },
  components: {
    ConfigHeader,
    UploadImage,
    ImageShow
  }
};
</script>

<style lang="sass" scoped>
#background
  width: 90%
  .headTitle
    margin-bottom: 10px
  .submit
    float: right
    margin-top: 20px
    .save
      background: #AA476C
      color: white
    .cancel
      background: #DDDDDD
      color: black

$colorShow: 30px
.title,.titledis
  width: 80px
  line-height: 40px
  vertical-align: top
  color: gray
  font-weight: 700
.titledis
  width: 80%
  line-height: 40px
.fade-enter-active, .fade-leave-active
  transition: opacity .3s

.fade-enter, .fade-leave-to
  opacity: 0

.previewArea
  #imageShow
    display: inline-block
    margin-right: 65px
  .swatch
    margin: 30px 30px 30px 0
    .title
      line-height: 40px
    .colorShow:hover
      cursor: pointer
    .colorShow
      margin: 7px 5px
      position: relative
      width: $colorShow
      height: $colorShow
      box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .15), inset 0 0 4px rgba(0, 0, 0, .25)
      border-radius: 3px
  .block
    vertical-align: top
    margin: 10px 0
    #uploadImage
      display: inline-block
      vertical-align: top
</style>
