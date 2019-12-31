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

        <draggable v-if="formData.length !== 0" v-model="formData" tag="tbody">
          <!-- tr的高度根据图片的高度0.12来调整 -->
          <tr v-for="(item, index) in formData" :ref="`row${index}`" :key="item.id" class="row" @mouseenter="putBg(`row${index}`)" @mouseleave="moveBg(`row${index}`)" :style="`height:${0.12 * clientWidth * 0.5 + 10}px`">

          <!-- 多选框 -->
              <td class="checkbox">
                <el-checkbox v-model="item.hasChecked" @change="handleCheckedChange(item)"></el-checkbox>
              </td>
              <td scope="row">{{ item.id }}</td>
              <!-- 由于draggable插件的限制，这里的整体for循环的数据要绑定formData，这样一来再使用for循环来init表格内容样式就不太行，暂时想到用一下这种将表格所需的全部样式列出来，
              用if来判断那个来显示 -->
              <!-- 如果是名称 -->
              <td v-if="item.name !== undefined" :style="`width: ${item.widthPercent - (-0.07) * clientWidth}px`">
                <el-input
                  v-if="multipleSelection.length !== 0 && item.edit"
                  v-model="item.name"
                >
                </el-input>
                <div  v-else class="ellipsis" :style="`width: ${item.widthPercent * clientWidth}px`" :title="item.name">{{ item.name }}</div>
              </td>

              <!-- 图片类 -->
              <td v-if="item.thumbnail !== undefined" :style="`width: ${item.widthPercent * clientWidth}px`">
                <div class="relativePos" :style="`height:${item.widthPercent * clientWidth * 0.5}px`">
                  <el-upload
                   v-if="item.edit"
                    class="upload-demo hidden fileInput"
                    action="/api/common/uploadImg"
                    :on-preview="handlePreview"
                    :on-success="uploadSuccess.bind(this,index, item)">
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
                    :src="item.thumbnail"
                    fit="contain"
                    class="thumbnail" @click="showDialog(item.thumbnail)"
                  >
                    <div slot="error" class="image-slot" style="position: absolute;top: 50%;left: 50% ;transform: translate(-50%,-50%)">
                      <i class="el-icon-picture-outline"></i>
                    </div>
                  </el-image>

                  <!-- <img class="thumbnail" @click="showDialog(item.thumbnail)" :src="item.thumbnail" alt="" :style="`display: inline-block;height:${item.widthPercent * clientWidth * 0.5}px`"> -->
                </div>
              </td>
              <!-- 如果是描述,描述的宽度比平均长一些 -->
              <td v-if="item.desc !== undefined" :style="`width: ${item.widthPercent - (-0.07) * clientWidth}px`">
                <el-input
                  v-if="multipleSelection.length !== 0 && item.edit"
                  v-model="item.desc"
                >
                </el-input>
                <span v-else class="ellipsis" :style="`width: ${item.widthPercent * clientWidth}px`" :title="item.desc">{{ item.desc }}</span>
              </td>

                <!-- 下拉选择状态 -->
              <td v-if="item.state !== undefined" :style="`width: ${item.widthPercent * clientWidth}px`">
                <el-select
                  v-if="multipleSelection.length !== 0 && item.edit"
                  v-model="item.state"
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
                <span v-else>{{ item.state ? "显示" : "隐藏" }}</span>
              </td>
              <td>
                <div v-if="item.edit">
                  <el-button
                    class="greenColor"
                    @click.stop="setNewValue(item)"
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
                  <el-button
                    class="redColor"
                    @click.stop="deleteThis(item)"
                    type="text"
                    size="medium "
                    >删除</el-button
                  >
                </div>
              </td>
          </tr>
        </draggable>
      </table>
    </div>
    <el-button
      @click="batchDelete"
      :disabled="multipleSelection.length ? false : true"
      class="batch"
      type="danger"
      round
      >批量删除</el-button
    >
  </div>
</template>

