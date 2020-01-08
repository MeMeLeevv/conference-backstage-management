<template>
  <div id="table">
    <div>
      <!-- 图片预览 -->
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogUrl" alt="" />
      </el-dialog>
      <table class="table" cellspacing="0" cellpadding="0">
        <!-- 初始化表头 -->
        <thead class="thead-dark">
          <tr>
            <th scope="col" :style="`width: ${0.01 * clientWidth}px`">
              <el-checkbox :indeterminate="(this.multipleSelection.length > 0) && (this.multipleSelection.length < this.formData.length)" v-model="checkAll"
              @change="handleCheckAllChange" ></el-checkbox>
            </th>
            <!-- 这里的width根据initable的数据来调整 -->
            <th scope="col" v-for="item in initTable" :key="item.id" :style="`width: ${item.widthPercent * clientWidth}px`">{{item.label}}</th>
          </tr>
        </thead>

        <draggable v-if="formData.length !== 0" v-model="formData" tag="tbody" @end="dropColumn">
          <!-- tr的高度根据图片的高度0.12来调整 -->
          <tr v-for="(item, index) in formData" :ref="`row${index}`" :key="item.id" class="row" @mouseenter="putBg(`row${index}`)" @mouseleave="moveBg(`row${index}`)" :style="`height:${0.12 * clientWidth * 0.5 + 10}px`">

          <!-- 多选框 -->
              <td class="checkbox">
                <el-checkbox v-model="item.hasChecked" @change="handleCheckedChange(item)"></el-checkbox>
              </td>
              <!-- 显示数量id -->
              <td scope="row">{{ index }}</td>
              <!-- 由于draggable插件的限制，这里的整体for循环的数据要绑定formData，这样一来再使用for循环来init表格内容样式就不太行，暂时想到用一下这种将表格所需的全部样式列出来，
              用if来判断那个来显示 -->
              <!-- 如果是标题 -->
              <td v-if="hasTableTd.title" :style="`width: ${item.widthPercent - (-0.07) * clientWidth}px`">
                <el-input
                  v-if="multipleSelection.length !== 0 && item.edit"
                  v-model="form.title"
                >
                </el-input>
                <div  v-else class="ellipsis" :style="`width: ${item.widthPercent * clientWidth}px`" :title="item.title">{{ item.title }}</div>
              </td>
              <!-- 如果是名称 -->
              <td v-if="hasTableTd.name" :style="`width: ${item.widthPercent - (-0.07) * clientWidth}px`">
                <el-input
                  v-if="multipleSelection.length !== 0 && item.edit"
                  v-model="form.name"
                >
                </el-input>
                <div  v-else class="ellipsis" :style="`width: ${item.widthPercent * clientWidth}px`" :title="item.name">{{ item.name }}</div>
              </td>

              <!-- 图片类 -->
              <!-- 背景 -->
              <td v-if="hasTableTd.background_img" :style="`width: ${item.widthPercent * clientWidth}px`">
                <div class="relativePos" :style="`height:${item.widthPercent * clientWidth * 0.5}px`">
                  <el-upload
                   v-if="item.edit"
                    class="upload-demo hidden fileInput"
                    action="/api/common/uploadImg"
                    :on-success="uploadSuccess.bind(null, 'background_img')">
                      <!-- <el-input
                        v-if="item.edit"
                        type="file"
                        class="hidden fileInput"
                        v-model="item.thumbnail"
                        title="请选择本地图片"
                      >
                      </el-input> -->
                      <el-button :style="`width: ${item.widthPercent * clientWidth}px;height:${item.widthPercent * clientWidth * 0.5}px`" size="medium" type="primary">点击上传</el-button>
                  </el-upload>
                  <el-image
                    :style="`width:${item.widthPercent * clientWidth}px;height:${item.widthPercent * clientWidth * 0.5}px; position:relative`"
                    :src="item.edit ? form.background_img : item.background_img"
                    fit="contain"
                    class="thumbnail" @click="showDialog(item.background_img)"
                  >
                    <div slot="error" class="image-slot" style="position: absolute;top: 50%;left: 50% ;transform: translate(-50%,-50%)">
                      <i class="el-icon-picture-outline"></i>
                    </div>
                  </el-image>

                  <!-- <img class="thumbnail" @click="showDialog(item.thumbnail)" :src="item.thumbnail" alt="" :style="`display: inline-block;height:${item.widthPercent * clientWidth * 0.5}px`"> -->
                </div>
              </td>
              <!-- 标题图 -->
              <td v-if="hasTableTd.title_img" :style="`width: ${item.widthPercent * clientWidth}px`">
                <div class="relativePos" :style="`height:${item.widthPercent * clientWidth * 0.5}px`">
                  <el-upload
                   v-if="item.edit"
                    class="upload-demo hidden fileInput"
                    action="/api/common/uploadImg"
                    :on-success="uploadSuccess.bind(null, 'title_img')">
                      <!-- <el-input
                        v-if="item.edit"
                        type="file"
                        class="hidden fileInput"
                        v-model="item.thumbnail"
                        title="请选择本地图片"
                      >
                      </el-input> -->
                      <el-button :style="`width: ${item.widthPercent * clientWidth}px;height:${item.widthPercent * clientWidth * 0.5}px`" size="medium" type="primary">点击上传</el-button>
                  </el-upload>
                  <el-image
                    :style="`width:${item.widthPercent * clientWidth}px;height:${item.widthPercent * clientWidth * 0.5}px; position:relative`"
                    :src="item.edit ? form.title_img : item.title_img"
                    fit="contain"
                    class="thumbnail" @click="showDialog(item.title_img)"
                  >
                    <div slot="error" class="image-slot" style="position: absolute;top: 50%;left: 50% ;transform: translate(-50%,-50%)">
                      <i class="el-icon-picture-outline"></i>
                    </div>
                  </el-image>

                  <!-- <img class="thumbnail" @click="showDialog(item.thumbnail)" :src="item.thumbnail" alt="" :style="`display: inline-block;height:${item.widthPercent * clientWidth * 0.5}px`"> -->
                </div>
              </td>

              <!-- 主图 -->
              <td v-if="hasTableTd.main_img" :style="`width: ${item.widthPercent * clientWidth}px`">
                <div class="relativePos" :style="`height:${item.widthPercent * clientWidth * 0.5}px`">
                  <el-upload
                   v-if="item.edit"
                    class="upload-demo hidden fileInput"
                    action="/api/common/uploadImg"
                    :on-success="uploadSuccess.bind(null, 'main_img')">
                      <el-button :style="`width: ${item.widthPercent * clientWidth}px;height:${item.widthPercent * clientWidth * 0.5}px`" size="medium" type="primary">点击上传</el-button>
                  </el-upload>
                  <el-image
                    :style="`width:${item.widthPercent * clientWidth}px;height:${item.widthPercent * clientWidth * 0.5}px; position:relative`"
                    :src="item.edit ? form.main_img : item.main_img"
                    fit="contain"
                    class="thumbnail" @click="showDialog(item.main_img)"
                  >
                    <div slot="error" class="image-slot" style="position: absolute;top: 50%;left: 50% ;transform: translate(-50%,-50%)">
                      <i class="el-icon-picture-outline"></i>
                    </div>
                  </el-image>

                </div>
              </td>
              <!-- 如果是描述,描述的宽度比平均长一些 -->
              <td v-if="hasTableTd.content" :style="`width: ${item.widthPercent - (-0.07) * clientWidth}px`">
                <el-input
                  v-if="multipleSelection.length !== 0 && item.edit"
                  v-model="form.content"
                >
                </el-input>
                <span v-else class="ellipsis" :style="`width: ${item.widthPercent * clientWidth}px`" :title="item.content">{{ item.content }}</span>
              </td>

                <!-- 下拉选择状态 -->
              <td v-if="item.status !== undefined" :style="`width: ${item.widthPercent * clientWidth}px`">
                <el-select
                  v-if="multipleSelection.length !== 0 && item.edit"
                  v-model="form.status"
                  style="width: 50%"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <span v-else>{{ item.status ? "显示" : "隐藏" }}</span>
              </td>
              <td>
                <div v-if="item.edit">
                  <el-button
                    class="greenColor"
                    @click.stop="setNewValue(item, index)"
                    type="text"
                    size="medium "
                    >确定</el-button
                  >
                  <el-button
                    class="redColor"
                    @click.stop="keepOldValue(item)"
                    type="text"
                    size="medium "
                    >取消</el-button
                  >
                </div>
                <div v-else>
                  <el-button
                    class="greenColor"
                    @click.stop="editClick(item)"
                    type="text"
                    size="medium "
                    >编辑</el-button
                  >
                  <!-- <el-button
                    class="redColor"
                    @click.stop="deleteThis(item)"
                    type="text"
                    size="medium "
                    >删除</el-button
                  > -->
                </div>
              </td>
          </tr>
        </draggable>
      </table>
    </div>
    <el-button
      @click="batchHide"
      :disabled="multipleSelection.length ? false : true"
      class="batch"
      type="danger"
      round
      >批量隐藏</el-button
    >
    <el-button
      @click="batchShow"
      :disabled="multipleSelection.length ? false : true"
      class="batch"
      type="danger"
      round
      >批量显示</el-button
    >
    <el-button
      @click="batchUploadImg"
      class="batch"
      type="danger"
      round
      >批量新建图片</el-button
    >
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import { deepCopy, getImgMsg } from '../../assets/js/base';
import { axiosPost } from '../../assets/js/axios';

