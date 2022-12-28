import store from '@/store'

export default {
  async install(Vue) {
    Vue.directive('permission', {
      inserted: function(el, binding) {
        let isAdmin = store.getters.isAdmin
        if (isAdmin) {
          return
        }
        if (!store.getters.permission_btns.includes(binding.value)) {
          el.parentNode.removeChild(el)
        }
      }
    })
    Vue.directive('else-permission', {
      inserted: function(el, binding) {
        let isAdmin = store.getters.isAdmin
        if (isAdmin) {
          el.parentNode.removeChild(el)
        }
        if (store.getters.permission_btns.includes(binding.value)) {
          el.parentNode.removeChild(el)
        }
      }
    })
  }
}