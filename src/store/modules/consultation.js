import {
  stuFilterOptionsApi,
  yuYueZixunFilterApi,
  seaPutUserApi
} from '@/api/potentialGuest/consultation'

export default {
  namespaced: true,
  state: {
    // isRefreshTable: false,
    queryList: {
      noCounselStateList: [{
        value: 0,
        text: "待咨询"
      }, {
        value: 1,
        text: "已报免费"
      }, {
        value: 2,
        text: "已报低端"
      }, {
        value: 3,
        text: "已报中端"
      }, {
        value: 4,
        text: "已报高端"
      }, {
        text: "已报转赠",
        value: "5"
      }],
      stateList: [], // 状态
      yuYueZiXunstateList: [{
          value: 2,
          id: 2,
          text: '未安排'
        },
        {
          value: 3,
          id: 3,
          text: '已安排'
        },
        {
          value: 8,
          id: 8,
          text: '未完成'
        },
        {
          value: 9,
          id: 9,
          text: '已完成'
        },
        {
          value: 4,
          id: 4,
          text: '今日可跟进'
        },
        {
          value: 5,
          id: 5,
          text: '超期未跟进'
        }
      ], // 预约咨询状态
      reserveList: [], // 预约咨询
      consultTypeList: [], // 咨询类型
      yearList: [], // 考试年份、考试届别
      campusLis: [], // 市场区域负责人
      ownList: [], // 所属人
      isFreshList: [], // 属性
      graduationList: [], // 毕业年份
      cityTreeList: [], // 所在城市
      dateTypeList: [], // 日期类型
      intentionList: [], // 意向类型
      sourceList: [], // 来源渠道
      filterDateRange: [{
        title: '今日需回访',
        id: 6
      }, {
        title: '近3天需回访',
        id: 7
      }, {
        title: '近7天需回访',
        id: 8
      }],
      statisticsTypeList: [{
        title: '超期未回访',
        id: 2
      }, {
        title: '高意向类型',
        id: 3
      }, {
        title: '高端班意向',
        id: 4
      }],
      consultMobilesList: [{
        title: '未预约',
        id: 1
      }, {
        title: '未完成',
        id: 2
      }, {
        title: '已完成',
        id: 3
      }],
      sortRuleList: [{
          title: '添加日期',
          column: 'addTime'
        },
        {
          title: '咨询日期',
          column: 'consultTime'
        },
        {
          title: '最后回访',
          column: 'lastConsultTime'
        },
        {
          title: '下次回访',
          column: 'nextConsultTIme'
        }
      ],
      sortSeasRuleList: [{
          title: '添加日期',
          column: 'addTime'
        },
        {
          title: '咨询日期',
          column: 'consultTime'
        },
        {
          title: '最后回访',
          column: 'lastConsultTime'
        },
        {
          title: '投放日期',
          column: 'seaPutTime'
        }
      ],
      waitFollowTypeList: [{
        title: '分配',
        id: 1
      }, {
        title: '转交',
        id: 2
      }],

      // 投放人
      setPutList: []
    },
    yyzxQueryList: {
      resultList: [],
      consultantList: []
    },
    registerJobList: [{
        id: 1,
        title: '临床',
        registerJob: '临床'
      },
      {
        id: 2,
        title: '护理',
        registerJob: '护理'
      },
      {
        id: 3,
        title: '药学',
        registerJob: '药学'
      },
      {
        id: 4,
        title: '中医',
        registerJob: '中医'
      },
      {
        id: 5,
        title: '检验',
        registerJob: '检验'
      },
      {
        id: 6,
        title: '康复',
        registerJob: '康复'
      },
      {
        id: 7,
        title: '公卫',
        registerJob: '公卫'
      },
      {
        id: 8,
        title: '影像',
        registerJob: '影像'
      },
      {
        id: 9,
        title: '其他',
        registerJob: '其他'
      }
    ],
    permissionList: {
      'RECORD_ADD': { // 添加咨询记录
        1: 'PG:STU:RECORD_ADD',
        2: 'PG:VDI:RECORD_ADD',
        4: 'PG:NOCOUNSEL:RECORD_ADD',
        5: 'PG:WAITSTU:RECORD_ADD',
        6: 'PG:ALLNEW:RECORD_ADD',
        8: 'PG:WAIT:RECORD_ADD',
        9: 'MARKET:SCHOOL:RECORD',
        10: 'PG:RC:ADD_RECORD'
      },
      'CONSULT': { //预约咨询
        1: 'PG:STU:CONSULT',
        2: 'PG:VDI:CONDULT',
        4: 'PG:NOCOUNSEL:CONDULT',
        5: 'PG:WAITSTU:CONDULT',
        8: 'PG:WAIT:CONDULT',
        10: 'PG:RC:EDIT_CONSULT'
      },
      'EDIT': { // 编辑
        1: 'PG:STU:FILE_EDIT',
        4: 'PG:NOCOUNSEL:EDIT',
        5: 'PG:WAITSTU:EDIT',
        8: 'PG:WAIT:RECORD_EDIT',
        10: 'PG:RC:EDIT'
      },
      /*    listType
       * 1、咨询用户（至少有一条咨询记录）
       * 2、有效线索（除公海外所有线索）
       * 3、已报高端（状态=已报高端）
       * 4、未咨询（有绑定所属人但还没有咨询记录）
       * 5、待分配（没有所属人但【是否分配咨询师=是】的潜在用户）
       * 6、全部潜在用户包括公海
       * 7、公海（currentState必须为空）
       * 8、待跟进
       * 9: 讲座登记详情
       * 10: 预约咨询
       */
      'ADD_ORDER': { // 新增订单
        1: 'PG:STU:ADD_ORDER',
        4: 'PG:NOCOUNSEL:ADD_ORDER',
        5: 'PG:WAITSTU:ADD_ORDER',
        9: 'PG:STU:ADD_ORDER'
      },
      'BATCH_DISTRIBUTION': { // 分配咨询
        1: 'PG:STU:BATCH_DISTRIBUTION',
        4: 'PG:NOCOUNSEL:BATCH_DISTRIBUTION',
        5: 'PG:WAITSTU:BATCH_DISTRIBUTION_COUNSELOR',
        7: 'PG:HS:BATCH_DISTRIBUTION_COUNSELOR',
        9: 'PG:STU:BATCH_DISTRIBUTION'
      },
      'MARKET_AREA': { // 修改市场区域
        1: 'PG:STU:MARKET_AREA',
        4: 'PG:NOCOUNSEL:MARKET_AREA',
        9: 'PG:STU:MARKET_AREA'
      },
      'HAND_OVER': { // 移交
        1: 'PG:STU:HAND_OVER',
        4: 'PG:NOCOUNSEL:HAND_OVER',
        5: 'PG:WAITSTU:HAND_OVER',
        9: 'PG:STU:HAND_OVER'
      },
      'DELIVER': { // 转交
        1: 'PG:STU:DELIVER',
        4: 'PG:NOCOUNSEL:DELIVER',
        9: 'PG:STU:DELIVER'
      },
      'PUT_PUBLIC': { // 放入公海
        1: 'PG:STU:PUT_PUBLIC',
        4: 'PG:NOCOUNSEL:PUT_PUBLIC',
        5: 'PG:WAITSTU:PUT_PUBLIC',
        9: 'PG:STU:PUT_PUBLIC'
      }
    }
  },
  mutations: {
    SET_ISREFRESHTABLE(state, value) {
      state.isRefreshTable = value
    },
    SET_QUERYLIST(state, queryList) {
      state.queryList = {
        ...state.queryList,
        ...queryList,
        stateList: queryList.stateList ? queryList.stateList.map(item => {
          item.value = item.value.toString()
          return item
        }) : [],
        isFreshList: queryList.isFreshList ? queryList.isFreshList.map(item => {
          item.value = item.value.toString()
          return item
        }) : [],
        classList: queryList.classList || []
      }
    },
    SET_QUERYLIST_YYZXQUERYLIST(state, yyzxQueryList) {
      state.yyzxQueryList = {
        ...state.yyzxQueryList,
        resultList: (yyzxQueryList.result || []).map(item => {
          return {
            id: item.value,
            title: item.text
          }
        }),
        consultantList: (yyzxQueryList.consultantList || []).map(item => {
          return {
            id: item.value.toString(),
            title: item.text
          }
        })
      }
    },
    SET_SEAPUTUSET(state, list) {
      state.queryList.setPutList = list
    }
  },
  actions: {
    queryListAct({
      commit
    }, type) {
      stuFilterOptionsApi(type).then(res => {
        if (res.data.consultTypeList) {
          res.data.consultTypeList.unshift({
            value: -1,
            text: '全部'
          })
        }
        commit('SET_QUERYLIST', res.data)
      })
      yuYueZixunFilterApi().then(res => {
        commit('SET_QUERYLIST_YYZXQUERYLIST', res.data || [])
      })
      seaPutUserApi().then(res => {
        commit('SET_SEAPUTUSET', res.data || [])
      })
    },
    isRefreshTableAct({
      commit
    }, value) {
      commit('SET_ISREFRESHTABLE', value)
    }
  }
}