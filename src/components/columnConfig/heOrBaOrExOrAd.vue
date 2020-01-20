<template>
  <div id="heOrBaOrExOrAd">
    <!-- 头图、背景、奖项、地址集合 -->
    <div v-if="type === 1" class="previewArea">
      <div class="block">
        <span class="title">主图： </span>
        <ImageShow
          :url="display.background_img"
          :imgId="display.background_img_id - 0"
          :imgW="display.background_img_width - 0"
          :imgH="display.background_img_height - 0"
          :jump_url="display.background_img_jumpurl"
          :isEdit="isEdit"
          imgName="background_img"
          @deleteImg="deleteImg"
        ></ImageShow>
        <UploadImage
          v-if="isEdit"
          :action="`${$store.state.api}/common/uploadImg`"
          inputName="background_img"
          @getImgMsg="getImgMsg"
          addMsg="只能上传一张图片"
        ></UploadImage>
      </div>
    </div>
    <div v-if="type === 2" class="previewArea">
      <div class="block">
        <span class="title">标题图： </span>
        <ImageShow
          title="标题图和标题只需提供一项即可"
          :url="display.title_img"
          :imgW="display.title_img_width - 0"
          :imgH="display.title_img_height - 0"
          :jump_url="display.title_img_jumpurl"
          :isEdit="isEdit"
          imgName="title_img"
          @deleteImg="deleteImg"
        ></ImageShow>
        <UploadImage
          v-if="isEdit"
          :action="`${$store.state.api}/common/uploadImg`"
          inputName="title_img"
          @getImgMsg="getImgMsg"
        ></UploadImage>
      </div>
      <div
        class="swatch"
        title="如果同时提供标题文字和标题图片，会优先展示标题文字"
      >
        <span class="title">标题： </span>
        <span v-if="!isEdit" class="titledis">{{ display.title }}</span>
        <el-input style="width: 60%" v-else v-model="form.title"></el-input>
      </div>

      <ConfigHeader
        class="headTitle"
        title="背景描述"
        :needDialog="false"
        :needInnerDialog="false"
      ></ConfigHeader>
      <!-- <quill-editor ref="myQuillEditor" :content="isEdit? form.desc_content : display.desc_content"
                :options="editorOption"
                @focus="onEditorFocus($event)"
                @change="onEditorChange($event)">
    </quill-editor> -->
      <el-input
        type="textarea"
        :rows="10"
        placeholder="请输入背景描述"
        v-model="form.desc_content"
        :disabled="!isEdit"
      >
      </el-input>
    </div>
    <!-- 大会背景集合 claim: 标题图/标题文字/内容文字-->
    <div v-if="type === 5 || type === 12" class="previewArea">
      <div
        class="swatch"
        title="如果同时提供标题文字和标题图片，会优先展示标题文字"
      >
        <span class="title">标题： </span>
        <span v-if="!isEdit" class="titledis">{{ display.title }}</span>
        <el-input style="width: 60%" v-else v-model="form.title"></el-input>
      </div>
      <div class="block">
        <span class="title">标题图： </span>
        <ImageShow
          title="标题图和标题只需提供一项即可"
          :url="display.title_img"
          :imgW="display.title_img_width - 0"
          :imgH="display.title_img_height - 0"
          :jump_url="display.title_img_jumpurl"
          :isEdit="isEdit"
          imgName="title_img"
          @deleteImg="deleteImg"
        ></ImageShow>
        <UploadImage
          v-if="isEdit"
          :action="`${$store.state.api}/common/uploadImg`"
          inputName="title_img"
          @getImgMsg="getImgMsg"
        ></UploadImage>
      </div>
      <div class="block">
        <span class="title">主图： </span>
        <ImageShow
          :url="display.background_img"
          :imgW="display.background_img_width - 0"
          :imgH="display.background_img_height - 0"
          :jump_url="display.background_img_jumpurl"
          :isEdit="isEdit"
          imgName="background_img"
          @deleteImg="deleteImg"
        ></ImageShow>
        <UploadImage
          v-if="isEdit"
          :action="`${$store.state.api}/common/uploadImg`"
          inputName="background_img"
          @getImgMsg="getImgMsg"
          addMsg="只能上传一张图片"
        ></UploadImage>
      </div>
      <div class="block" v-if="type === 5">
        <span class="title">主图链接： </span>
        <span v-if="!isEdit" class="titledis">{{ display.jump_url }}</span>
        <el-input style="width: 60%" v-else v-model="form.jump_url"></el-input>
      </div>
    </div>
    <div class="submit">
      <el-button
        type="primary"
        @click="isEdit ? submitForm() : (isEdit = true)"
        >{{ isEdit ? "保存" : "编辑" }}</el-button
      >
      <el-button type="default" v-if="isEdit" @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import { axiosPost, axiosGet } from '../../assets/js/axios';
import { mapGetters } from 'vuex';
import { getImgMsg, getLocalData, deepCopy } from '../../assets/js/base';

