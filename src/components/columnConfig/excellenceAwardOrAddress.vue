<template>
  <div id="excellenceAwardOrAddress"><!-- 内容图(contentImg、主色调(mainColor、背景图(commonImg.imgurl) -->
    <div class="previewArea">
      <div class="swatch">
        <span class="title">标题：  </span>
        <span v-if="!isEdit" class="titledis">{{display.title}}</span>
        <el-input style="width: 60%" v-else v-model="form.title"></el-input>
      </div>
      <div class="block">
        <span class="title">标题图：  </span>
        <ImageShow title="标题图和标题只需提供一项即可"  :url="display.title_img" :imgW="display.title_img_width"
        :imgH="display.title_img_height"></ImageShow>
          <UploadImage v-if="isEdit" inputName="title_img" @getImgMsg="getImgMsg"></UploadImage>
      </div>
      <div class="block">
        <span class="title">主图：  </span>
        <ImageShow  :url="display.background_img" :imgW="display.background_img_width"
        :imgH="display.background_img_height"></ImageShow>
          <UploadImage v-if="isEdit" inputName="background_img" @getImgMsg="getImgMsg" addMsg="只能上传一张图片"></UploadImage>
      </div>
      <el-button type="primary" @click="isEdit? submitForm() : (isEdit = true)">{{isEdit ? '保存':'编辑'}}</el-button>
      <el-button v-if="isEdit" type="primary" @click="isEdit = false">取消</el-button>
      <!-- 新增logo图 -->
    </div>
  </div>
</template>

<script>
import { axiosPost, axiosGet } from '../../assets/js/axios';
import { getLocalData, deepCopy, getImgMsg } from '../../assets/js/base';

const ImageShow = () => import('../common/imageShow')
const UploadImage = () => import('../common/uploadImage')
export default {
  name: 'excellenceAwardOrAddress',
  components: {
    ImageShow,
    UploadImage
  },
  data () {
    return {
      c_id: '',
      p_id: '',
      isEdit: false,
      display: {
      },
      form: {}
    }
  },
  created () {
    // 首先先初始化数据，大会头图就是栏目内容里的栏目背景图
    /// let that = this;
    let cData = getLocalData(['columnMsg']); // 取出点击保存在本地后的栏目信息
    this.c_id = cData[0].c_id
    this.p_id = cData[0].p_id
    axiosGet('/column/getColumnList', { c_id: this.c_id }, (res) => {
      let data = res.data
      if (data.code === '1') {
        this.display = data.data[0];
        this.form = deepCopy(this.display)
      } else {
        this.$message.error(data.msg)
      }
    }, (err) => {
      this.$message.error(err)
    });
  },
  methods: {
    /*
    作用：批量修改图片字段信息，基于后台字段统一，如果不统一反而会更麻烦，需要一个一个赋值
    @name: String 图片url字段，其他字段都是在这个基础上加上_xxx
    @imgMsgArr: Array 图片信息
    @return void
    */
    getImgMsg (name, imgMsgArr) {
      Object.assign(this.form, getImgMsg(name, imgMsgArr)); // Object.assign(target, ...sources)合并图片对象
    },
    /*
    作用：更新栏目数据
    @return void
    */
    submitForm () {
      let that = this
      axiosPost('/column/updateColumn', this.form,
        res => {
          let data = res.data;
          if (data.code === '1') {
            this.display = deepCopy(this.form)
            this.isEdit = false
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
    }
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
#excellenceAwardOrAddress
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
