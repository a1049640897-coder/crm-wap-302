import { getUserBtnsList } from '@/api/login'

export default {
  namespaced: true,
  state: {
    // 按钮权限
    btns: [],
    // 角色编码
    roles: [],
    // 是否管理员
    isAdmin: false
  },
  mutations: {
    SET_BTNS(state, btns) {
      state.btns = btns
    }
  },
  actions: {
    async getUserBtns({ state, commit, dispatch, getters, rootGetters }) {
      // return new Promise(resolve => {
        await getUserBtnsList().then(res => {
          commit('SET_BTNS', res.data)
        //   resolve()
        // }).catch(res => {
        //   console.log(res)
        // })
      })
    }
  }
}