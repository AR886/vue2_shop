const routes = [
  // 路由重定向
  { path: '/', redirect: '/login' },
  // 登录模块
  { path: '/login', component: () => import('@/views/login') },
  // 首页模块
  {
    path: '/users',
    component: () => import('@/views/home'),
    redirect: '/users/manage',
    children: [
      // 首页
      { path: 'manage', component: () => import('@/views/home/welcome') },
      // 用户列表
      { path: 'users', component: () => import('@/views/home/userList') }
    ]
  }
]

export default routes
