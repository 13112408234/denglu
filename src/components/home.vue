<template>
  <div>
    <div>首页</div>
    <el-button @click="logout">退出</el-button>
  </div>
</template>
<script>
export default {
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
  },
};
</script>
<style scoped>
</style>
