<template>
  <div id="highlight">
    <!-- 大会亮点集合 -->
    <!-- 弹窗 -->
    <Dialog
      :needDialog="needDialog"
      :title="dialogTitle"
      :initDialog="initDialog"
      @addMsg="addMsg"
      @closeDialog="needDialog = false"
    ></Dialog>

    <el-tabs
      v-model="activeName"
      type="card"
      addable
      @tab-add="addGroupMsg()"
      @tab-remove="removeTab(activeName)"
    >
      <el-tab-pane
        class="tabTitle"
        label="栏目管理"
        name="0"
        :closable="false"
      >
        <div class="previewArea">
          <div class="block">
            <span class="title">标题图： </span>
            <ImageShow
              title="标题图和标题只需提供一项即可"
              :url="columnListShow.title_img"
              :imgW="columnListShow.title_img_width"
              :imgH="columnListShow.title_img_height"
            ></ImageShow>
            <UploadImage
              v-if="isEditColumn"
              inputName="title_img"
              @getImgMsg="getImgMsg"
            ></UploadImage>
          </div>
          <div class="swatch">
            <span class="title">标题： </span>
            <span v-if="!isEditColumn" class="titledis">{{
              columnListShow.title
            }}</span>
            <el-input style="width: 60%" v-else v-model="form.title"></el-input>
          </div>
          <el-button
            type="primary"
            @click="isEditColumn ? submitForm() : editColumn()"
            >{{ isEditColumn ? "保存" : "编辑" }}</el-button
          >
          <el-button v-if="isEditColumn" type="primary" @click="isEditColumn = false"
            >取消</el-button
          >
          <!-- 新增logo图 -->
        </div>
      </el-tab-pane>

      <el-tab-pane
        v-for="(item, index) in columnGListShow"
        :key="item.name"
        :label="item.name"
        :name="`${index + 1}`"
        :closable="true"
      >
        <div
          class="previewArea"
        >
          <div class="block">
            <span class="title">组背景图： </span>
            <ImageShow
              title="标题图和标题只需提供一项即可"
              :url="item.background_img"
              :imgW="item.background_img_width"
              :imgH="item.background_img_height"
            ></ImageShow>
            <UploadImage
              v-if="isEditGroup"
              inputName="background_img"
              @getImgMsg="getImgMsg"
            ></UploadImage>
          </div>
          <div class="swatch">
            <span class="title">组标题： </span>
            <span v-if="!isEditGroup" class="titledis">{{ item.name }}</span>
            <el-input style="width: 60%" v-else v-model="form.name"></el-input>
          </div>
          <el-button
            type="primary"
            @click="isEditGroup ? submitForm() : editGroup(item)"
            >{{ isEditGroup ? "保存" : "编辑" }}</el-button
          >
          <el-button v-if="isEditGroup" type="primary" @click="isEditGroup = false"
            >取消</el-button
          >
        </div>

        <div style="margin-top: 50px">
          <ConfigHeader
            title="栏目内容"
            :initDialog="initDialog"
            @addGroupDetail="addGroupDetail"
          ></ConfigHeader>
          <!-- <Table class="flexTable" :initTable="initTable" :tableData="tableData"></Table> -->
          <Table
            class="flexTable"
            :initTable="initTable"
            :tableData="tableData"
          ></Table>
        </div>
      </el-tab-pane>

      <!-- <el-tab-pane class="tabTitle" label="栏目组管理" name="columnG">
        <el-button type="primary" @click="addGroupMsg">新 增</el-button>
      </el-tab-pane> -->

      <!-- 栏目组有内容才会展示，以及表单格式是要根据组的个数来组合 -->

    </el-tabs>
  </div>
</template>

<script>
import ConfigHeader from '../common/configHeader';
import Dialog from '../common/dialog';
import Table from '../common/table';
import { getImgMsg, getLocalData, deepCopy } from '../../assets/js/base';
import ImageShow from '../common/imageShow';
import { axiosPost } from '../../assets/js/axios';
import UploadImage from '../common/uploadImage';

