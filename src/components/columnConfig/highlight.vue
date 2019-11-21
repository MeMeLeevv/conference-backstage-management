<template>
  <div id="highlight">
    <!-- 大会亮点集合 -->
    <ConfigHeader title="亮点" :initDialog="initDialog"></ConfigHeader>
    <Table class="flexTable" :initTable="initTable" :tableData="tableData"></Table>
  </div>
</template>

<script>
import ConfigHeader from './common/configHeader'
import Table from './common/table'
export default {
  name: 'highlight',
  data () {
    return {
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
      initTable: [
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
      ]
    }
  },
  components: {
    ConfigHeader,
    Table
  }
}
</script>

<style lang="sass" scoped>
#highlight
  .flexTable
    margin: 20px 0
</style>
