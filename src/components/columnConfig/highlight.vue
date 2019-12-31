<template>
  <div id="highlight">
    <!-- 大会亮点集合 -->
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane class="tabTitle" label="栏目管理" name="column">
        <div class="previewArea">
          <div class="block">
            <span class="title">标题图： </span>
            <ImageShow
              title="标题图和标题只需提供一项即可"
              :url="display.title_img"
              :imgW="display.title_img_width"
              :imgH="display.title_img_height"
            ></ImageShow>
            <UploadImage
              v-if="isEdit"
              inputName="title_img"
              @getImgMsg="getImgMsg"
            ></UploadImage>
          </div>
          <div class="swatch">
            <span class="title">标题： </span>
            <span v-if="!isEdit" class="titledis">{{ display.title }}</span>
            <el-input style="width: 60%" v-else v-model="form.title"></el-input>
          </div>
          <el-button
            type="primary"
            @click="isEdit ? submitForm() : (isEdit = true)"
            >{{ isEdit ? "保存" : "编辑" }}</el-button
          >
          <el-button v-if="isEdit" type="primary" @click="isEdit = false"
            >取消</el-button
          >
          <!-- 新增logo图 -->
        </div>
      </el-tab-pane>
      <el-tab-pane label="栏目内容管理" name="columnContent">
        <div>
          <ConfigHeader title="亮点" :initDialog="initDialog"></ConfigHeader>
          <!-- <Table class="flexTable" :initTable="initTable" :tableData="tableData"></Table> -->
          <Table
            class="flexTable"
            :initTable="initTable"
            :tableData="tableData"
          ></Table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ConfigHeader from '../common/configHeader';
import Table from '../common/table';
import { getImgMsg, getLocalData, deepCopy } from '../../assets/js/base';
import ImageShow from '../common/imageShow';
import { axiosPost } from '../../assets/js/axios';
import UploadImage from '../common/uploadImage';

