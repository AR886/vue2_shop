import { reqOrderList } from '@/api'
import dayjs from 'dayjs'
const state = {
  orderList: {}
}
const mutations = {
  GETORDERLIST(state, orderList) {
    state.orderList = orderList
  }
}
const actions = {
  async getOrderList({ commit }, data) {
    const { data: res } = await reqOrderList(data)
    if (res.meta.status === 200) {
      res.data.goods.forEach((item) => {
        item.create_time = dayjs(item.create_time).format('YYYY-MM-DD HH:mm:ss')
      })
      commit('GETORDERLIST', res.data)
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
