import Vue from 'vue'
import Vuex from 'vuex'

import Login from './login'
import Home from './home'
import Roles from './roles'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    Login,
    Home,
    Roles
  }
})