export default {
  name: 'highlight',
  data () {
    return {
      isEdit: false,
      display: {}, // 栏目信息展示区
      form: {}, // 栏目信息提交区
      activeName: 'column',
      initDialog: [
        {
          label: '亮点名称',
          type: 'text',
          key: 'name',
          required: true
        },
        {
          label: '亮点描述',
          type: 'text',
          key: 'desc',
          required: true
        }
      ],
      /* initTable: [
        {
          label: '亮点名称',
          widthPercent: 0.3,
          type: 'text',
          key: 'name'
        },
        {
          label: '', // 迷之位置。。。。
          widthPercent: 0.05,
          type: 'checkbox',
          key: 'checkbox'
        },
        {
          label: '亮点描述',
          widthPercent: 0.3,
          type: 'text',
          key: 'desc'
        }
      ],
      tableData: [
        {
          id: 0,
          name: '234233333333333333333333333333333333333333',
          desc: '111111111111111111111',
          edit: false
        },
        {
          id: 1,
          name: 'rew',
          desc: '111111111111111111111',
          edit: false
        },
        {
          id: 2,
          name: 'werw',
          desc: '111111111111111111111',
          edit: false
        },
        {
          id: 3,
          name: 'werw',
          desc: '111111111111111111111',
          edit: false
        },
        {
          id: 4,
          name: 'wer',
          desc: '111111111111111111111',
          edit: false
        }
      ] */
      initTable: [
        {
          label: 'id',
          widthPercent: 0.05,
          type: 'text',
          key: 'text'
        },
        {
          label: '内容标题',
          widthPercent: 0.18,
          type: 'text',
          key: 'title'
        },
        {
          label: '内容标题图',
          widthPercent: 0.12,
          type: 'image',
          key: 'title_img'
        },
        {
          label: '内容背景图',
          widthPercent: 0.12,
          type: 'image',
          key: 'background_url_img'
        },
        {
          label: '描述',
          widthPercent: 0.18,
          type: 'text',
          key: 'desc'
        },
        {
          label: '显示状态', // 表头名
          widthPercent: 0.12, // 表头占父类长度百分比
          type: 'select', // 表头input类型
          key: 'state' // 他对应表格数据tableData对象里的key值
        },
        {
          label: '操作',
          type: 'operating',
          widthPercent: 0.1,
          key: 'operating'
        }
      ],
      tableData: [
        {
          title_img:
            'http://img.iimedia.cn/0000172149196a0ef95998ced58162a92fc188948e7ddd68e9abfc75e72425526e16b',
          background_url_img: 'http://img.iimedia.cn/0000172149196a0ef95998ced58162a92fc188948e7ddd68e9abfc75e72425526e16b',
          title:
            '2342333333333333333333333333333333333333333333333333333333333333333333333333',
          desc: '23423777777777777777777777777777777777',
          edit: false, // 是否为可编辑状态
          state: 1,
          widthPercent: 0.12, // 正常宽度
          hasChecked: false // 是否勾选
        },
        {
          title_img:
            'http://img.iimedia.cn/00001228e00fdffb513251e96027c50ff3fd18040576eed1660299eeb278938ef42d8',
          background_url_img: '',
          title: 'rew',
          desc: 'werw',
          edit: false,
          widthPercent: 0.12,
          state: 1,
          hasChecked: false
        },
        {
          title_img: '',
          background_url_img: '',
          title: 'werw',
          widthPercent: 0.12,
          desc: 'werwer',
          edit: false,
          state: 1,
          hasChecked: false
        },
        {
          title_img: '',
          background_url_img: '',
          title: 'werw',
          desc: 'werw',
          widthPercent: 0.12,
          edit: false,
          state: 1,
          hasChecked: false
        },
        {
          title_img: '',
          background_url_img: '',
          widthPercent: 0.12,
          title: 'wer',
          edit: false,
          desc: 'wer',
          state: 1,
          hasChecked: false
        }
      ]
    };
  },
  created () {
    /// let that = this;
    let cData = getLocalData(['columnMsg']); // 取出点击保存在本地后的栏目信息
    this.c_id = cData[0].c_id
    this.p_id = cData[0].p_id
    /* axiosGet('/api/column/getColumnList', { c_id: this.c_id }, (res) => {
      let data = res.data
      if (data.code === '1') {
        this.display = data.data[0];
        this.form = deepCopy(this.display)
        console.log(this.form, 'form')
      } else {
        this.$message.error(data.msg)
      }
    }, (err) => {
      this.$message.error(err)
      console.log(err, '根据栏目id查找栏目信息失败');
    }); */
    // let showData = {}
    let p1 = this.$axios.get('/api/column/getColumnList', { params: { c_id: cData[0].c_id } })
    let p2 = this.$axios.get('/api/columnObjgroup/getColumnObjGroupList', { params: { c_id: cData[0].c_id } })
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
      if (this.display.columnGList.length === 0) { // 新建组内容
        this.isEmpty = true
      } else { // 初始化组内容数据，
        this.isEmpty = false
      }
      console.log(this.display, 'this.display')
    }).catch(function (err) {
      this.$message.error(err);
    })
  },
  methods: {
    getImgMsg (name, imgMsgArr) {
      Object.assign(this.form, getImgMsg(name, imgMsgArr)); // Object.assign(target, ...sources)合并图片对象
    },
    handleClick (tab, event) {
      console.log(tab, event);
    },
    /*
    作用：更新栏目数据
    @return void
    */
    submitForm (formName) {
      let that = this
      // console.log(this.form, 'this.form')
      // let url
      /* if (this.isEmpty) { // 新建内容组
        url = '/api/columnObjgroup/newColumnObjGroup'
      } else { // 更新数据
        url = '/api/columnObjgroup/updateColumnObjGroup'
      } */
      axiosPost('/api/column/updateColumn', this.form,
        res => {
          let data = res.data;
          if (data.code === '1') {
            this.display = deepCopy(this.form)
            this.isEdit = false
            // console.log(this.display, 'result')
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
  },
  components: {
    ConfigHeader,
    Table,
    ImageShow,
    UploadImage
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
#highlight
  .flexTable
    margin: 20px 0
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
