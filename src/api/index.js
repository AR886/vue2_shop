import request from './ajax'

// 登录验证接口  login  post
export const reqLogin = (data) => request({ url: 'login', method: 'post', data })

// 左侧菜单权限  menus  get
export const reqLeftMenus = () => request({ url: 'menus', method: 'get' })

//  用户数据列表  users get
export const reqUserList = (data) => request({ url: `users`, method: 'get', params: data })

//  修改用户状态  users/:uId/state/:type  put
export const reqUpdateUserState = ({ uId, type }) => request({ url: `users/${uId}/state/${type}`, method: 'put' })

//  添加用户  users   post
export const reqAddUser = (data) => request({ url: 'users', method: 'post', data })

//  编辑用户提交  users/:id  put
export const reqUpdateUser = ({ id, email, mobile }) => request({ url: `users/${id}`, method: 'put', data: { email, mobile } })

//  删除单个用户  users/:id  delete
export const reqDeleteUser = (id) => request({ url: `users/${id}`, method: 'delete' })
