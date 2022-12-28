<template>
  <div id="consulationHeader">
    <div class="hf-l-seacrch" v-if="isSearch">
      <form action="/">
        <van-search v-model="listQuery.handoverKeyword" shape="round" show-action placeholder="请输入学员姓名、手机号码、QQ、微信" :clearable="false" @search="onKeywordSearch" @cancel="onKeywordCancel" @clear="onKeywordClear" />
      </form>
    </div>
    <div class="header-filter" v-else>
      <div class="hf-l-list">
        <van-dropdown-menu class="hf-l-list-menu">
          <!-- 移交统计  -->
          <van-dropdown-item :title="filterTitle" :title-class="isHtab1 ? 'common-act-color' : ''" @open="handleDropOpen(1)" ref="vanDropItem1">
            <div class="hf-drop-view" v-if="consultMobilesList.length">
              <div class="hf-drop-contain">
                <div class="hr-drop-filter-item" @click="handleConsultState(item.value)" v-for="item in consultMobilesList" :key="item.value">
                  <van-icon v-if="listQuery.titleType  && listQuery.titleType == item.value" name="success" color="#0088FE" />
                  <span :class="{'hr-drop-filter-item-act': listQuery.titleType && listQuery.titleType == item.value }">{{item.text}}</span>
                </div>
              </div>
              <div class="common-double-button">
                <van-button class="common-double-button-l" @click="handleReset(1)">重置</van-button>
                <van-button class="common-double-button-r" @click="handleConfirm">确定</van-button>
              </div>
            </div>
            <div v-else class="hf-drop-contain-empty">
              暂无数据
            </div>
          </van-dropdown-item>

          <!-- 日期类型 -->
          <van-dropdown-item v-if="['1', '4', '5', '7'].includes(listType)" :title="listQuery.dateType == 1 ? '移交日期' :  listQuery.dateType == 2 ?  '报名日期' :'日期类型'" title-class="common-act-color" @open="handleDropOpen(4)" ref="vanDropItem4">
            <div class="hf-drop-view">
              <div class="hf-drop-quick" style="margin-top: 0;">
                <div class="hf-drop-quick-item" style="margin-bottom: 0;">
                  <!-- <div class="hf-drop-quick-title">回访周期</div> -->
                  <div class="hf-drop-quick-list">
                    <div class="hf-drop-quick-list-item" :class="{ 'hf-drop-quick-list-item-act': listQuery.dateType === item.value }" @click="handleDateType(item.value)" v-for="item in queryList.dateTypeList" :key="item.id">{{item.text}}</div>
                  </div>
                  <ReQuickDateBtns @change="handleQuickDate" :startData="listQuery.startDate" :endData="listQuery.endDate" style="margin-top: 1rem;" />
                  <div class="hf-drop-quick-calendar">
                    <van-calendar ref="vanCalendar" :formatter="dayTextFormatter" @select="handleDateSelect" :default-date="defaultDate" :poppable="false" type="range" :show-title="false" color="#0088FE" :show-confirm="false" allow-same-day :min-date="new Date('2013/01/01')" :style="{ height: '400px' }" />
                  </div>
                </div>
              </div>
              <div class="common-double-button">
                <van-button class="common-double-button-l" @click="handleReset(4)">重置</van-button>
                <van-button class="common-double-button-r" @click="handleConfirm">确定</van-button>
              </div>
            </div>
          </van-dropdown-item>

        </van-dropdown-menu>
      </div>
      <div class="hf-r-list">
        <div class="hf-r-list-item" @click="handleSearch">
          <div class="hf-r-icon-bg">
            <van-icon name="search" class="hf-r-icon" />
          </div>
          <!-- <img src="@/assets/images/search.png" alt=""> -->
        </div>
        <div class="hf-r-list-item" @click="handleMoreFilter">
          <div class="hf-r-icon-bg" :class="{'hf-r-icon-bg-act': isMoreAct }">
            <van-icon name="filter-o" class="hf-r-icon" />
          </div>
        </div>
      </div>
    </div>
    <van-popup position="bottom" safe-area-inset-bottom v-model="moreFilterShow">
      <div class="common-popup moreContain">
        <div class="common-popup-header">
          <div></div>
          <div class="common-popup-header-title">
            <span>筛选</span>
          </div>
          <div class="common-popup-header-close">
            <van-icon name="cross" @click="moreFilterShow = false" />
          </div>
        </div>
        <div class="moreContain-body">
          <RePick v-model="listQuery.handoverShellId" label="移交部门" @change="handleHandoverShellId" v-if="cascadeShellList.length" :list.sync="cascadeShellList" isCascader childrenKey="child" isCell clearable />
          <RePick v-model="listQuery.handoverUserId" label="移交人" v-if="cascadeShellList.length" :emptyToastTitle="!listQuery.handoverShellId ? '请先选择移交部门' : ''" multiple :list="handoverUserOptions" isCell clearable />
          <RePick v-model="listQuery.handoverType" label="移交类型" @change="handleHandoverType" :list="handleOverTypeList" isCell clearable />
          <RePick v-model="listQuery.targetSysId" label="承接系统" @change="handleTargetSysId" :emptyToastTitle="!listQuery.handoverType ? '请先选择移交类型' : ''" :list="CJXTOptions" isCell clearable />
          <RePick v-model="listQuery.targetShellId" label="承接部门" :list="chengjiebumenOptions" @change="handleTargetShellId" isCascader isShowSearch titleKey="text" isCell clearable />
          <RePick v-model="listQuery.targetUserId" label="承接人" :list="chengjierenOptions" :emptyToastTitle="!listQuery.targetShellId ? '请先选择承接部门' : ''" isCell clearable />

        </div>
        <div class="common-popup-footer">
          <van-button style="width: 8rem; margin-right: 1rem;" @click="handleMoreReset">重置</van-button>
          <van-button type="info" style="width: 8rem;" @click="handleMoreConfirm">确认</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { makeYear } from "@/utils/date"
