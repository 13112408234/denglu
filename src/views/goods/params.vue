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
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            v-model="Classification"
            :options="ProductData"
            :props="Productprops"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab页签区 activeName当前哪一个页面先显示，下面date定义， @tab-click点击那一页就触发该属性函数-->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="first">
          <el-button type="primary" size="mini" :disabled="disabled"
            >添加参数</el-button
          >
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="second">
          <el-button type="primary" size="mini" :disabled="disabled"
            >添加属性</el-button
          >
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { categoriesitem } from "@/network/categories.js";
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
        expandTrigger: "hover", //鼠标移动显示下一级
      },
      // 被激活页签的名称
      activeName: "first",
      //页签的按钮
      disabled: true,
    };
  },
  watch: {},
  computed: {},
  methods: {
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
      this.disabled = false;
    },
    //tab页签点击事件的处理函数
    handleTabClick() {
      console.log(this.activeName);
    },
  },
  created() {
    //发起级联选择框的数据请求
    this.ProductListshu();
  },
  mounted() {},
};
</script>
<style scoped>
.wrapper {
}
.cat_opt {
  margin: 15px 0;
}
.el-cascader {
  margin-left: 10px;
}
</style>