import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant'
import VConsole from "vconsole"
import { setLocalStorage, compressFile } from '@/utils'
import msgAlert from './plugin/msgAlert'
import pluginPermission from '@/plugin/permission'
import 'vant/lib/index.css'
import 'nprogress/nprogress.css'
Vue.use(Vant);
Vue.use(msgAlert)
Vue.use(pluginPermission)
if (window.location.href.indexOf('localhost') === -1 && window.location.href.indexOf('www.joineast.com') === -1) {
  new VConsole()
}

Vue.prototype.$EventBus = new Vue() // 注册全局EventBus
Vue.prototype.$compressFile = compressFile

new Vue({
  router,
  store,
  render: h => h(App),
  created() {
    // Vue.prototype.$EventBus = this
    const isDD = this.$dd.env.platform !== "notInDingTalk"
    store.dispatch('common/setting/setDingTalk', isDD)
    setLocalStorage('isDD', isDD)
    if (isDD) {
      this.$dd.ui.webViewBounce.disable()
    }
    if (['development', 'test', 'sim'].includes(process.env.NODE_ENV)) {
      console.log(`%c当前环境::%c${process.env.VUE_APP_ENVIRONMENT_TITLE}`, 'color: #0088fe;', 'color: #67C23A;')
      console.log(`%c当前联调地址::${process.env.VUE_APP_APIURL}`, 'color: #0088fe;')
      console.log(`%c当前已连接到%c${window.localStorage.getItem('AXIOS_JOINEAST_TARGET_TITLE') || '全部'}%c的电脑`, 'color: #0088fe;', 'color: #67C23A;', 'color: #0088fe;')
    }
  }
}).$mount('#app')
