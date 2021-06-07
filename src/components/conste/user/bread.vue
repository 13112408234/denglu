<template>
  <div>
    <!-- 面包屑部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">
        <slot name="right"></slot>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <slot name="center"></slot>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <slot name="right"></slot>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<script>
export default {};
</script>
<style scoped>
</style>
