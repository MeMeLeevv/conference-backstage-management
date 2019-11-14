<template>
  <div id="table">
    <el-table
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="" width="55">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.checked"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="名称" width="120">
        <template slot-scope="scope">
            <el-input
            v-model="scope.row.name"
            clearable>
            </el-input>
        </template>
      </el-table-column>
      <el-table-column label="缩略图" width="120">
        <template slot-scope="scope">
            <el-input type="file" class="hidden"
            v-model="scope.row.thumbnail">
            </el-input>
        </template>
      </el-table-column>
      <el-table-column label="跳转链接" width="120">
        <template slot-scope="scope">
            <el-input
            v-model="scope.row.link"
            clearable>
            </el-input>
        </template>
      </el-table-column>
      <el-table-column label="显示状态" width="120">
        <template slot-scope="scope">
            <el-select v-model="scope.row.state">
            <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
            </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
          <el-button type="text" size="small">删除</el-button>
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
.hidden
  opacity: .5
#table
  border: 1px solid lightgray
  .el-table
    padding: 20px
    .el-input .el-input__inner
      visibility: hidden
</style>
