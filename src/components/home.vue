<template>
  <el-container class="home-container">
    <!-- 头部区 -->
    <el-header>
      <div>
        <img src="" alt="" />
        <span>后台管理系统</span>
      </div>
      <el-button @click="logout" class="el-button-logout">退出</el-button>
    </el-header>
    <!-- 页面主体区 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <!-- 一级菜单 -->
          <el-submenu index="1">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-location"></i>
              <!-- 文本 -->
              <span>导航一</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item index="1-4-1">
              <!-- 二级菜单模板区域 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-location"></i>
                <!-- 文本 -->
                <span>导航一</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主题 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
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
.home-container {
  height: 100%;
}
.el-header {
  color: #fff;
  font-size: 30px;
  background-color: #373d41;
  /* 左右对齐 */
  display: flex;
  justify-content: space-between;
  /* 退出按钮垂直居中 */
  align-items: center;
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
</style>
