<template>
  <div id="guests">
    <!-- 大会嘉宾集合 -->
    <ConfigHeader title="嘉宾" :initDialog="initDialog"></ConfigHeader>
    <Table class="flexTable" :initTable="initTable" :tableData="tableData"></Table>
  </div>
</template>

<script>
import ConfigHeader from './configHeader'
import Table from './table'
export default {
  name: 'guests',
  data () {
    return {
      initDialog: [
        {
          label: '嘉宾信息',
          type: 'text',
          key: 'name',
          required: true
        },
        {
          label: '头像',
          type: 'image',
          key: 'thumbnail',
          required: true
        },
        {
          label: '状态',
          type: 'Switch',
          key: 'state',
          required: true
        },
        {
          label: '职位',
          type: 'text',
          key: 'job',
          required: false
        }
      ],
      initTable: [
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
          label: '姓名',
          widthPercent: 0.12,
          type: 'text',
          key: 'name'
        },
        {
          label: '头像',
          widthPercent: 0.12,
          type: 'image',
          key: 'thumbnail'
        },
        {
          label: '职位',
          widthPercent: 0.19,
          type: 'text',
          key: 'job'
        }
      ],
      tableData: [
        {
          id: 0,
          thumbnail: '',
          name: '234233333333333333333333333333333333333333',
          job: '23423777777777777777777777777777777777',
          edit: false, /* 是否为可编辑状态 */
          state: true
        },
        {
          id: 1,
          thumbnail: '',
          name: 'rew',
          job: 'werw',
          edit: false,
          state: true
        },
        {
          id: 2,
          thumbnail: '',
          name: 'werw',
          job: 'werwer',
          edit: false,
          state: true
        },
        {
          id: 3,
          thumbnail: '',
          name: 'werw',
          job: 'werw',
          edit: false,
          state: true
        },
        {
          id: 4,
          thumbnail: '',
          name: 'wer',
          edit: false,
          job: 'wer',
          state: true
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
#guests
  .flexTable
    margin: 20px 0
</style>
