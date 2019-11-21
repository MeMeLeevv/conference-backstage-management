<template>
  <div id="backStage">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'backStage',
  data () {
    return {
      id: ''
    }
  },
  created () {
    this.id = this.$route.params.id
    console.log(this.id, 'id in backStage')
    this.$router.push(`/${this.id}/columnConfig/headImage`)
  }
}
</script>
<style lang="sass" scoped>

</style>
