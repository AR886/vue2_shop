<template>
  <div>
    <!-- 面包屑 -->
    <Crumbs firstMenu="权限管理" secondMenu="角色列表"></Crumbs>
    <!-- 主体 -->
    <el-card shadow="always" :body-style="{ padding: '20px' }" style="margin: 20px 0px">
      <!-- 添加角色按钮 -->
      <el-button type="primary" size="default" @click="addDialog = true">添加角色</el-button>
      <!-- 表格 -->
      <el-table border stripe style="margin: 20px 0px" :data="list">
        <el-table-column width="50" type="expand">
          <template slot-scope="{ row }">
            <el-row :class="['powerTree', i === 0 ? 'firstTree' : '', 'vcenter']" v-for="(firstPower, i) in row.children" :key="firstPower.id">
              <!-- 一级权限 -->
              <el-col :span="6" :offset="1">
                <el-tag closable @close="deleteUserRole(row, firstPower.id)">{{ firstPower.authName }}</el-tag>
              </el-col>
              <!-- 二三级权限 -->
              <el-col :span="17">
                <!-- 二级权限 -->
                <el-row :class="['powerTree', i === 0 ? 'firstTree' : '', 'vcenter']" v-for="(secondPower, i) in firstPower.children" :key="secondPower.id" style="margin: 0px">
                  <el-col :span="7" :offset="0">
                    <el-tag type="success" size="normal" effect="dark" closable @close="deleteUserRole(row, secondPower.id)">{{ secondPower.authName }}</el-tag>
                  </el-col>
                  <el-col :span="17" :offset="0">
                    <!-- 三级权限 -->
                    <el-tag type="warning" size="normal" effect="dark" closable v-for="thirdPower in secondPower.children" :key="thirdPower.id" style="margin: 0px 10px 10px 0px" @close="deleteUserRole(row, thirdPower.id)">{{ thirdPower.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#" align="center"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-button type="primary" size="small" icon="el-icon-edit" @click="openUpdateDialog(row)">编辑</el-button>
            <el-button type="danger" size="small" icon="el-icon-delete" @click="open(row)">删除</el-button>
            <el-button type="warning" size="small" icon="el-icon-setting" @click="setRole(row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <div class="block">
        <el-pagination :current-page.sync="page" :page-size="9" layout="jumper, prev, pager, next,->,total " :total="rolesList.length" style="text-align: center"> </el-pagination>
      </div>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addDialog" width="35%" :before-close="closeAddDialog">
      <el-form :model="addForm" ref="addFormRef" :rules="rules">
        <el-form-item label="角色名称" label-width="80px" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="80px" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeAddDialog">取 消</el-button>
        <el-button type="primary" @click="addRoleUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改角色信息对话框 -->
    <el-dialog title="编辑角色" :visible.sync="updateDialog" width="35%" :before-close="closeUpdateDialog">
      <el-form :model="updateForm" ref="updateFormRef" :rules="rules">
        <el-form-item label="角色名称" label-width="80px" prop="roleName">
          <el-input v-model="updateForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="80px" prop="roleDesc">
          <el-input v-model="updateForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeUpdateDialog">取 消</el-button>
        <el-button type="primary" @click="updateRoleUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="setUserRoleDialog" width="50%" @close="setRightsDialogClose">
      <el-tree ref="treeRef" :data="treePowerList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys"> </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setUserRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'roleList',
  data() {
    return {
      page: 1,
      // 切换添加表单对话框
      addDialog: false,
      // 收集角色添加表单数据
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      // 验证规则
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      // 切换修改角色对话框
      updateDialog: false,
      // 收集修改角色信息
      updateForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      visible: false,
      // 显示隐藏分配角色对话框
      setUserRoleDialog: false,
      // 树形控件 属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认勾选的权限
      defKeys: [],
      // 打开分配权限的角色ID
      setPowerUserID: ''
    }
  },
  mounted() {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表数据
    getRolesList() {
      this.$store.dispatch('getRolesList')
    },
    // 关闭对话框前的回调
    closeAddDialog() {
      this.$refs.addFormRef.resetFields()
      this.addDialog = false
    },
    // 添加角色
    addRoleUser() {
      this.$refs.addFormRef.validate(async (value) => {
        if (value) {
          const result = await this.$store.dispatch('addRole', this.addForm)
          if (result === 'ok') {
            this.$refs.addFormRef.resetFields()
            this.addDialog = false
            this.$message.success('创建角色成功')
            this.getRolesList()
          }
        }
      })
    },
    // 打开修改角色对话框
    openUpdateDialog(row) {
      this.updateDialog = true
      this.updateForm = { ...row }
    },
    // 关闭修改对话框
    closeUpdateDialog() {
      this.updateDialog = false
      this.$refs.updateFormRef.resetFields()
    },
    // 提交修改角色信息
    updateRoleUser() {
      this.$refs.updateFormRef.validate(async (value) => {
        const { updateForm } = this
        if (value) {
          const result = await this.$store.dispatch('updateRoleUser', updateForm)
          if (result === 'ok') {
            this.updateDialog = false
            this.$refs.updateFormRef.resetFields()
            this.$message.success('修改角色成功')
            this.getRolesList()
          }
        }
      })
    },
    // 确定删除对话框
    open(row) {
      this.$confirm(`此操作将永久删除${row.roleName}用户, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const result = await this.$store.dispatch('deleteRoleUser', row.id)
          if (result === 'ok') {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getRolesList()
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 删除角色权限
    deleteUserRole(row, rightId) {
      this.$confirm(`此操作将永久删除该权限, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const data = { roleId: row.id, rightId }
          const result = await this.$store.dispatch('deleteUserRole', data)
          if (result === 'ok') {
            this.$message({
              type: 'success',
              message: '删除权限成功!'
            })
            // 不重新渲染数据 直接把删除后返回的数据赋值给点击的children
            row.children = this.childList
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 打开分配权限 回调
    setRole(row) {
      this.setPowerUserID = row.id
      this.$store.dispatch('getTreePowerList')
      this.getDefaultKeys(row, this.defKeys)
      this.setUserRoleDialog = true
    },
    // 利用递归获取到最里层的权限ID
    getDefaultKeys(node, arr) {
      // 如果没有children 就是最里层的权限
      if (!node.children) {
        return arr.push(node.id)
      }
      // 没有则执行 递归
      node.children.forEach((item) => {
        this.getDefaultKeys(item, arr)
      })
    },
    // 关闭分配权限对话框
    setRightsDialogClose() {
      this.defKeys = []
      this.setPowerUserID = ''
    },
    // 确定为角色授权
    async allotRights() {
      const key = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const rids = key.join(',')
      const data = { roleId: this.setPowerUserID, rids }
      const result = await this.$store.dispatch('submitPower', data)
      if (result === 'ok') {
        this.$message.success('修改权限成功')
        this.setUserRoleDialog = false
        this.getRolesList()
      }
    }
  },
  computed: {
    ...mapState({
      rolesList: (state) => state.Roles.rolesList,
      childList: (state) => state.Roles.childList,
      treePowerList: (state) => state.Roles.treePowerList
    }),
    list() {
      const start = this.page === 1 ? 0 : (this.page - 1) * 9
      const end = this.page * 9
      return this.rolesList.slice(start, end)
    }
  }
}
</script>

<style lang="less" scoped>
.powerTree {
  margin: 0px 20px;
  border-top: 1px solid #ccc;
  padding: 10px 0px;
}
.firstTree {
  border: none;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
