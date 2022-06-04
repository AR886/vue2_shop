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
  },
  // 商品管理模块
  {
    path: '/goods',
    component: () => import('@/views/home'),
    children: [
      // 商品分类
      { path: 'categories', component: () => import('@/views/goods/categories') },
      // 参数分类
      { path: 'params', component: () => import('@/views/goods/params') },
      // 商品列表
      { path: 'goods', component: () => import('@/views/goods/list') },
      // 添加商品
      { path: 'add', component: () => import('@/views/goods/addGood') }
    ]
  },
  // 订单管理模块
  {
    path: '/orders',
    component: () => import('@/views/home'),
    children: [
      // 订单列表
      { path: 'orders', component: () => import('@/views/order/orderList') }
    ]
  },
  // 数据统计模块
  {
    path: '/reports',
    component: () => import('@/views/home'),
    children: [
      // 数据报表
      { path: 'reports', component: () => import('@/views/reports/reports') }
    ]
  }
]

export default routes
