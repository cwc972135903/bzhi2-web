/*
 * @Descripttion: 请求axios封装
 * @version: 
 * @Author: wenchao.chai
 * @Date: 2019-04-02 09:34:12
 * @LastEditors: wenchao.chai
 * @LastEditTime: 2020-06-05 09:13:22
 */

import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: window.env.VUE_APP_BASE_API_BZHI2_ENTIRE, //process.env.VUE_APP_BASE_API_BZHI2_ENTIRE,// process.env.VUE_APP_BASE_API_BZHI2, // api 的 base_url
  withCredentials: true, // 跨域请求时发送 cookies
  timeout: 500000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    if (store.getters.token) {
      // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
      config.headers['token'] = getToken() || ""
    }
    return config
  },
  error => {
    // debugger
    // Do something with request error
    // eslint-disable-next-line no-console
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get information such as headers or status
   * Please return  response => response
  */
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过 XMLHttpRequest 来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自身需求加以修改，若不需要，则可删除
   */
  response => { 
    const res = response.data
    if (response.data && !response.data.code) {
      //未封装过的httpResponse
      if (response.status != 200) {
        return Promise.reject(response)
      }else{
         return response
      }
    }
    if (res.code !== 200 && res.code != 20000) { 
       //错误提示 让最外层自己捕获进行处理
      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014 || res.code == 401) { 
        // 请自行在引入 MessageBox
        // import { Message, MessageBox } from 'element-ui'
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => { 
            location.reload() // 为了重新实例化vue-router对象 避免bug
          }).catch(error=>{
            // eslint-disable-next-line no-debugger
            debugger
          })
        })
      } 
      return Promise.reject(res.message||res.msg)
    } else {  
      if (res.code == 200 || res.code == 20000) {
         return res
      } 
    }
  },
  error => {  
    Message({
      message: error.message||error.msg,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
