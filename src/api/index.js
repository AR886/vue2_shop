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

//  所有权限列表  rights/:type  get  type类型值 list 或 tree , list 列表显示权限, tree 树状显示权限,`参数是url参数:type`
export const reqListPowerList = () => request({ url: `rights/list`, method: 'get' })
export const reqTreePowerList = () => request({ url: `rights/tree`, method: 'get' })

//  角色列表  roles  get
export const reqRolesList = () => request({ url: 'roles', method: 'get' })

// 添加角色  roles  post
export const reqAddRole = (data) => request({ url: 'roles', method: 'post', data })

// ### 编辑提交角色    roles/:id  put
export const reqUpdateRoleUser = ({ id, roleName, roleDesc }) => request({ url: `roles/${id}`, method: 'put', data: { roleName, roleDesc } })

//  删除角色    roles/:id  delete
export const reqDeleteRoleUser = (id) => request({ url: `roles/${id}`, method: 'delete' })

// 删除角色指定权限   roles/:roleId/rights/:rightId  delete
export const reqDeleteUserRole = ({ roleId, rightId }) => request({ url: `roles/${roleId}/rights/${rightId}`, method: 'delete' })

// 角色授权   roles/:roleId/rights  post
export const reqSubmitPower = ({ roleId, rids }) => request({ url: `roles/${roleId}/rights`, method: 'post', data: { rids } })

//  分配用户角色  users/:id/role  put
export const reqSetUserRole = ({ id, rid }) => request({ url: `users/${id}/role`, method: 'put', data: { rid } })

//  商品分类数据列表  categories  get
export const reqCategoriesList = (queryInfo) => request({ url: 'categories', method: 'get', params: queryInfo })

// 添加分类  categories post
export const reqAddCategories = (data) => request({ url: 'categories', method: 'post', data })

// 编辑提交分类 categories/:id put
export const reqUpdateCategories = ({ id, cat_name }) => request({ url: `categories/${id}`, method: 'put', data: { cat_name } })

//  删除分类  categories/:id  delete
export const reqDeleteCategories = (id) => request({ url: `categories/${id}`, method: 'delete' })

// 获取参数列表  categories/:id/attributes  get  sel通过 only 或 many 来获取分类静态参数还是动态参数
export const reqParamsOrAttrList = ({ id, sel }) => request({ url: `categories/${id}/attributes`, method: 'get', params: { sel } })

// 添加动态参数或者静态属性  categories/:id/attributes post
export const reqAddParamsOrAttr = ({ id, attr_name, attr_sel, attr_vals }) => request({ url: `categories/${id}/attributes`, method: 'post', data: { attr_name, attr_sel, attr_vals } })

// 编辑提交参数 categories/:id/attributes/:attrId  put
export const reqUpdateParamsOrAttr = ({ id, attrId, attr_name, attr_sel, attr_vals }) => request({ url: `categories/${id}/attributes/${attrId}`, method: 'put', data: { attr_name, attr_sel, attr_vals } })

// 删除参数  categories/:id/attributes/:attrid  delete
export const reqDeleteParamsOrAttr = ({ id, attrid }) => request({ url: `categories/${id}/attributes/${attrid}`, method: 'delete' })

//  商品列表数据  goods  get
export const reqGoods = ({ query, pagenum, pagesize }) => request({ url: 'goods', method: 'get', params: { query, pagenum, pagesize } })

// 删除商品  goods/:id  delete
export const reqDeleteGood = (id) => request({ url: `goods/${id}`, method: 'delete' })

//   添加商品  goods  post
export const reqAddGoods = (data) => request({ url: 'goods', method: 'post', data })
