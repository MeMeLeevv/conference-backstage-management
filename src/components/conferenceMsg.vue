<template>
  <div id="conferenceMsg" @click.stop="showColor = false"><!-- 内容图(contentImg、主色调(mainColor、背景图(commonImg.imgurl) -->
    <div class="previewArea">
      <div class="swatch">
        <span class="title">主色调： </span>
        <span v-if="!isEdit" class="colorShow" :style="`background: ${display ? display.main_color : 'white'}`">
          <span v-if="display.main_color" style="padding-top: 7px;width: 200px;position: relative;top: 100%;color: gray; font-size: 14px">{{display.main_color}}</span>
        </span>
        <el-color-picker
          v-else
          v-model="form.main_color"
          show-alpha
          :predefine="predefineColors">
        </el-color-picker>
      </div>
      <div class="block">
        <span class="title">logo图： </span>
        <ImageShow :url="display.logo_img" :imgW="display.logo_img_width" :imgH="display.logo_img_height"></ImageShow>
          <UploadImage v-if="isEdit" inputName="logo_img" @getImgMsg="getImgMsg" :action="`${$store.state.api}/common/uploadImg`"></UploadImage>
      </div>
      <div class="block" :style="isEdit? 'display: block' : ''">
        <span class="title">小  图： </span>
        <ImageShow  :url="display.small_picture_img" :imgW="display.small_picture_img_width" :imgH="display.small_picture_img_height"></ImageShow>
          <UploadImage v-if="isEdit" inputName="small_picture_img" @getImgMsg="getImgMsg" :action="`${$store.state.api}/common/uploadImg`"></UploadImage>
      </div>
      <div class="block">
        <span class="title">背景图：  </span>
        <ImageShow  :url="`${display.background_img}`" :imgW="display.background_img_width" :imgH="display.background_img_height"></ImageShow>
          <UploadImage v-if="isEdit" inputName="background_img" @getImgMsg="getImgMsg" addMsg="只能上传一张图片" :action="`${$store.state.api}/common/uploadImg`"></UploadImage>
      </div>
      <div class="swatch">
        <span class="title">大会名称：  </span>
        <span v-if="!isEdit" class="titledis">{{display.name}}</span>
        <el-input style="width: 60%" v-else v-model="form.name"></el-input>
      </div>
      <div class="swatch">
        <span class="title">大会类型：  </span>
        <span v-if="!isEdit" class="titledis">{{display.project_type === 1 ? '大会' : '奖项'}}</span>
        <el-select v-else v-model="form.project_type" placeholder="请选择大会类型">
            <el-option label="大会" :value="1"></el-option>
            <el-option label="奖项" :value="2"></el-option>
          </el-select>
      </div>
      <el-button class="saveBtn"  @click="isEdit? submitForm('ruleForm') : isEdit = true">{{isEdit ? '保存':'编辑'}}</el-button>
      <el-button class="cancelBtn" v-if="isEdit" @click="isEdit = false">取消</el-button>
      <!-- 新增logo图 -->
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { axiosGet, axiosPost } from '../assets/js/axios';
import { deepCopy } from '../assets/js/base';

const ImageShow = () => import('./common/imageShow')
const UploadImage = () => import('./common/uploadImage')
export default {
  name: 'conferenceMsg',
  data () {
    return {
      isEdit: false,
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
        background_img: '',
        background_img_height: 0,
        background_img_id: '',
        background_img_jumpurl: '',
        background_img_width: 0,
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
        background_img: '',
        background_img_height: 0,
        background_img_id: '',
        background_img_jumpurl: '',
        background_img_width: 0,
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
    axiosGet(`${this.$store.state.api}/project/getBaseProjectByPid`, { p_id: this.$route.params.id }, (res) => { /* 查询大会信息并展示在预览区，如果没有值要有初始化 */
      let data = res.data
      if (data.code === '1') {
        this.display = data.data;
        this.form = deepCopy(this.display)
        /// console.log(this.form, 'form')
      } else {
        this.$message.error(data.msg)
      }
    }, (err) => {
      this.$message.error(err)
      console.log(err, '根据大会id查找大会信息失败')
    });
  },
  computed: {
    ...mapGetters(['getOriginPage', 'getHasLogin', 'getAccount'])
  },
  methods: {
    ...mapMutations([
      'setHasLogin', 'setAccount', 'setBackStageTitle'
    ]),
    /*
    作用：批量修改图片字段信息，基于后台字段统一，如果不统一反而会更麻烦，需要一个一个赋值
    @name: String 图片url字段，其他字段都是在这个基础上加上_xxx
    @imgMsgArr: Array 图片信息
    @return void
    */
    getImgMsg (name, imgMsgArr) {
      if (imgMsgArr.length === 1) {
        this.form[name] = imgMsgArr[0].img_url
        this.form[`${name}_jumpurl`] = imgMsgArr[0].jump_url
        this.form[`${name}_width`] = imgMsgArr[0].width
        this.form[`${name}_height`] = imgMsgArr[0].height
        this.form[`${name}_id`] = imgMsgArr[0].img_id
      }
    },
    /*
    作用：更新大会数据
    @return void
    */
    submitForm () {
      let that = this
      // console.log(this.form, 'this.form')
      axiosPost(`${this.$store.state.api}/project/updateProject`, this.form,
        res => {
          let data = res.data;
          if (data.code === '1') {
            this.display = deepCopy(this.form)
            this.isEdit = false
            // console.log(this.display, 'result')
            this.setBackStageTitle(this.form.name)
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
        .vc-sketch
          position: absolute
          right: -245px
          top: -100px
          z-index: 1
    .block
      vertical-align: top
      display: inline-block
      margin: 10px 0
      #uploadImage
        display: inline-block
        vertical-align: top
</style>
