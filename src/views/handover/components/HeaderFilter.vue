<template>
  <div id="consulationHeader">
    <div class="hf-l-seacrch" v-if="isSearch">
      <form action="/">
        <van-search v-model="listQuery.handoverKeyword" shape="round" show-action placeholder="请输入学员姓名、手机号码、微信、QQ" :clearable="false" @search="onKeywordSearch" @cancel="onKeywordCancel" @clear="onKeywordClear" />
      </form>
    </div>
    <div class="header-filter" v-else>
      <div class="hf-l-list">
        <van-dropdown-menu class="hf-l-list-menu">
          <!-- 状态 -->
          <van-dropdown-item v-if="['1','3'].includes(listType)" title="状态" title-class="common-act-color" @open="handleDropOpen(1)" ref="vanDropItem1">
            <div class="hf-drop-view" v-if="isHandoverStateList.length">
              <div class="hf-drop-contain">
                <div class="hr-drop-filter-item" @click="handleType(null)">
                  <div>
                    <van-icon v-if="!listQuery.titleType" name="success" color="#0088FE" />
                    <span :class="{'hr-drop-filter-item-act': !listQuery.titleType }">全部</span>
                  </div>
                </div>
                <div class="hr-drop-filter-item" @click="handleType(item.value)" v-for="item in isHandoverStateList" :key="item.value">
                  <div>
                    <van-icon v-if="listQuery.titleType && item.value == listQuery.titleType" name="success" color="#0088FE" />
                    <span :class="{'hr-drop-filter-item-act': listQuery.titleType && item.value == listQuery.titleType }">{{item.text}}</span>
                  </div>
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
          <!-- 缴费类型 -->
          <van-dropdown-item v-else title="缴费类型" :title-class="isHtab2 ? 'common-act-color' : ''" @open="handleDropOpen(2)" ref="vanDropItem2">
            <div class="hf-drop-view" v-if="payTypes.length">
              <div class="hf-drop-contain">
                <div class="hr-drop-filter-item" @click="handleMethod(item.value)" v-for="item in payTypes" :key="item.value">
                  <van-icon v-if="listQuery.fillType && listQuery.fillType.includes(item.value)" name="success" color="#0088FE" />
                  <span :class="{'hr-drop-filter-item-act': listQuery.fillType && listQuery.fillType.includes(item.value) }">{{item.text}}</span>
                </div>
              </div>
              <div class="common-double-button">
                <van-button class="common-double-button-l" @click="handleReset(2)">重置</van-button>
                <van-button class="common-double-button-r" @click="handleConfirm">确定</van-button>
              </div>
            </div>
            <div v-else class="hf-drop-contain-empty">
              暂无数据
            </div>
          </van-dropdown-item>
          <!-- 日期类型 -->
          <van-dropdown-item title="日期类型" :title-class="isHtab3 ? 'common-act-color' : ''" @open="handleDropOpen(3)" ref="vanDropItem3">
            <div class="hf-drop-view">
              <div class="hf-drop-quick" style="margin-top: 0;">
                <div class="hf-drop-quick-item" style="margin-bottom: 0;">
                  <div class="hf-drop-quick-list" v-if="['1','3'].includes(listType)">
                    <div class="hf-drop-quick-list-item" :class="{ 'hf-drop-quick-list-item-act': listQuery.dateType === item.column }" @click="handleDateType(item.column)" v-for="item in sortRuleList" :key="item.column">{{item.title}}</div>
                  </div>
                  <div class="hf-drop-quick-list" v-else-if="listType == 2">
                    <div class="hf-drop-quick-list-item" :class="{ 'hf-drop-quick-list-item-act': listQuery.dateType === item.column }" @click="handleDateType(item.column)" v-for="item in sortRuleList1" :key="item.column">{{item.title}}</div>
                  </div>
                  <div class="hf-drop-quick-list" v-else>
                    <div class="hf-drop-quick-list-item" :class="{ 'hf-drop-quick-list-item-act': listQuery.dateType === item.column }" @click="handleDateType(item.column)" v-for="item in sortRuleList2" :key="item.column">{{item.title}}</div>
                  </div>
                  <ReQuickDateBtns :startData="startDate" :endData="endDate" @change="handleQuickDate" style="margin-top: 1rem;" />
                  <div class="hf-drop-quick-calendar">
                    <van-calendar ref="vanCalendar" :formatter="dayTextFormatter" @select="handleDateSelect" :default-date="defaultDate" :poppable="false" type="range" :show-title="false" color="#0088FE" :show-confirm="false" allow-same-day :min-date="new Date('2013/01/01')" :style="{ height: '400px' }" />
                  </div>
                </div>
              </div>
              <div class="common-double-button">
                <van-button class="common-double-button-l" @click="handleReset(3)">重置</van-button>
                <van-button class="common-double-button-r" @click="handleConfirm(3)">确定</van-button>
              </div>
            </div>
          </van-dropdown-item>

        </van-dropdown-menu>
      </div>
      <div class="hf-r-list">
        <div class="hf-r-list-item" @click="handleSearch">
          <div class="hf-r-icon-bg" :class="{'hf-r-icon-bg-act': paramProp.handoverKeyword }">
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
    <div class="top-statistics" v-if="['1','3'].includes(listType)">
      <div class="statist-item">应收:
        <van-loading type="spinner" color="#0088fe" v-if="!countData.amountMoney" size="20" />
        <span v-else>{{countData.amountMoney | moneyFmt}}</span><span class="line"></span>
      </div>
      <div class="statist-item">已收:
        <van-loading type="spinner" color="#67C23A" v-if="!countData.receivedMoney" size="20" />
        <span v-else>{{countData.receivedMoney | moneyFmt}}</span><span class="line"></span>
      </div>
      <div class="statist-item">余款:
        <van-loading type="spinner" color="#F56C6C" v-if="!countData.balanceMoney" size="20" />
        <span v-else>{{countData.balanceMoney | moneyFmt}}</span>
      </div>
    </div>
    <div class="top-statistics" v-else>
      <div class="statist-item">合计收款:
        <van-loading type="spinner" color="#0088fe" v-if="!countData.sumMoney" size="20" />
        <span v-else>{{countData.sumMoney | moneyFmt}}</span><span class="line"></span>
      </div>
      <div class="statist-item">去重合计收款:
        <van-loading type="spinner" color="#67C23A" v-if="!countData.disReceipt" size="20" />
        <span v-else>{{countData.disReceipt | moneyFmt}}</span>
      </div>
    </div>
    <van-popup position="bottom" safe-area-inset-bottom v-model="moreFilterShow" :lock-scroll="false" round get-container="#app" lazy-render>
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
        <div class="moreContain-body" v-if="['1','2'].includes(listType)">
          <RePick v-model="shellIdsLocal" label="移交部门" v-if="authDepartList.length" @change="handleHandoverShell($event,'handoverUserId')" :list="authDepartList" isCascader isCell clearable childrenKey="child" />
          <RePick v-model="listQuery.sourceChannelId" v-if="listType == '1'" label="来源渠道" :list="sourceList" isCascader isCell clearable childrenKey="children" />
          <RePick v-model="listQuery.examYear" v-if="listType == '1'" label="考试年份" :list="yearList" isCell clearable />
          <RePick v-model="listQuery.handoverUserId" label="移交人" v-if="authDepartList.length" :emptyToastTitle="!listQuery.shellIdsLocal ? '请先选择移交部门' : ''" isShowSearch :list="handoverUser" multiple isCell clearable />
          <RePick v-model="handoverType" label="移交类型" :list="handoverTypeOptions" @change="handleHandoverType" isCell clearable />
          <RePick v-model="targetSysId" label="承接系统" :isShowSearch="listQuery.handoverType == 1" :emptyToastTitle="!listQuery.handoverType && listQuery.handoverType !==0 ? '请先选择移交类型' : ''" :list="undertakSystemList" isCell @change="handleTargetSysId" />
          <RePick v-model="targetShellIdLocal" label="承接部门" :emptyToastTitle="!listQuery.targetSysId ? '请先选择承接系统' : ''" :list="undertakBranchList" titleKey="text" isCascader isCell clearable @change="handleTargetShellId" />
          <RePick v-model="listQuery.targetUserIdsLocal" label="承接人" isShowSearch :emptyToastTitle="!listQuery.targetShellIdLocal ? '请先选择承接部门' : ''" :list="undertakUserList" isCell clearable />
        </div>
        <div class="moreContain-body" v-else>
          <RePick v-model="targetShellIdLocal" label="承接部门" @change="handleTargetShellId" :list="undertakBranchList" v-if="undertakBranchList.length" titleKey="text" isCascader isShowSearch isCell clearable childrenKey="children" />
          <RePick v-model="listQuery.targetUserIdsLocal" label="承接人" isShowSearch :emptyToastTitle="!listQuery.targetShellIdLocal ? '请先选择承接部门' : ''" :list="undertakUserList" isCell clearable v-if="undertakBranchList.length" />
          <RePick v-model="handoverType" label="承接类型" @change="handleHandoverType" :list="handoverTypeOptions" isCell clearable />
          <RePick v-model="handoverSysId" label="移交系统" @change="handleHandoverSysId" :isShowSearch="listQuery.handoverType == 1" :list="undertakSystemList" isCell :emptyToastTitle="!listQuery.handoverType && listQuery.handoverType !==0 ? '请先选择承接类型' : ''" />
          <RePick v-model="shellIdsLocal" label="移交部门" @change="handleHandoverShell($event,'handoverUserIdLocal')" :list="handoverBranchList" :emptyToastTitle="!listQuery.handoverSysId ? '请先选择移交系统' : ''" isCascader isCell clearable titleKey="text" childrenKey="children" />
          <RePick v-model="listQuery.handoverUserIdLocal" label="移交人" isShowSearch :list="handoverUser" isCell clearable :emptyToastTitle="!listQuery.shellIdsLocal ? '请先选择移交部门' : ''" />
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
import { mapState } from 'vuex'
import dayjs from 'dayjs'
import { _toFixed, dayTextFormatter } from '@/utils'
import { sourceCascadeApi, examYearListApi } from '@/api/common'
import { targetShellBoxApi, getHandoverUserApi } from '@/api/potentialGuest/activity'
import { targetSysBoxApi } from '@/api/potentialGuest/paymentRecord'
export default {
  props: {
    listType: String,
    paramProp: Object,
    countData: Object
  },
  components: {
    ReQuickDateBtns: () => import('@/components/ReComponents/ReQuickDateBtns'),
    RePick: () => import('@/components/ReComponents/RePick'),
    // ReYear: () => import('@/components/ReComponents/ReYear')
  },
  data() {
    return {
      shellIdsLocal: null,
      handoverType: null,
      targetSysId: null,
      handoverSysId: null,
      targetShellIdLocal: null,
      startDate: null,
      endDate: null,
      dayTextFormatter: dayTextFormatter,
      undertakSystemList: [], // 承接系统
      undertakBranchList: [], // 承接部门
      undertakUserList: [], // 承接人
      handoverBranchList: [], // 移交部门
      yearList: [],
      sourceList: [],
      isSearch: false,
      handoverUser: [], // 移交人
      userPersons: [], // 承接人
      title: '请选择',
      moreFilterShow: false,
      defaultDate: null,
      listQuery: { handoverKeyword: '', fillType: [] },
      schoolList: [],
      pickerCheckValue: null
    }
  },
  computed: {
    ...mapState({
      currentSystemId: state => state.common.systems.currentSystem.id,
      sortRuleList: state => state.handover.queryList.sortRuleList,
      sortRuleList1: state => state.handover.queryList.sortRuleList1,
      sortRuleList2: state => state.handover.queryList.sortRuleList2,
      payTypes: state => state.handover.queryList.payTypes,
      handoverTypeOptions: state => state.handover.queryList.handoverTypeOptions,
      systemList: state => state.common.setting.systemList,
      queryList: state => state.activity.queryList,
      authDepartList: state => state.common.user.authDepartList,
      consultTypeList: state => state.consultation.queryList.consultTypeList,
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
      isHandoverStateList(state) {
        return state.handover.queryList[this.listType == 1 ? 'isHandoverStateList' : 'isReceiveStateList']
      },
      opponents(state) {
        if (this.listType) {
          return state.activity[this.listType == 2 ? 'queryBookList' : this.listType == 3 ? 'queryRivalList' : 'queryList'].opponents
        } else return state.activity.queryList.opponents
      }
    }),
    isMoreAct() {
      const listQuery = this.listQuery || {}
      const { handoverType, targetShellIdLocal, targetUserIdsLocal, shellIdsLocal, sourceChannelId, examYear, handoverUserId, targetSysId, handoverSysId, handoverUserIdLocal } = listQuery
      if (handoverType || targetShellIdLocal || targetUserIdsLocal || shellIdsLocal) {
        return true
      } else if (['1', '2'].includes(this.listType) && (sourceChannelId || examYear || (handoverUserId && handoverUserId.length) || targetSysId)) {
        return true
      } else if (['3', '4'].includes(this.listType) && (handoverSysId || handoverUserIdLocal)) {
        return true
      } else return false
    },
    isHtab2() {
      let isShow = false
      if (this.paramProp.fillType && this.paramProp.fillType.length) isShow = true
      return isShow
    },
    isHtab3() {
      let isShow = false
      if (this.paramProp.dateType) isShow = true
      return isShow
    }
  },
  filters: {
    moneyFmt(val) {
      if (val >= 10000) {
        return _toFixed(val / 10000) + '万元'
      } else return val + '元'
    }
  },
  created() {
    if (this.listType == '1') { this.handleSource(); this.handleYearList() }
    if (['3', '4'].includes(this.listType)) {
      this.handleTargetSysId(this.currentSystemId)
    }

  },
  methods: {
    handleHandoverType(type) {
      if (this.listQuery.handoverType !== type) {
        if (['1', '2'].includes(this.listType)) {
          this.targetSysId = null
          this.targetShellIdLocal = null
          this.$set(this.listQuery, 'targetSysId', null)
          this.$set(this.listQuery, 'targetShellIdLocal', null)
          this.$set(this.listQuery, 'targetUserIdsLocal', null)
        } else {
          this.handoverSysId = null
          this.shellIdsLocal = null
          this.$set(this.listQuery, 'handoverSysId', null)
          this.$set(this.listQuery, 'shellIdsLocal', null)
          this.$set(this.listQuery, 'handoverUserIdLocal', null)
        }
      }
      this.$set(this.listQuery, 'handoverType', type)
      if (type || type === 0) {
        targetSysBoxApi(type).then(res => {
          this.undertakSystemList = res.data || []
          if (this.undertakSystemList.length === 1) {
            const { id } = this.undertakSystemList[0]
            if (['1', '2'].includes(this.listType)) {
              this.targetSysId = id
              this.$set(this.listQuery, 'targetSysId', id)
              this.handleTargetSysId(this.targetSysId)
            } else {
              this.targetShellIdLocal = id
              this.$set(this.listQuery, 'targetShellIdLocal', id)
              this.handleHandoverSysId(this.targetShellIdLocal)
            }
          }
        })
      } else this.undertakSystemList = []
    },
    handleTargetSysId(sysId) {
      if (this.listQuery.targetSysId !== sysId) {
        this.targetShellIdLocal = null
        this.$set(this.listQuery, 'targetShellIdLocal', null)
        this.$set(this.listQuery, 'targetUserIdsLocal', null)
      }
      this.$set(this.listQuery, 'targetSysId', sysId)
      if (sysId) {
        targetShellBoxApi(sysId).then(res => {
          this.undertakBranchList = res.data || []
        })
      } else this.undertakBranchList = []
    },
    handleHandoverSysId(sysId) {
      if (this.listQuery.handoverSysId !== sysId) {
        this.shellIdsLocal = null
        this.$set(this.listQuery, 'shellIdsLocal', null)
        this.$set(this.listQuery, 'handoverUserIdLocal', null)
      }
      this.$set(this.listQuery, 'handoverSysId', sysId)
      if (sysId) {
        targetShellBoxApi(sysId).then(res => {
          this.handoverBranchList = res.data || []
        })
      } else this.handoverBranchList = []
    },
    handleTargetShellId(shellId) {
      if (this.listQuery.targetShellIdLocal !== shellId) {
        this.$set(this.listQuery, 'targetUserIdsLocal', null)
      }
      this.$set(this.listQuery, 'targetShellIdLocal', shellId)

      if (shellId) {
        getHandoverUserApi(shellId).then(res => {
          this.undertakUserList = res.data || []
        })
      } else this.undertakUserList = []
    },
    handleHandoverShell(shellId, key) {
      if (this.listQuery.shellIdsLocal !== shellId) {
        this.$set(this.listQuery, key, key == 'handoverUserId' ? [] : null)
      }
      this.$set(this.listQuery, 'shellIdsLocal', shellId)
      if (shellId) {
        getHandoverUserApi(shellId).then(res => {
          this.handoverUser = res.data || []
        })
      } else this.handoverUser = []
    },
    // 更多重置
    handleMoreReset() {
      if (['1', '2'].includes(this.listType)) {
        this.listQuery.sourceChannelId = null
        this.listQuery.examYear = null
        this.listQuery.handoverUserId = []
        this.targetSysId = null
        this.listQuery.targetSysId = null
      } else {
        this.handoverSysId = null
        this.listQuery.handoverSysId = null
        this.listQuery.handoverUserIdLocal = null
      }
      if (['1', '3'].includes(this.listType)) {
        this.listQuery.titleType = null
      } else this.listQuery.fillType = []

      this.listQuery.startDateChoose = null // 开始时间
      this.listQuery.endDateChoose = null // 结束时间
      this.listQuery.handoverKeyword = null // 关键词
      this.handoverType = null // 移交or承接类型
      this.listQuery.handoverType = null // 移交or承接类型
      this.targetShellIdLocal = null // 承接部门
      this.listQuery.targetShellIdLocal = null // 承接部门
      this.listQuery.targetUserIdsLocal = null // 承接人
      this.listQuery.dateType = null // 日期类型
      this.shellIdsLocal = null // 移交部门
      this.listQuery.shellIdsLocal = null // 移交部门
    },
    handleMoreConfirm() {
      this.$emit('onListQuery', this.listQuery)
      this.moreFilterShow = false
    },
    onKeywordSearch() {
      this.$emit('onListQuery', this.listQuery)
    },
    onKeywordClear(val) {
    },
    onKeywordCancel() {
      this.isSearch = false
    },
    handleQuickDate(e) {
      this.defaultDate = [dayjs(e.time[0]).toDate(), dayjs(e.time[1]).toDate()]
      this.listQuery.startDateChoose = ['1', '3'].includes(this.listType) ? dayjs(e.time[0]).format('YYYY-MM-DD') : e.time[0]
      this.listQuery.endDateChoose = ['1', '3'].includes(this.listType) ? dayjs(e.time[1]).format('YYYY-MM-DD') : e.time[1]
      this.startDate = e.time[0]
      this.endDate = e.time[1]
    },
    handleInit() {
      this.defaultDate = null
      this.listQuery = {
        ...this.paramProp,
        shellIds: this.paramProp.shellIds ? [...this.paramProp.shellIds] : []
      }
      if (this.listQuery.startDateChoose && this.listQuery.endDateChoose) {
        this.defaultDate = [dayjs(this.listQuery.startDateChoose).toDate(), dayjs(this.listQuery.endDateChoose).toDate()]
      } else {
        this.handleDateReset()
      }
    },
    handleDropOpen(val) {
      this.handleInit()
      /* this.$nextTick(() => {
        if (val === 4) {
          this.$refs.vanCalendar.scrollToDate(new Date())
        }
      }) */
    },
    // 搜索
    handleSearch() {
      this.listQuery.handoverKeyword = this.paramProp.handoverKeyword
      this.isSearch = true
    },
    // 更多筛选
    handleMoreFilter() {
      this.handleInit()
      this.moreFilterShow = true
    },
    // 状态
    handleType(val) {
      this.$set(this.listQuery, 'titleType', val)
    },
    handleDateType(val) {
      this.$set(this.listQuery, 'dateType', this.listQuery.dateType == val ? null : val)
    },
    // 缴费类型
    handleMethod(val) {
      const i = this.listQuery.fillType.findIndex(item => item === val)
      if (i > -1) {
        this.listQuery.fillType.splice(i, 1)
      } else {
        this.listQuery.fillType.push(val)
      }
    },
    // 快捷筛选
    handleStatics(id) {
      if (this.listQuery.statisticsType === id) {
        this.listQuery.statisticsType = null
      } else {
        this.listQuery.statisticsType = id
      }
    },
    // 日期类型
    handleConsultState(id) {
      if (this.listQuery.consultState === id) {
        this.listQuery.consultState = null
      } else {
        this.listQuery.consultState = id
      }
    },
    handleCheck(name) {
      this.listQuery[name] = !this.listQuery[name]
    },
    handleDateSelect(val) {
      if (val.filter(item => item).length === 2) {
        this.$set(this.listQuery, 'startDateChoose', ['1', '3'].includes(this.listType) ? dayjs(val[0]).format('YYYY-MM-DD') : val[0])
        this.$set(this.listQuery, 'endDateChoose', ['1', '3'].includes(this.listType) ? dayjs(val[1]).format('YYYY-MM-DD') : val[1])
        this.startDate = dayjs(val[0]).format('YYYY/MM/DD')
        this.endDate = dayjs(val[1]).format('YYYY/MM/DD')
      } else {
        this.$set(this.listQuery, 'startDateChoose', null)
        this.$set(this.listQuery, 'endDateChoose', null)
        this.startDate = null
        this.endDate = null
      }
    },
    // 日历重置
    handleDateReset() {
      this.defaultDate = null
      this.$refs.vanCalendar && this.$refs.vanCalendar.reset()
    },
    handleReset(num) {
      if (num === 1) {
        if (this.listType == 2) {
          this.listQuery.sendBookType = null
        } else this.listQuery.type = null
      } else if (num === 2) {
        this.listQuery.fillType = null
      } else if (num === 3) {
        this.handleDateReset()
        this.listQuery.startDateChoose = null
        this.listQuery.endDateChoose = null
        this.listQuery.dateType = null
        this.startDate = null
        this.endDate = null
      }
    },
    handleConfirm(key) {
      if (key === 3) { // 日期类型
        if (!this.listQuery.dateType) {
          this.$fm('请先选择日期类型！')
          return
        }
        if (!this.listQuery.startDateChoose || !this.listQuery.endDateChoose) {
          this.$fm('请先选择日期范围！')
          return
        }
      }
      if (['1', '3'].includes(this.listType)) {
        this.$refs.vanDropItem1.toggle(false)
      } else this.$refs.vanDropItem2.toggle(false)
      this.$refs.vanDropItem3.toggle(false)
      this.$emit('onListQuery', this.listQuery)
    },

    // 来源渠道
    handleSource() {
      sourceCascadeApi(2).then(res => {
        this.sourceList = res.data || []
      })
    },
    // 考试年份
    handleYearList() {
      examYearListApi().then(res => {
        this.yearList = res.data.filter(item => item)
      })
    }

  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
