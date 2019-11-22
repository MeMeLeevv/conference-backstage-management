<template>
  <div id="uploadImage">
    <el-upload
      :action="action"
      list-type="picture-card"
      name="img"
      :show-file-list="showFileList"
      :before-upload="beforeAvatarUpload"
      :on-success="uploadSuccess"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :limit="limit"
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
  /* 信息如果都已经验证成功，则用formData结合上传后台，触发父元素刷新表格 */
  name: 'uploadImage',
  props: {
    action: {
      type: String,
      default: '/api/filesaveImg'
    },
    showFileList: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 1
    },
    addMsg: {
      type: String,
      default: '只能上传一张图片文件，且不超过500kb'
    }
  },
  data () {
    /* 新发现！ */
    return {
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  methods: {
    uploadSuccess (response, file, fileList) {
      console.log(response, 'res')
      console.log(file, 'file')
      console.log(fileList, 'fileList')
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload (file) {
      const isJPG = this.isImage(file.type)
      const isLt2M = file.size / 1024 / 1024 < 1
      console.log(file.size, 'file.size')
      if (!isJPG) {
        this.$message.error('请上传图片格式的文件!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 1MB!')
      }
      return isJPG && isLt2M
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
      )
    }
  }
}
</script>

<style lang="sass" scoped></style>
