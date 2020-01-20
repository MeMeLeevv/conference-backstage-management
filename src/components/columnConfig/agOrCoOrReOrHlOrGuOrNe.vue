<template>
  <div id="agOrCoOrReOrHlOrGuOrNe">
    <!-- 议程、联系我们、报名、亮点、嘉宾、新闻集合 -->
    <!-- 弹窗 -->
    <Dialog
      :needDialog="needDialog"
      :title="dialogTitle"
      :initDialog="initDialog"
      @addbackStageMsg="addbackStageMsg"
      @closeDialog="needDialog = false"
      :imgLimit="imgLimit"
      :initTableHeader="initTableHeader"
      :isBatch="isBatch"
    ></Dialog>

    <el-tabs v-model="columnActiveName" type="border-card">
      <el-tab-pane
        class="tabTitle"
        label="栏目信息"
        name="column"
        :closable="false"
      >
        <div class="previewArea">
          <div
            class="swatch"
            title="如果同时提供标题文字和标题图片，会优先展示标题文字"
          >
            <span class="title">标题： </span>
            <span v-if="!isEditColumn" class="titledis">{{
              cMsgDisplay.title
            }}</span>
            <el-input style="width: 60%" v-else v-model="form.title"></el-input>
          </div>
          <div class="block">
            <span class="title">标题图： </span>
            <ImageShow
              title="标题图和标题只需提供一项即可"
              :url="cMsgDisplay.title_img"
              :imgW="cMsgDisplay.title_img_width - 0"
              :imgH="cMsgDisplay.title_img_height - 0"
              :jump_url="cMsgDisplay.title_img_jumpurl"
              :isEdit="isEditColumn"
              imgName="title_img"
              @deleteImg="deleteImg"
            ></ImageShow>
            <UploadImage
              v-if="isEditColumn"
              :action="`${$store.state.api}/common/uploadImg`"
              inputName="title_img"
              @getImgMsg="getImgMsg"
            ></UploadImage>
          </div>
          <el-button
            type="primary"
            @click="isEditColumn ? submitForm() : editColumn()"
            >{{ isEditColumn ? "保存" : "编辑" }}</el-button
          >
          <el-button
            v-if="isEditColumn"
            type="default"
            @click="cancel"
            >取消</el-button
          >
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
            title="内容"
            @addGroupContent="addGroupContent"
          ></ConfigHeader>
          <Table
            v-if="tableData"
            class="flexTable"
            :initTableHeader="initTableHeader"
            :tableData="tableData"
            @updateColumnObj="updateColumnObj"
            @batchHS="batchHS"
            @dropColumn="dropColumn"
            @batchUploadImg="batchUploadImg"
          ></Table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getImgMsg, getLocalData, deepCopy } from '../../assets/js/base';
import { axiosGet, axiosPost } from '../../assets/js/axios';

const ConfigHeader = () => import('../common/configHeader');
const Dialog = () => import('../common/dialog');
const Table = () => import('../common/table');
const ImageShow = () => import('../common/imageShow');
const UploadImage = () => import('../common/uploadImage');

