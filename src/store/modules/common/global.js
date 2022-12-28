
import Vue from "vue"
import { authorityTreeApi } from '@/api/common'
export default {
  namespaced: true,
  state: {
    tabDefaultActived: 0, // 活动默认的选中的tab
    cascadeShellList: [],
    roleFlagList: [
      {
        value: 1,
        label: '咨询'
      }, {
        value: 2,
        label: '市场'
      }, {
        value: 3,
        label: '教务'
      }, {
        value: 4,
        label: '讲师'
      }, {
        value: 0,
        label: '其他'
      }
    ],
    activityId: null, // 刷新列表的活动id
  },
  actions: {
    setAuthorityTree({ commit }) {
      authorityTreeApi().then(res => {
        commit('SET_ISHASDEPARTMENT2', res.data)
      })
    }
  },
  mutations: {
    // 设置活动默认的tab
    SET_ACTIVE_DEFAULT_TAB(state, payload) {
      const { title, route, isShow } = payload
      state.columnBarList[2].title = title
      state.columnBarList[2].route = route
      state.columnBarList[2].isShow = isShow
      // Vue.set(state.columnBarList)
    },
    SET_ISHASDEPARTMENT2(state, data) {
      state.cascadeShellList = data || []
    },
    SET_ACTIVITYID(state, payload) {
      const { activityId } = payload
      state.activityId = activityId
    }
  },

}