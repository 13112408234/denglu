<template>
  <div>
    <!-- 面包屑部分 -->
    <bread>
      <span slot="left">首页</span>
      <span slot="center">商品管理</span>
      <span slot="right">商品列表</span>
    </bread>
  </div>
</template>
<script>
import bread from "@/components/conste/user/bread";
export default {
  components: {
    bread,
  },
};
</script>
<style scoped>
</style>
