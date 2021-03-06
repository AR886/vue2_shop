import { reqCategoriesList, reqAddCategories, reqUpdateCategories, reqDeleteCategories, reqParamsOrAttrList, reqAddParamsOrAttr, reqUpdateParamsOrAttr, reqDeleteParamsOrAttr, reqGoods, reqDeleteGood, reqAddGoods, reqUpdateGood } from '@/api'

// 引入时间插件
import dayjs from 'dayjs'
const state = {
  categoriesList: [],
  twoCategoriesList: [],
  allCategoriesList: [],
  paramsList: [],
  attrList: [],
  goodsListInfo: {}
}
const mutations = {
  GETCATEGORIESLIST(state, categoriesList) {
    state.categoriesList = categoriesList
  },
  GETTWOCATEGORIESLIST(state, twoCategoriesList) {
    state.twoCategoriesList = twoCategoriesList
  },
  GETALLCATEGORIESLIST(state, allCategoriesList) {
    state.allCategoriesList = allCategoriesList
  },
  GETPARAMSLIST(state, paramsList) {
    state.paramsList = paramsList
  },
  GETATTRLIST(state, attrList) {
    state.attrList = attrList
  },
  GETGOODSLIST(state, goodsListInfo) {
    state.goodsListInfo = goodsListInfo
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
  },
  // 获取所有分类数据列表
  async getAllCategoriesList({ commit }) {
    const { data: res } = await reqCategoriesList()
    if (res.meta.status === 200) {
      commit('GETALLCATEGORIESLIST', res.data)
    }
  },
  // 获取动态参数列表(切割attr_vals成数组)
  async getParamsList({ commit }, data) {
    const { data: res } = await reqParamsOrAttrList(data)
    if (res.meta.status === 200) {
      // 把attr_vals 切割成数组
      res.data.attr_vals = res.data.forEach((item) => {
        // 判断 当为空时返回一个空数组
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 给每一个添加一个控制标签显示隐藏和文本
        item.inputVisible = false
        item.tagInputValue = ''
      })
      commit('GETPARAMSLIST', res.data)
    }
  },
  // 获取静态参数列表(切割attr_vals成数组)
  async gerAttrList({ commit }, data) {
    const { data: res } = await reqParamsOrAttrList(data)
    if (res.meta.status === 200) {
      res.data.attr_vals = res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 给每一个添加一个控制标签显示隐藏和文本
        item.inputVisible = false
        item.tagInputValue = ''
      })
      commit('GETATTRLIST', res.data)
    }
  },
  // 获取初始的静态参数列表
  async getAttrLists({ commit }, data) {
    const { data: res } = await reqParamsOrAttrList(data)
    if (res.meta.status === 200) {
      commit('GETATTRLIST', res.data)
    }
  },
  // 添加动态参数或者静态属性
  async addParamsOrAttr({ commit }, data) {
    const { data: res } = await reqAddParamsOrAttr(data)
    if (res.meta.status === 201) {
      return 'ok'
    }
  },
  // 编辑提交参数或属性
  async updateParamsOrAttr({ commit }, data) {
    const { data: res } = await reqUpdateParamsOrAttr(data)
    if (res.meta.status === 200) {
      return 'ok'
    }
  },
  // 删除参数或属性
  async deleteParamsOrAttr({ commit }, data) {
    const { data: res } = await reqDeleteParamsOrAttr(data)
    if (res.meta.status === 200) {
      return 'ok'
    }
  },
  // 获取商品列表数据
  async getGoodsList({ commit }, data) {
    // console.log(data)
    const { data: res } = await reqGoods(data)
    if (res.meta.status === 200) {
      res.data.goods.forEach((item) => {
        item.add_time = dayjs(item.add_time).format('YYYY-MM-DD HH:mm:ss')
      })
      commit('GETGOODSLIST', res.data)
    }
  },
  // 删除商品
  async deleteGood({ commit }, id) {
    const { data: res } = await reqDeleteGood(id)
    if (res.meta.status === 200) {
      return 'ok'
    }
  },
  // 添加商品
  async addGood({ commit }, info) {
    const { data: res } = await reqAddGoods(info)
    if (res.meta.status === 201) {
      return 'ok'
    }
  },
  // 编辑提交商品
  async updateGood({ commit }, goodInfo) {
    const { data: res } = await reqUpdateGood(goodInfo)
    console.log(res)
    if (res.meta.status === 201) {
      return 'ok'
    }
  }
}

const getters = {
  total: (state) => state.goodsListInfo.total,
  goodsList: (state) => state.goodsListInfo.goods
}
export default {
  state,
  mutations,
  actions,
  getters
}
