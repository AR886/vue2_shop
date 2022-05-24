<template>
  <div>
    <!-- 面包屑 -->
    <Crumbs :firstMenu="'用户管理'" :secondMenu="'用户列表'"></Crumbs>

    <!-- 主体 -->
    <el-card shadow="always" :body-style="{ padding: '20px' }" style="margin: 20px 0px">
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="8" :offset="0">
          <el-input placeholder="请输入内容" class="input-with-select" v-model="query" @blur="getUserList" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4" :offset="0">
          <el-button type="primary" size="default" @click="dialogFormVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table border stripe style="margin: 20px 0px" :data="userList.users">
        <el-table-column type="index" label="#" align="center"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="{ row }">
            <el-switch :value="row.mg_state" @change="toggleState(row)"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="230">
          <template slot-scope="{ row }">
            <el-tooltip class="item" effect="dark" content="修改角色" placement="top" :enterable="false">
              <el-button type="primary" size="small" icon="el-icon-edit" @click="updateUser(row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除角色" placement="top" :enterable="false">
              <el-button type="danger" size="small" icon="el-icon-delete" @click="open(row.id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" size="small" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页  @current-change="handleCurrentChange" -->
      <div class="block">
        <el-pagination :current-page.sync="page" :page-sizes="[3, 5, 7]" :page-size="limit" layout="jumper, prev, pager, next,->,total, sizes " :total="userList.total" style="text-align: center" @current-change="getUserList(page)" @size-change="handleSizeChange"> </el-pagination>
      </div>

      <!-- 添加用户对话框 -->
      <el-dialog title="添加用户" :visible.sync="dialogFormVisible" :before-close="close">
        <el-form :model="addForm" :rules="rules" ref="ruleFormRef">
          <el-form-item label="用户名" label-width="80px" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" label-width="80px" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" label-width="80px" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" label-width="80px" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="addNewUser">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 修改用户信息对话框 -->
      <el-dialog title="修改用户信息" :visible.sync="updateDialog" width="50%" @close="closeUpdate">
        <el-form ref="updateFormRef" :rules="rules" :model="updateForm" label-width="80px" :inline="false" size="normal">
          <el-form-item label="用户名" prop="username">
            <el-input :disabled="true" :placeholder="updateForm.username"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="updateForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="updateForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="updateDialog = false">取消</el-button>
          <el-button type="primary" @click="updateUserInfo">确定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'userList',
  data() {
    // 自定义邮箱验证规则
    let email = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入邮箱'))
      }
      if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)) {
        callback(new Error('邮箱格式不正确'))
      } else {
        callback()
      }
    }
    // 自定义手机号验证规则
    let mobile = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号'))
      }
      if (!/^1[3456789]\d{9}$/.test(value)) {
        callback(new Error('手机号格式不正确！'))
      } else {
        callback()
      }
    }
    return {
      // 搜索用户参数
      query: '',
      // 分页器
      page: 1,
      limit: 3,
      total: 0,
      // 显示隐藏添加用户对话框
      dialogFormVisible: false,
      // 收集添加用户数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户验证规则
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ],
        email: [{ validator: email, trigger: 'blur', required: true }],
        mobile: [{ validator: mobile, trigger: 'blur', required: true }]
      },
      // 显示隐藏修改用户对话框
      updateDialog: false,
      // 收集修改用户数据
      updateForm: {}
    }
  },
  mounted() {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    getUserList() {
      const data = {
        query: this.query,
        pagenum: this.page,
        pagesize: this.limit
      }
      this.$store.dispatch('getUserList', data)
    },
    // 用户列表 每页展示条数
    handleSizeChange(limits) {
      this.limit = limits
      this.getUserList()
    },
    // 用户列表 状态切换
    async toggleState(row) {
      // 切换状态
      row.mg_state = !row.mg_state
      // 整理数据
      const data = { uId: Number(row.id), type: row.mg_state }
      try {
        const result = await this.$store.dispatch('updateUserState', data)
        if (result === 'ok') {
          this.$message({ type: 'success', message: `修改${row.username}状态成功` })
        }
      } catch (error) {
        return Promise.reject(new Error('faile'))
      }
    },
    // 确定 添加用户
    addNewUser() {
      // 提交前的表单验证
      this.$refs['ruleFormRef'].validate(async (value) => {
        if (value) {
          this.dialogFormVisible = false
          const result = await this.$store.dispatch('addUser', this.addForm)
          if (result === 'ok') {
            this.$message.success('添加用户成功')
            this.$refs.ruleFormRef.resetFields()
            this.getUserList()
          }
        } else {
          return this.$message.error('添加用户失败')
        }
      })
    },
    // 取消 添加用户
    cancel() {
      this.$refs.ruleFormRef.resetFields()
      // 关闭对话框
      this.dialogFormVisible = false
    },
    // 添加用户对话框 关闭事件
    close() {
      this.$refs.ruleFormRef.resetFields()
      // 关闭对话框
      this.dialogFormVisible = false
    },
    // 修改用户 对话框
    updateUser(row) {
      // 浅拷贝对应的用户信息
      this.updateForm = { ...row }
      this.updateDialog = true
    },
    // 修改用户对话框 关闭事件
    closeUpdate() {
      this.$refs.updateFormRef.resetFields()
      this.updateForm = {}
      this.updateDialog = false
    },
    // 修改用户信息
    updateUserInfo() {
      this.$refs.updateFormRef.validate(async (value) => {
        if (value) {
          const data = {
            id: this.updateForm.id,
            email: this.updateForm.email,
            mobile: this.updateForm.mobile
          }
          const result = await this.$store.dispatch('updateUserInfo', data)
          if (result === 'ok') {
            this.updateDialog = false
            this.$message({ type: 'success', message: '修改成功' })
            this.getUserList()
          }
        }
      })
    },
    // 用户列表 删除按钮 弹框回调
    async open(id) {
      const result = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)
      if (result === 'confirm') {
        const removeResult = await this.$store.dispatch('deleteUser', id)
        if (removeResult === 'ok') {
          this.$message({ type: 'success', message: '删除成功!' })
          this.getUserList(this.$store.state.Home.userList.users.length <= 1 ? this.page - 1 : this.page)
        }
      }
      if (result === 'cancel') {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
      // .then(async () => {
      //   const result = await this.$store.dispatch('deleteUser', id)
      //   if (result === 'ok') {
      //     this.$message({ type: 'success', message: '删除成功!' })
      //     // 判断当前页用户列表至少有一条
      //     this.getUserList(this.userList.users.length < 1 ? this.page - 1 : this.page)
      //   }
      // })
      // .catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '已取消删除'
      //   })
      // })
    }
  },
  computed: {
    ...mapState({
      userList: (state) => state.Home.userList
    })
  }
}
</script>

<style lang="less" scoped></style>
