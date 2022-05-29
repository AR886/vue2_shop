<template>
  <div>
    <!-- 面包屑 -->
    <Crumbs firstMenu="商品管理" secondMenu="商品分类"></Crumbs>

    <!-- 主体 -->
    <el-card shadow="always" :body-style="{ padding: '20px' }" style="margin-top: 20px">
      <!-- 添加分类按钮 -->
      <el-button type="primary" size="default" @click="addClass">添加分类</el-button>

      <!-- 分类列表 -->
      <el-table :data="categoriesList.result" row-key="cat_id" border :tree-props="{ children: 'children' }" style="margin: 20px 0px">
        <el-table-column label="分类名称" prop="cat_name"> </el-table-column>
        <el-table-column label="是否有效" prop="cat_deleted">
          <template slot-scope="{ row }">
            <i v-if="!row.cat_deleted" class="el-icon-success" style="color: lightgreen"></i>
            <i v-else class="el-icon-error" style="color: red"></i>
          </template>
        </el-table-column>
        <el-table-column label="排序">
          <template slot-scope="{ row }">
            <el-tag v-if="row.cat_level === 0" type="primary" size="normal">一 级</el-tag>
            <el-tag v-if="row.cat_level === 1" type="success" size="normal">二 级</el-tag>
            <el-tag v-if="row.cat_level === 2" type="danger" size="normal">三 级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row, $index }">
            <el-button type="primary" size="small" @click="openUpdateDialog(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="deleteCategories(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器   @current-change="handleCurrentChange" -->
      <el-pagination :current-page="queryInfo.pagenum" :page-sizes="[5, 7, 10]" :page-size="queryInfo.pagesize" layout="  jumper,prev, pager, next,->,total,sizes" :total="categoriesList.total" style="text-align: center" @current-change="handleCurrentChange" @size-change="handleSizeChange">
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="40%" @close="addDialogClose">
      <el-form :model="addForm" label-width="80px" :rules="rules" ref="addFormRef">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- 级联选择  -->
          <el-cascader v-model="selectKeys" :options="twoCategoriesList" :props="cascaderProps" @change="parentCateChange" clearable></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategories">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog title="修改分类" :visible.sync="updateDialog" width="40%" @close="updateDialogClose">
      <el-form :model="updateForm" ref="updateFormRef" :rules="rules" label-width="80px" :inline="false" size="normal">
        <el-form-item label="用户名称" prop="cat_name">
          <el-input v-model="updateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="updateDialog = false">取消</el-button>
        <el-button type="primary" @click="updateCategories">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'categories',
  data() {
    return {
      // 发请求 获取数据 信息
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 显示隐藏添加分类对话框
      addDialogVisible: false,
      // 收集添加分类数据
      addForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      // 验证规则
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      // 级联选择配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true
      },
      // 被选中的父级ID数据
      selectKeys: [],
      // 收集编辑用户信息
      updateForm: {},
      // 显示隐藏编辑用户信息对话框
      updateDialog: false,
      // 显示隐藏 删除分类
      deleteVisible: false
    }
  },
  mounted() {
    this.getCategoriesList()
  },
  methods: {
    // 获取商品分类数据列表
    getCategoriesList() {
      this.$store.dispatch('getCategoriesList', this.queryInfo)
    },
    // 分页器 页面切换
    handleCurrentChange(pager) {
      this.queryInfo.pagenum = pager
      this.getCategoriesList()
    },
    // 分页器 每页展示多少条数据
    handleSizeChange(pagesize) {
      this.queryInfo.pagesize = pagesize
      this.getCategoriesList()
    },
    // 打开添加分类对话框
    addClass() {
      this.addDialogVisible = true
      this.$store.dispatch('getTwoCategoriesList', { type: 2 })
    },
    // 级联选择 发生变化触发
    parentCateChange() {
      // 把被选中的信息给addForm
      this.addForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]
      this.addForm.cat_level = this.selectKeys.length
      if (this.addForm.cat_pid === undefined) {
        this.addForm.cat_pid = 0
      }
    },
    // 添加分类
    addCategories() {
      this.$refs.addFormRef.validate(async (value) => {
        if (value) {
          const result = await this.$store.dispatch('addCategories', this.addForm)
          if (result === 'ok') {
            this.$message.success('添加分类成功')
            this.getCategoriesList()
            this.addDialogVisible = false
          }
        }
      })
    },
    // 关闭添加分类对话框 回调
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
      this.selectKeys = []
      this.addForm.cat_pid = 0
      this.addForm.cat_level = 0
    },
    // 打开编辑用户信息对话框
    openUpdateDialog(row) {
      this.updateDialog = true
      this.updateForm = { ...row }
    },
    // 关闭编辑用户名称对话框 回调
    updateDialogClose() {
      this.$refs.updateFormRef.resetFields()
      this.updateForm = {}
    },
    // 编辑提交分类
    updateCategories() {
      const data = { id: this.updateForm.cat_id, cat_name: this.updateForm.cat_name }
      this.$refs.updateFormRef.validate(async (valid) => {
        if (valid) {
          const result = await this.$store.dispatch('updateCategories', data)
          if (result === 'ok') {
            this.$message.success('修改分类名称成功')
            this.getCategoriesList()
            this.updateDialog = false
          }
        }
      })
    },
    // 删除分类
    deleteCategories(row) {
      this.$confirm(`此操作将永久删除${row.cat_name}分类, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const result = await this.$store.dispatch('deleteCategories', row.cat_id)
          if (result === 'ok') {
            this.$message({ type: 'success', message: '删除成功!' })
            this.getCategoriesList()
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  },
  computed: {
    ...mapState({
      categoriesList: (state) => state.Goods.categoriesList,
      twoCategoriesList: (state) => state.Goods.twoCategoriesList || []
    })
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
