<template>
  <div id="conferenceMsg" @click.stop="showColor = false"><!-- 内容图(contentImg、主色调(mainColor、背景图(commonImg.imgurl) -->
    <div class="previewArea">
      <div class="area">预览</div>
      <div class="swatch">
        <span class="title">主色调： </span>
        <span class="colorShow" :style="`background: ${display ? display.mainColor : 'white'}`">
        </span>
      </div>
      <div class="block">
        <span class="title">内容图：  </span>
        <ImageShow :url="`${display&&display.commonImg ? display.commonImg.imgurl : errorImg}`"></ImageShow>
      </div>
      <div class="block">
        <span class="title">背景图：  </span>
        <ImageShow :url="`${display&&display.commonImgBackground ? display.commonImgBackground.imgurl : errorImg}`"></ImageShow>
      </div>
    </div>
    <div class="hr"></div>
    <div class="editArea">
      <div class="area">编辑</div>
      <div class="swatch">
        <span class="title">主色调： </span>
        <span class="colorShow" @click.stop="showColor = true" :style="`background: rgba(${form.colors.rgba.r},${form.colors.rgba.g},${form.colors.rgba.b},${form.colors.rgba.a})`">
          <transition name="fade">
            <sketch-picker v-if="showColor" @input="updateColor" v-model="form.colors" /><!-- 提交时候可能需要摘掉一些数据，只留rgba -->
          </transition>
        </span>
      </div>
      <div class="block">
        <span class="title">内容图：  </span>
        <UploadImage inputName="projectImg" @getImgPath="getImgPath"></UploadImage>
      </div>
      <div class="block">
        <span class="title">背景图：  </span>
        <UploadImage inputName="backgroundImg" @getImgPath="getImgPath"></UploadImage>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import UploadImage from './common/uploadImage'
import ImageShow from './common/imageShow'
import { Sketch } from 'vue-color'
import { axiosGet, axiosPost } from '../assets/js/axios'
export default {
  name: 'conferenceMsg',
  data () {
    var defaultProps = {
      hex: '#194d33',
      hsl: {
        h: 150,
        s: 0.5,
        l: 0.2,
        a: 1
      },
      hsv: {
        h: 150,
        s: 0.66,
        v: 0.30,
        a: 1
      },
      rgba: {
        r: 25,
        g: 77,
        b: 51,
        a: 1
      },
      a: 1
    }
    return {
      errorImg: 'https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png',
      showColor: false,
      display: {/* 预览区的数据 */
        mainColor: '', /* 返回rgba格式的字符串 rgba(*,*,*,*) */
        commonImg: {
          imgurl: ''
        },
        commonImgBackground: {
          imgurl: ''
        }
      },
      form: {
        colors: defaultProps
      }
    }
  },
  created () {
    axiosGet('/api/conferencegetProjectById', { projectid: this.$route.params.id }, (res) => { /* 查询大会信息并展示在预览区，如果没有值要有初始化 */
      let data = JSON.parse(res.data)
      if (data.code === '1') {
        this.display = data.data
        console.log(data.data, '根据大会id查找大会信息成功')
      } else {
        console.log('请求成功！但是根据大会id查找大会信息失败')
      }
    }, (err) => {
      console.log(err, '根据大会id查找大会信息失败')
    })
  },
  computed: {
    ...mapGetters(['getOriginPage', 'getHasLogin', 'getAccount'])
  },
  methods: {
    ...mapMutations([
      'setHasLogin', 'setAccount'
    ]),
    updateColor () { /* 注意节流！！ */
      // console.log('updateColor')
      let color = `rgba(${this.form.colors.rgba.r},${this.form.colors.rgba.g},${this.form.colors.rgba.b},${this.form.colors.rgba.a})`
      /*
      请求的参数network上需要以下形式，可以模仿input标签上的name = project.id来提交数据
      Form Data
      project.id: 118
      project.mainColor: rgb(25, 77, 51)
      如果使用qs，数据参数提交形式会变成project[id]或者 'project': {'id': '117','mainColor': 'rgba(*, *, *, *)'}
      这些都不能提交到数据库
      */
      axiosPost('/api/filesaveProject', `project.id=${this.$route.params.id}&project.mainColor=${color}`, (res) => {
        let data = JSON.parse(res.data)
        if (data.code === '1') {
          this.display.mainColor = color
          console.log(data.data, '修改大会主色调成功！')
        } else {
          console.log('请求成功！但是修改大会主色调失败')
        }
      }, (err) => {
        console.log(err, '修改大会主色调失败')
      }, {}, false)
    },
    /* 获取到image的name值和value值并赋值给form，以便提交表单
    请求参数：
    project.id
    projectImg
    backgroundImg
    返回：
    commonImg.imgurl
    commonImgBackground.imgurl
    */
    getImgPath (name, path) {
      this.form[name] = path
      /* 获取到地址链接后立即更新数据库 */

      axiosPost('/api/filesaveProject', `project.id=${this.$route.params.id}&${name}=${path}`, (res) => {
        console.log(path, 'path')
        let data = JSON.parse(res.data)
        if (data.code === '1') {
          console.log(data.data, 'data.data')
          // console.log(this.display, 'display')
          name === 'projectImg' ? this.display.commonImg.imgurl = data.data.commonImg.imgurl : this.display.commonImgBackground.imgurl = data.data.commonImgBackground.imgurl
          console.log('修改成功！')
        } else {
          console.log('请求成功！但是修改失败')
        }
      }, (err) => {
        console.log(err, '修改失败')
      }, {}, false)
    }
  },
  components: {
    UploadImage,
    ImageShow,
    'sketch-picker': Sketch
  }
}
</script>
<style lang="sass" scoped>
$colorShow: 20px
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
