import { reqListPowerList, reqRolesList, reqAddRole, reqUpdateRoleUser, reqDeleteRoleUser, reqDeleteUserRole, reqTreePowerList, reqSubmitPower } from '@/api'

const state = {
  // 权限列表
  powerList: [],
  // 角色列表
  rolesList: [],
  // 删除角色权限返回的单个子列表
  childList: [],
  // 树形权限列表
  treePowerList: []
}
const mutations = {
  GETLISTPOWERLIST(state, powerList) {
    state.powerList = powerList
  },
  GETROLESLIST(state, rolesList) {
    state.rolesList = rolesList
  },
  DELETEUSERROLE(state, childList) {
    state.childList = childList
  },
  GETTREEPOWERLIST(state, treePowerList) {
    state.treePowerList = treePowerList
  }
}
const actions = {
  // 获取list 权限列表
  async getListPowerList({ commit }) {
    const { data: res } = await reqListPowerList()
    if (res.meta.status === 200) {
      commit('GETLISTPOWERLIST', res.data)
    }
  },
  // 获取角色列表
  async getRolesList({ commit }) {
    const { data: res } = await reqRolesList()
    if (res.meta.status === 200) {
      commit('GETROLESLIST', res.data)
    }
  },
  // 添加角色
  async addRole({ commit }, roleInfo) {
    const { data: res } = await reqAddRole(roleInfo)
    if (res.meta.status === 201) {
      return 'ok'
    }
  },
  // 修改角色信息
  async updateRoleUser({ commit }, data) {
    const { data: res } = await reqUpdateRoleUser(data)
    if (res.meta.status === 200) {
      return 'ok'
    }
  },
  // 删除角色
  async deleteRoleUser({ commit }, id) {
    const { data: res } = await reqDeleteRoleUser(id)
    if (res.meta.status === 200) {
      return 'ok'
    }
  },
  // 删除角色权限
  async deleteUserRole({ commit }, data) {
    const { data: res } = await reqDeleteUserRole(data)
    if (res.meta.status === 200) {
      commit('DELETEUSERROLE', res.data)
      return 'ok'
    }
  },
  // 获取tree 权限列表
  async getTreePowerList({ commit }) {
    const { data: res } = await reqTreePowerList()
    if (res.meta.status === 200) {
      commit('GETTREEPOWERLIST', res.data)
    }
  },
  // 提交角色权限(授权)
  async submitPower({ commit }, data) {
    const { data: res } = await reqSubmitPower(data)
    if (res.meta.status === 200) {
      return 'ok'
    }
  }
}
const getters = {}
export default {
  state,
  mutations,
  actions,
  getters
}
