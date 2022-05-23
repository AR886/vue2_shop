const routes = [
  // 路由重定向
  {path:'/',redirect:'/login'},
  // 登录模块
  {path:'/login',component:() =>import('@/views/login')},
  // 首页模块
  {path:'/home',component:() =>import('@/views/home')}
]

export default routes