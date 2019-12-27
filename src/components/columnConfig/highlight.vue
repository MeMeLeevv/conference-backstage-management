<template>
  <div id="highlight">
    <!-- 大会亮点集合 -->
    <ConfigHeader title="亮点" :initDialog="initDialog"></ConfigHeader>
    <!-- <Table class="flexTable" :initTable="initTable" :tableData="tableData"></Table> -->
    <Table class="flexTable" :initTable="initTable" :tableData="tableData"></Table>

  </div>
</template>

<script>
import ConfigHeader from '../common/configHeader';
import Table from '../common/table';
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
      /* initTable: [
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
      ] */
      initTable: [
        {
          label: 'id',
          widthPercent: 0.05,
          type: 'text',
          key: 'text'
        },
        {
          label: '名称',
          widthPercent: 0.18,
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
          widthPercent: 0.18,
          type: 'text',
          key: 'desc'
        },
        {
          label: '显示状态', // 表头名
          widthPercent: 0.12, // 表头占父类长度百分比
          type: 'select', // 表头input类型
          key: 'state' // 他对应表格数据tableData对象里的key值
        },
        {
          label: '操作',
          type: 'operating',
          widthPercent: 0.10,
          key: 'operating'
        }
      ],
      tableData: [
        {
          id: 0,
          thumbnail: 'http://img.iimedia.cn/0000172149196a0ef95998ced58162a92fc188948e7ddd68e9abfc75e72425526e16b',
          name: '2342333333333333333333333333333333333333333333333333333333333333333333333333',
          desc: '23423777777777777777777777777777777777',
          edit: false, // 是否为可编辑状态
          state: true,
          widthPercent: 0.12, // 正常宽度
          hasChecked: false // 是否勾选
        },
        {
          id: 1,
          thumbnail: 'http://img.iimedia.cn/00001228e00fdffb513251e96027c50ff3fd18040576eed1660299eeb278938ef42d8',
          name: 'rew',
          desc: 'werw',
          edit: false,
          widthPercent: 0.12,
          state: true,
          hasChecked: false
        },
        {
          id: 2,
          thumbnail: '',
          name: 'werw',
          widthPercent: 0.12,
          desc: 'werwer',
          edit: false,
          state: true,
          hasChecked: false
        },
        {
          id: 3,
          thumbnail: '',
          name: 'werw',
          desc: 'werw',
          widthPercent: 0.12,
          edit: false,
          state: true,
          hasChecked: false
        },
        {
          id: 4,
          thumbnail: '',
          widthPercent: 0.12,
          name: 'wer',
          edit: false,
          desc: 'wer',
          state: true,
          hasChecked: false
        }
      ]
    };
  },
  components: {
    ConfigHeader,
    Table
  }
};
</script>

<style lang="sass" scoped>
#highlight
  .flexTable
    margin: 20px 0
</style>