export default {
  name: 'highlight',
  data () {
    return {
      isEditColumn: false,
      isEditGroup: false,
      needDialog: false,
      isGroupEmpty: true, // 栏目组是否为空
      columnListShow: {}, // 栏目信息展示区
      columnGListShow: [], // 栏目组信息展示区
      dialogTitle: '',
      form: {}, // 信息提交区
      activeName: '0',
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
        /* {
          title_img:
            'http://img.iimedia.cn/0000172149196a0ef95998ced58162a92fc188948e7ddd68e9abfc75e72425526e16b',
          background_url_img:
            'http://img.iimedia.cn/0000172149196a0ef95998ced58162a92fc188948e7ddd68e9abfc75e72425526e16b',
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
        } */
      ]
    };
  },
  created () {
    // 注意如果属性层级太深，超过两层，双向绑定可能不起作用！
    let that = this;
    let cData = getLocalData(['columnMsg']); // 取出点击保存在本地后的栏目信息
    this.c_id = cData[0].c_id;
    this.p_id = cData[0].p_id;
    /* axiosGet('/api/column/getcolumnListShow', { c_id: this.c_id }, (res) => {
      let data = res.data
      if (data.code === '1') {
        this = data.data[0];
        this.form = deepCopy(this)
        console.log(this.form, 'form')
      } else {
        this.$message.error(data.msg)
      }
    }, (err) => {
      this.$message.error(err)
      console.log(err, '根据栏目id查找栏目信息失败');
    }); */
    // let showData = {}
    let p1 = this.$axios.get('/api/column/getColumnList', {
      params: { c_id: cData[0].c_id }
    });
    let p2 = this.$axios.get('/api/columnObjgroup/getColumnObjGroupList', {
      params: { c_id: cData[0].c_id }
    });
    Promise.all([p1, p2])
      .then(([columnListShow, ColumnObjGroupList]) => {
        return {
          columnListShow: columnListShow.data,
          ColumnObjGroupList: ColumnObjGroupList.data
        };
      })
      .then(showData => {
        if (
          showData.columnListShow.code !== '1' ||
          showData.ColumnObjGroupList.code !== '1'
        ) {
          that.$message.error('请求错误，请刷新！');
          return;
        }
        this.columnListShow = showData.columnListShow.data[0]; // 栏目信息展示
        this.columnGListShow = showData.ColumnObjGroupList.data; // 栏目组信息展示
        if (this.columnGListShow.length === 0) {
          // 新建组内容
          this.isGroupEmpty = true;
        } else {
          // 初始化组内容数据，
          this.isGroupEmpty = false;
        }
        console.log(this.columnGListShow, 'this');
      })
      .catch(function (err) {
        that.$message.error(err);
      });
  },
  methods: {
    /*
    作用：新增栏目内容信息，即表格信息
    @return void
    */
    addGroupDetail () {
      this.needDialog = true;
      this.addGDetail = true
      this.initDialog = [ //  初始化新增栏目内容dialog
        {
          label: '内容标题',
          type: 'text',
          key: 'title',
          required: true
        },
        {
          label: '内容标题图',
          type: 'image',
          key: 'title_img',
          required: true
        },
        {
          label: '内容背景图',
          type: 'image',
          key: 'background_url_img',
          required: true
        },
        {
          label: '描述',
          type: 'text',
          key: 'desc',
          required: true
        },
        {
          label: '状态',
          type: 'switch',
          key: 'status',
          required: true
        }
      ]
    },
    /*
    作用：编辑栏目信息
    @return void
    */
    editColumn () {
      this.isEditColumn = true
      this.form = deepCopy(this.columnListShow)
    },
    /*
    作用：编辑数据组信息
    @params item Object 要修改的数据
    @return void
    */
    editGroup (item) {
      this.isEditGroup = true
      this.form = deepCopy(item)
    },
    removeTab (targetName) {
      let tabs = this.editableTabs;
      let activeName = this.activeName;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }

      this.activeName = activeName;
      this.editableTabs = tabs.filter(tab => tab.name !== targetName);
    },
    /*
    作用：初始化数据组dialog数据
    @return void
    */
    addGroupMsg () {
      this.addGroup = true;
      this.needDialog = true;
      this.dialogTitle = '栏目组数据';
      this.initDialog = [
        {
          label: '组标题',
          type: 'text',
          key: 'name'
        },
        {
          label: '组背景图',
          type: 'image',
          key: 'background_img'
        }
      ];
    },
    getImgMsg (name, imgMsgArr) {
      Object.assign(this.form, getImgMsg(name, imgMsgArr)); // Object.assign(target, ...sources)合并图片对象
    },
    /*
    作用：将新增的数据更新到后台
    @params form: Object
    @return void
    */
    addMsg (form) {
      let that = this;
      let url;
      if (this.addGroup) {
        // 新增栏目组数据
        url = '/api/columnObjgroup/newColumnObjGroup'
        form.c_id = this.c_id
      } else if (this.addGDetail) {
        // 新增栏目detail内容信息
        url = '/api/columnObj/newColumnObj'
        form.group_id = this.columnGListShow[this.activeName - 1].group_id // watch 监听也行
      }
      console.log(form, 'dialogForm')
      axiosPost(
        url,
        form,
        res => {
          let data = res.data;
          if (data.code === '1') {
            // console.log(this, 'result')
            that.$message({
              message: data.msg,
              type: 'success'
            });
            if (this.addGroup) {
              this.columnGListShow.push(data.data[0]);
              let newTabName = this.columnGListShow.length + '';
              this.activeName = newTabName;
            }
          } else {
            that.$message.error(data.msg);
          }
        },
        err => {
          this.$message.error('更新大会头图失败，请重试！' + err);
        }
      );
    },
    handleClick (tab, event) {
      console.log(tab, event);
    },
    /*
    作用：更新栏目数据
    @return void
    */
    submitForm (formName) {
      let that = this;
      // console.log(this.form, 'this.form')
      let url
      if (this.isEditColumn) { // 更新栏目信息
        url = '/api/column/updateColumn'
        this.form.c_id = this.c_id;
      } else { // 更新栏目内容组信息
        url = '/api/columnObjgroup/updateColumnObjGroup'
      }
      console.log(this.form, 'submitthis.form')

      axiosPost(
        url,
        this.form,
        res => {
          let data = res.data;
          if (data.code === '1') {
            if (this.isEditColumn) {
              this.columnListShow = deepCopy(this.form);
              this.isEditColumn = false;
            } else if (this.isEditGroup) {
              this.columnGListShow[this.activeName - 1] = deepCopy(this.form);
              this.isEditGroup = false;
            }
            // this.form = {}
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
        }
      );
    }
  },
  components: {
    ConfigHeader,
    Dialog,
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
