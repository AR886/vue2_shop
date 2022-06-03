<template>
  <div>
    <!-- 面包屑 -->
    <Crumbs firstMenu="商品管理" secondMenu="商品列表"></Crumbs>
    <!-- 主体 -->
    <el-card shadow="always" :body-style="{ padding: '20px' }" style="margin: 20px 0px">
      <!-- 搜索框和按钮 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input v-model="queryInfo.query" placeholder="请输入内容" size="normal" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="searchGood"></el-button>
          </el-input>
        </el-col>
        <!-- 添加按钮 -->
        <el-col :span="4">
          <el-button type="primary" size="default" @click="$router.push('/goods/add')">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 商品列表表格 -->
      <el-table border stripe style="margin: 20px 0px" :data="goodsList">
        <el-table-column type="index" label="#" align="center"> </el-table-column>
        <el-table-column label="商品名称" width="" prop="goods_name"> </el-table-column>
        <el-table-column label="商品价格(元)" width="120" prop="goods_price"> </el-table-column>
        <el-table-column label="商品重量" width="80" prop="goods_weight"> </el-table-column>
        <el-table-column label="创建时间" width="170" prop="add_time"> </el-table-column>
        <el-table-column label="操作" width="130">
          <template slot-scope="{ row }">
            <el-button type="primary" size="small" icon="el-icon-edit"></el-button>
            <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteGood(row)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器    -->
      <el-pagination :current-page="queryInfo.pagenum" :page-sizes="[5, 7, 10]" :page-size="queryInfo.pagesize" layout="prev, pager, next, jumper,->,total,sizes" :total="total" style="text-align: center" @current-change="handleCurrentChange" @size-change="handleSizeChange"> </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'list',
  data() {
    return {
      queryInfo: {
        // 搜索文本框的value
        query: '',
        // 分页
        pagenum: 1,
        pagesize: 10
      }
    }
  },
  mounted() {
    this.getGoodsList()
  },
  methods: {
    // 获取商品列表数据
    getGoodsList() {
      // 发请求
      this.$store.dispatch('getGoodsList', this.queryInfo)
    },
    // 分页器切换页数
    handleCurrentChange(pager) {
      this.queryInfo.pagenum = pager
      this.getGoodsList()
    },
    // 分页器切换每页展示条数
    handleSizeChange(limit) {
      this.queryInfo.pagesize = limit
      this.getGoodsList()
    },
    // 搜索商品
    searchGood() {
      this.queryInfo.pagenum = 1
      this.getGoodsList()
    },
    // 删除商品
    async deleteGood(row) {
      const delResult = await this.$confirm(`此操作将永久删除该商品,是否继续？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).catch((err) => err)
      if (delResult === 'confirm') {
        const result = await this.$store.dispatch('deleteGood', row.goods_id)
        if (result === 'ok') {
          this.$message.success('删除商品成功')
          this.getGoodsList()
        }
      }
      if (delResult === 'cancel') {
        return this.$message.info('取消删除')
      }
    }
  },
  computed: {
    ...mapGetters(['total', 'goodsList'])
  }
}
</script>

<style lang="less" scoped></style>
