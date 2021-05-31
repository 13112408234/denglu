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
      <el-aside :width="iscollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          class="el-menu"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409Eff"
          :unique-opened="true"
          :collapse="iscollapse"
          :router="true"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menulist">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="item1.path" v-for="item1 in item.children">
              <!-- 二级菜单模板区域 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ item1.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主题 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import { getMenuList } from "@/network/home";
export default {
  data() {
    return {
      //左边菜单数据
      menulist: [],
      iscollapse: false,
    };
  },
  methods: {
    //退出
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    //点击按钮，切换菜单的折叠与展开
    toggleCollapse() {
      this.iscollapse = !this.iscollapse;
    },
  },
  created() {
    //左测菜单请求
    getMenuList().then((res) => {
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menulist = res.data;
      console.log(this.menulist);
    });
  },
};
</script>
<style scoped>
.home-container {
  height: 100%;
}
.el-header {
  color: #fff;
  font-size: 2rem;
  background-color: #373d41;
  /* 左右对齐 */
  display: flex;
  justify-content: space-between;
  /* 退出按钮垂直居中 */
  align-items: center;
}
.el-aside {
  background-color: #333744;
  transition: all 0.9s;
}
.el-menu {
  border-right: none;
}
.el-main {
  background-color: #eaedf1;
}
.toggle-button {
  background-color: #4a5064;
  text-align: center;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  /* 文本里面文字之间的左右距离 */
  letter-spacing: 0.2em;
}
</style>
