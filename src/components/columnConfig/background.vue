<template>
  <div id="background">
    <!-- 大会背景集合 claim: 标题图/标题文字/内容文字-->
    <ConfigHeader class="headTitle" title="内容详情" :needDialog="false"></ConfigHeader>
    <quill-editor :content="form.columnContent.contentText"
                :options="editorOption"
                @blur="onEditorBlur($event)"
                @focus="onEditorFocus($event)"
                @ready="onEditorReady($event)"
                @change="onEditorChange($event)">
    </quill-editor>
    <div class="attach">
      <div class="input">
        <el-input
          placeholder="请输入标题，或者选择上传标题图"
          v-model="form.columnContent.title"
          clearable>
        </el-input>
      </div>
      <div class="img">
        <span class="title">标题图 : </span>
        <uploadImage @getImgPath="getImgPath" inputName="titleImg" class="upload" :limit="1" :showFileList="true" addMsg="如有需要，可配置图片，小于200k，非必选"></uploadImage>
      </div>
    </div>
    <div class="submit">
      <el-button class="save" @click="submit">保存</el-button>
      <el-button class="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import ConfigHeader from '../common/configHeader'
import UploadImage from '../common/uploadImage'
import Qs from 'qs'

export default {
  name: 'guests',
  data () {
    return {/* 只要所属数据跟栏目的关系不是一对一，就放在栏目内容那里，否则放在栏目信息那里 */
      form: { /* 要提交给后台的数据，属于一对一，提交到栏目信息那里 */
        columnContent: {
          title: '',
          contentText: '<h2>I am Example</h2>'
        },
        titleImg: ''
      },
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
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      // 初始化编辑器
      let editor = document.querySelector('.ql-container.ql-snow')
      let editorPanel = document.querySelector('.ql-toolbar.ql-snow')
      if (this.hideEditorPanel) { /* 是否隐藏editor面板 */
        editorPanel.style.display = 'none'
      }
      this.initStyle(editor, {
        'background': 'white',
        'height': '300px',
        'margin-top': '20px',
        'border-top': '1px solid #ccc'
      })
    })
  },
  methods: {/* 增加数据，由子组件触发 */
    initStyle (dom, styleArr) { // 更改编辑器默认样式
      for (let item in styleArr) {
        dom.style[item] = styleArr[item]
      }
    },
    submit () { /* 提交数据 */
      console.log(this.form, 'form')
      this.$axios({/* 提交栏目信息 */
        method: 'post',
        url: '/api/filesaveColumnContent',
        data: this.form,
        transformRequest: [
          function (data) {
            return Qs.stringify(data)
          }
        ],
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(res => {

      }).catch(err => {
        console.log(err)
      }).finally()
    },
    getImgPath (name, value) { /* 获取图片链接，赋值给form */
      this.form[name] = value
    },
    onEditorBlur (editor) {
      console.log('editor blur!', editor)
    },
    onEditorFocus (editor) {
      console.log('editor focus!', editor)
    },
    onEditorReady (editor) {
      console.log('editor ready!', editor)
    },
    onEditorChange ({ editor, html, text }) {
      console.log('editor change!', editor, html, text)
      this.form.columnContent.contentText = html
    }
  },
  components: {
    ConfigHeader,
    UploadImage
  }
}
</script>

<style lang="sass" scoped>
#background
  width: 90%
  .headTitle
    margin-bottom: 10px
  .attach
    margin-top: 20px
    .input
      width: 40%
      margin: 30px 0
    span.title
      vertical-align: top
      margin-right: 20px
      color: gray
    .upload
      display: inline-block
  .submit
    float: right
    margin-top: 20px
    .save
      background: #AA476C
      color: white
    .cancel
      background: #DDDDDD
      color: black
</style>
