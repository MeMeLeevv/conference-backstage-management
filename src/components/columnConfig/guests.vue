<template>
  <div id="guests">
    <!-- 大会亮点集合 -->
    <!-- 弹窗 -->
    <Dialog
      :needDialog="needDialog"
      :title="dialogTitle"
      :initDialog="initDialog"
      @addbackStageMsg="addbackStageMsg"
      @closeDialog="needDialog = false"
    ></Dialog>

    <el-tabs v-model="columnActiveName" type="border-card">
      <el-tab-pane
        class="tabTitle"
        label="栏目信息"
        name="column"
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
          <el-button
            v-if="isEditColumn"
            type="primary"
            @click="isEditColumn = false"
            >取消</el-button
          >
          <!-- 新增logo图 -->
        </div>
      </el-tab-pane>

      <el-tab-pane
        class="tabTitle"
        label="栏目内容管理"
        name="columnGroup"
        :closable="false"
      >
        <!-- 表格 -->
        <div style="margin-top: 20px">
          <ConfigHeader
            title="嘉宾"
            :initDialog="initDialog"
            @addGroupContent="addGroupContent"
          ></ConfigHeader>
          <!-- <Table class="flexTable" :initTable="initTable" :tableData="tableData"></Table> -->
          <Table
            v-if="tableData"
            class="flexTable"
            :initTable="initTable"
            :tableData="tableData"
            @updateColumnObj="updateColumnObj"
            @batchHS="batchHS"
            @dropColumn="dropColumn"
          ></Table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ConfigHeader from '../common/configHeader';
import Dialog from '../common/dialog';
import Table from '../common/table';
import { getImgMsg, getLocalData, deepCopy } from '../../assets/js/base';
import ImageShow from '../common/imageShow';
import { axiosGet, axiosPost } from '../../assets/js/axios';
import UploadImage from '../common/uploadImage';

