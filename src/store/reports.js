import { reqTimeLineCharts } from '@/api'
const state = {
  timeLineCharts: {}
}
const mutations = {
  GETTIMELINECHARTS(state, timeLineCharts) {
    state.timeLineCharts = timeLineCharts
  }
}
const actions = {
  async getTimeLineCharts({ commit }) {
    const { data: res } = await reqTimeLineCharts()
    console.log(res)
    if (res.meta.status === 200) {
      commit('GETTIMELINECHARTS', res.data)
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
