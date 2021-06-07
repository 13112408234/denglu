<template>
  <div>
    <!-- 面包屑部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片部分  -->
    <el-card class="box-card">
      <el-table :data="rightsList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level === '0'">一级权限</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1' ">二级权限</el-tag>
            <el-tag type="warning" v-else="scope.row.level === '2' ">三级权限</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
  import { rightsqxlb } from '@/network/rights'
  export default {
    data() {
      return {
        //权限列表
        rightsList: []
      }
    },
    created() {
      rightsqxlb('list').then(res => {
        this.rightsList = res.data
        console.log(this.rightsList)
      })
    },
    methods: {

    }
  };
</script>
<style scoped>
</style>