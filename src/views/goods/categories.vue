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
      <el-row>
        <el-button type="primary" @click="addclick">添加分类</el-button>
      </el-row>
      <!-- 表格    data数据, selection-type隐藏复选框, expand-type隐藏展开行效果
        show-index渲染索引id, border显示纵向边框线
      -->
      <tree-table class="treetable" index-text="#" show-index :selection-type="false" :data="catelist"
        :columns="columns" :expand-type="false" border>
        <!-- 第二列：是否有效 slot-scope接收到当前列的数据-->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:lightgreen"></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <!-- 第三列：排序 slot-scope接收到当前列的数据-->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level==0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level==1" type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>
        <!-- 第四列 -->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click=EditClassification(scope.row)>编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="cateDelet(scope.row)">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区   @size-change输入跳转到几页,@current-change点击页码跳转, :current-page当前渲染的页码，:page-sizes选择每页显示多少条数据
      :page-size当前每页显示多少条数据
      -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum" :page-sizes="[3, 5, 10]" :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="提示" :visible.sync="dialogFormVisible" width="50%" @close="addDialogClosed">

      <el-form :model="addcatInfo" ref="numberValidateForm" label-width="100px" class="demo-ruleForm" :rules="rules">
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addcatInfo.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <!-- :options用来指定数据源,props用户选中的数据，v-model选中的值双向绑定到data中一定是数组， @change选择器中发生变化就会触发 
        clearable可以在旁边清空
        -->
        <el-form-item label="父级分类:">
          <el-cascader change-on-select clearable v-model="selectedKeys" :options="parentCateList"
            @change="parentCateChanged" :props="cascaderProps">
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="SuccessfulClassification">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑显示 -->
    <el-dialog title="编辑分类" :visible.sync="EditDisplay" width="30%">
      <el-form ref=EditRefs :model=EditInfo label-width="100px" :rules="rules">
        <el-form-item label="分类名称:" prop="name">
          <el-input v-model="EditInfo.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditDisplay = false">取 消</el-button>
        <el-button type="primary" @click="ClassificationEditing">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import bread from "@/components/conste/user/bread"; //面包屑
  import {
    categoriesitem,
    addCategory,
    DeleteClassificatio,
    EditClassificationRequest
  } from "@/network/categories";
  export default {
    components: {
      bread,
    },
    data() {
      return {
        //请求传入的参数
        querInfo: {
          type: 3,  //3代表3级都获取
          pagenum: 1, //页码值
          pagesize: 5, //每页条数
        },
        //保存请求列表数据
        catelist: [],
        //总数据条数
        total: 0,
        //为table指定列的定义
        columns: [
          { label: '分类名称', prop: 'cat_name', },
          {
            label: '是否有效',
            type: 'template',
            //当前列的使用模板名称
            template: 'isok'
          },//表示将当前列定义为模板列
          {
            label: '排序',
            type: 'template',
            //当前列的使用模板名称
            template: 'order'
          },//表示将当前列定义为模板列
          {
            label: '操作',
            type: 'template',
            //当前列的使用模板名称
            template: 'opt'
          },//表示将当前列定义为模板列
        ],
        //显示添加分类
        dialogFormVisible: false,
        addcatInfo: {
          cat_name: '',
          //父级分类的id
          cat_pid: 0,
          //分类等级，默认添加1级分类
          cat_level: 0
        },
        rules: {
          cat_name: [
            { required: true, message: '名称不能为空' },
          ],
        },
        //父级分类的列表
        parentCateList: [],
        //指定级联选择器的配置对象
        cascaderProps: {
          value: 'cat_id',//具体选择哪一个值的属性
          label: 'cat_name',//你所看到的是哪一个属性
          children: 'children',//父子嵌套用的是哪一个属性
          expandTrigger: 'hover' //鼠标移动显示下一级
        },
        //选中的父级分类的id数组
        selectedKeys: [],
        //编辑分类
        EditDisplay: false,
        EditInfo: {
          name: '',
          id: 0,
        },
        rules: {
          name: [
            { required: true, message: "请输入分类名", trigger: "blur" },
          ],
        },
      };
    },
    created() {
      //商品分类列表请求
      this.getCateList()
      this.addcal()
    },
    methods: {
      //封装获取商品列表
      getCateList() {
        categoriesitem(this.querInfo.type, this.querInfo.pagenum, this.querInfo.pagesize)
          .then((res) => {
            this.catelist = res.data.result
            // 为总数据条数赋值
            this.total = res.data.total
          })
      },
      // 监听pagesize改变
      handleSizeChange(newSize) {
        this.querInfo.pagesize = newSize
        //刷新商品分类列表请求
        this.getCateList()
      },
      // 监听pagenum改变
      handleCurrentChange(newpage) {
        this.querInfo.pagenum = newpage
        //刷新商品分类列表请求
        this.getCateList()
      },
      //点击添加发起父级列表请求
      addcal() {
        categoriesitem(2,)
          .then((res) => {
            console.log(res.data)
            this.parentCateList = res.data
            console.log(this.parentCateList)

          })
      },

      //点击添加分类
      addclick() {
        this.dialogFormVisible = true
      },
      //监听用户添加对话框关闭时里面内容清空重置
      addDialogClosed() {
        this.$refs.numberValidateForm.resetFields()
        //el-cascader级联选择器清空
        this.selectedKeys = []
        this.addcatInfo.cat_pid = 0
        this.addcatInfo.cat_level = 0

      },
      //确定添加分类
      SuccessfulClassification() {

        this.$refs.numberValidateForm.validate(valid => {

          if (!valid) return this.$message.error("添加失败")  //假如不通过，就返回去
          //发起添加请求
          addCategory(this.addcatInfo.cat_pid, this.addcatInfo.cat_name, this.addcatInfo.cat_level)
            .then((res) => {
              if (res.meta.status !== 201) {
                return this.$message.error("添加失败");
              }
              //商品分类列表请求
              this.getCateList()
              this.dialogFormVisible = false
              this.$message.success("添加成功");
            })
        })
      },
      //选择项发生变化就会触发这个函数
      parentCateChanged() {
        console.log(this.selectedKeys)
        //如果selectedKeys数组中length大于0,证明选中了父级分类
        //反之，就说明没有选中任何父级分类
        if (this.selectedKeys.length > 0) {
          this.addcatInfo.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
          //为当前分类等级赋值
          this.addcatInfo.cat_level = this.selectedKeys.length
        } else {
          // 为分类id赋值
          this.addcatInfo.cat_pid = 0
          //为当前分类的等级赋值
          this.addcatInfo.cat_level = 0
        }
      },

      //删除分类
      cateDelet(row) {
        this.$confirm('此操作将永久删除->' + row.cat_name + ', 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          DeleteClassificatio(row.cat_id).then((res) => {
            if (res.meta.status != 200) return this.$message.error("删除失败 ");
            //商品分类列表请求
            this.getCateList()
            this.$message.success("删除成功");
            console.log(res)
          })

        }).catch(() => {
          this.$message.error("删除已取消 ");
        });
      },

      //编辑
      EditClassification(row) {
        this.EditDisplay = true
        this.EditInfo.name = row.cat_name
        this.EditInfo.id = row.cat_id
      },
      //点击确定编辑完成
      ClassificationEditing() {
        this.$refs.EditRefs.validate(valid => {
          if (!valid) return this.$message.error("输入分类名称");  //假如不通过，就返回去
          EditClassificationRequest(this.EditInfo.id, this.EditInfo.name).then((res) => {
            if (res.meta.status != 200) rteurn
            //商品分类列表请求
            this.getCateList()
            this.$message.success("名称修改成功");
            this.EditDisplay = false
            console.log(res)

          })

        })

      },
    }
  };
</script>
<style scoped>
  .treetable {
    margin-top: 20px;
  }

  .el-cascader {
    width: 100%
  }
</style>