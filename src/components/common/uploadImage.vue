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
    inputName: {/* 图片地址对应的name值，方便整合成form一起提交到数据库 */
      type: String,
      default: ''
    }
  },
  data () {
    /* 新发现！ */
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [],
      multiple: false
    };
  },
  methods: {
    uploadSuccess (response, file, fileList) {
      // let path = JSON.parse(response).data
      if (!this.multiple) {
        console.log(response, file, fileList)
        /* let path = [];
        // console.log(fileList, 'fileLsit');
        fileList.forEach(item => {
          // console.log(JSON.parse(item.response), 'item');
          let data = JSON.parse(item.response);
          path.push(data.data);
        });
        // console.log(path, 'path');
        this.multiple = Number(this.limit) > 1;
        this.$emit('getImgPath', this.inputName, path, this.limit > 1) */
      }
    },
    handleRemove (file, fileList) {
      console.log(file, fileList);
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

<style lang="sass" scoped></style>