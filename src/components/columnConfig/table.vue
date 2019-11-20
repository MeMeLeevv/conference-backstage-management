<template>
  <div id="table">
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 98%"
      @selection-change="handleSelectionChange"
      :fit="true"
    >
      <div v-for="item in initTable" :key="item.id">
        <!-- 多选类 -->
        <el-table-column v-if="item.type === 'checkbox'" label="" :width="item.widthPercent" align="center" type="selection"></el-table-column>
        <!-- 文本框类 -->
        <el-table-column v-if="item.type === 'text'" :label="item.label" :width="item.widthPercent" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
            <el-input v-if="multipleSelection.length !== 0 && scope.row.edit"
            v-model="scope.row[item.key]"
            >
            </el-input>
            <span v-else class="ellipsis">{{scope.row[item.key]}}</span>
        </template>
      </el-table-column>
      <!-- 图片类 -->
      <el-table-column v-if="item.type === 'image'" :label="item.label" :width="item.widthPercent" align="center">
        <template slot-scope="scope">
            <div class="relativePos">
              <el-input v-if="scope.row.edit" type="file" class="hidden fileInput"
            v-model="scope.row[item.key]" title="请选择本地图片">
            </el-input>
            <el-image
              :style="`width: ${item.widthPercent}px; height: 100px`"
              :src="url"
              fit="contain">
            </el-image>
            </div>
        </template>
      </el-table-column>
      <!-- 下拉类 -->
      <el-table-column v-if="item.type === 'select'" :label="item.label" :width="item.widthPercent" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
            <el-select v-if="multipleSelection.length !== 0 && scope.row.edit" v-model="scope.row[item.key]" style="width: 50%">
            <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
            </el-select>
            <span v-else>{{scope.row[item.key] ? '显示' : '隐藏'}}</span>
        </template>
      </el-table-column>
      </div>
      <!-- <el-table-column label="名称" :width="shortInput" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
            <el-input v-if="multipleSelection.length !== 0 && scope.row.edit"
            v-model="scope.row.name"
            >
            </el-input>
            <span v-else>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="缩略图" :width="shortInput" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
            <div class="relativePos">
              <el-input type="file" class="hidden fileInput"
            v-model="scope.row.thumbnail">
            </el-input>
            <el-image
              :style="`width: ${shortInput}px; height: 100px`"
              :src="url"
              fit="contain">
            </el-image>
            </div>
        </template>
      </el-table-column>
      <el-table-column label="跳转链接" :width="longInput" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
            <el-input v-if="multipleSelection.length !== 0 && scope.row.edit" style="width: 80%"
            v-model="scope.row.link"
            >
            </el-input>
            <span v-else>{{scope.row.link}}</span>
        </template>
      </el-table-column>
      <el-table-column label="显示状态" :width="shortInput" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
            <el-select v-if="multipleSelection.length !== 0 && scope.row.edit" v-model="scope.row.state" style="width: 50%">
            <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
            </el-select>
            <span v-else>{{scope.row.state ? '显示' : '隐藏'}}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" :width="longInput" align="center">
        <template slot-scope="scope">
          <div v-if="multipleSelection.length !== 0 && scope.row.edit">
            <el-button class="greenColor" @click.stop="setNewValue(scope.row)" type="text" size="small">确定</el-button>
            <el-button  class="redColor" @click.stop="keepOldValue(scope.row)" type="text" size="small">取消</el-button>
          </div>
          <div v-else>
            <el-button class="greenColor" @click.stop="editClick(scope.row)" type="text" size="small">编辑</el-button>
            <el-button  class="redColor" @click.stop="deleteThis(scope.row)" type="text" size="small">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-button @click="batchDelete" :disabled="multipleSelection.length ? false : true" class="batch" type="danger" round>批量删除</el-button>
  </div>
</template>

<script>

