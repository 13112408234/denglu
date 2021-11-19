<template>
  <div class="wrapper">
    <!-- 面包屑部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" show-icon :closable="false">
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader v-model="Classification" :options="ProductData" :props="Productprops" @change="handleChange">
          </el-cascader>
        </el-col>
      </el-row>
      <!-- tab页签区 activeName当前哪一个页面先显示，下面date定义， @tab-click点击那一页就触发该属性函数-->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="disabled" @click="adddDialogVisible=true">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableDate" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand"></el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>

            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="putclick(scope.row)">动态编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="open(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="disabled" @click="adddDialogVisible=true">添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableDate" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand"></el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="putclick(scope.row)">编辑
                </el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="open(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数的对话框 -->
    <el-dialog :title="'添加' +titleText" :visible.sync="adddDialogVisible" width="50%" @close="addDialogClosedm">
      <el-form :model="addForm" :rules="rules" ref="addruleForm" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数的对话框 -->
    <el-dialog title="修改参数" :visible.sync="putDialogVisible" width="50%">
      <el-form :model="putForm" :rules="rules" ref="addruleForm" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="putForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="putDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="putParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { categoriesitem } from "@/network/categories.js";
  import { parameterList, AddAttribute, EditingParameters, DeleteParameters } from "@/network/params.js";
  export default {
    components: {},
    props: {},
    data() {
      return {
        //商品分类级联选择存放用户选择的内容
        Classification: [],
        //给用户选择的数据
        ProductData: [],
        //指定级联选择器的配置对象
        Productprops: {
          value: "cat_id", //具体选择哪一个值的属性
          label: "cat_name", //你所看到的是哪一个属性
          children: "children", //父子嵌套用的是哪一个属性
        },
        // 被激活页签的名称
        activeName: "many",
        //页签的按钮
        disabled: true,
        cateId: "",
        //动态参数数据
        manyTableDate: [],
        //静态属性的数据
        onlyTableDate: [],
        //添加参数对话框显示隐藏
        adddDialogVisible: false,
        //添加参数的表单数据对象
        addForm: {
          attr_name: ''
        },
        //添加表单验证规则
        rules: {
          attr_name: [{ required: true, message: '名称不能为空' },]
        },
        // 修改参数的对话框
        putDialogVisible: false,
        //修改保存的数据
        putForm: {
          attr_name: ''
        },
        butAttr_id: '',
      };
    },
    watch: {},
    computed: {
      titleText() {
        if (this.activeName === "many") {
          return "动态参数"
        }
        return "静态属性"
      }

    },
    methods: {
      //参数列表请求封装
      ParameterPackage() {
        parameterList(this.cateId, this.activeName).then((res) => {
          if (res.meta.status != 200) return;
          console.log(res);
          if (this.activeName === "many") {
            this.manyTableDate = res.data;
          } else {
            this.onlyTableDate = res.data;
          }
        });
      },

      //级联选择器列表请求封装
      ProductListshu() {
        categoriesitem().then((res) => {
          this.ProductData = res.data;
          console.log(res);
        });
      },
      //级联选择框发生变化，会触发该函数
      handleChange() {
        if (this.Classification.length != 3) {
          this.Classification = [];
          return;
        }
        //级联被选中，下面按钮启用
        this.disabled = false;
        //拿到选中的分类id
        this.cateId = this.Classification[2];
        console.log(this.cateId);
        //发起参数列表请求
        this.ParameterPackage();
      },
      //tab页签点击事件的处理函数
      handleTabClick() {
        //发起参数列表请求
        this.ParameterPackage()
        //在没有选中级联选择框内容的时候，提示用户
        if (this.Classification.length < 3) {
          this.$message.error("请选择商品分类")
        }
        console.log(this.Classification);
      },
      //监听对话框的关闭事件
      addDialogClosedm() {
        this.$refs.addruleForm.resetFields()
      },
      //点击按钮添加参数
      addParams() {
        this.$refs.addruleForm.validate(valid => {
          if (!valid) return
          AddAttribute(this.cateId, this.addForm.attr_name, this.activeName)
            .then((res) => {
              console.log(res)
              this.adddDialogVisible = false,
                this.$message.success("添加成功");
              this.ParameterPackage()
            })
        })
      },
      // 点击修改
      putclick(row) {
        this.putDialogVisible = true,
          this.putForm.attr_name = row.attr_name,
          this.butAttr_id = row.attr_id
        console.log(row)
      },
      //确定修改
      putParams() {
        EditingParameters(this.cateId, this.butAttr_id, this.putForm.attr_name, this.activeName)
          .then((res) => {
            if (res.meta.status != 200) return
            console.log(res, this.activeName)
            // 更新列表
            this.ParameterPackage()
            this.$message.success("添加成功");
            //关闭修改窗口
            this.putDialogVisible = false
          })
      },
      //删除静态属性或者动态参数
      open(row) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          DeleteParameters(this.cateId, row.attr_id).then((res) => {
            if (res.meta.status != 200) return
            // 更新列表
            this.ParameterPackage()
            this.$message.success("添加成功");
            console.log(res)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    },
    created() {
      //发起级联选择框的数据请求
      this.ProductListshu();
    },
    mounted() { },
  };
</script>
<style scoped>
  .wrapper {}

  .cat_opt {
    margin: 15px 0;
  }

  .el-cascader {
    margin-left: 10px;
  }
</style>