import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
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

    // 如果header返回的content-type不是application/json则下载
    if (response.headers['content-type'] != 'application/json') {
      // console.log(window.decodeURI(response.headers['content-disposition'].split('=')[2].replace('utf-8\'\'', ''), "UTF-8"));
      let blob = new Blob([res], { type: 'application/vnd.ms-excel;charset=utf-8' }) // 将服务端返回的文件流（二进制）excel文件转化为blob
      let fileName = window.decodeURI(response.headers['content-disposition'].split('=')[2].replace('utf-8\'\'', ''), "UTF-8");
      //浏览器兼容写法
      if (window.navigator && window.navigator.msSaveOrOpenBlob) { // IE
        window.navigator.msSaveOrOpenBlob(blob, fileName)
      } else {
        let objectUrl = (window.URL || window.webkitURL).createObjectURL(blob)
        let downFile = document.createElement('a')
        downFile.style.display = 'none'
        downFile.href = objectUrl
        downFile.download = fileName // 下载后文件名
        document.body.appendChild(downFile)
        downFile.click()
        document.body.removeChild(downFile) // 下载完成移除元素
        window.URL.revokeObjectURL(objectUrl)   // 只要映射存在，Blob就不能进行垃圾回收，因此一旦不再需要引用，就必须小心撤销URL，释放掉blob对象。
      }
      return res;
    }

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.msg,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
