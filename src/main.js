import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 引入全局演示表
import '@/assets/css/global.css'
import store from './store'

// 面包屑
import Crumbs from '@/components/crumbs.vue'
// 引入阿里图标库
import '@/assets/iconfont/iconfont.css'

Vue.component(Crumbs.name, Crumbs)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
