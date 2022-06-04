import Vue from 'vue'
import Vuex from 'vuex'

import Login from './login'
import Home from './home'
import Roles from './roles'
import Goods from './goods'
import Orders from './order'
import Reports from './reports'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    Login,
    Home,
    Roles,
    Goods,
    Orders,
    Reports
  }
})
