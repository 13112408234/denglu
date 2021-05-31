<template>
  <div>
    <button @click="pushlogin">登录</button>
  </div>
</template>
<script>
export default {
  methods: {
    pushlogin() {
      this.$router.push("/login");
    },
  },
};
</script>
<style scoped>
</style>
