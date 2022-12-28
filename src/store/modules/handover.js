import {
  infoSetApi
} from '@/api/common'

export default {
  namespaced: true,
  state: {
    queryList: {
      day: 30, // 移交日起N天内报班算移交业绩
      sortRuleList: [{
          title: '移交日期',
          column: 'handoverTime'
        },
        {
          title: '接收日期',
          column: 'receiveTime'
        },
        {
          title: '报名日期',
          column: 'enrollTime'
        }
      ],
      sortRuleList1: [{
          title: '收款日期',
          column: 'paymentTime'
        },
        {
          title: '移交日期',
          column: 'handoverTime'
        },
        {
          title: '收款添加日期',
          column: 'additionPayTime'
        }
      ],
      sortRuleList2: [{
          title: '收款日期',
          column: 'paymentTime'
        },
        {
          title: '接收日期',
          column: 'handoverTime'
        },
        {
          title: '收款添加日期',
          column: 'additionPayTime'
        }
      ],
      payTypes: [{
          text: '预交',
          value: 1
        },
        {
          text: '全款',
          value: 2
        }, {
          text: '补交',
          value: 3
        }
      ],
      handoverTypeOptions: [{
          id: '0',
          title: '跨分校'
        },
        {
          id: '1',
          title: '跨系统'
        }
      ],
      isHandoverStateList: [
        // 移交状态
        {
          text: '待确认',
          value: 4
        },
        {
          text: '移交成功未分配',
          value: 10
        },
        {
          text: '移交成功未跟进',
          value: 5
        },
        {
          text: '移交成功已跟进',
          value: 6
        },
        {
          text: '移交成功已报免费班',
          value: 18
        },
        {
          text: '移交成功已报低端班',
          value: 15
        },
        {
          text: '移交成功已报中端班',
          value: 16
        },
        {
          text: '移交成功已报高端班',
          value: 17
        },
        {
          text: '移交失败',
          value: 8
        }
      ],
      isReceiveStateList: [
          // 接收状态
          {
            text: '接收成功未分配',
            value: 10
          },
          {
            text: '接收成功未跟进',
            value: 5
          },
          {
            text: '接收成功已跟进',
            value: 6
          },
          {
            text: '接收成功已报免费班',
            value: 18
          },
          {
            text: '接收成功已报低端班',
            value: 15
          },
          {
            text: '接收成功已报中端班',
            value: 16
          },
          {
            text: '接收成功已报高端班',
            value: 17
          },
          {
            text: '接收失败',
            value: 13
          }
        ]
      }
    },
    mutations: {
      SET_QUERYLIST(state, day) {
        console.log('SET_QUERYLIST', day);
        state.queryList.day = day
      }
    },
    actions: {
      getConfigDetail({
        commit
      }) {
        infoSetApi('HANDOVER_RESULT_TIME').then(res => {
          commit('SET_QUERYLIST', Number(res.data.value)) || 30
        })
      }
    }
  }