<template>
  <div id="partners">
    <!-- 大会伙伴集合 -->
    <ConfigHeader title="伙伴" :initDialog="initDialog"></ConfigHeader>
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
          label: '名称',
          type: 'text',
          key: 'name',
          required: true
        },
        {
          label: 'logo',
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
          label: '描述',
          type: 'text',
          key: 'desc',
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
          label: '名称',
          widthPercent: 0.12,
          type: 'text',
          key: 'name'
        },
        {
          label: 'logo',
          widthPercent: 0.12,
          type: 'image',
          key: 'thumbnail'
        },
        {
          label: '描述(非必填)',
          widthPercent: 0.19,
          type: 'text',
          key: 'desc'
        }
      ],
      tableData: [
        {
          id: 0,
          thumbnail: '',
          name: '234233333333333333333333333333333333333333',
          desc: '23423777777777777777777777777777777777',
          edit: false, /* 是否为可编辑状态 */
          state: true
        },
        {
          id: 1,
          thumbnail: '',
          name: 'rew',
          desc: 'werw',
          edit: false,
          state: true
        },
        {
          id: 2,
          thumbnail: '',
          name: 'werw',
          desc: 'werwer',
          edit: false,
          state: true
        },
        {
          id: 3,
          thumbnail: '',
          name: 'werw',
          desc: 'werw',
          edit: false,
          state: true
        },
        {
          id: 4,
          thumbnail: '',
          name: 'wer',
          edit: false,
          desc: 'wer',
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
#partners
  .flexTable
    margin: 20px 0
</style>
