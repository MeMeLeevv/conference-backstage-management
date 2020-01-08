<template>
  <div id="highlight">
    <!-- 大会亮点集合 -->
    <!-- 弹窗 -->
    <ddialoog
      :needDialog="needDialog"
      :title="dialogTitle"
      :initDialog="initDialog"
      @addbackStageMsg="addbackStageMsg"
      @closeDialog="needDialog = false"
      :isBatch="isBatch"
      :imgLimit="imgLimit"
      :initTable="initTable"
    ></ddialoog>

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
        <div style="margin-bottom: 20px;">
          <el-button size="small" @click="addGroupMsg()">
            新增栏目内容
          </el-button>
        </div>
        <el-tabs
          v-model="activeName"
          type="card"
          closable
          @tab-remove="removeTab"
        >
        <!-- 表格 -->
          <el-tab-pane
            v-for="(item, index) in columnGListShow"
            :key="item.name"
            :label="item.name"
            :name="`${index}`"
            :closable="true"
          >
            <div class="previewArea">
              <div class="block">
                <span class="title">背景图： </span>
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
                <span class="title">标题： </span>
                <span v-if="!isEditGroup" class="titledis">{{
                  item.name
                }}</span>
                <el-input
                  style="width: 60%"
                  v-else
                  v-model="form.name"
                ></el-input>
              </div>
              <el-button
                type="primary"
                @click="isEditGroup ? submitForm() : editGroup(item)"
                >{{ isEditGroup ? "保存" : "编辑" }}</el-button
              >
              <el-button
                v-if="isEditGroup"
                type="primary"
                @click="isEditGroup = false"
                >取消</el-button
              >
            </div>

            <div style="margin-top: 50px">
              <ConfigHeader
                title="内容"
                :initDialog="initDialog"
                @addGroupContent="addGroupContent"
              ></ConfigHeader>
              <!-- <Table class="flexTable" :initTable="initTable" :tableData="tableData"></Table> -->
              <Table
                v-if="item.tableData"
                class="flexTable"
                :initTable="initTable"
                :tableData="item.tableData"
                @updateColumnObj="updateColumnObj"
                @batchHS="batchHS"
                @dropColumn="dropColumn"
                @batchUploadImg="batchUploadImg"
              ></Table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ConfigHeader from '../common/configHeader';
import ddialoog from '../common/dialog';
import Table from '../common/table';
import { getImgMsg, getLocalData, deepCopy } from '../../assets/js/base';
import ImageShow from '../common/imageShow';
import { axiosGet, axiosPost } from '../../assets/js/axios';
import UploadImage from '../common/uploadImage';

