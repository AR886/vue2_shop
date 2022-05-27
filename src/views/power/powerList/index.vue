<template>
  <div>
    <!-- 面包屑 -->
    <Crumbs firstMenu="权限管理" secondMenu="权限列表"></Crumbs>

    <!-- 主体 -->
    <el-card shadow="always" :body-style="{ padding: '20px' }" style="margin: 20px 0px">
      <!-- 表格  :data=""  -->
      <el-table border stripe :data="list" style="margin-bottom: 20px">
        <el-table-column type="index" label="#" align="center"></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="width"> </el-table-column>
        <el-table-column prop="path" label="路径" width="width"> </el-table-column>
        <el-table-column label="权限等级" width="width" class="roleTag">
          <template slot-scope="{ row }" class="roleTag">
            <el-tag v-if="row.level === '0'">一 级</el-tag>
            <el-tag v-if="row.level === '1'" type="success">二 级</el-tag>
            <el-tag v-if="row.level === '2'" type="warning">三 级</el-tag>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 @current-change="getUserList(page)" @size-change="handleSizeChange" -->
      <div class="block">
        <el-pagination :current-page.sync="page" :page-size="9" layout="jumper, prev, pager, next,->,total " :total="powerList.length" style="text-align: center"> </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'powerList',
  data() {
    return {
      page: 1
    }
  },
  mounted() {
    this.getListPowerList()
  },
  methods: {
    // 获取权限列表数据
    getListPowerList() {
      this.$store.dispatch('getListPowerList')
    }
  },
  computed: {
    ...mapState({
      powerList: (state) => state.Roles.powerList
    }),
    // 把获取到的全部权限列表 分页展示
    list() {
      const start = this.page === 1 ? 0 : (this.page - 1) * 9
      const end = this.page * 9
      return this.powerList.slice(start, end)
    }
  }
}
</script>

<style lang="less" scoped></style>
