import { reqLeftMenus, reqUserList, reqUpdateUserState, reqAddUser, reqUpdateUser, reqDeleteUser } from '@/api'

const state = {
  leftMenus: [],
  userList: {}
}
const mutations = {
  GETLEDTMENUS(state, leftMenus) {
    state.leftMenus = leftMenus
  },
  GETUSERLIST(state, userList) {
    state.userList = userList
  }
}
const actions = {
  // 获取左侧菜单
  async getLeftMenus({ commit }) {
    const { data: res } = await reqLeftMenus()
    if (res.meta.status === 200) {
      commit('GETLEDTMENUS', res.data)
    }
  },
  // 获取用户列表
  async getUserList({ commit }, data) {
    const { data: res } = await reqUserList(data)
    if (res.meta.status === 200) {
      commit('GETUSERLIST', res.data)
      return 'ok'
    }
  },
  // 修改用户状态
  async updateUserState({ commit }, data) {
    const { data: res } = await reqUpdateUserState(data)
    if (res.meta.status === 200) {
      return 'ok'
    }
  },
  // 添加用户
  async addUser({ commit }, data) {
    const { data: res } = await reqAddUser(data)
    if (res.meta.status === 201) {
      return 'ok'
    }
  },
  // 修改用户信息
  async updateUserInfo({ commit }, data) {
    const { data: res } = await reqUpdateUser(data)
    if (res.meta.status === 200) {
      return 'ok'
    }
  },
  // 删除单个用户
  async deleteUser({ commit }, id) {
    const { data: res } = await reqDeleteUser(id)
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
