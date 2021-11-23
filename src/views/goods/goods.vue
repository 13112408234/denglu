<template>
  <div class="wrapper">
    <!-- 面包屑部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 行 搜索框-->
      <el-row :gutter="20">
        <!-- 列 -->
        <el-col :span="8">
          <!-- @clear清空input会触发该属性 clearable允许清空-->
          <el-input
            placeholder="请输入内容"
            v-model="querInfo.query"
            clearable
            @clear="ProductListBox"
            @input="inputHover"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="ProductListBox"
            >
            </el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goodAddpage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格 border边框线,stripe鼠标滑动变色-->
      <el-table
        :data="tableData"
        style="width: 100%"
        border
        stripe
        class="tablecolumn"
      >
        <!-- 第一列 -->
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格" width="95px">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="80px">
        </el-table-column>
        <el-table-column
          prop="add_time"
          label="创建时间"
          width="140px"
          class="tablecolumn"
        >
          <template slot-scope="scope1">
            {{ scope1.row.add_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column prop="date" label="操作" width="200px">
          <template slot-scope="scope">
            <!-- <el-button type="primary" icon="el-icon-edit" size="mini">编辑
                        </el-button> -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="opendelete(scope.row)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区   @size-change输入跳转到几页,@current-change点击页码跳转,
            :current-page当前渲染的页码，:page-sizes选择每页显示多少条数据
            :page-size当前每页显示多少条数据,
            :current-page当前页码值
            -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[8, 15, 20]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { ProductList, DeleteItemAxios } from "@/network/goods.js";
export default {
  components: {},
  props: {},
  data() {
    return {
      //请求传入的参数
      querInfo: {
        query: "",
        pagenum: 1, //页码值
        pagesize: 8, //每页条数
      },
      //保存请求列表数据
      tableData: [],
      //总数据条数
      total: 0,
      AntiShake: "11",
    };
  },
  watch: {},
  computed: {},
  methods: {
    // 封装商品列表请求
    ProductListBox() {
      ProductList(
        this.querInfo.query,
        this.querInfo.pagenum,
        this.querInfo.pagesize
      ).then((res) => {
        if (res.meta.status != 200) return;
        //保存数据
        this.tableData = res.data.goods;
        //保存总条数
        this.total = res.data.total;
        console.log(this.tableData);
        console.log(res);
      });
    },
    // 分页
    // 监听pagesize改变,用户选择页码的条数跳转
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize;
      //刷新商品列表请求
      this.ProductListBox();
    },
    //监听pagenum改变
    handleCurrentChange(newpage) {
      this.querInfo.pagenum = newpage;
      //刷新商品列表请求
      this.ProductListBox();
    },
    //给input添加防抖操作
    inputHover() {
      clearTimeout(this.AntiShake);
      this.AntiShake = setTimeout(() => {
        //刷新商品列表请求
        this.ProductListBox();
      }, 1000);
    },
    //删除商品
    opendelete(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          DeleteItemAxios(row.goods_id).then((res) => {
            if (res.meta.status != 200) return;
            //刷新商品列表请求
            this.ProductListBox();
            this.$message.success("请求成功");
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 添加商品
    goodAddpage() {
      this.$router.push("/Add");
    },
  },
  created() {
    //商品列表请求
    this.ProductListBox();
  },
  mounted() {},
};
</script>
<style scoped>
.wrapper {
}

.el-table {
  margin-top: 15px;
}

.tablecolumn {
  font-size: 12px;
}
</style>