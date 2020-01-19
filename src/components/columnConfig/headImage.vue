<template>
  <div id="headImage">
    <!-- 内容图(contentImg、主色调(mainColor、背景图(commonImg.imgurl) -->
    <div class="previewArea">
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
      <el-button
        type="primary"
        @click="isEdit ? submitForm() : (isEdit = true)"
        >{{ isEdit ? "保存" : "编辑" }}</el-button
      >
      <el-button type="default" v-if="isEdit" @click="cancel">取消</el-button>
      <!-- 新增logo图 -->
    </div>
  </div>
</template>

<script>
import { axiosPost, axiosGet } from '../../assets/js/axios';
import { getLocalData, deepCopy, getImgMsg } from '../../assets/js/base';

const ImageShow = () => import('../common/imageShow');
const UploadImage = () => import('../common/uploadImage');
export default {
  name: 'headImage',
  components: {
    ImageShow,
    UploadImage
  },
  data () {
    return {
      c_id: '',
      p_id: '',
      isEdit: false,
      display: {},
      form: {},
      isDeleteOriginImg: false, // 是否有点击原图删除
      originImg: {} // 保存原始图片信息
    };
  },
  created () {
    // 首先先初始化数据，大会头图就是栏目内容里的栏目背景图
    /// let that = this;
    let cData = getLocalData(['columnMsg']); // 取出点击保存在本地后的栏目信息
    if (!cData[0].c_id) {
      // 如果没有缓存，则跳转到首页
      this.$router.push('/');
      return;
    }
    this.c_id = cData[0].c_id;
    this.p_id = cData[0].p_id;
    axiosGet(
      `${this.$store.state.api}/column/getColumnList`,
      { c_id: this.c_id },
      res => {
        let data = res.data;
        if (data.code === '1') {
          this.display = data.data[0];
          console.log(this.display, 'resullt');
          this.form = deepCopy(this.display);
        } else {
          this.$message.error(data.msg);
        }
      },
      err => {
        this.$message.error(err);
        console.log(err, '根据栏目id查找栏目信息失败');
      }
    );
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
    submitForm (formName) {
      let that = this;
      axiosPost(
        `${this.$store.state.api}/column/updateColumn`,
        this.form,
        res => {
          let data = res.data;
          if (data.code === '1') {
            this.display = deepCopy(this.form);
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
      console.log(this.form, 'form');
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
#headImage
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
