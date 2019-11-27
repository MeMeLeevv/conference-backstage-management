<template>
  <div id="conferenceMsg" @click.stop="showColor = false"><!-- 内容图(contentImg、主色调(mainColor、背景图(commonImg.imgurl) -->
    <div class="previewArea">
      <div class="area">预览</div>
      <div class="swatch">
        <span class="title">主色调： </span>
        <span class="colorShow" :style="`background: rgba(${form.colors.rgba.r},${form.colors.rgba.g},${form.colors.rgba.b},${form.colors.rgba.a})`">
        </span>
      </div>
      <div class="block">
        <span class="title">内容图：  </span>
        <ImageShow></ImageShow>
      </div>
      <div class="block">
        <span class="title">背景图：  </span>
        <ImageShow></ImageShow>
      </div>
    </div>
    <div class="hr"></div>
    <div class="editArea">
      <div class="area">编辑</div>
      <div class="swatch">
        <span class="title">主色调： </span>
        <span class="colorShow" @click.stop="showColor = true" :style="`background: rgba(${form.colors.rgba.r},${form.colors.rgba.g},${form.colors.rgba.b},${form.colors.rgba.a})`">
          <transition name="fade">
            <sketch-picker v-if="showColor" @input="updateValue" v-model="form.colors" /><!-- 提交时候可能需要摘掉一些数据，只留rgba -->
          </transition>
        </span>
      </div>
      <div class="block">
        <span class="title">内容图：  </span>
        <UploadImage inputName="contentImage" @getImgPath="getImgPath"></UploadImage>
      </div>
      <div class="block">
        <span class="title">背景图：  </span>
        <UploadImage inputName="backgroundImage" @getImgPath="getImgPath"></UploadImage>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import UploadImage from './common/uploadImage'
import ImageShow from './common/imageShow'
import { Sketch } from 'vue-color'

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
      showColor: false,
      form: {
        colors: defaultProps
      }
    }
  },
  created () {

  },
  computed: {
    ...mapGetters(['getOriginPage', 'getHasLogin', 'getAccount'])
  },
  methods: {
    ...mapMutations([
      'setHasLogin', 'setAccount'
    ]),
    updateValue () {
      console.log('updateValue')
    },
    submitForm (formName) {
    },
    getImgPath (name, path) { /* 获取到image的name值和value值并赋值给form，以便提交表单 */
      this.form[name] = path
      console.log(this.form, 'form')
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
