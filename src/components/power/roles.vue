<template>
  <div>
    <!-- 面包屑部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片部分 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolelist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              :class="['dbbottom', 'vcenter', i1 === 0 ? 'dbtop' : '']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightsByid(scope.row, item1.id)">
                  {{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二和三级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :class="['vcenter', i2 != 0 ? 'dbtop' : '']"
                >
                  <!-- 二级渲染 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightsByid(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级渲染 -->
                  <el-col :span="18">
                    <el-tag
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightsByid(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column prop="roleName" label="操作">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete">删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              @click="showSetRight(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="dialogVisible" width="40%">
      <!-- 树形控件 -->
      <el-tree
        :data="rightslist"
        :props="treeprops"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defkeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  rolesitemget,
  rolesremove,
  rolesitemquan,
  rolesitemxiuquan,
} from "@/network/roles.js";
export default {
  data() {
    return {
      //网络请求分配权限页面的数据
      rolelist: [],
      //控制分配权限对话框显示和隐藏
      dialogVisible: false,
      //点击权限分配的所有数据
      rightslist: [],
      //树形控件的属性绑定对象
      treeprops: {
        label: "authName",
        children: "children",
      },
      //树形控件默认选中的id节点数组
      defkeys: [],
      //当前即将分配权限的角色id
      roleId: "",
    };
  },
  created() {
    //获取权限列表
    this.rolesquanx();
  },
  //根据id删除对应的权限
  methods: {
    // 获取权限列表封装
    rolesquanx() {
      rolesitemget().then((res) => {
        if (res.meta.status != 200) return $message.error("获取角色列表失败");
        this.rolelist = res.data;
      });
    },
    //点击列表'>'删除里面分配权限
    removeRightsByid(role, right) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          rolesremove(role.id, right).then((res) => {
            if (res.meta.status !== 200) {
              return this.$messages.error("删除权限失败");
            }
            role.children = res.data;
            this.$message.success("删除成功");
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    //展示分配权限的对话框
    showSetRight(role) {
      this.roleId = role.id;
      this.dialogVisible = true;
      rolesitemquan("tree").then((res) => {
        if (res.meta.status != 200) {
          return this.$messages.error("获取数据失败");
        }
        this.defkeys = []; //清除列表的id，保存新id
        this.getleafkeys(role, this.defkeys);
        this.rightslist = res.data;
      });
    },
    //通过递归的形式获取角色下所有三级权限的id,实现勾选状态保存到defkeys数组中
    getleafkeys(node, arr) {
      //如果当前node节点不包含children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => {
        this.getleafkeys(item, arr);
      });
    },
    //点击为角色分配权限
    allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      console.log(keys);
      const idStr = keys.join(",");
      console.log(idStr);
      rolesitemxiuquan(this.roleId, idStr).then((res) => {
        //更改权限成功，关闭分配权限对话框
        this.dialogVisible = false;
        this.$message.success("修改权限成功");
        //重新获取权限列表
        this.rolesquanx();
      });
    },
  },
};
</script>
<style scoped>
.el-tag {
  margin: 7px 7px;
}
.dbtop {
  border-top: 1px solid #eee;
}
.dbbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
