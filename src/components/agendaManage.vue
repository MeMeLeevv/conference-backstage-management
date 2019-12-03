<template>
  <div id="agendaManage">
    <ConfigHeader title="议程" @deleteAgenda="deleteAgenda" :needDialog="false" :needDeleteBtn="true">新增议程</ConfigHeader>
  </div>
</template>

<script>
import ConfigHeader from './common/configHeader'
export default {
  name: 'agendaManage',
  data () {
    return {
      id: ''
    };
  },
  created () {
  },
  computed: {
  },
  methods: {
    deleteAgenda () {
      console.log('deleteAgenda')
    }
  },
  components: {
    ConfigHeader
  }
};
</script>
<style lang="sass" scoped>

</style>
