<template>
    <div id="headImage">
      <!-- 大会头图集合 -->
      <ConfigHeader></ConfigHeader>
      <Table class="flexTable"></Table>
    </div>
</template>

<script>
import ConfigHeader from './configHeader'
import Table from './table'
export default {
  name: 'headImage',
  components: {
    ConfigHeader,
    Table
  }
}
</script>

<style lang="sass" scoped>
#headImage
  .flexTable
    margin: 20px 0
</style>
