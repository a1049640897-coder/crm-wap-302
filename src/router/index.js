import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index'
import NProgress from 'nprogress'
import { getLocalStorage } from '@/utils'
import { frameInRoutes, frameOutRoutes } from './routes'
import * as dd from "dingtalk-jsapi"

Vue.use(VueRouter)

const routes = [...frameInRoutes, ...frameOutRoutes]
const outRoutesName = frameOutRoutes.map(item => decodeURIComponent(item.name))

const router = new VueRouter({
  routes
})
let isFetchPermissionInfo = false
const fetchPermissionInfo = async () => {
  let obj = {}
  if (['development', 'test', 'sim'].includes(process.env.NODE_ENV)) {
    await getLocalStorage('currentSystem').then(res => {
      obj = { currentSystemObj: JSON.parse(res) }
    })
  }
  await store.dispatch('common/user/login', obj).then(async () => {
    await store.dispatch('common/setting/getSystem')
    await store.dispatch('common/setting/getAllProvice')
    await store.dispatch('common/setting/configDetail')
    await store.dispatch('common/setting/searchoptionList')
    await store.dispatch('common/permission/getUserBtns')
    await store.dispatch('common/user/outLimit')
    await store.dispatch('common/setting/getAllMenu')
    await store.dispatch('baiduCode/getBaiduCode')
  })
}
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  if (store.getters.isSafing || outRoutesName.includes(to.name)) {
    next()
  } else {
    if (!isFetchPermissionInfo) {
      await fetchPermissionInfo()
      isFetchPermissionInfo = true
      next(to.path, true)
    } else {
      next()
    }
  }
})

router.afterEach((to) => {
  const documentTitle = to.meta.title
  if (store.state.common.setting.isDingTalk) {
    dd.ready(() => {
      dd.biz.navigation.setTitle({ title: documentTitle });
    });
  } else {
    document.title = documentTitle
  }
  NProgress.done()
})

export default router
