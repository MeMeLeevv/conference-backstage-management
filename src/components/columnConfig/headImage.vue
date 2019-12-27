<template>
  <div id="headImage">
    <!-- 大会头图集合 -->
    <!-- ConfigHeader需要传props：
       title：String；
       initDialog：Array 初始化弹窗数据
       格式如下：
       [{
            label: '名称',
            type: 'text',
            key: 'name', /* 对应tableData里的key值 */
            required: true
          }]
        form: Object 提交到后台的数据
        格式如下：
        {
          id: 1, /* id生成方法，前端生成还是后端？ */
          thumbnail: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg', /* 图片 */
          name: '',
          desc: '',
          edit: false,
          state: true
        }
        -->
    <!--
          Table需要传的props
          initTable: Array {/* 初始化表格样式，输入表头类型 */
          格式如下：[{
            label: '显示状态', // 表头名
            widthPercent: 0.12, // 表头占父类长度百分比
            type: 'select', // 表头input类型
            key: 'state' // 他对应表格数据tableData对象里的key值
           ]
          tableData: Array{/* 表格数据 */
            [{ // 如果用户编辑成空数据！！
            id: 0,
            thumbnail: '',
            name: '234233333333333333333333333333333333333333',
            link: '23423777777777777777777777777777777777',
            edit: false, /* 是否为可编辑状态 */
            state: true
          }]
      }
    }
         -->
    <div class="previewArea">
      <div class="area">预览</div>
      <div class="block">
        <span class="title">logo图： </span>
        <ImageShow :url="display.logo_img" :imgW="display.logo_img_width" :imgH="display.logo_img_height"></ImageShow>
      </div>
      <div class="block">
        <span class="title">小图： </span>
        <ImageShow :url="display.small_picture_img" :imgW="small_picture_img_width" :imgH="small_picture_img_height"></ImageShow>
      </div>
    </div>
    <div class="hr"></div>
    <div class="editArea">
      <div class="area">编辑</div>
      <div class="block">
        <span class="title">logo图： </span>
        <UploadImage
          inputName="columnImg"
          @getImgPath="getImgPath"
        ></UploadImage>
      </div>
      <div class="block">
        <span class="title">小图： </span>
        <UploadImage
          inputName="columnImg"
          @getImgPath="getImgPath"
        ></UploadImage>
      </div>
    </div>
  </div>
</template>

<script>
import ImageShow from '../common/imageShow';
import UploadImage from '../common/uploadImage';
import { axiosPost } from '../../assets/js/axios';
import { getLocalData, getherMSg } from '../../assets/js/base';

export default {
  name: 'headImage',
  components: {
    ImageShow,
    UploadImage
  },
  data () {
    var id = this.$route.params.id;
    return {
      display: {

      },
      data: [],
      form: {},
      id: id, // 大会id
      cid: '' // 栏目id
    };
  },
  created () {
    /// let that = this;
    let cData = getLocalData(['columnMsg']);
    this.c_id = cData[0].c_id;
    this.p_id = cData[0].p_id;
    let p1 = this.$axios.get('/api/column/getColumnList', { params: { c_id: cData[0].c_id } })
    let p2 = this.$axios.get('/api/columnObjgroup/getColumnObjGroupList', { params: { c_id: cData[0].c_id } })
    // let showData = {}
    Promise.all([p1, p2]).then(([ColumnList, ColumnObjGroupList]) => {
      return {
        ColumnList: ColumnList.data, ColumnObjGroupList: ColumnObjGroupList.data
      }
    }).then((showData) => {
      if (showData.ColumnList.code !== '1' || showData.ColumnObjGroupList.code !== '1') {
        this.$message.error('请求错误，请刷新！');
        return
      }
      this.display.columnList = showData.ColumnList.data[0]
      this.display.columnGList = showData.ColumnObjGroupList.data
      if (this.display.columnGList.length !== 0) { // 根据组id去查找组内容

      }
      console.log(this.display, 'this.display')
    }).catch(function (err) {
      this.$message.error(err);
    })
  },
  methods: {
    getImgPath (name, path) {
      /* 在这里仅修改栏目内容图的路径 */
      this.form[name] = path;
      console.log(this.form, 'form');
      let data = getherMSg(this.data, [[`${name}`, `${path}`]]); /* 取得更新值之后的参数序列化 */
      axiosPost('/api/filesaveColumn', data, (res) => {
        let data = JSON.parse(res.data);
        if (data.code === '1') {
          this.display.commonImgColumn.imgurl = path;
          console.log(data.data, '修改大会头图成功！');
        } else {
          console.log('请求成功！但是修改大会头图失败');
        }
      }, (err) => {
        console.log(err, '修改大会头图失败');
      }, {}, false);
    }
  }
};
</script>

<style lang="sass" scoped>
#headImage
  .flexTable
    margin: 20px 0
.slide-enter-active,.slide-leave-active
  transition: all 0.3s
.slide-enter,.slide-leave-to
  transform: translate3d(100%, 0, 0)

$colorShow: 20px
.title
  vertical-align: top
  color: gray
  font-weight: 700
.fade-enter-active, .fade-leave-active
  transition: opacity .3s

.fade-enter, .fade-leave-to
  opacity: 0

#headImage
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
    margin: 30px 30px 30px 0
    .block
      vertical-align: top
      margin: 30px 30px 30px 0
      display: inline-block
      #uploadImage
        display: inline-block
</style>
