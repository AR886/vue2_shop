import Vue from 'vue'
import VueRouter from 'vue-router'

// 引入路由规则
import routes from './routes'

Vue.use(VueRouter)


const router = new VueRouter({
  routes
})

// 路由前置守卫
router.beforeEach((to,from,next)=>{
  // 判断 有无token
  if(to.path === '/login'){
    next()
  }else{
    // 获取token
    const token = sessionStorage.getItem('TOKEN')
    if(token){
      next()
    }else{
      next('/login')
    }
  }
})
export default router