export default {
  name: 'flexTable',
  props: {
    initTable: {
      /* 初始化表格样式，输入表头类型 */
      type: Array,
      default: function () {
        return [
          {
            label: '显示状态', // 表头名
            widthPercent: 0.12, // 表头占父类长度百分比
            type: 'select', // 表头input类型
            key: 'status' // 他对应表格数据tableData对象里的key值
          },
          {
            label: '', // 迷之位置。。。。
            widthPercent: 0.05,
            type: 'checkbox',
            key: 'checkbox'
          },
          {
            label: '名称',
            widthPercent: 0.12,
            type: 'text',
            key: 'name'
          },
          {
            label: '缩略图',
            widthPercent: 0.12,
            type: 'image',
            key: 'thumbnail'
          },
          {
            label: '跳转链接',
            widthPercent: 0.19,
            type: 'text',
            key: 'link'
          }
        ];
      }
    },
    tableData: {
      /* 表格数据 */
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      dialogUrl: '',
      dialogVisible: false,
      checkAll: false,
      enabled: true,
      dragging: false,
      batch: false, // 批量
      shortInput: '200px', // 短input框长度
      longInput: '250px', // 长input框长度
      url:
        'http://img.iimedia.cn/00001228e00fdffb513251e96027c50ff3fd18040576eed1660299eeb278938ef42d8',
      options: [
        {
          value: 1,
          label: '显示'
        },
        {
          value: 0,
          label: '隐藏'
        }
      ],
      form: {}, // 编辑时保留提交的数据
      formData: [],
      multipleSelection: [], /* 保存所选项的obj_id */
      hasTableTd: { // 表格是否展示这些字段
        background_img: false,
        content: false,
        desc_content: false,
        main_img: false,
        name: false,
        status: false,
        title: false,
        title_img: false
      }
    };
  },
  computed: {

  },
  mounted () {
    // let that = this;
    this.$nextTick(function () {
    });
  },
  created () {
    // this.init()
    // this.setTableWidth()
    this.clientWidth = document.body.clientWidth
    this.formData = this.tableData
    // let keys = []
    // 判断hasTableTd是否有initTable的key字段，初始化table的td
    for (let i in this.initTable) {
      // keys.push(this.initTable[i].key)
      this.hasTableTd[this.initTable[i].key] = this.hasTableTd.hasOwnProperty(this.initTable[i].key)
    }
  },
  methods: {
    /*
    作用：批量上传图片
    @return void
    */
    batchUploadImg () {
      this.$emit('batchUploadImg')
    },
    showDialog (url) {
      this.dialogVisible = true
      this.dialogUrl = url
    },
    putBg (ref) { /* 给鼠标hover的那行表格数据更改背景 */
      this.$refs[ref][0].style.background = '#f5f7fa'
    },
    moveBg (ref) {
      this.$refs[ref][0].style.background = 'white'
    },
    uploadSuccess (name, response, file, fileList) { /* success之后将url付给 */
      if (response.code === '1') {
        Object.assign(this.form, getImgMsg(name, [fileList[0].response.data])); // Object.assign(target, ...sources)合并图片对象
      } else {
        this.$message.error(response.msg)
      }
    },
    handleCheckAllChange (val) { /* 全选按钮 */
      // console.log(this.checkAll)
      if (!this.checkAll) { /* 从true变成false，全选变成全不选 */
        this.multipleSelection = []
        this.clearSelection() // 清除checked状态
      } else {
        let allId = []
        for (let i = 0; i < this.formData.length; i++) {
          allId.push(this.formData[i].obj_id)
          this.formData[i].hasChecked = true
        }
        this.multipleSelection = allId
        console.log(this.formData)
      }
      // this.isIndeterminate = false;
    },
    handleCheckedChange (item) { /* 将id push进multipleSelection */
      if (!item.hasChecked) { /* fasle ，表示取消checked，需要将已经在multipleSelection的数据删除 */
        this.multipleSelection.splice(this.multipleSelection.indexOf(item.obj_id), 1)
      } else {
        this.multipleSelection.push(item.obj_id)
      }
      this.checkAll = (this.formData.length !== 0) && (this.multipleSelection.length === this.formData.length)

      /* let checkedCount = value.length;
      this.checkAll = checkedCount === this.tableItems.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.tableItems.length; */
    },
    /*
    作用：确认修改表格数据，请求后台更新，以及调用父组件本地更新
    @params row 修改的该行数据
    @params index 该行的索引index
    @return void
    */
    setNewValue (row, index) {
      // 确定更改新值
      let that = this;
      this.$confirm('是否确定修改所选行信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 请求后台更新栏目内容
          axiosPost(
            'api/columnObj/updateColumnObj',
            this.form,
            res => {
              let data = res.data;
              if (data.code === '1') {
                // 本地更新
                this.$emit('updateColumnObj', this.form, index)
                this.toggleSelection(); // 取消所有选择状态，让model的值于data的tableData的值同步更新
                row.edit = false; // 清除所有编辑状态
                that.$message({
                  type: 'success',
                  message: '修改成功!'
                });
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
        })
        .catch(() => {
          this.clearSelection() // 清除checked状态
          that.$message({
            type: 'info',
            message: '已取消修改'
          });
        });
    },
    /*
    作用：取消更改
    @params row 修改的该行数据
    @return void
    */
    keepOldValue (row) {
      // 取消更改
      let that = this;
      this.$confirm('是否确定恢复原值？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.toggleSelection();
          row.edit = false;
          that.$message({
            type: 'success',
            message: '恢复成功!'
          });
        })
        .catch(() => {
          this.clearSelection() // 清除checked状态
          that.$message({
            type: 'info',
            message: '已取消恢复'
          });
        });
    },
    /*
    作用：清除checked状态
    @params row 修改的该行数据
    @return void
    */
    clearSelection () {
      for (let i = 0; i < this.formData.length; i++) {
        this.formData[i].hasChecked = false
      }
    },
    /*
    作用：点击编辑
    @return void
    */
    editClick (row) {
      // 点击编辑
      this.form = deepCopy(row) // 编辑前先保存旧值
      this.clearEdit(); /// 先清除掉之前的编辑态
      this.toggleSelection([row]);
      row.edit = true;
    },
    /*     deleteThis (row) {
      // 点击删除
      this.clearEdit();
      this.toggleSelection([row]);
      console.log(this.multipleSelection, 'multipleSelection')
      this.batchHide();
    }, */
    /*
    作用：清除所有编辑状态
    @return void
    */
    clearEdit () {
      for (let i = 0; i < this.formData.length; i++) {
        this.formData[i].edit = false;
      }
    },
    /*
    作用：点击批量隐藏
    @return void
    */
    batchHide () {
      let that = this;
      this.$confirm('是否确定隐藏所选行信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.isBatchHide = true
        this.batchHS(this.multipleSelection)
      }).catch(() => {
        that.$message({
          type: 'info',
          message: '已取消隐藏'
        });
      }).finally(() => {
        this.multipleSelection = []
        this.clearSelection() // 清除checked状态
      })
    },
    /*
    作用：点击批量显示
    @return void
    */
    batchShow () {
      let that = this;
      this.$confirm('是否确定隐显示所选行信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.isBatchHide = false
        this.batchHS(this.multipleSelection)
        this.multipleSelection = []
      }).catch(() => {
        that.$message({
          type: 'info',
          message: '已取消显示'
        });
      }).finally(() => {
        this.multipleSelection = []
        this.clearSelection() // 清除checked状态
      })
    },
    /*
    作用：批量显示或隐藏操作
    @return void
    */
    batchHS (multipleSelection) {
      let that = this
      let ids = multipleSelection
      let status
      if (this.isBatchHide) {
        status = 0
      } else {
        status = 1
      }
      axiosPost(
        'api/columnObj/batUpdateStatus',
        {
          updateData: JSON.stringify(multipleSelection), // 数组传入后台都要字符串化
          status
        },
        res => {
          let data = res.data;
          if (data.code === '1') {
            // 本地更新
            this.$emit('batchHS', ids, status)
            this.checkAll = (this.formData.length !== 0) && (this.multipleSelection.length === this.formData.length)
            that.$message({
              message: data.msg,
              type: 'success'
            });
          } else {
            that.$message.error(data.msg);
          }
        },
        err => {
          this.$message.error('更新，请重试！' + err);
        }
      )
    },
    /*
    作用：批量显示或隐藏操作
    @return void
    */
    toggleSelection (rows) {
      this.clearSelection() // 清除checked状态
      this.multipleSelection = []
      if (rows) {
        rows.forEach(row => {
          // console.log(row, 'row')
          row.hasChecked = !row.hasChecked
          this.handleCheckedChange(row)
          // this.multipleSelection.push(row.id)// !!!!!!!!!!!!!!!!
        })
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val;
      // console.log(val, 'val')
    },
    checkMove: function (e) {
      window.console.log('Future index: ' + e.draggedContext.futureIndex);
    },
    /*
    作用：发送更新栏目内容顺序sort请求给后台
    @formName: String 对应新增表单的ref
    @return void
    */
    dropColumn () {
      this.dragging = false;
      this.$emit('dropColumn', this.formData)
    }
  },
  components: {
    draggable
  }
};
</script>

