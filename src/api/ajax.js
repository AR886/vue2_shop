import axios from "axios";

// 引入进度条
import nprogress from "nprogress";
import 'nprogress/nprogress.css'

// 创建实例对象
const request = axios.create({
  baseURL:'http://127.0.0.1:8888/api/private/v1/'
})

// 请求拦截器
request.interceptors.request.use((config) =>{
  // 开启进度条
  nprogress.start()

  // 返回
  return config
})

// 响应拦截器
request.interceptors.response.use((resolve) =>{
  // 进度条结束
  nprogress.done()
  return resolve
},(error) =>{
  return Promise.reject(error)
})

export default request