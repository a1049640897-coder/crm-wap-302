import store from '@/store'
import axios from 'axios'
import { Dialog, Notify, Toast } from 'vant'
import { handleColseLoading } from '@/plugin/msgAlert'
import router from '../../router/index'
let is503 = false

function transform(data) {
  return new Promise(resolve => {
    let fr = new FileReader()
    fr.onload = () => {
      resolve(JSON.parse(fr.result).msg || JSON.parse(fr.result).data)
    }
    fr.readAsText(data, ['utf-8'])
  })
}

// 重定向 登录 界面
function redirectLogin() {
  Dialog.alert({
    title: '确认操作',
    message: store.getters.authorization ? '当前用户登录时间超时，请重新登录' : '您还未登录，请先登录',
  }).then(() => {
    store.dispatch('common/user/out')
  })
}

// 记录和显示错误
function errorLog(err, status) {
  if (status === 201) {
    Notify({ type: 'warning', message: err.message });
  } else if (status === 202) {
    Notify({ type: 'danger', message: err.message });
  } else {
    Toast.fail(err.message)
  }
  handleColseLoading()
}

// 创建一个 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API,
  timeout: 10000 // 请求超时时间
  // onUploadProgress: p => { return 100 * (p.loaded / p.total) },
  // onDownloadProgress: p => { return 100 * (p.loaded / p.total) }
})
// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在请求发送之前做一些处理
    const { authorization, currentSystem, isSafing } = store.getters
    if (isSafing && !config.safingPass) throw new Error('维护中！！！拒绝请求!')
    config.headers['authorization'] = authorization
    if (config.headers.reqCurrentSysId) {
      config.headers['joineast-system-id'] = config.headers.reqCurrentSysId
    } else {
      config.headers['joineast-system-id'] = currentSystem ? currentSystem.id : 1
    }
    config.headers['joineast-request-path'] = window.location.hash.substr(1)
    if (['development', 'test', 'sim'].includes(process.env.NODE_ENV)) {
      const AXIOS_JOINEAST_TARGET = window.localStorage.getItem('AXIOS_JOINEAST_TARGET')
      if (AXIOS_JOINEAST_TARGET && AXIOS_JOINEAST_TARGET != 'all') {
        config.headers['joineast-target'] = AXIOS_JOINEAST_TARGET
      }
    }
    return config
  },
  error => {
    // 发送失败
    Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    // dataAxios 是 axios 返回数据中的 data
    const dataAxios = response.data
    // 这个状态码是和后端约定的
    const code = dataAxios.status
    // 这个状态是 下载的
    let isDownLoad = false
    let isCount = false
    if (response.config.config && response.config.config.isDownLoad) {
      isDownLoad = response.config.config.isDownLoad
    }
    if (response.config.config && response.config.config.count) {
      isCount = response.config.config.count
    }
    if (isDownLoad) {
      return dataAxios
    }
    if (isCount) {
      return response
    } else {
      // 根据 code 进行判断
      if (code === undefined) {
        // 如果没有 code 代表这不是项目后端开发的接口 比如可能是 D2Admin 请求最新版本
        return dataAxios
      } else {
        if (code === 200) {
          return dataAxios
        } else if (code === 201) {
          errorLog({ message: dataAxios.msg }, 201)
          return Promise.reject(dataAxios)
        } else if (code === 202) {
          errorLog({ message: dataAxios.msg }, 202)
          return Promise.reject(dataAxios)
        }
      }
    }
  },
  async error => {
    if (error && error.response) {
      switch (error.response.status) {
      case 400:
        error.message = '状态码：400，请求错误'
        break
      case 401:
        error.message = '状态码：401，鉴权失败，请联系管理员'
        if (store.getters.isSafing) return
        // 仅供开发者使用
        // if (process.env.NODE_ENV === 'development') {
        //   store.dispatch('common/user/out')
        // }
        redirectLogin()

        break
      case 403:
        error.message = '状态码：403，拒绝访问'
        if (store.getters.isSafing) return
        // 仅供开发者使用
        // if (process.env.NODE_ENV === 'development') {
        //   store.dispatch('common/user/out')
        // } else {
          redirectLogin()
        // }
        break
      case 404:
        error.message =
          `状态码：404，错误信息：${error.response.data.msg}, 请求地址出错: ${error.response.config.url}`
        break
      case 408:
        error.message = '状态码：408，请求超时'
        break
      case 415:
        error.message =
          `状态码：415，错误信息：${error.response.data.msg}, 请求地址出错: ${error.response.config.url}`
        break
      case 500:
        error.message =
        `状态码：500，错误信息：${error.response.data.message || error.response.data.msg}, 请求地址出错: ${error.response.config.url}`
        // error.message = error.response.data.msg ? error.response.data.msg : '状态码：500，服务器内部错误'
        break
      case 501:
        error.message = '状态码：501，服务未实现'
        break
      case 502:
        error.message = '状态码：502，网关错误'
        break
      case 503:
        if (error.response.config.responseType === 'blob') {
          await transform(error.response.data).then(res => {
            error.message = res
          })
        } else {
          error.message = error.response.data.msg ? error.response.data.msg : '状态码：503，服务不可用'
        }
        if (is503) return
        is503 = true
        router.push({ path: '/503', query: { redirect: window.location.hash.substr(2) } })
        // store.dispatch('common/user/errOut')
        break
      case 504:
        error.message = '状态码：504，网关超时'
        break
      case 505:
        error.message = '状态码：505，HTTP版本不受支持'
        break
      default:
        break
      }
    } else if (error && error.stack.indexOf('timeout') > -1) {
      error.message = `请求超时（${error.request.timeout}ms），请重试！`
    }
    if (!store.getters.isSafing) errorLog(error)
    return Promise.reject(error)
  }
)

export default service