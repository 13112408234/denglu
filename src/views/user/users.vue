<template>
  <div>
    <!-- 面包屑部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片部分 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入你要查询的用户" v-model="queryInfo.query" clearable @clear="getUserListpage"
            @input="getUserListpage">
            <el-button slot="append" icon="el-icon-search" @click="getUserListpage"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表部分 -->
      <el-table :data="userlist" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChaged(scope.row)">

            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <!-- 修改按钮 -->
            <el-tooltip content="修改" placement="top">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="dialogVisixiiu(scope.row)"></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip content="删除" placement="top">
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="open(scope.row.id)">
              </el-button>
            </el-tooltip>
            <!-- 分配角色按钮 -->
            <el-tooltip content="分配角色" placement="top">
              <el-button @click="setRole(scope.row)" size="mini" type="warning" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-row :gutter="400">
        <el-col :span="30" style="color: #fff;">
          3
        </el-col>
        <el-col :span="50">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 6, 7]" :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </el-col>
      </el-row>
      <!-- 点击添加用户时的弹框 -->
      <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="addDialogClosed">
        <!-- 主体区域 -->
        <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部按钮区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确定</el-button>
        </span>
      </el-dialog>
      <!-- 修改的弹框 -->
      <el-dialog title="修改用户信息" :visible.sync="dialogVisixiiugai" width="40%" @close="addDialogClosedxiu">
        <el-form ref="addFormRefxg" :model="usernameInfo" :rules="addFormRules" label-width="70px">
          <el-form-item label="用户名">
            <el-input v-model="usernameInfo.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="usernameInfo.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="usernameInfo.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisixiiugai = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配角色对话框 -->
      <el-dialog title="提示" :visible.sync="dialogVisiblefpei" width="50%">
        <div>
          <p>当前的用户：{{userInfo.username}}</p>
          <p>当前的角色：{{userInfo.role_name}}</p>
          <p>分配新角色：<el-select v-model="selectedRoleId" placeholder="请选择">
              <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id">
              </el-option>
            </el-select>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisiblefpei = false">取 消</el-button>
          <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
  import axios from 'axios'
  import {
    getUserList,
    stateanniu,
    addFormtijiao,
    addFormdelete,
    addFormput,
    addFormput_roles,
    addFormput_xiuroles
  } from "@/network/home";
  export default {
    data() {
      return {
        // 用户列表请求参数 pagenum=>多少页，pagesize =>每页多少个
        queryInfo: {
          query: '',
          //当前的页数
          pagenum: 1,
          //当前每页显示多少条数据
          pagesize: 5
        },
        //用户列表
        userlist: [],
        //总条数
        total: 0,
        //控制添加用户弹框显示和隐藏
        dialogVisible: false,

        //添加用户的表单数据
        addForm: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
        //添加表单验证规则对象
        addFormRules: {
          username: [
            { required: true, message: "请输入用户名", trigger: "blur" },
            { min: 3, max: 10, message: "用户名长度在 3 到 10个字符", trigger: "blur" },
          ],
          password: [
            { required: true, message: "请输入密码", trigger: "blur" },
            { min: 6, max: 15, message: "用户名长度在 6 到 15个字符", trigger: "blur" },
          ],
          email: [
            { required: true, message: "请输入邮箱", trigger: "blur" },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: "请输入手机号", trigger: "blur" },
            { min: 11, max: 11, message: "手机号的长度在11位", trigger: "blur" },
          ],
        },
        //控制修改弹框显示和隐藏
        dialogVisixiiugai: false,
        //修改用户的变量
        usernameInfo: {
          username: '',
          email: '',
          mobile: '',
          id: ''
        },
        //分配角色对话框
        dialogVisiblefpei: false,
        //分配角色用户变量
        userInfo: {},
        //所有角色的数据列表
        roleList: [],
        //已选中的角色id值
        selectedRoleId: ''
      }
    },
    created() {
      //用户列表请求
      this.getUserListpage()
      stateanniu().then(res => {
      })

    },
    methods: {
      //封装用户列表请求
      getUserListpage() {
        getUserList(this.queryInfo.query, this.queryInfo.pagenum, this.queryInfo.pagesize).then(res => {
          this.userlist = res.data.users
          this.total = res.data.total
          console.log(this.userlist, this.total)
        })
      },

      //监听用户选择每页多少条的数
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize,
          //发送用户列表请求
          this.getUserListpage()

      },
      //监听用户点击页码值的改变
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage,
          //发送用户列表请求
          this.getUserListpage()
      },
      //监听状态开关的改变并且把修改的状态保存到数据库
      userStateChaged(userinfo) {
        stateanniu(userinfo.id, userinfo.mg_state).then(res => {
          console.log(res)
        })
      },
      // 用户点击修改按钮
      dialogVisixiiu(row) {
        this.dialogVisixiiugai = true
        this.usernameInfo.username = row.username
        this.usernameInfo.email = row.email
        this.usernameInfo.mobile = row.mobile
        this.usernameInfo.id = row.id
      },
      //清除修改弹框退出时的预验证
      addDialogClosedxiu() {
        this.$refs.addFormRefxg.resetFields()
      },
      //监听用户点击修改弹窗验证表单数据
      editUserInfo() {
        this.$refs.addFormRefxg.validate(valid => {
          if (!valid) return
          //发起修改信息的用户请求
          addFormput(this.usernameInfo.id, this.usernameInfo.email, this.usernameInfo.mobile).then(res => {
            // 关闭修改弹窗
            this.dialogVisixiiugai = false
            this.$message.success("修改成功");
            console.log(res)
            //重新发起用户列表请求
            this.getUserListpage()
          })
        })
      },
      //监听用户添加对话框关闭时里面内容清空重置
      addDialogClosed() {
        this.$refs.addFormRef.resetFields()
      },
      //监听用户添加对话框确认添加时验证表单数据
      addUser() {
        this.$refs.addFormRef.validate(valid => {
          // 验证不通过
          if (!valid) return
          //验证通过向服务器发起添加用户请求
          addFormtijiao(this.addForm.username, this.addForm.password, this.addForm.email, this.addForm.mobile).then(res => {
            if (res.meta.status !== 201) {
              return this.$message.error("添加用户失败,用户名重复");
            }
            this.dialogVisible = false,
              this.$message.success("添加成功");
            console.log(res)
          })
        })
      },
      //删除用户
      open(id) {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          addFormdelete(id).then(res => {
            this.$message.success("删除成功");
            console.log(res)
            this.getUserListpage()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //展示分配角色的对话框
      setRole(userInfo) {
        //清空已选中的角色id值记录
        this.selectedRoleId = '',
          this.dialogVisiblefpei = true
        //在展示对话框之前获取角色列表
        this.userInfo = userInfo
        //角色分配网络请求
        addFormput_roles().then(res => {
          this.roleList = res.data
        })
      },
      //点击按钮分配角色
      saveRoleInfo() {
        if (!this.selectedRoleId) {
          return this.$message.error('请选则要分配的角色')
        }
        //关闭对话框
        this.dialogVisiblefpei = false
        addFormput_xiuroles(this.userInfo.id, this.selectedRoleId).then(res => {
          if (res.meta.status != 200) {
            return this.$message.error("修改失败");
          }
          this.$message.success("修改成功");
          //刷新用户列表
          this.getUserListpage()
        })
      }
    }
  };
</script>
<style scoped>
  .text {
    font-size: 14px;
  }

  .item {
    padding: 18px 0;
  }

  .box-card {
    margin-top: 20px;
    font-size: 12px;
    width: 100%;
  }

  .el-table {
    margin-bottom: 20px;
    margin-top: 20px;
    font-size: 12px;
  }
</style>