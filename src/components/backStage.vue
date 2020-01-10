<template>
  <div id="backStage"><!-- 点击页面返回时会停留在http://localhost:8000/#/117，应该返回到首页 -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'backStage',
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
  }
};
</script>
<style lang="sass" scoped>

</style>
