import axios from 'axios'
// import { MessageBox, Message } from 'element-ui'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken, removeToken } from '@/utils/auth'

axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';


// create an axios instance
const service = axios.create({
  // baseURL: 'http://127.0.0.1:4523/mock/421382',
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers.token = getToken()
      // console.log(store.getters.token)
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // console.log(response)
    // if the custom code is not 200, it is judged as an error.
    if (res.status !== 200) {
      console.log(res)
      if(res.status == 403){
        Message({
          message: '登录已过期！请重新登录',
          type: 'error',
          duration: 5 * 1000,
        })
        removeToken()
      }
      else{
        Message({
          message: res.message || '出错了',
          type: 'error',
          duration: 5 * 1000,
        })
      }
      // else{
      //   Message({
      //     message: '登录已过期！请重新登录',
      //     type: 'error',
      //     duration: 5 * 1000,
      //   })
      //   removeToken()
      //   }
      // }
      return Promise.reject(new Error(res.message || 'Error'))
      // return res
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 10000
    })
    return Promise.reject(error)
  }
)

export default service