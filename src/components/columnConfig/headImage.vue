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
        <span class="title">内容图： </span>
        <ImageShow url="display.commonImgColumn.imgurl"></ImageShow>
      </div>
    </div>
    <div class="hr"></div>
    <div class="editArea">
      <div class="area">编辑</div>
      <div class="block">
        <span class="title">内容图： </span>
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
import { axiosGet, axiosPost } from '../../assets/js/axios';
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
        /* 预览区 */
      },
      data: [],
      form: {},
      id: id, // 大会id
      cid: '' // 栏目id
    };
  },
  created () {
    /* 请求返回的参数如下：
    id  栏目id
    cid 所属大会id
    name 栏目名称（标题）
    type 栏目类型
    commonImgColumn.imgurl 栏目图片路径
    display 显示状态 0:不显示  1:显示
    createTime 创建时间

    commonImgTitle.imgurl 栏目标题图片路径
      commonImgTitle.link 栏目标题图片跳转链接
    commonImgBackground.imgurl 栏目背景图片路径
      commonImgBackground.link 栏目背景图片跳转链接
    column_describe 栏目描述
      commonImgColumn.link 栏目图片跳转链接
    content_sorting 栏目内容的排序
    structure 页面排版结构
    proportion 页面排版比例
    max_contents 最大内容数量
    extend1 扩展列1
    extend2 扩展列2
    extend3 扩展列3
    */
    // let that = this;
    let id = getLocalData(['columnMsg']);
    /* 返回格式为：
    [{…}]
        0:
        cid: 789 大会id
        id: 166  栏目id
        name: "大会头图"
        type: "0"
        url: "/789/columnConfig/column0"
        __proto__: Object
        length: 1
        __proto__: Array(0) */
    this.id = id[0].id;
    this.cid = id[0].cid;
    axiosGet(
      '/api/conferencegetColumnByColumnid',
      { columnId: id[0].id },
      res => {
        /* 查询大会信息并展示在预览区，如果没有值要有初始化 */
        let data = JSON.parse(res.data);
        if (data.code === '1') {
          this.display = data.data;
          console.log(this.display, 'display');
          /* 大会头图请求现在所必须的数据 */
          this.data = [
            'column.id',
            `${this.display.id}`,
            'column.cid',
            `${this.display.cid}`,
            'column.name',
            `${this.display.name}`,
            'column.type',
            `${this.display.type}`,
            'columnImg',
            `${this.display.commonImgColumn && this.display.commonImgColumn.imgurl}`,
            'column.display',
            `${this.display.display}`
          ];
        } else {
          console.log('请求成功！但是根据栏目id查找大会头图失败');
        }
      },
      err => {
        console.log(err, '根据栏目id查找大会头图失败');
      }
    );
  },
  methods: {
    /* 请求参数：
    column.id 栏目的id
    column.cid 所属大会的id
    column.name 栏目名称
    column.type 栏目类型
    columnImg 栏目图片
    column.display 显示状态 0:不显示  1:显示

    titleImg 栏目标题图片
    titleImgLink 栏目标题图片的跳转链接
    backgroundImg 栏目背景图片
    backgroundImgLink 栏目背景图片的跳转链接
    column.columnDescribe 栏目描述
    columnImgLink 栏目图片的跳转链接
    column.contentSorting 栏目内容排序 (字符串 格式为“内容id3,内容id1,内容id2,……”)
    column.structure 页面排版结构
    column.proportion 页面排版比例
    column.maxContents 最大内容数量
    column.extend1 扩展列1
    column.extend2 扩展列2
    column.extend3 扩展列3

    返回参数为：
    id 栏目id
    cid 所属大会的id
    name 栏目名称（标题）
    type 栏目类型
    commonImgColumn.imgurl 栏目图片路径
    display 显示状态 0:不显示  1:显示
    createTime 创建时间

    commonImgTitle.imgurl 栏目标题图片路径
    commonImgTitle.link 栏目标题图片跳转链接
    commonImgBackground.imgurl 栏目背景图片路径
    commonImgBackground.link 栏目背景图片跳转链接
    columnDescribe 栏目描述
    commonImgColumn.link 栏目图片跳转链接
    contentSorting 栏目内容的排序
    structure 页面排版结构
    proportion 页面排版比例
    maxContents 最大内容数量
    extend1 扩展列1
    extend2 扩展列2
    extend3 扩展列3
    */
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
