<template>
  <div id="conferenceMsg" @click.stop="showColor = false"><!-- 内容图(contentImg、主色调(mainColor、背景图(commonImg.imgurl) -->
    <div class="previewArea">
      <div class="area">预览</div>
      <div class="swatch">
        <span class="title">主色调： </span>
        <span class="colorShow" :style="`background: ${display ? display.main_color : 'white'}`">
          <span v-if="display.main_color" style="padding-top: 7px;width: 200px;position: relative;top: 100%;color: gray; font-size: 14px">{{display.main_color}}</span>
        </span>
      </div>
      <div class="block">
        <span class="title">logo图： </span>
        <ImageShow :url="display.logo_img" :imgW="display.logo_img_width" :imgH="display.logo_img_height"></ImageShow>
      </div>
      <div class="block">
        <span class="title">小图： </span>
        <ImageShow :url="display.small_picture_img" :imgW="display.small_picture_img_width" :imgH="display.small_picture_img_height"></ImageShow>
      </div>
      <div class="block">
        <span class="title">背景图：  </span>
        <ImageShow :url="`${display.background_url_img}`" :imgW="display.background_url_img_width" :imgH="display.background_url_img_height"></ImageShow>
      </div>
      <div class="swatch">
        <span class="title">大会名称： {{display.name}}</span>
      </div>
      <div class="swatch">
        <span class="title">大会类型： {{display.project_type === '1' ? '大会' : '奖项'}}</span>
      </div>
      <!-- 新增logo图 -->
    </div>
    <div class="hr"></div>
    <div class="editArea">
      <div class="area">编辑</div>
      <div class="swatch">
        <span class="title" style="line-height: 40px">主色调： </span>
            <el-color-picker
              v-model="form.main_color"
              show-alpha
              :predefine="predefineColors">
            </el-color-picker>
      </div>
      <div class="block">
        <span class="title">logo图：  </span>
        <UploadImage inputName="logo_img" @getImgMsg="getImgMsg"></UploadImage>
      </div>
      <div class="block">
        <span class="title">小图：  </span>
        <UploadImage inputName="small_picture_img" @getImgMsg="getImgMsg"></UploadImage>
      </div>
      <div class="block">
        <span class="title">背景图：  </span>
        <UploadImage inputName="background_url_img" @getImgMsg="getImgMsg" addMsg="只能上传一张图片"></UploadImage>
      </div>
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="大会名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="大会类型" prop="project_type">
          <el-select v-model="form.project_type" placeholder="请选择大会类型">
            <el-option label="大会" :value="1"></el-option>
            <el-option label="奖项" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import UploadImage from './common/uploadImage';
import ImageShow from './common/imageShow';
import { axiosGet, axiosPost } from '../assets/js/axios';
import { deepCopy } from '../assets/js/base';

export default {
  name: 'conferenceMsg',
  data () {
    return {
      errorImg: 'https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png',
      showColor: false,
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        'rgba(255, 69, 0, 0.68)',
        'rgb(255, 120, 0)',
        'hsv(51, 100, 98)',
        'hsva(120, 40, 94, 0.5)',
        'hsl(181, 100%, 37%)',
        'hsla(209, 100%, 56%, 0.73)',
        '#c7158577'
      ],
      rules: {
        name: [
          { required: true, message: '请输入大会名称', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        project_type: [
          { required: true, message: '请选择大会类型', trigger: 'change' }
        ]
      },
      display: {/* 预览区的数据 */
        background_url_img: '',
        background_url_img_height: 0,
        background_url_img_id: '',
        background_url_img_jumpurl: '',
        background_url_img_width: 0,
        logo_img: '',
        logo_img_height: 0,
        logo_img_id: '',
        logo_img_jumpurl: '',
        logo_img_width: 0,
        main_color: '', // 返回rgba格式的字符串 rgba(*,*,*,*)
        name: '',
        p_id: this.$route.params.id,
        project_type: 1,
        small_picture_img: '',
        small_picture_img_height: 0,
        small_picture_img_id: '',
        small_picture_img_jumpurl: '',
        small_picture_img_width: 0,
        status: 1
      },
      form: {
        background_url_img: '',
        background_url_img_height: 0,
        background_url_img_id: '',
        background_url_img_jumpurl: '',
        background_url_img_width: 0,
        logo_img: '',
        logo_img_height: 0,
        logo_img_id: '',
        logo_img_jumpurl: '',
        logo_img_width: 0,
        main_color: '', // 返回rgba格式的字符串 rgba(*,*,*,*)
        name: '',
        p_id: this.$route.params.id,
        project_type: 1,
        small_picture_img: '',
        small_picture_img_height: 0,
        small_picture_img_id: '',
        small_picture_img_jumpurl: '',
        small_picture_img_width: 0
      }
    };
  },
  created () {
    axiosGet('/api/project/getBaseProjectByPid', { p_id: this.$route.params.id }, (res) => { /* 查询大会信息并展示在预览区，如果没有值要有初始化 */
      let data = res.data
      if (data.code === '1') {
        this.display = data.data;
        this.form = deepCopy(this.display)
        console.log(this.display, 'display')
      } else {
        this.$message.error(data.msg)
      }
    }, (err) => {
      this.$message.error(err)
      console.log(err, '根据大会id查找大会信息失败');
    });
  },
  computed: {
    ...mapGetters(['getOriginPage', 'getHasLogin', 'getAccount'])
  },
  methods: {
    ...mapMutations([
      'setHasLogin', 'setAccount'
    ]),
    getImgMsg (name, imgMsgArr) {
      if (imgMsgArr.length === 1) {
        this.form[name] = imgMsgArr[0].img_url
        this.form[`${name}_jumpurl`] = imgMsgArr[0].jump_url
        this.form[`${name}_width`] = imgMsgArr[0].width
        this.form[`${name}_height`] = imgMsgArr[0].height
        this.form[`${name}_id`] = imgMsgArr[0].img_id
      }
    },
    submitForm (formName) {
      let that = this
      console.log(this.form, 'this.form')
      this.$refs[formName].validate((valid) => {
        if (valid) {
          axiosPost('/api/project/updateProject', this.form,
            res => {
              let data = res.data;
              if (data.code === '1') {
                console.log(data.data, 'result')
                this.display = deepCopy(this.form)
                that.$message({
                  message: data.msg,
                  type: 'success'
                });
              } else {
                that.$message.error(data.msg);
              }
            },
            err => {
              this.$message.error('更新大会失败，请重试！' + err);
            });
        } else {
          this.$message.error('信息输入有误！请正确填写信息！');
        }
      })
    }
  },
  components: {
    UploadImage,
    ImageShow
  }
};
</script>
<style lang="sass" scoped>
$colorShow: 30px
.title
  vertical-align: top
  color: gray
  font-weight: 700
.fade-enter-active, .fade-leave-active
  transition: opacity .3s

.fade-enter, .fade-leave-to
  opacity: 0

#conferenceMsg
  .area
    font-size: 22px
    font-weight: 700
    text-align: center
  .editArea
    .area
      margin-top: 30px
  .hr
    height: 10px
    background: white
  .previewArea
    #imageShow
      display: inline-block
      margin-right: 65px
  .editArea,.previewArea
    .swatch
      margin: 30px 30px 30px 0
      .title
        line-height: $colorShow
      .colorShow:hover
        cursor: pointer
      .colorShow
        position: relative
        width: $colorShow
        height: $colorShow
        box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .15), inset 0 0 4px rgba(0, 0, 0, .25)
        border-radius: 3px
        .vc-sketch
          position: absolute
          right: -245px
          top: -100px
          z-index: 1
    .block
      vertical-align: top
      margin: 30px 30px 30px 0
      display: inline-block
      #uploadImage
        display: inline-block
</style>
