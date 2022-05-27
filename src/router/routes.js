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
  },
  // 权限管理模块
  {
    path: '/rights',
    component: () => import('@/views/home'),
    children: [
      // 角色列表
      { path: 'roles', component: () => import('@/views/power/roleList') },
      // 权限列表
      { path: 'rights', component: () => import('@/views/power/powerList') }
    ]
  }
]

export default routes