<script>
import draggable from 'vuedraggable';
const tableOptions = [0, 1, 2, 3]

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
            key: 'state' // 他对应表格数据tableData对象里的key值
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
        return [
          // 如果用户编辑成空数据！！！
          /* {
            id: 0,
            thumbnail: '',
            name: '234233333333333333333333333333333333333333',
            link: '23423777777777777777777777777777777777',
            edit: false,
            state: true
          },
          {
            id: 1,
            thumbnail: '',
            name: 'rew',
            link: 'werw',
            edit: false,
            state: true
          },
          {
            id: 2,
            thumbnail: '',
            name: 'werw',
            link: 'werwer',
            edit: false,
            state: true
          },
          {
            id: 3,
            thumbnail: '',
            name: 'werw',
            link: 'werw',
            edit: false,
            state: true
          },
          {
            id: 4,
            thumbnail: '',
            name: 'wer',
            edit: false,
            link: 'wer',
            state: true
          } */
        ];
      }
    }
  },
  data () {
    return {
      dialogUrl: '',
      dialogVisible: false,
      checkAll: false,
      checkedtableItems: [0, 1],
      tableItems: tableOptions,
      enabled: true,
      dragging: false,
      batch: false, // 批量
      shortInput: '200px', // 短input框长度
      longInput: '250px', // 长input框长度
      url:
        'http://img.iimedia.cn/00001228e00fdffb513251e96027c50ff3fd18040576eed1660299eeb278938ef42d8',
      options: [
        {
          value: true,
          label: '显示'
        },
        {
          value: false,
          label: '隐藏'
        }
      ],
      form: {}, // 编辑时保留提交的数据
      formData: [],
      multipleSelection: []/* 保存所选项的id */
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
  },
  methods: {
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
    uploadSuccess (index, item, response, file, fileList) { /* success之后将url付给 */
      console.log(index, item, response, file, fileList)
      if (response.code === '1') {
        this.$set(item, 'thumbnail', response.data.imgurl)
        // this.formData[index].thumbnail = response.data.imgurl
        // item.thumbnail = response.data.imgurl
      }
      // console.log(this.formData, this.$set)
    },
    handlePreview (file) {
      console.log(file.url, 'file.url'); /* blob的临时对象 */
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleCheckAllChange (val) { /* 全选按钮 */
      // console.log(this.checkAll)
      if (!this.checkAll) { /* 从true变成false，全选变成全不选 */
        this.multipleSelection = []
        this.clearSelection() // 清除checked状态
      } else {
        let allId = []
        for (let i = 0; i < this.formData.length; i++) {
          allId.push(this.formData[i].id)
          this.formData[i].hasChecked = true
        }
        this.multipleSelection = allId
        console.log(this.formData)
      }
      // this.isIndeterminate = false;
    },
    handleCheckedChange (item) { /* 将id push进multipleSelection */
      if (!item.hasChecked) { /* fasle ，表示取消checked，需要将已经在multipleSelection的数据删除 */
        this.multipleSelection.splice(this.multipleSelection.indexOf(item.id), 1)
      } else {
        this.multipleSelection.push(item.id)
      }
      this.checkAll = (this.formData.length !== 0) && (this.multipleSelection.length === this.formData.length)

      /* let checkedCount = value.length;
      this.checkAll = checkedCount === this.tableItems.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.tableItems.length; */
    },
    init () {
      // 先把input的border删除掉
    },
    /*     getDevice () {
      window.deviceWidth = document.body.clientWidth
      window.deviceHeight = document.body.clientHeight
    }, */
    /*     setTableWidth () {
      this.shortInput = window.deviceWidth * 0.12 // 使用百分比会报错 expression missing
      this.longInput = window.deviceWidth * 0.17
      // console.log(this.shortInput)
    }, */
    setNewValue (row) {
      // 确定更改新值
      let that = this;
      this.$confirm('是否确定修改所选行信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.toggleSelection(); // 取消所有选择状态，让model的值于data的tableData的值同步更新
          row.edit = false; // 清除所有编辑状态
          that.$message({
            type: 'success',
            message: '修改成功!'
          });
        })
        .catch(() => {
          this.clearSelection() // 清除checked状态
          that.$message({
            type: 'info',
            message: '已取消修改'
          });
        });
    },
    keepOldValue (row) {
      // 取消更改
      let that = this;
      this.$confirm('是否确定恢复原值？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          for (let rr in row) {
            // 恢复旧值
            row[rr] = row[`old${rr}`];
          }
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
    clearSelection () {
      for (let i = 0; i < this.formData.length; i++) {
        this.formData[i].hasChecked = false
      }
    },
    editClick (row) {
      // 点击编辑
      for (let rr in row) {
        // 编辑前先保存旧值
        row[`old${rr}`] = row[rr];
      }
      // console.log(row, 'editRow')
      this.clearEdit(); /// 先清除掉之前的编辑态
      this.toggleSelection([row]);
      row.edit = true;
    },
    deleteThis (row) {
      // 点击删除
      this.clearEdit();
      this.toggleSelection([row]);
      console.log(this.multipleSelection, 'multipleSelection')
      this.batchDelete();
    },
    clearEdit () {
      // 清除所有编辑状态
      for (let i = 0; i < this.formData.length; i++) {
        if (this.formData[i].edit) {
          // 查询之前编辑的那个状态，如果点击编辑且修改后不做任何处理又跳转到另一行编辑，保留之前的值
          for (let j in this.formData[i]) {
            this.formData[i][j] = this.formData[i][`old${j}`];
          }
          this.formData[i].edit = false;
        }
      }
    },
    batchDelete () {
      // 点击批量删除
      let that = this;
      this.$confirm('是否确定删除所选行信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          that.multipleSelection.forEach(items => {
            // 寻找对应的id号然后删除
            let findIndex = this.formData.findIndex(item => (item.id) === items);
            that.formData.splice(findIndex, 1);
          });
          that.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.checkAll = (this.formData.length !== 0) && (this.multipleSelection.length === this.formData.length)
        })
        .catch(() => {
          this.clearSelection() // 清除checked状态
          that.$message({
            type: 'info',
            message: '已取消删除'
          });
        }).finally(() => {
          this.multipleSelection = []
        })
    },
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
    dropColumn () {
      /* 新增的时候将sort = this.navMsg[2].subTitle.length */
      this.dragging = false
    },
    checkMove: function (e) {
      window.console.log('Future index: ' + e.draggedContext.futureIndex);
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
    box-shadow: 0 0 10px #A8A8A8
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
