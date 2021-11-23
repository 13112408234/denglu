<template>
  <div class="adv">
    <div class="dv">欢迎使用shop后台管理系统</div>
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
.adv {
  position: relative;
  height: 100%;
}
.dv {
  height: 50px;
  position: absolute;
  left: 45%;
  top: 45%;
}
</style>
