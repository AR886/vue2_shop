<template>
  <div>
    <!-- 面包屑 -->
    <Crumbs firstMenu="订单管理" secondMenu="订单列表"></Crumbs>
    <!-- 主体 -->
    <el-card shadow="always" :body-style="{ padding: '20px' }" style="margin: 20px 0px">
      <el-row :gutter="20">
        <el-col :span="8" :offset="0">
          <el-input placeholder="请输入内容" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="searchOrder"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table border stripe style="margin: 20px 0px" :data="orderList.goods">
        <el-table-column type="index" label="#" align="center"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号"> </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="100" align="center"> </el-table-column>
        <el-table-column label="是否付款" width="100" align="center">
          <template slot-scope="{ row }">
            <el-tag v-if="row.pay_status === '1'" type="primary" size="small">已付款</el-tag>
            <el-tag v-else type="danger" size="small">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="100" align="center"> </el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="240" align="center"> </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="{ row }">
            <el-button type="primary" size="small" icon="el-icon-edit" title="修改订单地址" @click="openUpdateAddress(row)"></el-button>
            <el-button type="success" size="small" icon="el-icon-location" title="查看物流信息" @click="openProgress(row)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器   -->
      <el-pagination :current-page="queryInfo.pagenum" :page-sizes="[5, 7, 10]" :page-size="queryInfo.pagesize" layout="prev, pager, next, jumper,->,total,sizes" :total="orderList.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="text-align: center">
      </el-pagination>
    </el-card>

    <!-- 修改地址对话框 -->
    <el-dialog title="修改地址" :visible.sync="updateAddressVisible" width="45%" @close="addressDialogClose">
      <!-- 表单 -->
      <el-form :model="addressForm" ref="addressFormRef" :rules="rules" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" v-model="addressForm.address1" :props="{ expandTrigger: 'hover' }"> </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="updateAddressVisible = false">取消</el-button>
        <el-button type="primary">确定</el-button>
      </span>
    </el-dialog>

    <!-- 物流信息对话框 -->
    <el-dialog title="物流信息" :visible.sync="progressDialogVisible" width="45%">
      <el-timeline :reverse="true">
        <el-timeline-item v-for="(activity, index) in progress.data" :key="index" :timestamp="activity.time">
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
// 引入地址文件
import cityData from '../citydata'
export default {
  name: 'orderList',
  data() {
    const progress = require('../progress.json')
    return {
      // 查询信息
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 显示隐藏修改地址对话框
      updateAddressVisible: false,
      // 收集修改地址对话框信息
      addressForm: {
        address1: [],
        address2: ''
      },
      // 验证规则
      rules: {
        address1: [{ required: true, message: '请选择省市区/县', trigger: 'blur' }],
        address2: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      },
      // 城市数据信息
      cityData,
      // 显示隐藏物流信息
      progressDialogVisible: false,
      // 假物流信息
      progress
    }
  },
  mounted() {
    this.getOrderList()
  },
  methods: {
    // 获取订单列表数据
    getOrderList() {
      this.$store.dispatch('getOrderList', this.queryInfo)
    },
    // 分页器切换页数 回调
    handleCurrentChange(pager) {
      this.queryInfo.pagenum = pager
      this.getOrderList()
    },
    // 切换每页展示条数
    handleSizeChange(limits) {
      this.queryInfo.pagesize = limits
      this.getOrderList()
    },
    // 打开修改地址对话框
    openUpdateAddress(row) {
      this.updateAddressVisible = true
    },
    // 关闭修改地址对话框 回调
    addressDialogClose() {
      this.$refs.addressFormRef.resetFields()
    },
    // 显示隐藏物流信息对话框
    openProgress(row) {
      this.progressDialogVisible = true
    },
    // 搜索订单
    searchOrder() {
      ;(this.queryInfo.pagenum = 1), this.getOrderList()
    }
  },
  computed: {
    ...mapState({
      orderList: (state) => state.Orders.orderList
    })
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
