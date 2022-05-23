import { reqLogin } from '@/api'

const  state = {
  info:{}
}
const mutations = {
  LOGIN(state,info){
    state.info = info
  }
}
const actions = {
  async login({commit},data){
    const {data:res} = await reqLogin(data) 
    if(res.meta.status === 200){
      commit('LOGIN',res.data)
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
