// 封装axios
// 实例化  请求拦截器 响应拦截器
import { message } from 'antd'
import axios from 'axios'
import { getToken } from './token'
import { history } from './history'

const http = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 5000
})
new Promise((reslove,reject)=>{
  console.log("2")
})
let canSendMessage = true;

// 添加请求拦截器
http.interceptors.request.use((config) => {
  // if not login add token
  const token = getToken()
  if (token) {
    config.headers.Authorization = `${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// 添加响应拦截器
http.interceptors.response.use((response) => {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么

  return response.data
}, (error) => {
  if (error.response) {
    const { status, data } = error.response
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    if (canSendMessage) {
      message.error((data && data.message) || '登录信息过期或未授权，请重新登录！');
      canSendMessage = false;
      setTimeout(() => {
        canSendMessage = true;
      }, 5000);
    
      history.push('/handle/NoAuthorization')
    }
  } else {
    message.error('连接错误!')
  }
  return Promise.reject(error)
})

export { http }
