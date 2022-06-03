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

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 注册富文本编辑器
Vue.use(VueQuillEditor)

Vue.component(Crumbs.name, Crumbs)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