export default {/* 大会嘉宾只有一组内容 */
  name: 'guests',
  data () {
    return {
      c_id: '',
      p_id: '',
      isEditColumn: false, // 此时是否在编辑栏目信息
      needDialog: false, // 是否需要dialog
      initDialog: [],
      columnListShow: {}, // 栏目信息展示区
      columnGListShow: [], // 栏目组信息展示区
      groupDetailEmpty: false, // 栏目内容是否为空
      dialogTitle: '',
      form: {}, // 信息提交区
      activeName: '0', // 栏目tab的激活name
      columnActiveName: 'column', // 栏目内容组tab的激活name
      initTable: [
        // 初始化表格样式信息
        {
          label: 'index', // 表头名
          widthPercent: 0.05, // 表头占父类长度百分比
          type: 'text', // 表头input类型
          key: 'text' // 他对应表格数据tableData对象里的key值
        },
        {
          label: '头像',
          widthPercent: 0.12,
          type: 'image',
          key: 'main_img'
        },
        {
          label: '姓名',
          widthPercent: 0.12,
          type: 'text',
          key: 'name'
        },
        {
          label: '职务',
          widthPercent: 0.18,
          type: 'text',
          key: 'content'
        },
        {
          label: '显示状态',
          widthPercent: 0.12,
          type: 'select',
          key: 'status'
        },
        {
          label: '操作',
          type: 'operating',
          widthPercent: 0.1,
          key: 'operating'
        }
      ],
      tableData: []
    };
  },
  created () {
    // 注意如果属性层级太深，超过两层，需要判断是否存在值（v-if），否则双向绑定不起作用！
    let that = this;
    let cData = getLocalData(['columnMsg']); // 取出点击保存在本地后的栏目信息
    this.c_id = cData[0].c_id;
    this.p_id = cData[0].p_id;
    console.log(this.c_id, 'c-Id');

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
    // 同时请求栏目信息和栏目内容组信息
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
        this.columnGListShow = showData.ColumnObjGroupList.data; // 栏目内容组信息展示
        if (this.columnGListShow.length === 0) {
          // tableData初始化，新建组内容
          this.groupDetailEmpty = true; // 需要自动新建组！！！
          /*  this.columnGListShow[this.activeName] = {} /// 这两行不可省略，否则当用户新建栏目内容的时候此时表格tableData没有初始化为[]的话之后往tableData添加数据时视图无法得到相应
          this.columnGListShow[this.activeName].tableData = [] */
        } else {
          // 初始化栏目内容组数据，
          /* 表格格式为：{
          title_img: '',
          background_img: '',
          widthPercent: 0.12,
          title: 'wer',
          edit: false,
          content: 'wer',
          status: 1,
          hasChecked: false
        } */
          this.groupDetailEmpty = false;
          axiosGet(
            '/api/columnObj/getColumnObjList',
            { group_id: this.columnGListShow[0].group_id },
            res => {
              let data = res.data;
              if (data.code === '1') {
                this.columnGListShow[0].tableData = data.data;
                for (
                  let j = 0;
                  j < this.columnGListShow[0].tableData.length;
                  j++
                ) {
                  // 初始化表格信息
                  this.columnGListShow[0].tableData[j].widthPercent = 0.12; // 控制表格tb的宽度
                  this.columnGListShow[0].tableData[j].edit = false; // 是否是编辑状态
                  this.columnGListShow[0].tableData[j].hasChecked = false; // checkbox状态是否勾选
                }
              } else {
                // this.$message.error(data.msg);
              }
            },
            err => {
              console.log(err, '根据栏目id查找栏目信息失败');
              this.$message.error(err);
            }
          );
          console.log(this.columnGListShow, 'this.columnGListShow');
        }
      })
      .catch(function (err) {
        console.log(err, '根据栏目id查找栏目信息失败');
        that.$message.error(err);
      });
  },
  /*   watch: {
    activeName: function (newV) {
      this.form.group_id = this.columnGListShow[newV - 1].group_id // watch 监听也行
    }
  }, */
  methods: {
    /*
    作用：新增栏目内容组信息，即表格信息
    @return void
    */
    addGroupContent () {
      this.needDialog = true;
      this.initDialog = [
        //  初始化新增栏目内容组dialog
        {
          label: '姓名',
          type: 'text',
          key: 'name',
          required: true
        },
        {
          label: '头像',
          type: 'image',
          key: 'main_img',
          required: true
        },
        {
          label: '职务',
          type: 'text',
          key: 'content',
          required: true
        },
        {
          label: '状态',
          type: 'Switch',
          key: 'status',
          required: true
        }
      ];
    },
    /*
    作用：将新增的数据更新到后台
    @params form: Object
    @return void
    */
    addbackStageMsg (form) {
      let that = this;
      let url;
      // 新增栏目detail内容信息
      url = '/api/columnObj/newColumnObj';
      form.group_id = this.columnGListShow[0].group_id;
      form.status = form.status ? 1 : 0; // status是Boolean格式，需转成number传给后台
      axiosPost(
        url,
        form,
        res => {
          let data = res.data;
          if (data.code === '1') {
            console.log(data.data, 'addbackStageMsg.data');
            that.$message({
              message: data.msg,
              type: 'success'
            });
            // 新建表格内容，先初始化表格数据
            data.data[0].widthPercent = 0.12; // 控制表格tb的宽度
            data.data[0].edit = false; // 是否是编辑状态
            data.data[0].hasChecked = false; // checkbox状态是否勾选
            if (!this.columnGListShow[0].tableData) {
              // 如果一开始新建为空，须先初始化
              this.columnGListShow[0].tableData = [];
            }
            this.columnGListShow[0].tableData.push(
              data.data[0]
            );
          } else {
            that.$message.error(data.msg);
          }
        },
        err => {
          this.$message.error('更新大会头图失败，请重试！' + err);
        }
      );
    },
    /*
    作用：编辑栏目信息
    @return void
    */
    editColumn () {
      this.isEditColumn = true;
      this.form = {};
      this.form = deepCopy(this.columnListShow);
    },
    /*
    作用：子组件触发，本地批量显示或隐藏数据
    @params ids Array 要修改的数据obj_id
    @return void !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    */
    batchHS (ids, status) {
      console.log(ids, status, 'batchHS');
      for (let i = 0; i < ids.length; i++) {
        this.columnGListShow[this.activeName].tableData.forEach(item => {
          if (item.obj_id === ids[i]) {
            item.status = status;
          }
        });
      }
    },
    /*
    作用：更新栏目数据
    @return void
    */
    submitForm () {
      let that = this;
      // console.log(this.form, 'this.form')
      let url;
      // 更新栏目信息
      url = '/api/column/updateColumn';
      this.form.c_id = this.c_id;

      axiosPost(
        url,
        this.form,
        res => {
          let data = res.data;
          if (data.code === '1') {
            this.columnListShow = deepCopy(this.form);
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
    },
    /*
    作用：批量修改图片字段信息，基于后台字段统一，如果不统一反而会更麻烦，需要一个一个赋值
    @name: String 图片url字段，其他字段都是在这个基础上加上_xxx
    @imgMsgArr: Array 图片信息
    @return void
    */
    getImgMsg (name, imgMsgArr) {
      Object.assign(this.form, getImgMsg(name, imgMsgArr)); // Object.assign(target, ...sources)合并图片对象
    },
    /*
    作用：table后台更新数据后本地更新
    @params row 修改的该行数据
    @params index 该行的索引index
    @return void
    */
    updateColumnObj (item, index) {
      this.columnGListShow[0].tableData[index] = item;
    },
    /*
    作用：发送更新栏目内容顺序sort请求给后台
    @data: Array 对应更新顺序的表格的数据
    @return void
    */
    dropColumn (data) {
      this.columnGListShow[0].tableData = data;
      let sortData = [];
      let that = this;
      // 改变每个栏目的sort信息，对应索引值
      this.columnGListShow[0].tableData.map((item, index) => {
        sortData.push(item.obj_id);
      });
      // 更新栏目内容排序
      axiosPost(
        '/api/column/sortColumn',
        {
          sortData: JSON.stringify(sortData),
          type: 3
        },
        res => {
          //
          let data = res.data;
          if (data.code === '1') {
            that.$message({
              message: data.msg,
              type: 'success'
            });
          } else {
            this.$message.error(data.msg);
          }
        },
        err => {
          this.$message.error('排序栏目失败，请重试！' + err);
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
#guests
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