export default {
  name: 'highlight',
  data () {
    return {
      c_id: '',
      p_id: '',
      imgLimit: 1, // 图片上传限制个数
      isBatch: false, // 是否批量上传
      isEditColumn: false, // 此时是否在编辑栏目信息
      isEditGroup: false, // 此时是否在编辑组
      needDialog: false, // 是否需要dialog
      initDialog: [],
      columnListShow: {}, // 栏目信息展示区
      columnGListShow: [], // 栏目组信息展示区
      groupDetailEmpty: false, // 栏目内容是否为空
      dialogTitle: '',
      form: {}, // 信息提交区
      activeName: '0', // 栏目tab的激活name
      columnActiveName: 'column', // 栏目内容组tab的激活name
      initTable: [ // 初始化表格样式信息
        {
          label: 'index', // 表头名
          widthPercent: 0.05, // 表头占父类长度百分比
          type: 'text', // 表头input类型
          key: 'text' // 他对应表格数据tableData对象里的key值
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
          key: 'background_img'
        },
        {
          label: '描述',
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
      tableData: '' // 表格数据，初始化不要设为[]，否则template里的table组件v-if="tableData"会默认为真，当刚加载时tableData有数据会无法显示
    };
  },
  created () {
    // 注意如果属性层级太深，超过两层，需要判断是否存在值（v-if），否则双向绑定不起作用！
    let that = this;
    let cData = getLocalData(['columnMsg']); // 取出点击保存在本地后的栏目信息
    this.c_id = cData[0].c_id;
    this.p_id = cData[0].p_id;
    console.log(this.c_id, 'c-Id')

    let p1 = this.$axios.get('/api/column/getColumnList', { // 查询栏目信息
      params: { c_id: cData[0].c_id }
    });
    let p2 = this.$axios.get('/api/columnObjgroup/getColumnObjGroupList', { // 查询栏目组信息
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
          this.groupDetailEmpty = true
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
          this.groupDetailEmpty = false
          for (let i = 0; i < this.columnGListShow.length; i++) { // 循环请求每个组的表格信息
            axiosGet(
              '/api/columnObj/getColumnObjList',
              { group_id: this.columnGListShow[i].group_id },
              res => {
                let data = res.data;
                if (data.code === '1') {
                  this.columnGListShow[i].tableData = data.data;
                  for (let j = 0; j < this.columnGListShow[i].tableData.length; j++) { // 初始化表格信息
                    this.columnGListShow[i].tableData[j].widthPercent = 0.12 // 控制表格tb的宽度
                    this.columnGListShow[i].tableData[j].edit = false // 是否是编辑状态
                    this.columnGListShow[i].tableData[j].hasChecked = false // checkbox状态是否勾选
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
          }
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
    作用：捕捉table子组件传过来的批量上传图片事件
    @return void
    */
    batchUploadImg () { // 批量上传图片可供选择：1、选择哪类图片上传 2、是多对一还是多对多
      this.needDialog = true
      this.imgLimit = 10 // 限制10张图
      this.dialogTitle = '选择图片'
      this.isBatch = true // 传给dialog组件，显示批量dialog界面
    },
    /*
    作用：批量修改图片字段信息，基于后台字段统一，如果不统一反而会更麻烦，需要一个一个赋值
    @name: String 图片url字段，其他字段都是在这个基础上加上_xxx
    @imgMsgArr: Array 图片信息
    @return void
    */
    getImgMsg (name, imgMsgArr) {
      if (imgMsgArr.length === 1) {
        Object.assign(this.form, getImgMsg(name, imgMsgArr)); // Object.assign(target, ...sources)合并图片对象
      } else { // 多图上传
        this.form.files = getImgMsg(name, imgMsgArr)
      }
    },
    /*
    作用：初始化数据组dialog数据
    @return void
    */
    addGroupMsg () {
      this.addGroup = true;
      this.addGDetail = false;
      this.needDialog = true;
      this.dialogTitle = '栏目内容数据';
      this.initDialog = [
        {
          label: '标题',
          type: 'text',
          key: 'name'
        },
        {
          label: '背景图',
          type: 'image',
          key: 'background_img'
        }
      ];
      this.isBatch = false
      this.imgLimit = 1
    },
    /*
    作用：新增栏目内容组信息，即表格信息
    @return void
    */
    addGroupContent () {
      this.addGroup = false;
      this.needDialog = true;
      this.addGDetail = true;
      this.initDialog = [
        //  初始化新增栏目内容组dialog
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
          key: 'background_img',
          required: true
        },
        {
          label: '描述',
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
      this.isBatch = false
      this.imgLimit = 1
    },
    /*
    作用：将新增的数据更新到后台
    @params form: Object
    @return void
    */
    addbackStageMsg (form, isColumnList) {
      let that = this;
      let url, imgNum
      if (this.imgLimit > 1) { // 批量上传
        url = '/api/columnObj/batUploadImgAndNew'
        form.data.group_id = this.columnGListShow[this.activeName].group_id
        imgNum = form.imgsArr.length
        form.data = JSON.stringify(form.data)
        form.imgsArr = JSON.stringify(form.imgsArr)
      } else {
        if (this.addGroup) {
        // 新增栏目组数据
          url = '/api/columnObjgroup/newColumnObjGroup';
          form.c_id = this.c_id;
        } else if (this.addGDetail) {
        // 新增栏目detail内容信息
          url = '/api/columnObj/newColumnObj';
          form.group_id = this.columnGListShow[this.activeName].group_id;
          form.status = form.status ? 1 : 0; // status是Boolean格式，需转成number传给后台
        }
      }
      // console.log(form, 'addbackStageMsg.Form');
      axiosPost(
        url,
        form,
        res => {
          let data = res.data;
          if (data.code === '1') {
            console.log(data.data, 'addbackStageMsg.data')
            that.$message({
              message: data.msg,
              type: 'success'
            });
            if (this.imgLimit > 1) {
              axiosGet( // 重新请求table数据
                '/api/columnObj/getColumnObjList',
                { group_id: this.columnGListShow[this.activeName].group_id },
                res => {
                  let data = res.data;
                  if (data.code === '1') {
                    let tableData = data.data;
                    tableData = tableData.slice(-imgNum) // 请求所有table数据后只取新增的
                    for (let j = 0; j < tableData.length; j++) {
                      // 初始化表格信息
                      tableData[j].widthPercent = 0.12; // 控制表格tb的宽度
                      tableData[j].edit = false; // 是否是编辑状态
                      tableData[j].hasChecked = false; // checkbox状态是否勾选
                      if (!this.columnGListShow[this.activeName].tableData) { // 如果一开始新建为空，须先初始化
                        this.columnGListShow[this.activeName].tableData = []
                      }
                      this.columnGListShow[this.activeName].tableData.push(tableData[j])
                    }
                  } else {
                    this.$message.error(data.msg);
                  }
                },
                err => {
                  console.log(err, '根据栏目id查找栏目信息失败');
                  this.$message.error(err);
                }
              )
            } else {
              if (this.addGroup) { // 新建栏目内容
                this.columnGListShow.push(data.data[0]);
                let newTabName = this.columnGListShow.length - 1 + '';
                this.activeName = newTabName;
                this.addGroup = false
                this.columnGListShow[this.activeName].tableData = [] // 初始化tableData的值
              } else if (this.addGDetail) { // 新建表格内容，先初始化表格数据
                data.data[0].widthPercent = 0.12 // 控制表格tb的宽度
                data.data[0].edit = false // 是否是编辑状态
                data.data[0].hasChecked = false // checkbox状态是否勾选
                if (!this.columnGListShow[this.activeName].tableData) { // 如果一开始新建为空，须先初始化
                  this.columnGListShow[this.activeName].tableData = []
                }
                this.columnGListShow[this.activeName].tableData.push(data.data[0])

                this.addGDetail = false
              }
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
    /*
    作用：编辑栏目信息
    @return void
    */
    editColumn () {
      this.isEditColumn = true;
      this.form = {}
      this.form = deepCopy(this.columnListShow);
    },
    /*
    作用：编辑栏目内容组信息
    @params item Object 要修改的数据
    @return void
    */
    editGroup (item) {
      this.form = {}
      this.isEditGroup = true;
      this.form = deepCopy(item);
    },
    /*
    作用：子组件触发，本地批量显示或隐藏数据
    @params ids Array 要修改的数据obj_id
    @return void !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    */
    batchHS (ids, status) {
      console.log(ids, status, 'batchHS')
      for (let i = 0; i < ids.length; i++) {
        this.columnGListShow[this.activeName].tableData.forEach(item => {
          if (item.obj_id === ids[i]) {
            item.status = status
          }
        })
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
      if (this.isEditColumn) {
        // 更新栏目信息
        url = '/api/column/updateColumn';
        this.form.c_id = this.c_id;
      } else {
        // 更新栏目内容组信息
        url = '/api/columnObjgroup/updateColumnObjGroup';
      }
      console.log(this.form, 'submitForm.form');

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
              this.columnGListShow[this.activeName] = deepCopy(this.form);
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
    },
    /*
    作用：删除特定栏目内容组信息，即需要将status更新为0，即为隐藏，后台变不会返回status为0的数据
    @params targetName String 当前删除的tab的index
    @return void
    */
    removeTab (targetName) {
      let index = targetName - 0
      let tabs = this.columnGListShow
      let that = this
      // 这里需要考虑if(this.activeName !== targetName),否则this.targetName不需要变
      if (this.activeName === targetName) {
        if (tabs[index + 1]) {
          this.activeName = index + 1 + ''
        } else if (tabs[index - 1]) {
          this.activeName = index - 1 + ''
        }
      }
      this.columnGListShow[index].status = 0
      axiosPost(
        'api/columnObjgroup/updateColumnObjGroup',
        this.columnGListShow[index],
        res => {
          let data = res.data;
          if (data.code === '1') {
            this.columnGListShow.splice(index, 1) // 本地删除
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
    作用：table后台更新数据后本地更新
    @params row 修改的该行数据
    @params index 该行的索引index
    @return void
    */
    updateColumnObj (item, index) {
      this.columnGListShow[this.activeName].tableData[index] = item
    },
    /*
    作用：发送更新栏目内容顺序sort请求给后台
    @data: Array 对应更新顺序的表格的数据
    @return void
    */
    dropColumn (data) {
      this.columnGListShow[this.activeName].tableData = data
      let sortData = [];
      let that = this;
      // 改变每个栏目的sort信息，对应索引值
      this.columnGListShow[this.activeName].tableData.map((item, index) => {
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
    ddialoog,
    Table,
    ImageShow,
    UploadImage
  }
}
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
