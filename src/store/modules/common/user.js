import { removeAccessToken, getLocalStorage, setLocalStorage } from '@/utils'
import { getUserInfo } from '@/api/login'
import { authDepartListApi, authAreaListApi } from '@/api/common'
import { yuYueZixunDepartApi } from '@/api/potentialGuest/consultation'
import router from '@/router'

export default {
  namespaced: true,
  state: {
    info: {},
    authorization: '',
    isOutLimit: false,
    authDepartList: [],
    authAreaList: [],
    nowAuthDepartList: []
  },
  mutations: {
    SET_AUTHORIZATION(state, authorization) {
      state.authorization = authorization
    },

    SET_ISOUTLIMIT: (state, isOutLimit) => {
      state.isOutLimit = isOutLimit
    },

    DESTORY_AUTHORIZATION: (state) => {
      state.authorization = null
      state.info = {}
    },
    SET_USERINFO: (state, info) => {
      state.info = info || {}
    },
    SET_AUTHCASCADELIST: (state, list) => {
      state.authDepartList = list
    },
    SET_AUTHAREALIST: (state, list) => {
      state.authAreaList = list
    },
    SET_NOWAUTHAREALIST: (state, list) => {
      state.nowAuthDepartList = list
    },
  },
  actions: {
    /**
     * @description 设置 登录令牌
     * @param {String} authorization vuex authorization
     */

    setAuthorization({ commit }, authorization) {
      commit('SET_AUTHORIZATION', authorization)
    },

    // 限制登出操作
    outLimit({ commit }) {
      commit('SET_ISOUTLIMIT', JSON.parse(window.localStorage.getItem('isOutLimit')))
    },


    // /**
    //  * @description 注销用户并返回登录页面
    //  * @param {Object} param context
    //  * @param {Object} param vm {Object} vue 实例
    //  * @param {Object} param confirm {Boolean} 是否需要确认
    //  */
    //  logout({ commit, dispatch }, { vm, confirm = false }) {
    //   // 判断是否需要确认
    //   if (confirm) {
    //     commit('d2admin/gray/set', true, { root: true })
    //     vm.$confirm('注销当前账户吗?', '确认操作', {
    //       confirmButtonText: '确定注销',
    //       cancelButtonText: '放弃',
    //       type: 'warning'
    //     }).then(() => {
    //       commit('d2admin/gray/set', false, { root: true })
    //       dispatch('out')
    //     }).catch(() => {
    //       commit('d2admin/gray/set', false, { root: true })
    //       vm.$message('放弃注销用户')
    //     })
    //   } else {
    //     dispatch('out')
    //   }
    // },

    removeAccessToken({ commit }) {
      commit('DESTORY_AUTHORIZATION')
    },
    /**
     * @description 注销
     */
    // eslint-disable-next-line
    async out({ state, commit, dispatch, getters, rootGetters }) {
      await commit('DESTORY_AUTHORIZATION', null)
      await dispatch('common/systems/destoryState', null, { root: true })
      removeAccessToken().then(() => {
        if (rootGetters.isSafing) return
        if (['development', 'test', 'sim'].includes(process.env.NODE_ENV)) {
          router.push({ name: 'Login' })
        } else {
          if (rootGetters.isOutLimit) {
            window.location.href = '../../autoLogin'
          } else {
            window.location.href = '../../login'
          }
        }
      })
    },


    /**
     * @description 登录
     * @param {Object} param context
     * @param {Object} param vm {Object} vue 实例
     * @param {Object} param username {String} 用户账号
     * @param {Object} param password {String} 密码
     * @param {Object} param route {Object} 登录成功后定向的路由对象 任何 vue-router 支持的格式
     */
    login({ dispatch, commit }, data) {
      return new Promise((resolve, reject) => {
        getLocalStorage('accessToken').then(async res => {
          if (!res) {
            reject(new Error('token不存在，请重新登录'))
            dispatch('out')
            return
          }
          commit('SET_AUTHORIZATION', res)
          await getLocalStorage('currentSystem').then(res => {
            if (process.env.NODE_ENV === 'development') {
              dispatch('common/systems/setCurrentSystem', data.currentSystemObj, { root: true }).catch(str => {
                reject(str)
              })
            } else {
              dispatch('common/systems/setCurrentSystem', JSON.parse(res), { root: true }).catch(str => {
                reject(str)
              })
            }
          })
          await getUserInfo().then(res => {
            if (!res) {
              reject(new Error('获取个人信息失败'))
              if (['development', 'test', 'sim'].includes(process.env.NODE_ENV)) {
                dispatch('out')
              }
              return
            }
            setLocalStorage('userInfo', JSON.stringify(res.data))
            commit('SET_USERINFO', res.data)
            resolve()
          }).catch(res => {
            reject(res.response.status)
          })

          // 权限部门
          authDepartListApi().then(res => {
            let arr = res.data || []
            commit('SET_AUTHCASCADELIST', arr.map(item => {
              return {
                ...item,
                children: []
              }
            }))
          })
          // 今日活动部门
          yuYueZixunDepartApi().then(res => {
            let arr = res.data || []
            commit('SET_NOWAUTHAREALIST', arr.map(item => {
              return {
                ...item,
                children: []
              }
            }))
          })

          // 权限市场区域
          authAreaListApi().then(res => {
            commit('SET_AUTHAREALIST', res.data || [])
          })

        }).catch(() => {
          throw new Error('无localSystem信息')
        })
      })
    },

    // errOut({ dispatch }) {
    //   dispatch('d2admin/systems/setSafe', true, { root: true }).then(() => {
    //     setTimeout(() => {
    //       router.push({ path: '/503' })
    //     }, 300)
    //   })
    // }
  }
}
