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
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- //循环渲染Tag标签 -->
                <el-tag closable v-for="(item,i) in scope.row.attr_vals" :key="i" @close="handleClose(i,scope.row)">
                  {{item}}
                </el-tag>
                <!-- 输入文本框 inputVisible控制input显示和隐藏，v-model文本框输入的内容， @keyup.enter.native失去焦点会触发-->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                  ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!-- 添加按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>

            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="putclick(scope.row)">编辑</el-button>
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
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- //循环渲染Tag标签 -->
                <el-tag @close="handleClose(i,scope.row)" closable v-for=" (item,i) in scope.row.attr_vals" :key="i">
                  {{item}}
                </el-tag>
                <!-- 输入文本框 inputVisible控制input显示和隐藏，v-model文本框输入的内容， @keyup.enter.native失去焦点会触发-->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                  ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!-- 添加按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                </el-button>
              </template>
            </el-table-column>
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
      <el-form :model="putForm" :rules="rules" ref="putruleForm" label-width="100px">
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
        //控制按钮与文本框的输入形式
        inputVisible: false,
        //文本框输入的内容
        inputValue: '',
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
          //对拿到的tag等等数据做一个分割
          res.data.forEach(item => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
            item.inputVisible = false,
              item.inputValue = ''
          });
          console.log(res)
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
        });
      },
      //删除tag封装
      tagdelete(row) {
        EditingParameters(this.cateId, row.attr_id, row.attr_name, row.attr_sel, row.attr_vals.join(' '))
          .then((res) => {
            if (res.meta.status != 200) return
            this.$message.success("修改参数项成功");
          })
      },
      //级联选择框发生变化，会触发该函数
      handleChange() {
        if (this.Classification.length != 3) {
          this.Classification = [];
          this.manyTableDate = [];
          this.onlyTableDate = []
          this.$message.error("只能为三级分类设置相关参数")
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
      },
      //确定修改
      putParams() {

        this.$refs.putruleForm.validate(valid => {
          if (!valid) return
          EditingParameters(this.cateId, this.butAttr_id, this.putForm.attr_name, this.activeName)
            .then((res) => {
              if (res.meta.status != 200) return
              // 更新列表
              this.ParameterPackage()
              this.$message.success("添加成功");
              //关闭修改窗口
              this.putDialogVisible = false
            })
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
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //文本框失去焦点或摁下了Enter都会触发
      handleInputConfirm(row) {
        //用户输入多个空格，没有输入真实内容时，数组清空
        if (row.inputValue.trim().length === 0) {
          row.inputValue = '',
            row.inputVisible = false
          return
        }
        //如果没有return，证明需要做后期处理
        //用户输入的内容push到row.attr_vals数组里
        row.attr_vals.push(row.inputValue.trim()),
          //input重置为空
          row.inputValue = ''
        //隐藏输入框
        row.inputVisible = false
        // 发起添加请求
        this.tagdelete(row)
      },
      //点击按钮展示文本输入框
      showInput(row) {
        row.inputVisible = true
        //自动获取焦点
        //$nextTick当页面渲染完毕后才会执行里面代码
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      //删除对应的参数可选项tag
      handleClose(i, row) {
        row.attr_vals.splice(i, 1)
        // 发起添加请求
        this.tagdelete(row)
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

  .el-tag {
    margin: 10px
  }

  .input-new-tag {
    width: 100px;
  }
</style>