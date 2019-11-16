<template>
  <div id="table">
    <el-table
      :data="tableData"
      tooltip-effect="dark"
      style="width: 96%"
      @selection-change="handleSelectionChange"
      :fit="true"
    >
      <el-table-column label="" width="50%" align="center">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.checked"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="名称" :width="shortInput" align="center">
        <template slot-scope="scope" title="pic">
            <el-input
            v-model="scope.row.name"
            >
            </el-input>
        </template>
      </el-table-column>
      <el-table-column label="缩略图" :width="shortInput" align="center">
        <template slot-scope="scope">
            <div class="relativePos">
              <el-input type="file" class="hidden fileInput"
            v-model="scope.row.thumbnail">
            </el-input>
            <el-image
              style="width: 130px; height: 100px"
              :src="url"
              fit="contain">
            </el-image>
            </div>
        </template>
      </el-table-column>
      <el-table-column label="跳转链接" :width="longInput" align="center">
        <template slot-scope="scope">
            <el-input style="width: 80%"
            v-model="scope.row.link"
            >
            </el-input>
        </template>
      </el-table-column>
      <el-table-column label="显示状态" :width="shortInput" align="center">
        <template slot-scope="scope">
            <el-select v-model="scope.row.state" style="width: 50%">
            <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
            </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作" :width="longInput" align="center">
        <template slot-scope="scope">
          <el-button class="greenColor" @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
          <el-button class="redColor" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

export default {
  name: 'flexTable',
  data () {
    return {
      shortInput: '200px',
      longInput: '250px',
      url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      options: [{
        value: true,
        label: '显示'
      }, {
        value: false,
        label: '隐藏'
      }],
      tableData: [
        {
          checked: false,
          thumbnail: '',
          name: '',
          link: '',
          state: true
        },
        {
          checked: false,
          thumbnail: '',
          name: '',
          link: '',
          state: true
        },
        {
          checked: false,
          thumbnail: '',
          name: '',
          link: '',
          state: true
        },
        {
          checked: false,
          thumbnail: '',
          name: '',
          link: '',
          state: true
        },
        {
          checked: false,
          thumbnail: '',
          name: '',
          link: '',
          state: true
        }
      ],
      multipleSelection: []
    }
  },
  methods: {
    handleClick (row) {
      console.log(row)
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style lang="sass" scoped>
$inputHeight: 76px
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
    margin: 0 auto
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

</style>
