import {
  Dialog
} from 'vant'
import {
  setLocalStorage
} from '@/utils'

export default {
  namespaced: true,
  state: {
    list: [{
        id: 1,
        title: '聚创管理系统',
        mobile: '15880214631',
        pwd: '15880214631',
        path: '/erp/'
      },
      {
        id: 3,
        title: '教招管理系统',
        mobile: '18050076763',
        pwd: '18050076763',
        path: '/erp/'
      },
      {
        id: 97,
        title: '学考管理系统',
        mobile: '15880214631',
        pwd: '15880214631',
        path: '/erp/'
      },
      {
        id: 98,
        title: '信息中心管理系统',
        mobile: '15880214631',
        pwd: '15880214631',
        path: '/erp/'
      },
      {
        id: 66,
        title: '资格证管理系统',
        mobile: '15880214631',
        pwd: '15880214631',
        path: '/erp/'
      },
      {
        id: 74,
        title: '辅导员管理系统',
        mobile: '15880214631',
        pwd: '15880214631',
        path: '/erp/'
      },
      {
        id: 76,
        title: '聚创专插本系统',
        mobile: '15880214631',
        pwd: '15880214631',
        path: '/erp/'
      },
      {
        id: 77,
        title: '中创专升本系统',
        mobile: '15880214631',
        pwd: '15880214631',
        path: '/erp/'
      },
      {
        id: 22,
        title: '优公管理系统',
        mobile: '15880214631',
        pwd: '15880214631',
        path: '/erp/'
      },
      {
        id: 47,
        title: '网校管理系统',
        mobile: '15880214631',
        pwd: '15880214631',
        path: '/erp/'
      },
      {
        id: 48,
        title: '在职管理系统',
        mobile: '15880214631',
        pwd: '15880214631',
        path: '/erp/'
      },
      {
        id: 49,
        title: '专升本管理系统',
        mobile: '15880214631',
        pwd: '15880214631',
        path: '/erp/'
      },
      {
        id: 62,
        title: '宏医管理系统',
        mobile: '15880214631',
        pwd: '15880214631',
        path: '/erp/'
      },
      {
        id: 93,
        title: '宏医医疗管理',
        mobile: '15880214631',
        pwd: '15880214631',
        path: '/erp/'
      },
      {
        id: 50,
        title: '学历管理系统',
        mobile: '18876411460',
        pwd: '18876411460',
        path: '/erp/'
      },
      {
        id: 68,
        title: '中创管理系统',
        mobile: '15880214631',
        pwd: '15880214631',
        path: '/erp/'
      },
      {
        id: 69,
        title: '考研总部管理系统',
        mobile: '15880214631',
        pwd: '15880214631',
        path: '/erp/'
      },
      {
        id: 70,
        title: '教招总部管理系统',
        mobile: '15880214631',
        pwd: '15880214631',
        path: '/erp/'
      }
    ],
    devUserList: [{
        id: 'all',
        title: '全部'
      },
      {
        id: 'cql',
        title: '陈清兰'
      },
      {
        id: 'htd',
        title: '黄腾达'
      },
      {
        id: 'wzc',
        title: '王自成'
      },
      {
        id: 'zzl',
        title: '张泽林'
      },
      {
        id: 'zxy',
        title: '钟小禹'
      }
    ],
    isSafing: false,
    currentSystem: {}
  },
  mutations: {
    SET_ISSAFING: (state, val) => {
      state.isSafing = val
    },
    SET_CURRENTSYSTEM(state, currentSystem) {
      state.currentSystem = currentSystem
      setLocalStorage('currentSystem', JSON.stringify(currentSystem))
    },

    DESTORY_STATE(state) {
      // state.systemList = new Array(0)
      state.currentSystem = {}
    }
  },
  actions: {
    setSafe({ commit }, val) {
      return new Promise(resolve => {
        commit('SET_ISSAFING', val) // 开发用
        resolve()
      })
    },
    setCurrentSystem({
      commit,
      dispatch
    }, currentSystem) {
      if (currentSystem) {
        commit('SET_CURRENTSYSTEM', currentSystem)
      } else {
        Dialog.alert({
          title: '确认操作',
          message: '您还未登录，请先登录',
        }).then(() => {
          dispatch('common/user/out', null, {
            root: true
          })
        })
      }
    },


    destoryState({
      commit
    }) {
      commit('DESTORY_STATE')
    }
  }
}