export default {
  name: 'flexTable',
  props: {
    initTable: {/* 初始化表格样式，输入表头类型 */
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
        ]
      }
    },
    tableData: {/* 表格数据 */
      type: Array,
      default: function () {
        return [ // 如果用户编辑成空数据！！！
          {
            id: 0,
            thumbnail: '',
            name: '234233333333333333333333333333333333333333',
            link: '23423777777777777777777777777777777777',
            edit: false, /* 是否为可编辑状态 */
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
          }
        ]
      }
    }
  },
  data () {
    return {
      batch: false, // 批量
      shortInput: '200px', // 短input框长度
      longInput: '250px', // 长input框长度
      url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      options: [{
        value: true,
        label: '显示'
      }, {
        value: false,
        label: '隐藏'
      }],
      multipleSelection: []
    }
  },
  mounted () {
    let that = this
    this.$nextTick(function () {
      // that.getDevice()
      // 消除input上的border
      that.initTable.forEach((item, index) => {
        that.initTable[index].widthPercent = document.body.clientWidth * item.widthPercent
      })
    })
  },
  created () {
    // this.init()
    // this.setTableWidth()
  },
  methods: {
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
    setNewValue (row) { // 确定更改新值
      let that = this
      this.$confirm('是否确定修改所选行信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.toggleSelection() // 取消所有选择状态，让model的值于data的tableData的值同步更新
        row.edit = false // 清除所有编辑状态
        that.$message({
          type: 'success',
          message: '修改成功!'
        })
      }).catch(() => {
        that.$refs.multipleTable.clearSelection()
        that.$message({
          type: 'info',
          message: '已取消修改'
        })
      })
    },
    keepOldValue (row) { // 取消更改
      let that = this
      this.$confirm('是否确定恢复原值？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        for (let rr in row) { // 恢复旧值
          row[rr] = row[`old${rr}`]
        }
        this.toggleSelection()
        row.edit = false
        that.$message({
          type: 'success',
          message: '恢复成功!'
        })
      }).catch(() => {
        that.$refs.multipleTable.clearSelection()
        that.$message({
          type: 'info',
          message: '已取消恢复'
        })
      })
    },
    editClick (row) { // 点击编辑
      for (let rr in row) { // 编辑前先保存旧值
        row[`old${rr}`] = row[rr]
      }
      // console.log(row, 'editRow')
      this.clearEdit() /// 先清除掉之前的编辑态
      this.toggleSelection([row])
      row.edit = true
    },
    deleteThis (row) { // 点击删除
      this.clearEdit()
      this.toggleSelection([row])
      this.batchDelete()
    },
    clearEdit () { // 清除所有编辑状态
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].edit) { // 查询之前编辑的那个状态，如果点击编辑且修改后不做任何处理又跳转到另一行编辑，保留之前的值
          for (let j in this.tableData[i]) {
            this.tableData[i][j] = this.tableData[i][`old${j}`]
          }
          this.tableData[i].edit = false
        }
      }
    },
    batchDelete () { // 点击批量删除
      let that = this
      this.$confirm('是否确定删除所选行信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.multipleSelection.forEach(item => { // 寻找对应的id号然后删除
          let id = item.id
          let findIndex = this.tableData.findIndex(item => item.id === id)
          that.tableData.splice(findIndex, 1)
        })
        that.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        that.$refs.multipleTable.clearSelection()
        that.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    toggleSelection (rows) {
      let that = this
      that.$refs.multipleTable.clearSelection()
      if (rows) {
        rows.forEach(row => {
          // console.log(row, 'row')
          that.$refs.multipleTable.toggleRowSelection(row)
        })
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      // console.log(val, 'val')
    }
  }
}
</script>

<style lang="sass" scoped>
$inputHeight: 76px
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
  height: $inputHeight
.absolutePos
  position: absolute
.hidden
  opacity: 0
#table
  .el-table
    padding: 20px
    border: 1px solid lightgray
    .el-table__row td
      padding: 0 20px
    .fileInput
      width: 100%
      position: absolute
      left: 50%
      top: 50%
      transform: translate(-50%,-50%)
      z-index: 1
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
    .el-button
      padding: 10px
      font-size: 14px
  .batch
    margin: 20px 0
</style>
