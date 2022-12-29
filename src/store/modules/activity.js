import {
  getLecConditonApi,
  getLecbookConditonApi,
  getLecRivalConditonApi
} from '@/api/potentialGuest/activity'

export default {
  namespaced: true,
  state: {
    queryList: {
      methods: [], // 授课类型
      opponents: [], // 对手名称
      targets: [], // 针对对象
      teachers: [], // 讲师名称
      types: [], // 讲座类型
      dateTypeList: [
        {
          value: 1,
          text: '移交日期'
        },
        {
          value: 2,
          text: '报名日期'
        },
      ],
      waitNowTypeList: [{ title: '讲座', id: 1 }, { title: '活动', id: 3 }],
    },
    queryBookList: {
      methods: [], // 授课类型
      opponents: [], // 对手名称
      targets: [], // 针对对象
      teachers: [], // 讲师名称
      types: [] // 讲座类型
    },
    queryRivalList: {
      methods: [], // 授课类型
      opponents: [], // 对手名称
      targets: [], // 针对对象
      teachers: [], // 讲师名称
      types: [] // 讲座类型
    },
    tabDefaultActivedObj: {
      title: '添加讲座'
    }, // 活动默认的选中的tab
    isHandoverStateList: [
      {
        // 移交状态
        text: '待确认',
        value: 1
      },
      {
        text: '移交成功未分配',
        value: 9
      },
      {
        text: '移交成功未跟进',
        value: 2
      },
      {
        text: '移交失败',
        value: 3
      },
      {
        text: '移交成功已跟进',
        value: 4
      },
      {
        text: '移交成功已报低端班',
        value: 5
      },
      {
        text: '移交成功已报中端班',
        value: 6
      },
      {
        text: '移交成功已报高端班',
        value: 7
      },
      {
        text: '移交成功已报免费班',
        value: 8
      },
      {
        text: '移交成功未跟进',
        value: 10
      }
    ],
    isHandoverStateList1: [
      {
        // 待接收中的状态
        text: '待接收',
        value: 1
      },
      {
        text: '接收成功未分配',
        value: 9
      },
      {
        text: '接收成功未跟进',
        value: 2
      },
      {
        text: '接收失败',
        value: 3
      },
      {
        text: '接收成功已跟进',
        value: 4
      },
      {
        text: '接收成功已报低端班',
        value: 5
      },
      {
        text: '接收成功已报中端班',
        value: 6
      },
      {
        text: '接收成功已报高端班',
        value: 7
      },
      {
        text: '移交成功已报免费班',
        value: 8
      },
      {
        text: '接收成功未跟进',
        value: 10
      }
    ],
    isHandoverStateList2: [
      {
        text: '接收失败',
        value: 3
      },
      {
        text: '接收成功未分配',
        value: 9
      },
      {
        text: '接收成功未跟进',
        value: 2
      },
      {
        text: '接收成功已跟进',
        value: 4
      },
      {
        text: '接收成功已报低端班',
        value: 5
      },
      {
        text: '接收成功已报中端班',
        value: 6
      },
      {
        text: '接收成功已报高端班',
        value: 7
      },
      {
        text: '移交成功已报免费班',
        value: 8
      },
      {
        text: '接收成功未跟进',
        value: 10
      }
    ],
    activatyShellOptions: [],// 关联问卷的所属部门列表
    quesIsUpdate: false, // 活动详情问卷信息是否更新
    activityIsUpdate: false, // 活动列表编辑是否刷新
    quesConnectObj: {}, // 添加讲座/活动 保留关联问卷 调用弹窗
    quesConnectObjIsUpdate: false, // 关联问卷成功活动是否刷新
    activityIsAddUpdate: false, // 添加活动列表是否刷新
    isDetailsEnter: false, // 是否是详情进入编辑
    activityPartId: null, // 参与人员id
    activityPartIsUpdate: false, // 参与人员列表是否重新刷新
  },
  mutations: {
    SET_QUERYLIST(state, queryList) {
      state.queryList = {
        ...state.queryList,
        ...queryList,
      }
      state.queryList.types.unshift({ text: '全部', value: 5 })
      state.queryList.methods.unshift({ text: '全部', value: 5 })
      state.queryList.targets.unshift({ text: '全部', value: 5 })
    },

    SET_BOOK_QUERYLIST(state, queryList) {
      state.queryBookList = {
        ...state.queryBookList,
        ...queryList
      }
      state.queryBookList.types.unshift({ text: '全部', value: 5 })
      state.queryBookList.methods.unshift({ text: '全部', value: 5 })
      state.queryBookList.targets.unshift({ text: '全部', value: 5 })
    },

    SET_RIVAL_QUERYLIST(state, queryList) {
      state.queryRivalList = {
        ...state.queryRivalList,
        ...queryList
      }
      state.queryRivalList.types.unshift({ text: '全部', value: 5 })
      state.queryRivalList.methods.unshift({ text: '全部', value: 5 })
      state.queryRivalList.targets.unshift({ text: '全部', value: 5 })
    },

    // 设置活动默认的tab
    SET_ACTIVE_DEFAULT_TAB(state, payload) {
      state.tabDefaultActived = payload
    },

    // 设置关联问卷所属部门的列表 
    SAVE_SHELL_OPTIONS(state, data) {
      state.activatyShellOptions = data
    },

    // 问卷信息更新
    SET_QUESISUPDATE(state) {
      state.quesIsUpdate = !state.quesIsUpdate
    },

    // 活动编辑列表更新
    SET_ACTIVITYSTATE(state) {
      state.activityIsUpdate = !state.activityIsUpdate
    },

    // 活动添加列表更新
    SET_ACTIVITYADDSTATE(state) {
      state.activityIsAddUpdate = !state.activityIsAddUpdate
    },


    // 设置活动列表二维码弹窗的对象
    SET_QUESOBJ(state, payload) {
      const { quesConnectObjIsUpdate } = payload
      state.quesConnectObjIsUpdate = quesConnectObjIsUpdate
      state.quesConnectObj = payload
      console.log('二维码关联的对象...', payload);
    },

    // 设置从详情进入编辑
    SET_DETAILFLAG(state, payload) {
      const { flag } = payload
      state.isDetailsEnter = flag
    },

    // 设置参与人员id
    SET_PARTACTID(state, payload) {
      const { activityPartId } = payload
      console.log('activityPartId...', activityPartId);
      state.activityPartId = activityPartId
    },

    // 设置参与人员刷新
    SET_PARTUSERUPDATE(state, payload) {
      const { activityPartIsUpdate } = payload
      console.log('activityPartIsUpdate...', activityPartIsUpdate);
      state.activityPartIsUpdate = activityPartIsUpdate
    }
  },
  actions: {
    queryListAct({
      commit
    }) {
      getLecConditonApi().then(res => {
        commit('SET_QUERYLIST', res.data)
      })
    },

    queryBookListAct({
      commit
    }) {
      getLecbookConditonApi().then(res => {
        commit('SET_BOOK_QUERYLIST', res.data)
      })
    },

    queryRivalListAct({
      commit
    }) {
      getLecRivalConditonApi().then(res => {
        commit('SET_RIVAL_QUERYLIST', res.data)
      })
    },

    queryShellOptions({ commit }, data) { // 保存活动模块-所属部门可选项
      commit('SAVE_SHELL_OPTIONS', data)
    },
  }
}