export default {
  name: 'agOrCoOrReOrHlOrGuOrNe',
  data () {
    return {
      c_id: '',
      p_id: '',
      isBatch: false, // 是否批量上传
      imgLimit: 1, // 图片上传限制个数
      isDeleteOriginImg: false, // 是否有点击原图删除
      originImg: {}, // 保存原始图片信息
      isEditColumn: false, // 此时是否在编辑栏目信息
      needDialog: false, // 是否需要dialog
      initDialog: [],
      cMsgDisplay: {}, // 栏目信息展示区
      cGListDisplay: [], // 栏目组信息展示区
      groupDetailEmpty: false, // 栏目内容是否为空
      dialogTitle: '',
      form: {}, // 编辑提交的Object
      activeName: '0', // 栏目tab的激活name
      columnActiveName: 'column', // 栏目内容组tab的激活name
      initTableHeader: [],
      tableData: '' // 表格数据，初始化不要设为[]，否则template里的table组件v-if="tableData"会默认为真，当刚加载时tableData有数据会无法显示
    };
  },
  created () {
    // 注意如果属性层级太深，超过两层，需要判断是否存在值（v-if），否则双向绑定不起作用！
    let that = this;
    let cData = getLocalData(['columnMsg']); // 取出点击栏目保存在本地后的栏目信息缓存
    if (!cData[0].c_id) {
      // 如果没有缓存，则跳转到首页
      this.$router.push('/');
      return;
    }
    this.c_id = cData[0].c_id;
    this.p_id = cData[0].p_id;
    this.type = cData[0].type;
    if (this.type === 8) { // news
      this.initTableHeader = [
        // 初始化表格样式信息
        {
          label: 'index', // 表头名
          widthPercent: 0.05, // 表头占父类长度百分比
          type: 'text', // 表头input类型
          key: 'text' // 他对应表格数据tableData对象里的key值
        },
        {
          label: '标题',
          widthPercent: 0.12,
          type: 'text',
          key: 'title'
        },
        {
          label: '内容图',
          widthPercent: 0.12,
          type: 'image',
          key: 'main_img'
        },
        {
          label: '背景图',
          widthPercent: 0.12,
          type: 'image',
          key: 'background_img'
        },
        {
          label: '详述',
          widthPercent: 0.10,
          type: 'text',
          key: 'content'
        },
        {
          label: '跳转链接',
          widthPercent: 0.12,
          type: 'text',
          key: 'url'
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
      ]
    } else if (this.type === 6) { // guests
      this.initTableHeader = [
        // 初始化表格样式信息
        {
          label: 'index', // 表头名
          widthPercent: 0.05, // 表头占父类长度百分比
          type: 'text', // 表头input类型
          key: 'text' // 他对应表格数据tableData对象里的key值
        },
        {
          label: '姓名',
          widthPercent: 0.12,
          type: 'text',
          key: 'name'
        },
        {
          label: '头像',
          widthPercent: 0.12,
          type: 'image',
          key: 'main_img'
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
      ]
    } else if (this.type === 3) { // highLight
      this.initTableHeader = [ // 初始化表格样式信息
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
          label: '内容标题背景图',
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
      ]
    } else {
      this.initTableHeader = [
        // 初始化表格样式信息
        {
          label: 'index', // 表头名
          widthPercent: 0.05, // 表头占父类长度百分比
          type: 'text', // 表头input类型
          key: 'text' // 他对应表格数据tableData对象里的key值
        },
        {
          label: '描述图',
          widthPercent: 0.12,
          type: 'image',
          key: 'main_img'
        },
        {
          label: '描述图链接',
          widthPercent: 0.25,
          type: 'text',
          key: 'url'
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
      ]
    }
    let p1 = this.$axios.get(`${this.$store.state.api}/column/getColumnList`, {
      params: { c_id: cData[0].c_id }
    });
    let p2 = this.$axios.get(
      `${this.$store.state.api}/columnObjgroup/getColumnObjGroupList`,
      {
        params: { c_id: cData[0].c_id }
      }
    );
    // 同时请求栏目信息和栏目内容组信息
    Promise.all([p1, p2])
      .then(([cMsgDisplay, ColumnObjGroupList]) => {
        return {
          cMsgDisplay: cMsgDisplay.data,
          ColumnObjGroupList: ColumnObjGroupList.data
        };
      })
      .then(showData => {
        if (
          showData.cMsgDisplay.code !== '1' ||
          showData.ColumnObjGroupList.code !== '1'
        ) {
          that.$message.error('请求错误，请刷新！');
          return;
        }
        this.cMsgDisplay = showData.cMsgDisplay.data[0]; // 栏目信息展示
        this.cGListDisplay = showData.ColumnObjGroupList.data; // 栏目内容组信息展示
        if (this.cGListDisplay.length === 0) { // 大会议程、联系我们以及报名只需要一组栏目内容，如果没有则自动新建一组
          // tableData初始化，新建组内容
          this.addbackStageMsg({}, true); // 新增一组栏目内容
        } else {
          // 初始化栏目内容组数据，
          this.group_id = this.cGListDisplay[this.activeName].group_id;
          axiosGet(
            `${this.$store.state.api}/columnObj/getColumnObjList`,
            { group_id: this.group_id },
            res => {
              let data = res.data;
              if (data.code === '1') {
                this.tableData = data.data;

                for (let j = 0; j < this.tableData.length; j++) {
                  // 初始化表格信息
                  this.tableData[j].widthPercent = 0.12; // 控制表格tb的宽度
                  this.tableData[j].edit = false; // 是否是编辑状态
                  this.tableData[j].hasChecked = false; // checkbox状态是否勾选
                }
                this.cGListDisplay[this.activeName].tableData = this.tableData;
              } else {
                this.$message.error(data.msg);
              }
            },
            err => {
              this.$message.error(err);
            }
          );
        }
      })
      .catch(function (err) {
        that.$message.error(err);
      });
  },
  methods: {
    /*
    作用：捕捉table子组件传过来的批量上传图片事件
    @return void
    */
    batchUploadImg () {
      // 批量上传图片可供选择：1、选择哪类图片上传 2、是多对一还是多对多
      this.needDialog = true;
      this.imgLimit = 10; // 限制10张图
      this.dialogTitle = '选择图片';
      this.isBatch = true; // 传给dialog组件，显示批量dialog界面
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
      } else {
        // 多图上传
        this.form.files = getImgMsg(name, imgMsgArr);
      }
    },
    /*
    作用：新增栏目内容组信息，即表格信息
    @return void
    */
    addGroupContent () {
      this.needDialog = true;
      if (this.type === 8) { // news
        this.initDialog = [
        //  初始化新增栏目内容组dialog
          {
            label: '标题',
            type: 'text',
            key: 'title',
            required: true
          },
          {
            label: '内容图',
            type: 'image',
            key: 'main_img',
            required: true
          },
          {
            label: '详述',
            type: 'text',
            key: 'content',
            required: true
          },
          {
            label: '背景图',
            type: 'image',
            key: 'background_img',
            required: true
          },
          {
            label: '跳转链接',
            type: 'text',
            key: 'url',
            required: true
          }
        ]
      } else if (this.type === 6) { // guests
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
          }
        ];
      } else if (this.type === 3) { // highLight
        this.initDialog = [
        //  初始化新增栏目内容组dialog
          {
            label: '内容标题',
            type: 'text',
            key: 'title',
            required: true
          },
          {
            label: '内容标题背景图',
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
          }
        ]
      } else {
        this.initDialog = [
        //  初始化新增栏目内容组dialog
          {
            label: '描述图',
            type: 'image',
            key: 'main_img',
            required: true
          },
          {
            label: '描述图链接',
            type: 'text',
            key: 'url',
            required: true
          }
        ]
      }

      this.isBatch = false;
      this.imgLimit = 1;
    },
    /*
    作用：将新增的数据更新到后台
    @params form: Object
    @params iscolumnList： Boolean 在created函数中如果监测到栏目组不存在则需要新建一个
    @return void
    */
    addbackStageMsg (form, isColumnList) {
      let that = this;
      let url, imgNum;
      if (this.imgLimit > 1) {
        // 批量上传
        url = `${this.$store.state.api}/columnObj/batUploadImgAndNew`;
        form.data.group_id = this.group_id;
        imgNum = form.imgsArr.length;
        form.data = JSON.stringify(form.data);
        form.imgsArr = JSON.stringify(form.imgsArr);
      } else {
        if (isColumnList) {
          // 新增栏目组数据
          url = `${this.$store.state.api}/columnObjgroup/newColumnObjGroup`;
          form.c_id = this.c_id;
          form.status = 1; // 默认展示
        } else {
          // 新增一条栏目内容信息
          url = `${this.$store.state.api}/columnObj/newColumnObj`;
          form.group_id = this.group_id;
          form.status = form.status ? 1 : 0; // status是Boolean格式，需转成number传给后台
        }
      }
      axiosPost(
        url,
        form,
        res => {
          let data = res.data;
          if (data.code === '1') {
            that.$message({
              message: data.msg,
              type: 'success'
            });
            if (this.imgLimit > 1) {
              axiosGet(
                // 重新请求table数据
                `${this.$store.state.api}/columnObj/getColumnObjList`,
                { group_id: this.group_id },
                res => {
                  let data = res.data;
                  if (data.code === '1') {
                    let tableData = data.data;
                    tableData = tableData.slice(-imgNum); // 请求所有table数据后只取新增的插入到原来的的table数据里
                    for (let j = 0; j < tableData.length; j++) {
                      // 初始化新增的表格信息
                      tableData[j].widthPercent = 0.12; // 控制表格tb的宽度
                      tableData[j].edit = false; // 是否是编辑状态
                      tableData[j].hasChecked = false; // checkbox状态是否勾选
                      this.tableData.push(tableData[j])
                    }
                    this.cGListDisplay[this.activeName].tableData = this.tableData;
                  } else {
                    this.$message.error(data.msg);
                  }
                },
                err => {
                  this.$message.error(err);
                }
              );
            } else {
              if (isColumnList) {
                // 新建栏目组数据成功
                this.cGListDisplay = data.data;
                this.group_id = data.data[0].group_id;
                this.tableData = [];
              } else {
                // 新建表格内容，先初始化表格数据
                data.data[0].widthPercent = 0.12; // 控制表格tb的宽度
                data.data[0].edit = false; // 是否是编辑状态
                data.data[0].hasChecked = false; // checkbox状态是否勾选
                this.tableData.push(data.data[0]);
              }
            }
          } else {
            that.$message.error(data.msg);
          }
        },
        err => {
          this.$message.error('更新大会嘉宾失败，请重试！' + err);
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
      this.form = deepCopy(this.cMsgDisplay); // 将已有信息copy到form，form由用户编辑后提交到后台
    },
    /*
    作用：子组件触发，本地批量显示或隐藏数据
    @params ids Array 要修改的数据obj_id
    @return void
    */
    batchHS (ids, status) {
      for (let i = 0; i < ids.length; i++) {
        for (let j = 0; j < this.tableData.length; j++) {
          if (this.tableData[j].obj_id === ids[i]) {
            this.tableData[j].status = status - 0;
          }
        }
      }
    },
    /*
    作用：更新栏目数据
    @return void
    */
    submitForm () {
      let that = this;
      let url;
      // 更新栏目信息
      url = `${this.$store.state.api}/column/updateColumn`;
      this.form.c_id = this.c_id;

      axiosPost(
        url,
        this.form,
        res => {
          let data = res.data;
          if (data.code === '1') {
            this.cMsgDisplay = deepCopy(this.form);
            that.$message({
              message: data.msg,
              type: 'success'
            });
            this.isEditColumn = false;
            this.isDeleteOriginImg = false;
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
    作用：点击删除图标将该图片的信息清空
    @params clearImgObj Object 子组件传进来的已经清空的图片信息
    @params originImg Object 子组件传进来的原始的图片信息
    @return void
    */
    deleteImg (clearImgObj, originImg) {
      this.isDeleteOriginImg = true;
      this.originImg = Object.assign(this.originImg, originImg);
      this.cMsgDisplay = Object.assign(this.cMsgDisplay, clearImgObj);
      this.form = deepCopy(this.cMsgDisplay);
    },
    /*
    作用：恢复数据
    @return void
    */
    cancel () {
      this.isEditColumn = false;
      if (this.isDeleteOriginImg) {
        this.cMsgDisplay = Object.assign(this.cMsgDisplay, this.originImg);
        this.isDeleteOriginImg = false;
      }
    },

    /*
    作用：table后台更新数据后本地更新
    @params row 修改的该行数据
    @params index 该行的索引index
    @return void
    */
    updateColumnObj (item, index) {
      this.tableData[index] = item;
    },
    /*
    作用：发送更新栏目内容顺序sort请求给后台
    @data: Array 对应更新顺序的表格的数据
    @return void
    */
    dropColumn (data) {
      this.tableData = data;
      let sortData = [];
      let that = this;
      // 改变每个栏目的sort信息，对应索引值
      this.tableData.map((item, index) => {
        sortData.push(item.obj_id);
      });
      // 更新栏目内容排序
      axiosPost(
        `${this.$store.state.api}/column/sortColumn`,
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
#agOrCoOrReOrHlOrGuOrNe
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
