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
          <el-button type="primary" size="mini" :disabled="disabled">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableDate" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand"></el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>

            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="disabled">添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableDate" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand"></el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数的对话框 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { categoriesitem } from "@/network/categories.js";
  import { parameterList } from "@/network/params.js";
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
      };
    },
    watch: {},
    computed: {},
    methods: {
      //参数列表请求封装
      ParameterPackage() {
        parameterList(this.cateId, this.activeName).then((res) => {
          if (res.meta.status != 200) return this.$message.error("列表获取失败");
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
        this.ParameterPackage();
        console.log(this.activeName);
      },
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