const ConfigHeader = () => import('../common/configHeader');
const ImageShow = () => import('../common/imageShow');
const UploadImage = () => import('../common/uploadImage');
export default {
  name: 'heOrBaOrExOrAd',
  data () {
    return {
      /* 只要所属数据跟栏目的关系不是一对一，就放在栏目内容那里，否则放在栏目信息那里 */
      c_id: '',
      p_id: '',
      isEdit: false,
      display: {
        desc_content: ''
      },
      form: {},
      isDeleteOriginImg: false, // 是否有点击原图删除
      originImg: {}, // 保存原始图片信息
      hideEditorPanel: true, // 是否隐藏编辑面板
      editorOption: {
        // 富文本的可编辑选项
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // toggled buttons
            [{ size: ['small', false, 'large'] }],
            [{ list: 'ordered' }, { list: 'bullet' }]
          ]
        }
      },
      columnMsg: {}
    };
  },
  created () {
    // 取得当前栏目的信息
    let cData = getLocalData(['columnMsg']); // 取出点击保存在本地后的栏目信息
    if (!cData[0].c_id) {
      // 如果没有缓存，则跳转到首页
      this.$router.push('/');
      return;
    }
    this.c_id = cData[0].c_id;
    this.p_id = cData[0].p_id;
    this.type = cData[0].type;

    axiosGet(
      `${this.$store.state.api}/column/getColumnList`,
      { c_id: this.c_id },
      res => {
        let data = res.data;
        if (data.code === '1') {
          this.display = data.data[0];
          this.form = deepCopy(this.display);
        } else {
          this.$message.error(data.msg);
        }
      },
      err => {
        this.$message.error(err);
      }
    );
  },
  computed: {
    ...mapGetters(['getColumnMsg'])
  },
  mounted () {
    this.$nextTick(() => {
      // 初始化编辑器
      /* let editor = document.querySelector('.ql-container.ql-snow');
      let editorPanel = document.querySelector('.ql-toolbar.ql-snow');
      if (this.hideEditorPanel) { // 是否隐藏editor面板
        editorPanel.style.columnMsg = 'none';
      }
      this.initStyle(editor, {
        'background': 'white',
        'height': '300px',
        'margin-top': '20px',
        'border-top': '1px solid #ccc'
      }) */
    });
  },
  methods: {
    /* 增加数据，由子组件触发 */
    /*
    作用：批量修改图片字段信息，基于后台字段统一，如果不统一反而会更麻烦，需要一个一个赋值
    @name: String 图片url字段，其他字段都是在这个基础上加上_xxx
    @imgMsgArr: Array 图片信息
    @return void
    */
    getImgMsg (name, imgMsgArr, isRemove) {
      console.log(this.form, 'getImgMsg')

      Object.assign(this.form, getImgMsg(name, imgMsgArr)); // Object.assign(target, ...sources)合并图片对象
      if (isRemove) {
        let keys = Object.keys(this.form)
        for (let i = 0; i < keys.length; i++) {
          if (keys[i].indexOf(name) !== -1) {
            delete this.form[keys[i]]
          }
        }
      }
    },
    /* initStyle (dom, styleArr) {
      // 更改编辑器默认样式
      for (let item in styleArr) {
        dom.style[item] = styleArr[item];
      }
    }, */
    /*
    作用：更新栏目数据
    @return void
    */
    submitForm () {
      let that = this;
      axiosPost(
        `${this.$store.state.api}/column/updateColumn`,
        this.form,
        res => {
          let data = res.data;
          if (data.code === '1') {
            this.display = Object.assign(this.display, deepCopy(this.form));
            this.isEdit = false;
            that.$message({
              message: data.msg,
              type: 'success'
            });
            this.isDeleteOriginImg = false;
          } else {
            that.$message.error(data.msg);
          }
        },
        err => {
          this.$message.error('更新大会头图失败，请重试！' + err);
        }
      );
    },
    /*
    作用：点击删除图标将该图片的信息清空
    @params clearImgObj Object 子组件传进来的已经清空的图片信息
    @params originImg Object 子组件传进来的原始的图片信息
    @return void
    */
    deleteImg (clearImgObj, originImg) {
      this.isDeleteOriginImg = true;
      this.originImg = Object.assign(this.originImg, originImg);
      this.display = Object.assign(this.display, clearImgObj);
      this.form = deepCopy(this.display);
    },
    /*
    作用：恢复数据
    @return void
    */
    cancel () {
      this.isEdit = false;
      if (this.isDeleteOriginImg) {
        this.display = Object.assign(this.display, this.originImg);
        this.isDeleteOriginImg = false;
      }
    }
    /*
    作用：点击富文本编辑器，如果不是编辑状态，编辑器默认不可编辑
    @params editor Object 事件对象
    @return void
    */
    /* onEditorFocus (editor) {
      if (!this.isEdit) {
        this.$refs.myQuillEditor.quill.enable(false);
      } else {
        this.$refs.myQuillEditor.quill.enable(true);
      }
    }, */
    /*
    作用：编辑器被改动时，内容同步更新到this.form.desc_content
    @params editor Object 事件对象
    @return void
    */
    /* onEditorChange ({ editor, html, text }) {
      this.form.desc_content = html;
    } */
  },
  components: {
    ConfigHeader,
    UploadImage,
    ImageShow
  }
};
</script>

<style lang="sass" scoped>
#heOrBaOrExOrAd
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
