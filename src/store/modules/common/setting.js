import {
  getUserSystem,
  getAllSys,
  getAllRegion,
  configIsRequire,
  searchoptionApi
} from '@/api/common'
import {
  userCommonmenuListApi
} from '@/api/workOrder'
import dayjs from 'dayjs'

var yearStart = 2000
var yearRange = 20 + 1

export default {
  namespaced: true,
  state: {
    isDingTalk: false,
    isAdmin: false,
    // 所有系统
    systemList: [],
    // 用户权限系统
    userSystemList: [],
    // 所有菜单
    allMenu: [],
    // 省市县
    allProvicesAndCitys: [],
    yearStart: yearStart,
    // 年份
    yearList: new Array(Number(dayjs().format('YYYY')) - yearStart + yearRange).fill(null).map((item, index) => {
      return yearStart + index
    }),
    pageSize: 20,
    subjectRule: null,
    isRequireYear: true, // 毕业年份是否必填
    isRequireStudent: true, // 在校生是否必填
    isRequrieSchool: false, // 报考学校是否必填
    isRequireSbuject: false, // 报考科目是否必填
    isRequireAddress: false, // 上课地点是否必填
    isbindBelongUser: null, // 是否绑定所属人
    examYearText: '', // 考试年份还是考试届别
    highIntention: [], // 高意向集合
    showExamMonth: true, // 是否显示考试月份
    schoolTypeList: []
  },
  mutations: {
    SET_ISDINGTALK: (state, type) => {
      state.isDingTalk = type
    },
    SET_SYSTEMLIST: (state, list) => {
      state.systemList = list
    },
    SET_USERSYSTEMLIST: (state, list) => {
      state.userSystemList = list
    },
    GET_ALL_REGION(state, data) {
      state.allProvicesAndCitys = data
    },
    GET_SUBJECT_RULE(state, data) { // 保存考试科目读取规则
      state.subjectRule = data
    },
    GRADUATION_YEAR(state, data) {
      state.isRequireYear = data
    },
    IS_REQUIRE_STUDENT(state, data) {
      state.isRequireStudent = data
    },
    HIGH_INTENTION(state, data) {
      state.highIntention = data
    },
    REQUIRE_SCHOOL(state, data) {
      state.isRequrieSchool = data
    },
    REQUIRE_SUBJECT(state, data) {
      state.isRequireSbuject = data
    },
    REQUIRE_ADDRESS(state, data) {
      state.isRequireAddress = data
    },
    BIND_BELONG_USER(state, data) {
      state.isbindBelongUser = data
    },
    GET_EXAM_YEAR(state, data) { // 考试年份还是考试届别
      state.examYearText = data
      localStorage.setItem('examYearTextStr', data)
    },
    GET_EXAM_MONTH(state, data) { // 是否显示考试月份
      state.showExamMonth = data
      localStorage.setItem('examMonthVal', data ? 1 : 0)
    },
    SET_SEARCHOPTIONLIST(state, data) {
      state.schoolTypeList = data
    },
    SET_ALLMENU(state, data) {
      state.allMenu = data
    }
  },
  actions: {
    setDingTalk({
      commit
    }, value) {
      commit('SET_ISDINGTALK', value)
    },
    /**
     * 获取远程系统
     */
     getSystem({
      commit
    }) {
      return new Promise(((resolve, reject) => {
        Promise.all([
          getUserSystem().then(res => {
            commit('SET_SYSTEMLIST', res.data)
          }).catch(() => {
            reject('获取系统出错了！')
          }),
          getAllSys().then(res => {
            commit('SET_USERSYSTEMLIST', res.data)
          }).catch(() => {
            reject('获取系统出错了！')
          })
        ]).then(() => {
          resolve()
        })
      }))
    },

    // 获取所有菜单
    async getAllMenu({
      commit
    }) {
      await userCommonmenuListApi().then(res => {
        commit('SET_ALLMENU', res.data || [])
      })
    },
    // 获取所有省市县
    async getAllProvice({
      commit
    }) {
      await getAllRegion().then(res => {
        commit('GET_ALL_REGION', res.data)
      })
    },

    async configDetail({
      commit
    }) {
      await configIsRequire().then(res => { // 获取设置模块的配置信息
        if (!res || !res.data) return
        const obj = res.data
        commit('GET_SUBJECT_RULE', obj.examSubject ? +obj.examSubject : null)
        commit('GRADUATION_YEAR', Number(obj.yearIsRequire) === 1)
        commit('IS_REQUIRE_STUDENT', Number(obj.isDiffer) === 1)
        if (obj.highIntention && obj.highIntention.length) {
          commit('HIGH_INTENTION', obj.highIntention)
        }
        commit('REQUIRE_SCHOOL', +obj.orderEnrollSchool === 1)
        commit('REQUIRE_SUBJECT', +obj.orderEnrollSubject === 1)
        commit('REQUIRE_ADDRESS', +obj.orderClassAddress === 1)
        commit('BIND_BELONG_USER', +obj.isbindBelongUser === 1)
        commit('GET_EXAM_YEAR', obj.examYearText || '考试届别') // 考试年份还是考试届别
        commit('GET_EXAM_MONTH', !(obj.showExamMonth == 0)) // 是否显示考试月份

      })
    },

    async searchoptionList({
      commit
    }) {
      await searchoptionApi().then(res => {
        let arr = res.data || []
        arr.push({
          value: -1,
          text: '未知'
        })
        commit('SET_SEARCHOPTIONLIST', arr.map(item => {
          return {
            id: item.value,
            title: item.text
          }
        }))
      })
    }
  }
}