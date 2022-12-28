import { Toast } from 'vant'
import * as dd from 'dingtalk-jsapi'

Toast.allowMultiple()
let slotLoading = {}

export const handleColseLoading = (el) => {
  slotLoading[el] && slotLoading[el].clear()
  // if (el) slotLoading[el].clear()
  // else {
  //   Object.keys(slotLoading).forEach(item => {
  //     slotLoading[item].clear()
  //   })
  // }
}

export default {
  install(Vue) {
    /**
     * 加载提示器
     * @param {Boolean} isLoading 打开或关闭加载提示
     * @param {String} el 是否需要多个loading
     * @returns 
     */
    Vue.prototype.$loading = function (isLoading, el = 'global') {
      return new Promise(resolve => {
        if (isLoading) {
          // console.log('开启', el)
          slotLoading[el] = Toast.loading({
            message: '加载中...',
            forbidClick: true,
            icon: require('@/assets/images/loading.gif'),
            duration: 0,
            className: 'slotLoading'
          })
        } else {
          // console.log('关闭', el)
          handleColseLoading(el)
          // slotLoading[el].clear()
        }
        resolve()
      })
    }
    // 成功轻提示
    Vue.prototype.$sm = function (msg) {
      return new Promise(resolve => {
        Toast.success({
          message: msg || '成功',
          forbidClick: true
        })
        resolve()
      })
    }
    // 失败轻提示
    Vue.prototype.$fm = function (msg) {
      return new Promise(resolve => {
        Toast.fail({
          message: msg || '失败',
          forbidClick: true
        })
        // Notification({
        //   title: '提示',
        //   message: val,
        //   duration: 1500,
        //   type: 'warning'
        // })
        resolve()
      })
    },
    Vue.prototype.$dd = dd
  }
}