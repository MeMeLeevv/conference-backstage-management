<template>
  <div id="uploadImage">
    <el-upload
      :action="action"
      list-type="picture-card"
      name="file"
      :show-file-list="showFileList"
      :before-upload="beforeAvatarUpload"
      :on-success="uploadSuccess"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      multiple
      :file-list="fileList"
      :limit="limit"
      :on-exceed="imgExceed"
    >
      <i class="el-icon-plus"></i>
      <div slot="tip" class="showMsg el-upload__tip" v-if="imgList.length !== 0">
        <span class="msgItem" v-for="(item) in imgList" :key="item.id">{{`( ${item.width} * ${item.height} )`}}</span>
      </div>
      <div slot="tip" class="el-upload__tip">{{ addMsg }}</div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible"
      ><!-- 预览图片 -->
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  // 信息如果都已经验证成功，则用formData结合上传后台，触发父元素刷新表格
  name: 'uploadImage',
  props: {
    action: {
      type: String,
      default: '/api/common/uploadImg'
    },
    limit: {
      type: Number,
      default: 1
    },
    addMsg: {
      type: String,
      default: '只能上传一张图片文件，且不超过200kb'
    },
    showFileList: {
      type: Boolean,
      default: true
    },
    inputName: {/* 图片信息对应的key值，方便在父组件里整合成form一起提交到数据库 */
      type: String,
      default: ''
    }
  },
  data () {
    return {
      imgList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [],
      multiple: false
    };
  },
  created () {
    this.fileList = []
    this.imgList = []
  },
  methods: {
    /*
    作用：上传成功后触发父组件的getImgMsg方法
    @response: Object 上传的响应结果
    @file: Object  该次请求结果返回的文件和响应信息
    @fileList: Array  请求结果返回的所有文件和响应信息
    @return void
    */
    /* uploadSuccess (response, file, fileList) {
      let that = this
      if (!that.multiple) {
        that.multiple = Number(that.limit) > 1;
        console.log(fileList, 'fileList');

        for (let i = 0; i < fileList.length; i++) {
          console.log(response, '======', file, '========', fileList, 'fileList[' + i + ']');
          (function (i) {
            setTimeout(() => {
              let code = fileList[i].response.code;
              if (code === '1') {
                let data = fileList[i].response.data
                data.uid = fileList[i].uid
                that.imgList.push(data)
                // console.log('imgList' + i + '=>', that.imgList, 'code' + i + '=>', fileList[i].response.code);
              } else {
                that.$message.error(fileList[i].response.msg)
              }
            }, 100);
          })(i)
        }
        that.$emit('getImgMsg', that.inputName, that.imgList)
      }
    }, */
    uploadSuccess (response, file, fileList) {
      let that = this
      console.log(fileList, 'fileList');
      let imgLen = fileList.length
      if (imgLen > 1) { // 多图上传
        console.log(response, file, fileList)
        if (response.code === '1') {
          let data = response.data
          data.uid = file.uid
          that.imgList.push(data)
          if (that.imgList.length === imgLen) {
            that.$emit('getImgMsg', that.inputName, that.imgList)
          }
          console.log('imgList' + '=>', that.imgList)
        } else {
          that.$message.error(response.msg)
        }
      } else {
        let code = response.code;
        if (code === '1') {
          let data = response.data
          data.uid = file.uid
          that.imgList.push(data)
          console.log('imgList' + '=>', that.imgList)
        } else {
          that.$message.error(response.msg)
        }
        that.$emit('getImgMsg', that.inputName, that.imgList)
      }
    },
    handleRemove (file, fileList) { //
      console.log(file, fileList);
      let index = this.imgList.findIndex((item, index) => item.uid === file.uid)
      this.imgList.splice(index, 1)
      this.$emit('getImgMsg', this.inputName, this.imgList, true) // true表示是移除操作
    },
    handlePictureCardPreview (file) { /* 预览的时候 */
      console.log(file.url, 'file.url'); /* blob的临时对象 */
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    beforeAvatarUpload (file) { /* 上传前 */
      const isJPG = this.isImage(file.type);
      const isLt2M = (file.size / 1024 / 200).toPrecision(3) < 1;
      if (!isJPG) {
        this.$message.error('请上传图片格式的文件!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 200k!');
      }
      return isJPG && isLt2M;
    },
    isImage (ext) {
      return (
        [
          'png',
          'jpg',
          'jpeg',
          'bmp',
          'gif',
          'webp',
          'psd',
          'svg',
          'tiff',
          'image/jpeg',
          'image/png',
          'image/gif'
        ].indexOf(ext) !== -1
      );
    },
    imgExceed () {
      this.$message({
        message: '图片只能上传指定数量！,请先删除已存在的图片！',
        type: 'warning'
      });
    }
  }
};
</script>

<style lang="sass" scoped>
.showMsg
  line-height: 20px
  color: gray
  font-size: 14px
  .msgItem
    width: 146px
    height: 18px
    text-align: center
</style>
