<template>
    <div class="wrapper">
        <!-- 面包屑部分 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card>
            <!-- 行 搜索框-->
            <el-row :gutter="20">
                <!-- 列 -->
                <!-- <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="querInfo.query" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search" @click="postdata"></el-button>
                    </el-input>
                </el-col> -->
                <!-- <el-col :span="4">
                    <el-button type="primary">添加商品</el-button>
                </el-col> -->
            </el-row>
            <!-- 表格 border边框线,stripe鼠标滑动变色-->
            <el-table :data="tableData" style="width: 100%" border stripe>
                <!-- 第一列 -->
                <el-table-column type="index" label="#">
                </el-table-column>
                <!-- 第二列 -->
                <el-table-column prop="order_number" label="订单编号">
                </el-table-column>
                <el-table-column prop="order_price" label="订单价格">
                </el-table-column>
                <el-table-column prop="pay_status" label="是否付款">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.pay_status ==='1'">已付款</el-tag>
                        <el-tag type="danger" v-else>未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="is_send" label="是否发货">
                </el-table-column>
                <el-table-column prop="update_time" label="下单时间">
                    <template slot-scope="scope">
                        {{scope.row.update_time | dataFormat}}
                    </template>
                </el-table-column>
                <!-- 第三列 -->
                <el-table-column prop="date" label="操作" width="200px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="bjVisible = true">编辑
                        </el-button>
                        <el-button type="success" icon="el-icon-location" size="mini" @click="open(scope.row)">地址
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区   @size-change输入跳转到几页,@current-change点击页码跳转,
            :current-page当前渲染的页码，:page-sizes选择每页显示多少条数据
            :page-size当前每页显示多少条数据,
            :current-page当前页码值
            -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="querInfo.pagenum" :page-sizes="[5, 7, 10]" :page-size="querInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
            <!-- 编辑对话框 -->
            <el-dialog title="修改地址" :visible.sync="bjVisible" width="50%" @close="addressClose">
                <!-- 表单 -->
                <el-form :model="addruleForm" :rules="rules" ref="ruleFormref2" label-width="100px">
                    <el-form-item label="省市区/县" prop="address1">
                        <el-cascader v-model="addruleForm.address1" :options="cityData"
                            :props="{ expandTrigger: 'hover' }"></el-cascader>
                    </el-form-item>
                    <el-form-item label="详细地址" prop="address2">
                        <el-input v-model="addruleForm.address2"></el-input>
                    </el-form-item>
                </el-form>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="bjVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addclick2">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 地址对话框 -->
            <el-dialog title="物流信息" :visible.sync="dialogVisible1" width="30%">
                <!-- 时间线 -->
                <el-timeline>
                    <el-timeline-item v-for="(activity, index) in activities" :key="index" :timestamp="activity.time">
                        {{activity.context}}
                    </el-timeline-item>
                </el-timeline>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
    import { OrderListAxios, LogisticsAddressAxios } from '@/network/order.js'
    import cityData from './citydata.js'
    export default {
        components: {},
        props: {},
        data() {
            return {
                //请求传入的参数
                querInfo: {
                    query: '',
                    pagenum: 1, //页码值
                    pagesize: 5, //每页条数
                },
                //保存请求列表数据
                tableData: [],
                //总数据条数
                total: 0,
                //编辑对话框
                bjVisible: false,
                // 编辑对话框的数据
                addruleForm: {
                    address1: [],//级联选择框
                    address2: ''
                },
                //验证规则
                rules: {
                    address1: [
                        { required: true, message: "省市区/县", trigger: "blur" },
                    ],
                    address2: [
                        { required: true, message: "请输入详细地址", trigger: "blur" },
                    ]
                },
                cityData,//编辑省市区地址信息
                dialogVisible1: false,//地址对话框
                // 时间线
                activities: [
                    {
                        "time": "2021-05-10 09:39:00",
                        "ftime": "2021-05-10 09:39:00",
                        "context": "已签收,感谢使用顺丰,期待再次为您服务",
                        "location": ""
                    },
                    {
                        "time": "2021-05-10 08:23:00",
                        "ftime": "2021-05-10 08:23:00",
                        "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
                        "location": ""
                    },
                    {
                        "time": "2021-05-10 07:32:00",
                        "ftime": "2021-05-10 07:32:00",
                        "context": "快件到达 [北京海淀育新小区营业点]",
                        "location": ""
                    },
                    {
                        "time": "2021-05-10 02:03:00",
                        "ftime": "2021-05-10 02:03:00",
                        "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
                        "location": ""
                    },
                    {
                        "time": "2021-05-09 23:05:00",
                        "ftime": "2021-05-09 23:05:00",
                        "context": "快件到达 [北京顺义集散中心]",
                        "location": ""
                    },
                    {
                        "time": "2021-05-09 21:21:00",
                        "ftime": "2021-05-09 21:21:00",
                        "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
                        "location": ""
                    },
                    {
                        "time": "2021-05-09 13:07:00",
                        "ftime": "2021-05-09 13:07:00",
                        "context": "顺丰速运 已收取快件",
                        "location": ""
                    },
                    {
                        "time": "2021-05-09 12:25:03",
                        "ftime": "2021-05-09 12:25:03",
                        "context": "卖家发货",
                        "location": ""
                    },
                    {
                        "time": "2021-05-09 12:22:24",
                        "ftime": "2021-05-09 12:22:24",
                        "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
                        "location": ""
                    },
                    {
                        "time": "2021-05-08 21:36:04",
                        "ftime": "2021-05-08 21:36:04",
                        "context": "商品已经下单",
                        "location": ""
                    }
                ],
            };
        },
        watch: {},
        computed: {},
        methods: {
            //封装
            OrderListBox() {
                OrderListAxios(this.querInfo.query, this.querInfo.pagenum, this.querInfo.pagesize).then((res) => {
                    this.tableData = res.data.goods
                    this.total = res.data.total
                    console.log(res);


                })
            },
            // 分页
            // 监听pagesize改变,用户选择页码的条数跳转
            handleSizeChange(newSize) {
                this.querInfo.pagesize = newSize
                //刷新商品分类列表请求
                this.OrderListBox()
            },
            //监听pagenum改变
            handleCurrentChange(newpage) {
                this.querInfo.pagenum = newpage
                //刷新商品分类列表请求
                this.OrderListBox()
            },
            addclick2() {
                this.$refs.ruleFormref2.validate(valid => {
                    //没有填写，返回提示信息
                    if (!valid) {
                        return this.message.error('请填写必要的表单项')
                    }
                    this.$message.success('修改成功');
                    this.bjVisible = false
                })

            },
            // 关闭编辑框清空缓存数据
            addressClose() {
                this.$refs.ruleFormref2.resetFields()
            },
            //点击地址按钮
            open(row) {
                this.dialogVisible1 = true

            },

            //搜索
            postdata() {
                console.log(this.querInfo.query);

                //刷新商品分类列表请求
                this.OrderListBox()
            }
        },
        created() {
            //订单列表
            this.OrderListBox()
        },
        mounted() { }
    };
</script>
<style scoped>
    .wrapper {}

    .el-cascader {
        width: 100%;
    }
</style>