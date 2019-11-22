<template>
  <div id="background">
    <!-- 大会背景集合 -->
    <ConfigHeader class="headTitle" title="内容详情" :needDialog="false"></ConfigHeader>
    <quill-editor :content="content"
                :options="editorOption"
                @blur="onEditorBlur($event)"
                @focus="onEditorFocus($event)"
                @ready="onEditorReady($event)"
                @change="onEditorChange($event)">
    </quill-editor>
    <div class="attach">
      <span class="title">图片配置 : </span>
      <uploadImage class="upload" :limit="2" :showFileList="true" addMsg="如有需要，可配置图片，小于1M，非必选"></uploadImage>
    </div>
    <div class="submit">
      <el-button class="save">保存</el-button>
      <el-button class="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import ConfigHeader from '../common/configHeader'
import UploadImage from '../common/uploadImage'
export default {
  name: 'guests',
  data () {
    return {
      hideEditorPanel: true, // 是否隐藏编辑面板
      content: '<h2>I am Example</h2>',
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
    updateMsg () {
      console.log('子组件触发父组件完成')
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
      this.content = html
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
