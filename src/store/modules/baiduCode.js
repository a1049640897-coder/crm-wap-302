import {
  getBaiduCodeApi
} from '@/api/common'

export default {
  namespaced: true,
  state: {
    baiduCode: ''
  },
  // mutations: {
  //   SET_CODES(state, val) {
  //     state.baiduCode = val
  //     // window.localStorage.setItem('baiduCode', state.baiduCode.baiduCodePc ? state.baiduCode.baiduCodePc : '')
  //   }
  // },
  actions: {
    getBaiduCode() {
      getBaiduCodeApi().then(res => {
        if (res.data.baiduCodeWap) {
          var _hmt = _hmt || [];
          (function () {
            var hm = document.createElement("script")
            hm.src = "https://hm.baidu.com/hm.js?" + res.data.baiduCodeWap
            // hm.src = "https://hm.baidu.com/hm.js?81de61ebdff46e2e865e13f6eaa1a5a5";
            var s = document.getElementsByTagName("script")[0]
            s.parentNode.insertBefore(hm, s)
          })()
        }
      })
    }
  }
}