import { mapState } from 'vuex'
import dayjs from 'dayjs'
import { commonShellAllUserApi } from '@/api/common'
import { getHandoverUserApi, targetSysBoxactivityIdApi, targetShellBoxApi } from '@/api/potentialGuest/activity'
import { dayTextFormatter } from '@/utils'
export default {
  props: {
    listType: String,
    paramProp: Object,
    filterProp: Object // 移交筛选title的参数
  },
  components: {
    ReQuickDateBtns: () => import('@/components/ReComponents/ReQuickDateBtns'),
    RePick: () => import('@/components/ReComponents/RePick'),
    // ReYear: () => import('@/components/ReComponents/ReYear')
  },
  data() {
    return {
      dayTextFormatter: dayTextFormatter,
      // 年份选择数据源
      years: makeYear().reverse(),
      isSearch: false,
      userPersons: [],
      title: '请选择',
      moreFilterShow: false,
      defaultDate: null,
      listQuery: { keyword: '', crmMarketAreaIds: [], dateType: 1, titleType: 1 },
      schoolList: [],
      pickerCheckValue: null,
      consultMobilesList: [
        {
          text: '参与人数',
          value: 1,
          key: 'total'
        },
        {
          text: '未移交',
          value: 12,
          key: 'notHandover'
        },
        {
          text: '待确认',
          value: 4,
          key: 'notDetermine'
        },
        {
          text: '未跟进',
          value: 5,
          key: 'notFollow'
        },
        {
          text: '未分配',
          value: 10,
          key: 'notDistribution'
        },
        {
          text: '已跟进',
          value: 6,
          key: 'toFollow'
        },
        {
          text: '已报班',
          value: 7,
          key: 'signUp'
        },
        {
          text: '移交失败',
          value: 8,
          key: 'handoverFail'
        }
      ],
      handoverUserOptions: [], // 移交人
      handleOverTypeList: [
        {
          title: '跨系统',
          id: '1'
        },
        {
          title: '跨分校',
          id: '0'
        }
      ],
      CJXTOptions: [], // 承接系统
      chengjiebumenOptions: [],
      chengjierenOptions: []
    }
  },
  // watch: {
  //   'listQuery.dateRange': {
  //     handler(val) {
  //     }
  //   }
  // },
  computed: {
    filterTitle() {
      // this.Fdata[0].children[0].Fnum = data.total
      // this.Fdata[0].children[1].Fnum = data.newStudent // 新用户
      // this.Fdata[0].children[2].Fnum = data.oldStudent // 老用户
      // this.Fdata[0].children[3].Fnum = data.notHandover // 未移交
      // this.Fdata[0].children[4].Fnum = data.notDetermine // 待确认
      // this.Fdata[0].children[5].Fnum = data.notFollow // 未跟进
      // this.Fdata[0].children[6].Fnum = data.notDistribution // 未分配
      // this.Fdata[0].children[7].Fnum = data.toFollow // 已跟进
      // this.Fdata[0].children[8].Fnum = data.signUp // 已报班
      let obj = this.consultMobilesList.find(v => v.value == this.listQuery.titleType) || {}
      const { key, text } = obj
      let newTitle = `${text || '参与人数'}:0`
      if (this.filterProp) {
        Object.keys(this.filterProp).forEach(newKey => {
          if (newKey == key) {
            newTitle = `${text}:${this.filterProp[newKey] || 0}`
            // this.listQuery.isShow = this.filterProp[newKey] ? 0 : 1
          }
        })
      }
      return newTitle
    },
    ...mapState({
      cascadeShellList: state => state.common.global.cascadeShellList,
      queryList: state => state.activity.queryList,
      authDepartList: state => state.common.user.authDepartList,
      authAreaList: state => state.common.user.authAreaList,
      allProvicesAndCitys: state => state.common.setting.allProvicesAndCitys,
      methods(state) {
        if (this.listType) {
          return state.activity[this.listType == 2 ? 'queryBookList' : this.listType == 3 ? 'queryRivalList' : 'queryList'].methods
        } else return state.activity.queryList.methods
      },
      targets(state) {
        if (this.listType) {
          return state.activity[this.listType == 2 ? 'queryBookList' : this.listType == 3 ? 'queryRivalList' : 'queryList'].targets
        } else return state.activity.queryList.targets
      },
      teachers(state) {
        if (this.listType) {
          return state.activity[this.listType == 2 ? 'queryBookList' : this.listType == 3 ? 'queryRivalList' : 'queryList'].teachers
        } else return state.activity.queryList.teachers
      },
      types(state) {
        if (this.listType) {
          return state.activity[this.listType == 2 ? 'queryBookList' : this.listType == 3 ? 'queryRivalList' : 'queryList'].types
        } else return state.activity.queryList.types
      },
      opponents(state) {
        if (this.listType) {
          return state.activity[this.listType == 2 ? 'queryBookList' : this.listType == 3 ? 'queryRivalList' : 'queryList'].opponents
        } else return state.activity.queryList.opponents
      }
      /* targets: state => state.activity[this.listType == 2 ? 'queryBookList' : this.listType == 3 ?'queryRivalList' : 'queryList'].targets, // 针对对象
      teachers: state => state.activity[this.listType == 2 ? 'queryBookList' : this.listType == 3 ?'queryRivalList' : 'queryList'].teachers, // 讲师名称
      types: state => state.activity[this.listType == 2 ? 'queryBookList' : this.listType == 3 ?'queryRivalList' : 'queryList'].types // 讲座类型 */
    }),
    isMoreAct() {
      let bol = false
      const listQuery = this.listQuery || {}
      const { handoverShellId, handoverUserId, handoverType, targetSysId, targetShellId, targetUserId } = listQuery
      if (handoverShellId || handoverUserId && handoverUserId.length || handoverType || targetSysId || targetShellId && targetShellId.length || targetUserId && targetUserId.length) {
        bol = true
      }
      return bol
    },
    isHtab1() {
      let isShow = false
      if (this.listQuery.titleType) isShow = true
      return isShow
    },
    isHtab2() {
      let isShow = false
      if (this.listQuery.followUpState) isShow = true
      return isShow
    },
    isHtab3() {
      let isShow = false
      if (this.listQuery.result && this.listQuery.result.length) isShow = true
      return isShow
    },
    isHtab4() {
      let isShow = false
      if (this.listQuery.intentionType && this.listQuery.intentionType.length) isShow = true
      return isShow
    }
  },
  created() {
    // this.useGetGenerousList()
  },
  methods: {
    handleTargetShellId(val) {
      this.getHandoverUserByList(val, 0)
    },
    handleTargetSysId(val) {
      this.useTargetShellBox(val)
    },
    handleHandoverShellId(val) {
      this.getHandoverUserByList(val, 1)
    },

    // 获取承接部门
    useTargetShellBox(id) {
      if (id) {
        targetShellBoxApi(id).then(res => {
          this.chengjiebumenOptions = res.data || []

          this.$set(this.listQuery, 'targetShellId', null)
        })
      } else {
        this.chengjiebumenOptions = []
        this.$set(this.listQuery, 'targetShellId', null)
      }
    },
    // 移交类型
    handleHandoverType(val) {
      this.useTargetSysBox(val)
    },
    useTargetSysBox(v) { // 承接系统可选项
      const { sid } = this.$route.params
      if (v) {
        targetSysBoxactivityIdApi(v, sid).then(res => {
          this.CJXTOptions = res.data
          this.listQuery.targetSysId = null
        })
      } else {
        this.CJXTOptions = []
        this.listQuery.targetSysId = null
      }
    },
    // 移交人/承接人可选项 type: 1 移交人 0 承接人
    getHandoverUserByList(id, type) {
      if (id) {
        getHandoverUserApi(id).then(res => {
          if (type) {
            this.handoverUserOptions = res.data || []
            this.$set(this.listQuery, 'handoverUserId', [])
          } else {
            this.chengjierenOptions = res.data || []
            this.$set(this.listQuery, 'targetUserId', null)
          }
        })
      } else {
        if (type) {
          this.handoverUserOptions = []
          this.$set(this.listQuery, 'handoverUserId', [])
        } else {
          this.chengjierenOptions = []
          this.$set(this.listQuery, 'targetUserId', null)
        }
      }
    },
    // 日期类型筛选
    handleDateType(id) {
      this.$set(this.listQuery, 'dateType', id)
      this.listQuery.dateType = id

    },

    onKeywordSearch() {
      this.$emit('onListQuery', this.listQuery)
    },
    onKeywordClear(val) {
    },
    onKeywordCancel() {
      this.listQuery.handoverKeyword = null
      this.onKeywordSearch()
      this.isSearch = false
    },
    handleQuickDate(e) {
      //
      if (this.listQuery.dateType == 1) {
        // this.listQuery.beginDate = dayjs(val[0]).format('YYYY/MM/DD')
        // this.listQuery.endDate = dayjs(val[1]).format('YYYY/MM/DD')
        this.listQuery.startDate = `${e.time[0]} 00:00:00`
        this.listQuery.endDate = `${e.time[1]} 23:59:59`
      } else {
        // this.listQuery.signUpBegin = dayjs(val[0]).format('YYYY/MM/DD')
        // this.listQuery.signUpEnd = dayjs(val[1]).format('YYYY/MM/DD')
        this.listQuery.signUpBegin = `${e.time[0]} 00:00:00`
        this.listQuery.signUpEnd = `${e.time[1]} 23:59:59`
      }
      this.defaultDate = [dayjs(e.time[0]).toDate(), dayjs(e.time[1]).toDate()]
    },
    handleInit() {
      this.defaultDate = null
      this.listQuery = {
        ...this.listQuery,
        titleType: this.listQuery.titleType ? this.listQuery.titleType : null,
      }
      if ((this.listQuery.beginDate && this.listQuery.endDate) || (this.listQuery.signUpBegin && this.listQuery.signUpEnd)) {
        if (this.listQuery.dateType == 1) {
          this.defaultDate = [dayjs(this.listQuery.beginDate).toDate(), dayjs(this.listQuery.endDate).toDate()]
        } else {
          this.defaultDate = [dayjs(this.listQuery.signUpBegin).toDate(), dayjs(this.listQuery.signUpEnd).toDate()]
        }
      } else {
        this.handleDateReset()
      }
    },
    handleDropOpen() {
      this.handleInit()
    },
    // 搜索
    handleSearch() {
      this.listQuery.keyword = this.paramProp.keyword
      this.isSearch = true
    },
    // 更多筛选
    handleMoreFilter() {
      this.handleInit()
      this.moreFilterShow = true
    },
    // 移交统计
    handleConsultState(val) {
      this.listQuery.titleType = val || null
    },
    handleCheck(name) {
      this.listQuery[name] = !this.listQuery[name]
    },

    handleDateSelect(val) {
      if (val.filter(item => item).length) {
        // dateType 1: 移交日期 2 报名日期
        if (this.listQuery.dateType == 1) {
          this.listQuery.beginDate = dayjs(val[0]).format('YYYY/MM/DD')
          this.listQuery.endDate = dayjs(val[1]).format('YYYY/MM/DD')
        } else {
          this.listQuery.signUpBegin = dayjs(val[0]).format('YYYY/MM/DD')
          this.listQuery.signUpEnd = dayjs(val[1]).format('YYYY/MM/DD')
        }
      }
    },
    // 日历重置
    handleDateReset() {
      this.defaultDate = null
      this.$refs.vanCalendar && this.$refs.vanCalendar.reset()
    },
    handleReset(num) {
      if (num === 1) {
        this.listQuery.titleType = null
      } else if (num === 2) {
        this.listQuery.followUpState = null
      } else if (num === 3) {
        this.listQuery.result = []
      } else if (num === 4) {
        this.listQuery.intentionType = []
        this.listQuery.startDate = null
        this.listQuery.endDate = null
      }
      // const obj = JSON.parse(JSON.stringify(this.paramProp))
    },
    handleConfirm() {
      this.$refs.vanDropItem1.toggle(false)
      // if (this.listType != 2) this.$refs.vanDropItem2.toggle(false)
      this.$refs.vanDropItem4.toggle(false)
      this.$emit('onListQuery', this.listQuery)
    },

    // 部门
    handleShell(e) {
      commonShellAllUserApi(e).then(res => {
        this.userPersons = res.data || []
      })
    },
    handleSource() {

    },
    // 更多重置
    handleMoreReset() {
      // this.listQuery.schoolManager = [] // 校区主管
      // this.listQuery.sysShellId = [] // 所属部门
      // this.listQuery.shellIdsLocal = null
      // this.listQuery.attendSchools = [] // 就读院校
      // this.listQuery.schoolIdLocal = null
      // this.listQuery.cityId = null // 所在城市
      // this.listQuery.titleType = null // 预约状态
      // this.listQuery.owner = null // 所属人
      // this.listQuery.ownLocal = null
      // this.listQuery.sourceId = null
      // this.listQuery.intentionClass = [] // 意向班型
      // this.listQuery.intentionCourseIds = []
      // this.listQuery.consultType = []
      // this.listQuery.consultTypeLocal = null
      // this.listQuery.examYear = []
      // this.listQuery.examYearLocal = null
      // this.listQuery.isFresh = []
      // this.listQuery.isFreshLocal = null
      // this.listQuery.campus = []
      // this.listQuery.campusLocal = null
      // this.listQuery.areaId = []
      // this.listQuery.own = []
      // this.listQuery.graduationYear = []
      // this.listQuery.graduationYearLocal = null


      this.listQuery.handoverShellId = null // 移交部门
      this.listQuery.handoverUserId = null // 移交人
      this.listQuery.handoverType = null // 移交类型
      this.listQuery.targetSysId = null // 承接系统
      this.listQuery.targetShellId = null // 承接部门
      this.listQuery.targetUserId = null // 承接人


    },
    handleMoreConfirm() {
      this.$emit('onListQuery', this.listQuery)
      this.moreFilterShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/views/activities/components/index.scss';
</style>
