<template>
    <div class="wrapper">
        <!-- 面包屑部分 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card>
            <!-- 2.为Echarts准备一个具备大小宽高的dom -->
            <div id="main" style="width: 750px;height:400px;"></div>
        </el-card>
    </div>
</template>

<script>
    import { tupickAxios } from '@/network/reports.js'
    // 导入echarts
    let echarts = require('echarts')
    import _ from 'lodash'
    export default {
        components: {},
        props: {},
        data() {
            return {
                // 需要合并的数据
                options: {
                    title: {
                        text: '用户来源'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#E9EEF3'
                            }
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            boundaryGap: false
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ]
                }
            };
        },
        watch: {},
        computed: {},
        methods: {
            drawLine() {
                // 基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(document.getElementById('main'));

                // 指定图表的配置项和数据
                tupickAxios().then((res) => {
                    // 合并2个对象，不合并会出现鼠标移进去，不显示数据效果
                    const result = _.merge(res.data, this.options)
                    // 使用刚指定的配置项和数据显示图表。
                    myChart.setOption(result);
                    console.log(res.data);

                })


            }
        },
        created() { },
        mounted() {
            this.drawLine();
        }
    };
</script>
<style scoped>
    .wrapper {}
</style>