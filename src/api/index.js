import request from "./ajax";

// 登录验证接口  login  post
export const reqLogin = (data)=>request({url:'login',method:'post',data})