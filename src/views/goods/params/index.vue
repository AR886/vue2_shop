<template>
  <div>
    <!-- 面包屑 -->
    <Crumbs firstMenu="商品管理" secondMenu="参数列表"></Crumbs>

    <!-- 主体 -->
    <el-card shadow="always" :body-style="{ padding: '20px' }" style="margin-top: 20px">
      <!-- 警告 -->
      <el-alert title="注意: 只允许为第三级分类设置相关参数 !" type="warning" :closable="false" show-icon> </el-alert>
      <!-- 级联选择  -->
      <el-row style="margin: 20px 0px" :gutter="20">
        <el-col>
          <span>选择商品分类 : </span>
          <el-cascader v-model="selectKeys" :options="allCategoriesList" :props="cascaderProps" @change="parentCateChange" clearable style="width: 25%"></el-cascader>
        </el-col>
      </el-row>

      <!-- 标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数 按钮 -->
          <el-button type="primary" size="small" :disabled="this.selectKeys.length !== 3" @click="addParamsOrAttrDialog">添加参数</el-button>
          <!-- 参数表格 -->
          <el-table border stripe style="margin: 20px 0px" :data="paramsList">
            <el-table-column type="expand">
              <template slot-scope="{ row }">
                <!-- 标签 -->
                <el-tag v-for="(item, i) in row.attr_vals" :key="i" type="primary" size="samll" closable style="margin-left: 20px" @close="tagClose(row, i)">{{ item }}</el-tag>
                <!-- 添加新标签input -->
                <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.tagInputValue" ref="tagInputRef" size="small" @keyup.enter.native="handleInputConfirm(row)" @blur="handleInputConfirm(row)" style="width: 100px; margin-left: 20px"> </el-input>
                <!-- 添加新标签按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(row)" style="margin-left: 20px">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{ row }">
                <el-button type="primary" size="small" icon="el-icon-edit" @click="openUpdateDialog(row)">编辑</el-button>
                <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteParamsOrAttr(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加参数 按钮 -->
          <el-button type="primary" size="small" :disabled="this.selectKeys.length !== 3" @click="addParamsOrAttrDialog">添加属性</el-button>
          <!-- 参数表格 -->
          <el-table border stripe style="margin: 20px 0px" :data="attrList">
            <el-table-column type="expand">
              <template slot-scope="{ row }">
                <!-- 标签 -->
                <el-tag v-for="(item, i) in row.attr_vals" :key="i" type="primary" size="samll" closable style="margin-left: 20px" @close="tagClose(row, i)">{{ item }}</el-tag>
                <!-- 添加新标签input -->
                <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.tagInputValue" ref="tagInputRef" size="small" @keyup.enter.native="handleInputConfirm(row)" @blur="handleInputConfirm(row)" style="width: 100px; margin-left: 20px"> </el-input>
                <!-- 添加新标签按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(row)" style="margin-left: 20px">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{ row }">
                <el-button type="primary" size="small" icon="el-icon-edit" @click="openUpdateDialog(row)">编辑</el-button>
                <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteParamsOrAttr(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数或属性对话框 -->
    <el-dialog :title="activeName === 'many' ? '添加参数' : '添加属性'" :visible.sync="addDialog" width="40%" @close="addDialogClose">
      <el-form :model="addForm" ref="addFormRef" :rules="rules" label-width="80px">
        <el-form-item :label="activeName === 'many' ? '参数名称' : '属性名称'" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="addDialog = false">取消</el-button>
        <el-button type="primary" @click="addParamsOrAttr">确定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑参数或属性对话框 -->
    <el-dialog :title="activeName === 'many' ? '编辑参数' : '编辑属性'" :visible.sync="updateDialog" width="40%" @close="updateDialogClose">
      <el-form :model="updateForm" ref="updateFormRef" :rules="rules" label-width="80px">
        <el-form-item :label="activeName === 'many' ? '参数名称' : '属性名称'" prop="attr_name">
          <el-input v-model="updateForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="updateDialog = false">取消</el-button>
        <el-button type="primary" @click="updateParamsOrAttr">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'params',
  data() {
    return {
      // 级联选择配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 被选中的父级ID数据
      selectKeys: [],
      // 控制标签页的切换
      activeName: 'many',
      // 切换显示添加参数或属性对话框
      addDialog: false,
      // 收集添加属性表单
      addForm: {
        attr_name: ''
      },
      // 切换显示隐藏编辑参数或属性对话框
      updateDialog: false,
      // 收集编辑表单
      updateForm: {},
      // 验证规则
      rules: {
        attr_name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.getCategoriesListAll()
    this.getParamsOrAttrList()
  },
  methods: {
    // 获取所有分类数据列表
    getCategoriesListAll() {
      this.$store.dispatch('getAllCategoriesList')
    },
    // 级联选择 内容发生改变时触发
    parentCateChange() {
      if (this.selectKeys.length !== 3) {
        this.selectKeys = []
        // 当没选择三级分类ID时 清除paramsList
        this.$store.state.Goods.paramsList = []
        this.$store.state.Goods.attrList = []
        return
      }
      this.getParamsOrAttrList()
    },
    // tab 被选中时触发
    handleClick(tab, event) {
      this.getParamsOrAttrList()
    },
    // 根据三级分类ID获取参数或者属性
    getParamsOrAttrList() {
      if (this.activeName === 'many') {
        const data = { id: this.selectKeys[2], sel: this.activeName }
        this.$store.dispatch('getParamsList', data)
      } else {
        const data = { id: this.selectKeys[2], sel: this.activeName }
        this.$store.dispatch('gerAttrList', data)
      }
    },
    // 打开添加参数或属性
    addParamsOrAttrDialog() {
      this.addDialog = true
    },
    // 当添加对话框 关闭回调
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加动态参数或静态属性
    addParamsOrAttr() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (valid) {
          // 整理参数发请求
          const data = {
            id: this.selectKeys[2],
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
          // 发请求
          const result = await this.$store.dispatch('addParamsOrAttr', data)
          if (result === 'ok') {
            this.$message.success('添加成功')
            this.getParamsOrAttrList()
            this.addDialog = false
          }
        }
      })
    },
    // 编辑对话框关闭 回调
    updateDialogClose() {
      this.$refs.updateFormRef.resetFields()
    },
    // 打开编辑对话框
    openUpdateDialog(row) {
      this.updateDialog = true
      this.updateForm = { ...row }
    },
    // 编辑提交参数或属性
    updateParamsOrAttr() {
      this.$refs.updateFormRef.validate(async (valid) => {
        if (valid) {
          const data = {
            id: this.updateForm.cat_id,
            attrId: this.updateForm.attr_id,
            attr_name: this.updateForm.attr_name,
            attr_sel: this.updateForm.attr_sel
          }
          const result = await this.$store.dispatch('updateParamsOrAttr', data)
          if (result === 'ok') {
            this.$message.success('修改成功')
            this.getParamsOrAttrList()
            this.updateDialog = false
          }
        }
      })
    },
    // 删除参数或属性
    deleteParamsOrAttr(row) {
      this.$confirm(`此操作将永久删除${row.attr_name}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const data = { id: row.cat_id, attrid: row.attr_id }
          const result = await this.$store.dispatch('deleteParamsOrAttr', data)
          if (result === 'ok') {
            this.$message({ type: 'success', message: '删除成功!' })
            this.getParamsOrAttrList()
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 显示标签input
    showInput(row) {
      row.inputVisible = true
      this.$nextTick((_) => {
        this.$refs.tagInputRef.$refs.input.focus()
      })
    },
    // 显示按钮
    handleInputConfirm(row) {
      if (row.tagInputValue.trim().length !== 0) {
        row.attr_vals.push(row.tagInputValue.trim())
        this.updateTag(row)
      }
      row.inputVisible = false
      row.tagInputValue = ''
    },
    // 修改标签 提交数据
    async updateTag(row) {
      // 整理参数
      const data = {
        id: row.cat_id,
        attrId: row.attr_id,
        attr_name: row.attr_name,
        attr_sel: this.activeName,
        attr_vals: row.attr_vals.join(' ')
      }
      const result = await this.$store.dispatch('updateParamsOrAttr', data)
      if (result === 'ok') {
        this.$message.success('更改标签列表成功')
      }
    },
    // 删除标签
    tagClose(row, i) {
      row.attr_vals.splice(i, 1)
      this.updateTag(row)
    }
  },
  computed: {
    ...mapState({
      allCategoriesList: (state) => state.Goods.allCategoriesList,
      paramsList: (state) => state.Goods.paramsList,
      attrList: (state) => state.Goods.attrList
    })
  }
}
</script>

<style lang="less" scoped></style>
