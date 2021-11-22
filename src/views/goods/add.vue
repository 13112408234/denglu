<template>
    <div class="wrapper">
        <!-- 面包屑部分 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card>
            <!-- 提示区域 -->
            <el-alert title="添加商品信息" type="info" center show-icon>
            </el-alert>
            <!-- 步骤条 active控制进度的，减0是可以转换为数字的，因为标签页的原因所以一定要是数字-->
            <el-steps :space="200" :active="activeindex-0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品列表"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>

            <!-- form表单一定要在标签页的外面 -->
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" label-position="top">
                <!-- 标签页 :tab-position显示的位置，:before-leave获取即将进入和离开标签页名字，判断标签页切换 @tab-click用户点击了哪一个标签页-->
                <el-tabs :tab-position="'left'" v-model="activeindex" :before-leave="beforeTabLeave"
                    @tab-click="tabClicked">
                    <!-- 第一页 -->
                    <el-tab-pane label="基本信息">
                        <!-- 第一行 -->
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="ruleForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="ruleForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="ruleForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="ruleForm.goods_weight"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <!-- :options指定数据源（要展示的数据），:props是配置项,@change选中时触发，v-model选中了第几级数据，用length判定-->
                            <el-cascader v-model="ruleForm.goods_cat" :options="cateList" :props="cateProps"
                                @change="handleChange">
                            </el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <!-- 第二面 -->
                    <el-tab-pane label="商品参数">
                        <!-- 渲染表单的item项 -->
                        <el-form-item :label="item.attr_name" v-for="item in manyTabdata" :key="item.attr_id">
                            <!-- 复选框 -->
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox border :label="cb" v-for="(cb,i) in item.attr_vals" :key="i"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性">
                        <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片">
                        <!-- action图片是上传的url地址,on-preview预览图片事件,on-remove点击x号删除图片触发该事件，list-type根据不同的值渲染出不同ui效果,:headers因为请求是组件自己的ajax，所以还要为他添加token
                        :on-success上传图片成功时的处理
                        -->
                        <el-upload :action="uploabURL" :on-preview="handlePreview" :on-remove="handleRemove"
                            list-type="picture" :headers="headerObj" :on-success="handleSuccess">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容">
                        <!-- 富文本编辑器 -->
                        <quill-editor v-model="ruleForm.goods_introduce"></quill-editor>
                        <!-- 添加商品 -->
                        <el-button type="primary" class="quillButton" @click="add">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
            <!-- 图片预览窗口 -->
            <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
                <img :src="previewPath" alt="" class="previewImg">
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
    import { CommodityClassificationAxios, parameterListAxios, AddItemshopAxios } from '@/network/add.js'
    export default {
        components: {},
        props: {},
        data() {
            return {
                //点击标签页可以跟步骤条进度绑定在一起
                activeindex: '0',
                // 保存form的数据
                ruleForm: {
                    goods_name: '',//商品名称
                    goods_price: 0,//商品价格
                    goods_number: 0,//商品数量
                    goods_weight: '',//商品重量
                    // 商品所属的分类数组
                    goods_cat: [],
                    //商品的介绍
                    goods_introduce: '',
                    attrs: [],
                },
                //验证规则
                rules: {
                    goods_name: [
                        { required: true, message: "请输入商品名称", trigger: "blur" },
                    ],
                    goods_price: [
                        { required: true, message: "请输入商品价格", trigger: "blur" },
                    ],
                    goods_number: [
                        { required: true, message: "请输入商品数量", trigger: "blur" },
                    ],
                    goods_weight: [
                        { required: true, message: "请输入商品重量", trigger: "blur" },
                    ],
                    goods_cat: [
                        { required: true, message: "请选择商品分类", trigger: "blur" },
                    ]
                },
                //级联选择器的数据源
                cateList: [],
                cateProps: {

                    label: 'cat_name',//看到的是哪一个属性
                    value: 'cat_id',//你选中的是哪一个值
                    children: 'children',//实现父子节点之间的嵌套,没有写只能显示一级，下级不会显示
                    expandTrigger: 'hover'//鼠标移动显示
                },
                //保存商品参数请求的数据
                manyTabdata: [],
                //保存商品属性数据
                onlyTableData: [],
                //上传图片的地址
                uploabURL: 'http://127.0.0.1:8888/api/private/v1/upload',
                //给图片的url添加token
                headerObj: {
                    Authorization: window.sessionStorage.getItem("token"),
                },
                //图片的数组
                pics: [],
                //图片预览url
                previewPath: '',
                //图片窗口
                previewVisible: false
            };
        },
        watch: {},
        computed: {},
        methods: {
            CommodityClassificationBox() {
                CommodityClassificationAxios().then((res) => {
                    if (res.meta.status != 200) return;
                    // 保存数据
                    this.cateList = res.data
                    console.log(this.cateList);

                })
            },
            // 级联选中会触发该函数
            handleChange() {
                if (this.ruleForm.goods_cat.length !== 3) {
                    this.ruleForm.goods_cat = []
                }
                console.log(this.ruleForm.goods_cat);
            },
            //阻止标签页切换,actiName即将进入的标签页名字，oldActiName即将 离开的标签页名字
            beforeTabLeave(actiName, oldActiName) {
                if (oldActiName === '0' && this.ruleForm.goods_cat.length !== 3) {
                    this.$message.error('请选择商品分类');
                    return false
                }
            },
            //用户进入第二个标签页发起请求
            tabClicked() {
                //商品参数请求
                if (this.activeindex === '1') {
                    parameterListAxios(this.ruleForm.goods_cat[2], 'many').then((res) => {
                        if (res.meta.status != 200) return;
                        this.$message.success('进入成功');
                        console.log(res);
                        res.data.forEach(item => {
                            item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
                        });
                        this.manyTabdata = res.data

                    })

                }
                //商品属性请求
                else if (this.activeindex === '2') {
                    parameterListAxios(this.ruleForm.goods_cat[2], 'only').then((res) => {
                        if (res.meta.status != 200) return;
                        this.$message.success('请求成功');
                        this.onlyTableData = res.data
                        console.log(res);

                    })
                }
            },

            //预览图片效果事件
            handlePreview(file) {
                this.previewPath = file.response.data.url
                console.log(this.previewPath)
                this.previewVisible = true
            },
            //点击x号删除图片,file:被移除的图片对象
            handleRemove(file) {

                // 1.获取将要删除的临时图片路径
                const filePath = file.response.data.tmp_path;
                // 2.从pics数组中，找到这个图片对应的索引值
                const i = this.pics.findIndex(x => {
                    return x.pic === filePath

                })
                console.log(i)
                // 3.调用数组的splice方法，把图片信息对象，从pics数组中移除
                this.pics.splice(i, 1)
                console.log(this.pics);


                // const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
                // var ret3 = arr1.findIndex((value, index, arr) => {
                //     console.log(value)
                //     value > 4
                // })
                // console.log('%s', ret3)


            },
            //监听图片上传成功的事件,1参数一.response服务器返回来的数据对象
            handleSuccess(response) {
                // 1.拼接得到一个图片信息对象
                const picInfo = {
                    pic: response.data.tmp_path
                }
                // 2.将图片信息对象，push到pics数组中
                this.pics.push(picInfo)
                console.log(this.pics)

            },
            //添加商品
            add() {
                this.$refs.ruleForm.validate(valid => {
                    //没有填写，返回提示信息
                    if (!valid) {
                        return this.$message.error('请填写必要的表单项');
                    }
                    //填写了就发请求
                    //深拷贝lodash   cloneDeep(obj)
                    const form = _.cloneDeep(this.ruleForm)
                    form.goods_cat = form.goods_cat.join(',')
                    // 处理动态参数
                    this.manyTabdata.forEach(item => {
                        const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals.join(' ') }
                        this.ruleForm.attrs.push(newInfo)
                    })
                    //处理静态属性
                    this.onlyTableData.forEach(item => {
                        const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
                        this.ruleForm.attrs.push(newInfo)
                    })
                    form.attrs = this.ruleForm.attrs
                    console.log(form);
                    //添加商品请求
                    AddItemshopAxios(
                        form.goods_name,
                        form.goods_cat,
                        form.goods_price,
                        form.goods_number,
                        form.goods_weight,
                        form.goods_introduce,
                        this.pics,
                        form.attrs,
                    ).then((res) => {
                        this.$router.push('/goods')
                        this.$message.success('添加成功');
                    })

                })
            }

        },
        created() {
            this.CommodityClassificationBox()
        },
        mounted() { }
    };
</script>
<style scoped>
    .wrapper {}

    .el-steps {
        margin: 20px 0;
    }

    .el-checkbox {
        margin: 0 5px 0 0 !important
    }

    .previewImg {
        width: 100%;
    }

    .quillButton {
        margin-top: 13px;
        margin-left: 45%;
    }
</style>