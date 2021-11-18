<template>
  <div>
    <!-- 面包屑部分 -->
    <bread>
      <span slot="left">首页</span>
      <span slot="center">商品管理</span>
      <span slot="right">商品分类</span>
    </bread>
    <!-- 卡片部分 -->
    <el-card class="box-card">
      <!-- 添加分类按钮 -->
      <el-button type="primary">添加分类</el-button>
      <!-- 表格 -->
      <el-table :data="tableData">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="cat_name" label="分类名称"> </el-table-column>
        <el-table-column prop="cat_deleted" label="是否有效"> </el-table-column>
        <el-table-column prop="address" label="排序"> </el-table-column>
        <el-table-column prop="address" label="操作"> </el-table-column>
      </el-table>
      <!-- 分页区 -->
    </el-card>
  </div>
</template>
<script>
  import bread from "@/components/conste/user/bread"; //面包屑
  import { categoriesitem } from "@/network/categories";
  export default {
    components: {
      bread,
    },
    data() {
      return {
        //请求传入的参数
        querInfo: {
          type: 3,
          pagenum: 1,
          pagesize: 5,
        },
        //保存请求列表数据
        tableData: [],
      };
    },
    created() {
      //商品分类列表请求
      categoriesitem().then((res) => {
        this.tableData = res.data;

      });
    },
  };
</script>
<style scoped>
</style>