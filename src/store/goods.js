import { reqCategoriesList, reqAddCategories, reqUpdateCategories, reqDeleteCategories } from '@/api'
const state = {
  categoriesList: [],
  twoCategoriesList: []
}
const mutations = {
  GETCATEGORIESLIST(state, categoriesList) {
    state.categoriesList = categoriesList
  },
  GETTWOCATEGORIESLIST(state, twoCategoriesList) {
    state.twoCategoriesList = twoCategoriesList
  }
}
const actions = {
  // 获取商品分类数据列表
  async getCategoriesList({ commit }, queryInfo) {
    const { data: res } = await reqCategoriesList(queryInfo)
    if (res.meta.status === 200) {
      commit('GETCATEGORIESLIST', res.data)
    }
  },
  // 获取所有二级分类数据列表
  async getTwoCategoriesList({ commit }, type) {
    const { data: res } = await reqCategoriesList(type)
    if (res.meta.status === 200) {
      commit('GETTWOCATEGORIESLIST', res.data)
    }
  },
  // 添加分类
  async addCategories({ commit }, data) {
    const { data: res } = await reqAddCategories(data)
    if (res.meta.status === 201) {
      return 'ok'
    }
  },
  // 编辑提交分类
  async updateCategories({ commit }, data) {
    const { data: res } = await reqUpdateCategories(data)
    console.log(res)
    if (res.meta.status === 200) {
      return 'ok'
    }
  },
  // 删除分类
  async deleteCategories({ commit }, id) {
    const { data: res } = await reqDeleteCategories(id)
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
