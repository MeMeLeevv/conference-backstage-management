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
              <span class="title">内容图：  </span>
              <ImageShow></ImageShow>
            </div>
         </div>
         <div class="hr"></div>
         <div class="editArea">
           <div class="area">编辑</div>
          <div class="block">
            <span class="title">内容图：  </span>
            <UploadImage inputName="contentImage" @getImgPath="getImgPath"></UploadImage>
          </div>
         </div>
    </div>
</template>

<script>
import ImageShow from '../common/imageShow'
import UploadImage from '../common/uploadImage'

export default {
  name: 'headImage',
  components: {
    ImageShow,
    UploadImage
  },
  data () {
    var id = this.$route.params.id
    return {
      form: {

      },
      id: id, // 大会id
      cid: '' // 栏目id
    }
  },
  created () {
    let that = this
    this.$axios.get(`/api/conferencegetColumnByCid?projectid=${this.id}`).then((res) => { /* 请求大会栏目的所有信息 */
      res = JSON.parse(res.data)
      console.log(res, 'headImage')
      if (res.code === '1') {
        let data = res.data
        data = data.filter(item => item.name === '大会背景')[0] /* 筛选出大会背景信息 */
        console.log(data, 'data')
        this.cid = data.cid
        that.$axios.get(`/api/conferencegetColumnByCid?columnId=${data.cid}`).then((ress) => {
          let columnData = JSON.parse(ress.data)
          console.log(columnData, 'column')
        })
      }
    }).catch((error) => {
      console.log(error)
    }).finally(() => {

    })
  },
  methods: {
    getImgPath (name, path) { /* 获取到image的name值和value值并赋值给form，以便提交表单 */
      this.form[name] = path
      console.log(this.form, 'form')
    }
  }
}
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