<style lang="sass" scoped>
.el-checkbox
  width: 40px
  height: 20px
  vertical-align: top
.el-icon-picture-outline
  font-size:30px
*
  box-sizing: border-box
  transition: background-color .25s ease
.ellipsis
  width: 100%
  display: inline-block
  overflow: hidden
  text-overflow: ellipsis
.redColor
  color: red
.greenColor
  color: green
.relativePos
  position: relative
  width: 100%
  .fileInput
    width: 100%
    position: absolute
    left: 50%
    top: 50%
    transform: translate(-50%,-50%)
    z-index: 1
.absolutePos
  position: absolute
.hidden
  opacity: 0
#table
  .table
    .thead-dark
      background: #545c64
      color: white
      font-size: 18px
      tr
        height: 50px
        th
          border-bottom: 1px solid #ebeef5
    .el-button
      padding: 10px
      font-size: 16px
    .checkbox
      width: 70px
    .thumbnail:hover
      cursor: pointer
  .batch
    margin: 20px 0
  .row
    text-align: center
    td
      border-bottom: 1px solid #f2f2f2
    .el-image
      position: absolute
      left: 50%
      top: 50%
      transform: translate(-50%, -50%)
      margin: 0 auto
    .el-select>.el-input
      margin: 0 auto
    .el-input
      width: 80%
</style>
