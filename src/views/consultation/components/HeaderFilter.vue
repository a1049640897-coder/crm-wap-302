<template>
  <div class="header-filter" id="consulationHeader" :style="isActSearch ? 'padding: 0 0 0 0.5rem' : ''">
    <div class="hf-l-list" v-show="!isActSearch">
      <van-dropdown-menu class="hf-l-list-menu">
        <!-- 状态 :title-class="isHtab1 ? 'common-act-color' : ''" -->
        <van-dropdown-item v-if="['1', '4', '5', '7'].includes(listType)" title="状态" title-class="common-act-color" @open="handleDropOpen(1)" ref="vanDropItem1">
          <div class="hf-drop-view" v-if="stateList.length">
            <div class="hf-drop-contain">
              <div class="hr-drop-filter-item" @click="handleType(null)">
                <van-icon v-if="listQuery.currentState && !listQuery.currentState.length" name="success" color="#0088FE" />
                <span :class="{'hr-drop-filter-item-act': listQuery.currentState && !listQuery.currentState.length }">全部</span>
              </div>
              <div class="hr-drop-filter-item" @click="handleType(item.value)" v-for="item in stateList" :key="item.id">
                <van-icon v-if="listQuery.currentState && listQuery.currentState.includes(item.value)" name="success" color="#0088FE" />
                <span :class="{'hr-drop-filter-item-act': listQuery.currentState && listQuery.currentState.includes(item.value) }">{{item.text}}</span>
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
        <!-- 预约咨询状态 -->
        <van-dropdown-item v-else-if="['yuYueZiXun'].includes(listType)" title="状态" :title-class="isHtabYuYue ? 'common-act-color' : ''" @open="handleDropOpen(1)" ref="vanDropItem1">
          <div class="hf-drop-view" v-if="queryList.yuYueZiXunstateList.length">
            <div class="hf-drop-contain">
              <div class="hr-drop-filter-item" @click="handleYuYueType(null)">
                <van-icon v-if="!listQuery.yuYuetZiXunType" name="success" color="#0088FE" />
                <span :class="{'hr-drop-filter-item-act': !listQuery.yuYuetZiXunType }">全部</span>
              </div>
              <div class="hr-drop-filter-item" @click="handleYuYueType(item.value)" v-for="item in queryList.yuYueZiXunstateList" :key="item.id">
                <van-icon v-if="listQuery.yuYuetZiXunType === item.value" name="success" color="#0088FE" />
                <span :class="{'hr-drop-filter-item-act': listQuery.yuYuetZiXunType === item.value }">{{item.text}}</span>
              </div>
            </div>
            <div class="common-double-button">
              <van-button class="common-double-button-l" @click="handleReset('yuyue')">重置</van-button>
              <van-button class="common-double-button-r" @click="handleConfirm">确定</van-button>
            </div>
          </div>
          <div v-else class="hf-drop-contain-empty">
            暂无数据
          </div>
        </van-dropdown-item>
        <!-- 8 类型 -->
        <van-dropdown-item v-if="['8'].includes(listType)" title="类型" :title-class="isHtab8 ? 'common-act-color' : ''" @open="handleDropOpen(8)" ref="vanDropItem8">
          <div class="hf-drop-view" v-if="queryList.waitFollowTypeList.length">
            <div class="hf-drop-contain">
              <div class="hr-drop-filter-item" @click="handleWaitFollowType(null)">
                <van-icon v-if="!listQuery.distributeType" name="success" color="#0088FE" />
                <span :class="{'hr-drop-filter-item-act': !listQuery.distributeType }">全部</span>
              </div>

              <div class="hr-drop-filter-item" @click="handleWaitFollowType(item.id)" v-for="item in queryList.waitFollowTypeList" :key="item.id">
                <van-icon v-if="item.id === listQuery.distributeType" name="success" color="#0088FE" />
                <span :class="{'hr-drop-filter-item-act': item.id === listQuery.distributeType }">{{item.title}}</span>
              </div>
            </div>
            <div class="common-double-button">
              <van-button class="common-double-button-l" @click="handleReset(8)">重置</van-button>
              <van-button class="common-double-button-r" @click="handleConfirm">确定</van-button>
            </div>
          </div>
          <div v-else class="hf-drop-contain-empty">
            暂无数据
          </div>
        </van-dropdown-item>
        <!-- 意向类型 咨询用户、待分配、公海、待跟进 -->
        <van-dropdown-item v-if="['1', '5', '7', '8', 'yuYueZiXun'].includes(listType)" title="意向类型" :title-class="isHtab2 ? 'common-act-color' : ''" @open="handleDropOpen(2)" ref="vanDropItem2">
          <div class="hf-drop-view" v-if="queryList.intentionList.length">
            <div class="hf-drop-contain">
              <div class="hr-drop-filter-item" @click="handleIntention(item.value)" v-for="item in queryList.intentionList" :key="item.id">
                <van-icon v-if="listQuery.intentionIds && listQuery.intentionIds.includes(item.value)" name="success" color="#0088FE" />
                <span :class="{'hr-drop-filter-item-act': listQuery.intentionIds && listQuery.intentionIds.includes(item.value) }">{{item.text}}</span>
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
        <!-- 快捷筛选 -->
        <van-dropdown-item v-if="['1', '4', '5', '7'].includes(listType)" title="快捷筛选" :title-class="isHtab3 ? 'common-act-color' : ''" @open="handleDropOpen(3)" ref="vanDropItem3">
          <div class="hf-drop-view">
            <div class="hf-drop-quick" style="margin-top: 0;">
              <!-- 回访周期 -->
              <div class="hf-drop-quick-item" v-if="['1', '5'].includes(listType)">
                <div class="hf-drop-quick-title">回访周期</div>
                <div class="hf-drop-quick-list">
                  <div class="hf-drop-quick-list-item" :class="{ 'hf-drop-quick-list-item-act': listQuery.statisticsType === item.id }" @click="handleReturnVisit(item.id)" v-for="item in queryList.filterDateRange" :key="item.id">{{item.title}}</div>
                </div>
              </div>
              <!-- 用户标签 -->
              <div class="hf-drop-quick-item" v-if="['1', '5'].includes(listType)">
                <div class="hf-drop-quick-title">用户标签</div>
                <div class="hf-drop-quick-list">
                  <div class="hf-drop-quick-list-item" :class="{ 'hf-drop-quick-list-item-act': listQuery.statisticsType === item.id }" @click="handleStatics(item.id)" v-for="item in queryList.statisticsTypeList" :key="item.id">{{item.title}}</div>
                </div>
              </div>
              <!-- 预约状态 -->
              <div class="hf-drop-quick-item" v-if="['1', '4', '5'].includes(listType)">
                <div class="hf-drop-quick-title">预约状态</div>
                <div class="hf-drop-quick-list">
                  <div class="hf-drop-quick-list-item" :class="{ 'hf-drop-quick-list-item-act': listQuery.consultState === item.id }" @click="handleConsultState(item.id)" v-for="item in queryList.consultMobilesList" :key="item.id">{{item.title}}</div>
                </div>
              </div>
              <!-- 默认不看 -->
              <div class="hf-drop-quick-item" v-if="['1', '4', '5'].includes(listType)">
                <div class="hf-drop-quick-title">默认不看</div>
                <div class="hf-drop-quick-list">
                  <van-checkbox class="hf-drop-quick-list-item-checkbox" @click="handleCheck('noneHigh')" :value="!!listQuery.noneHigh" icon-size="1rem" shape="square">不看已报高端</van-checkbox>
                  <van-checkbox class="hf-drop-quick-list-item-checkbox" @click="handleCheck('handover')" :value="!!listQuery.handover" icon-size="1rem" shape="square">不看已移交</van-checkbox>
                  <van-checkbox v-if="['1', '5', '7'].includes(listType)" class="hf-drop-quick-list-item-checkbox" @click="handleCheck('visit')" :value="!!listQuery.visit" icon-size="1rem" shape="square">不看无需回访</van-checkbox>
                  <!-- <div class="hf-drop-quick-list-item" :class="{ 'hf-drop-quick-list-item-act': listQuery.consultState === item.id }" @click="handleConsultState(item.id)" v-for="item in queryList.consultMobilesList" :key="item.id">{{item.title}}</div> -->
                </div>
              </div>
              <!-- 回访周期 -->
              <div class="hf-drop-quick-item" v-if="['1', '5', '7'].includes(listType)">
                <div class="hf-drop-quick-title">排序规则</div>
                <div class="hf-drop-quick-list">
                  <ReSort v-model="listQuery.sortRule" :info="item" v-for="(item, index) in sortRuleList" :key="index" />
                </div>
              </div>
            </div>
            <div class="common-double-button">
              <van-button class="common-double-button-l" @click="handleReset(3)">重置</van-button>
              <van-button class="common-double-button-r" @click="handleConfirm">确定</van-button>
            </div>
          </div>
        </van-dropdown-item>
        <!-- 日期类型 -->
        <van-dropdown-item v-if="['1', '4', '5', '7'].includes(listType)" :title="listType == 4 ? '添加日期' : '日期类型'"  :title-class="isHtab4 ? 'common-act-color' : ''" @open="handleDropOpen(4)" ref="vanDropItem4">
          <div class="hf-drop-view">
            <div class="hf-drop-quick" style="margin-top: 0;">
              <div class="hf-drop-quick-item" style="margin-bottom: 0;">
                <!-- <div class="hf-drop-quick-title">回访周期</div> -->
                <div class="hf-drop-quick-list" v-if="listType != 4">
                  <div class="hf-drop-quick-list-item" :class="{ 'hf-drop-quick-list-item-act': listQuery.dateType === item.value }" @click="handleDateType(item.value)" v-for="item in queryList.dateTypeList" :key="item.id">{{item.text}}</div>
                </div>
                <ReQuickDateBtns :startData="listQuery.startDate" :endData="listQuery.endDate" @change="handleQuickDate" style="margin-top: 1rem;" />
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
        <!-- 分配转交日期 -->
        <van-dropdown-item v-if="['8', 'yuYueZiXun'].includes(listType)" :title="listType === '8' ? '分配转交日期' : listType === 'yuYueZiXun' ? '预约日期' : ''" :title-class="isHtab9 ? 'common-act-color' : ''" @open="handleDropOpen(9)" ref="vanDropItem9">
          <div class="hf-drop-view">
            <div class="hf-drop-quick" style="margin-top: 0;">
              <div class="hf-drop-quick-item" style="margin-bottom: 0;">
                <ReQuickDateBtns :startData="listQuery.distributeStartDate" :endData="listQuery.distributeEndDate" @change="handleDisAndOverQuickDate" style="margin-top: 1rem;" />
                <div class="hf-drop-quick-calendar">
                  <van-calendar ref="vanDisAndOverCalendar" :formatter="dayTextFormatter" @select="handleDisAndOverDateSelect" :default-date="defaultDisAndOverDate" :poppable="false" type="range" :show-title="false" color="#0088FE" :show-confirm="false" allow-same-day :min-date="new Date('2013/01/01')" :style="{ height: '400px' }" />
                </div>
              </div>
            </div>
            <div class="common-double-button">
              <van-button class="common-double-button-l" @click="handleReset(8)">重置</van-button>
              <van-button class="common-double-button-r" @click="handleConfirm">确定</van-button>
            </div>
          </div>
        </van-dropdown-item>
      </van-dropdown-menu>
    </div>
    <div class="hf-r-list" v-show="!isActSearch">
      <div class="hf-r-list-item" @click="handleSearch">
        <div class="hf-r-icon-bg" :class="{'hf-r-icon-bg-act': listQuery.keyword }">
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
    <div style="width: 100%;" v-show="isActSearch">
      <van-search class="searchInput" v-model="listQuery.keyword" @search="onSearch" @clear="onSearch" placeholder="请输入学员姓名、手机号码、微信、QQ" show-action background="#ffffff">
        <template #action>
          <div style="font-size: 0.76rem;" @click="handleSearchCancel">取消</div>
        </template>
      </van-search>
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
        <div class="common-popup-body moreContain-body">
          <van-form ref="filterForm" :show-error-message="false" validate-trigger="" :submit-on-enter="false">
            <RePick v-model="listQuery.shellIdsLocal" label="所属部门" :list="authDepartList" isCascader isShowSearch isCell clearable childrenKey="child" />
            <RePick v-model="listQuery.schoolIdLocal" label="就读学校" :list.sync="schoolList" isCascader isShowSearch isCell clearable isOriginSchoolSearch />
            <RePick v-model="listQuery.areaId" label="市场区域" :list="authAreaList" multiple isCell clearable />
            <!-- <RePick v-model="listQuery.graduationYearLocal" label="毕业年份" :list="graduationList" titleKey="text" idKey="value" isCell clearable /> -->
            <ReYear v-model="listQuery.graduationYearLocal" label="毕业年份" clearable />
            <RePick v-model="listQuery.isFreshLocal" label="属性" :list="isFreshList" titleKey="text" idKey="value" isCell clearable />
            <!-- 考试年份/考试界别 -->
            <!-- <RePick v-model="listQuery.examYearLocal" :label="examYearText" :list="yearList" titleKey="text" idKey="value" isCell clearable /> -->
            <ReYear v-model="listQuery.examYearLocal" :label="examYearText" clearable />
            <RePick v-if="['1', 'yuYueZiXun', '8', '7', '5'].includes(listType)" v-model="listQuery.consultTypeLocal" label="咨询类型" :list="consultTypeList" titleKey="text" idKey="value" isCell clearable />
            <RePick v-if="['yuYueZiXun'].includes(listType)" v-model="listQuery.resultIdLocal" label="咨询结果" :list="resultList" isCell clearable />
            <RePick v-if="['1', 'yuYueZiXun', '8', '5', '7'].includes(listType)" v-model="listQuery.intentionCourseIds" label="意向班型" :list="classList" multiple titleKey="text" idKey="value" isShowSearch isCell clearable />
            <RePick v-model="listQuery.cityId" label="所在城市" :list="cityTreeList" isCascader isShowSearch titleKey="text" idKey="id" isCell clearable childrenKey="children" />
            <RePick v-model="listQuery.sourceId" label="来源渠道" :list="sourceList" isCascader isShowSearch titleKey="text" idKey="id" isCell clearable childrenKey="children" />
            <RePick v-model="listQuery.campusLocal" label="市场区域负责人" :list="campusLis" titleKey="text" idKey="value" isShowSearch isCell clearable />
            <RePick v-if="['1', '4', '8'].includes(listType)" v-model="listQuery.ownLocal" label="所属人" :list="ownList" titleKey="text" idKey="value" isShowSearch isCell clearable />
            <RePick v-if="['yuYueZiXun'].includes(listType)" v-model="listQuery.consultantIdLocal" label="咨询/市场" :list="consultantList" isShowSearch isCell clearable />
            <RePick v-if="['7'].includes(listType)" v-model="listQuery.seaPutUserIdsLocal" label="投放人" :list="setPutList" isCell clearable isShowSearch />
            <RePick v-if="['7'].includes(listType)" v-model="listQuery.creatorIdsLocal" label="添加人" :list="setPutList" isCell clearable isShowSearch />
          </van-form>
        </div>
        <div class="common-popup-footer">
          <van-button style="width: 8rem; margin-right: 1rem;" @click="handleMoreReset">重置</van-button>
          <van-button type="info" style="width: 8rem;" @click.stop="handleMoreConfirm">确认</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { dayTextFormatter } from '@/utils'
import { mapState } from 'vuex'
import dayjs from 'dayjs'

export default {
  props: {
    listType: String,
    paramProp: Object
  },
  components: {
    ReSort: () => import('@/components/ReComponents/ReSort'),
    RePick: () => import('@/components/ReComponents/RePick'),
    ReQuickDateBtns: () => import('@/components/ReComponents/ReQuickDateBtns'),
    ReYear: () => import('@/components/ReComponents/ReYear')
  },
  data() {
    return {
      dayTextFormatter: dayTextFormatter,
      isActSearch: false,
      title: '请选择',
      moreFilterShow: false,
      defaultDate: null,
      defaultDisAndOverDate: null,
      listQuery: {},
      schoolList: []
    }
  },
  computed: {
    ...mapState({
      queryList: state => state.consultation.queryList,
      authDepartList: state => state.common.user.authDepartList,
      authAreaList: state => state.common.user.authAreaList,
      yearList: state => state.consultation.queryList.yearList,
      graduationList: state => state.consultation.queryList.graduationList,
      isFreshList: state => state.consultation.queryList.isFreshList,
      consultTypeList: state => state.consultation.queryList.consultTypeList,
      classList: state => state.consultation.queryList.classList,
      sourceList: state => state.consultation.queryList.sourceList,
      ownList: state => state.consultation.queryList.ownList,
      //  state.consultation.queryList.cityTreeList
      cityTreeList: state => state.common.setting.allProvicesAndCitys,
      campusLis: state => state.consultation.queryList.campusLis,
      setPutList: state => state.consultation.queryList.setPutList,
      resultList: state => state.consultation.yyzxQueryList.resultList,
      consultantList: state => state.consultation.yyzxQueryList.consultantList,
      examYearText: state => state.common.setting.examYearText,
      stateList(state) {
        if (this.listType == 4) {
          return state.consultation.queryList.noCounselStateList
        } else return state.consultation.queryList.stateList
      },
      sortRuleList(state) {
        if (this.listType == 7) {
          return state.consultation.queryList.sortSeasRuleList
        } else return state.consultation.queryList.sortRuleList
      }
    }),
    isMoreAct() {
      let bol = false
      const listQuery = this.paramProp || {}
      if (listQuery.shellIdsLocal || listQuery.schoolIdLocal || listQuery.isFreshLocal || (listQuery.areaId && listQuery.areaId.length) || listQuery.graduationYearLocal || listQuery.isFreshLoca || listQuery.examYearLocal || listQuery.consultTypeLocal || (listQuery.intentionCourseIds && listQuery.intentionCourseIds.length) || listQuery.cityId || listQuery.sourceId || listQuery.campusLocal || listQuery.ownLocal || listQuery.activityId || listQuery.resultIdLocal || listQuery.consultantIdLocal || listQuery.seaPutUserIdsLocal || listQuery.creatorIdsLocal) {
        bol = true
      }
      return bol
    },
    isHtab1() {
      let isShow = false
      if (this.paramProp.currentState.length) isShow = true
      return isShow
    },
    isHtab2() {
      let isShow = false
      if (this.paramProp.intentionIds && this.paramProp.intentionIds.length) isShow = true
      return isShow
    },
    isHtab3() {
      let isShow = false
      if (this.paramProp.statisticsType) {
        isShow = true
      } else if (this.paramProp.consultState) {
        isShow = true
      } else if (this.paramProp.noneHigh || this.paramProp.handover || this.paramProp.visit) {
        isShow = true
      } else if (this.listType === '4' ? false : this.paramProp.sortRule && Object.keys(this.paramProp.sortRule).length) {
        isShow = true
      }
      return isShow
    },
    isHtab4() {
      let isShow = this.listType !== '4'
      if (this.paramProp.startDate) {
        isShow = true
      }
      return isShow
    },
    isHtab8() {
      let isShow = false
      if (this.paramProp.distributeType) {
        isShow = true
      }
      return isShow
    },
    isHtab9() {
      let isShow = false
      if (this.paramProp.distributeStartDate && this.paramProp.distributeEndDate) {
        isShow = true
      }
      return isShow
    },
    isHtabYuYue() {
      let isShow = false
      if (this.paramProp.yuYuetZiXunType) {
        isShow = true
      }
      return isShow
    }
  },
  methods: {
    handleWaitFollowType(e) {
      this.listQuery.distributeType = e
    },
    handleInit() {
      this.defaultDate = null
      this.defaultDisAndOverDate = null
      this.listQuery = {
        ...this.paramProp,
        shellIds: [...this.paramProp.shellIds],
        intentionIds: [...this.paramProp.intentionIds],
        intentionCourseIds: [...this.paramProp.intentionCourseIds],
        consultType: [...this.paramProp.consultType],
        examYear: [...this.paramProp.examYear],
        isFresh: [...this.paramProp.isFresh],
        campus: [...this.paramProp.campus],
        currentState: [...this.paramProp.currentState],
        own: [...this.paramProp.own],
        reserveState: [...this.paramProp.reserveState],
        graduationYear: [...this.paramProp.graduationYear],
        areaId: [...this.paramProp.areaId],
        resultId: [...this.paramProp.resultId],
        consultantId: [...this.paramProp.consultantId],
        sortRule: { ...this.paramProp.sortRule }
      }
      if (this.listQuery.startDate && this.listQuery.endDate) {
        this.defaultDate = [dayjs(this.listQuery.startDate).toDate(), dayjs(this.listQuery.endDate).toDate()]
      } else if (this.listQuery.distributeStartDate && this.listQuery.distributeEndDate) {
        this.defaultDisAndOverDate = [dayjs(this.listQuery.distributeStartDate).toDate(), dayjs(this.listQuery.distributeEndDate).toDate()]
      } else {
        this.handleDateReset()
      }
    },
    handleDropOpen(val) {
      this.handleInit()
      this.$nextTick(() => {
        if (val === 4) {
          this.$refs.vanCalendar.scrollToDate(new Date())
        } else if (val === 9) {
          this.$refs.vanDisAndOverCalendar.scrollToDate(new Date())
        }
      })
    },
    onSearch() {
      this.handleConfirm()
    },
    // 搜索
    handleSearch() {
      if (['yuYueZiXun', '8'].includes(this.listType)) {
        this.handleInit()
        this.isActSearch = true
      } else {
        this.$router.push({
          path: '/searchstudent'
        })
      }
    },
    handleSearchCancel() {
      this.isActSearch = false
    },
    // 更多筛选
    handleMoreFilter() {
      this.handleInit()
      this.moreFilterShow = true
    },
    // 状态
    handleType(val) {
      this.listQuery.currentState = val || val == 0 ? [val] : []
    },
    // 预约状态
    handleYuYueType(val) {
      this.listQuery.yuYuetZiXunType = val
    },
    // 意向类型
    handleIntention(val) {
      const i = this.listQuery.intentionIds.findIndex(item => item === val)
      if (i > -1) {
        this.listQuery.intentionIds.splice(i, 1)
      } else {
        this.listQuery.intentionIds.push(val)
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
    // 回访周期
    handleReturnVisit(id) {
      if (this.listQuery.statisticsType === id) {
        this.listQuery.statisticsType = null
        this.listQuery.startDate = null
        this.listQuery.endDate = null
      } else {
        this.listQuery.statisticsType = id
        if (id === 6) {
          this.listQuery.endDate = dayjs().format('YYYY/MM/DD')
        } else if (id === 7) {
          this.dateRange = [dayjs().format('YYYY/MM/DD'), dayjs().add(2, 'day').format('YYYY/MM/DD')]
          this.listQuery.endDate = dayjs().add(2, 'day').format('YYYY/MM/DD')
        } else if (id === 8) {
          this.dateRange = [dayjs().format('YYYY/MM/DD'), dayjs().add(6, 'day').format('YYYY/MM/DD')]
          this.listQuery.endDate = dayjs().add(6, 'day').format('YYYY/MM/DD')
        }
        this.listQuery.startDate = dayjs().format('YYYY/MM/DD')
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
    handleDateType(id) {
      this.listQuery.dateType = id
    },

    handleDateSelect(val) {
      if (val.filter(item => item).length === 2) {
        this.listQuery.startDate = dayjs(val[0]).format('YYYY/MM/DD')
        this.listQuery.endDate = dayjs(val[1]).format('YYYY/MM/DD')
      }
    },
    handleDisAndOverDateSelect(val) {
      if (val.filter(item => item).length === 2) {
        this.listQuery.distributeStartDate = dayjs(val[0]).format('YYYY/MM/DD')
        this.listQuery.distributeEndDate = dayjs(val[1]).format('YYYY/MM/DD')
      }
    },
    // 日历重置
    handleDateReset() {
      this.defaultDate = null
      this.$refs.vanCalendar && this.$refs.vanCalendar.reset()
    },
    // 分配转交日历重置
    handleDisAndOverDateReset() {
      this.defaultDisAndOverDate = null
      this.$refs.vanDisAndOverCalendar && this.$refs.vanDisAndOverCalendar.reset()
    },
    handleReset(num) {
      if (num === 1) {
        this.listQuery.dateType = this.listType === '4' ? 1 : this.listType === '1' ? 3 : 2
        this.listQuery.currentState = []
      } else if (num === 2) {
        this.listQuery.intentionIds = []
      } else if (num === 3) {
        this.listQuery.statisticsType = null
        this.listQuery.consultState = null
        this.listQuery.handover = ['7', '8'].includes(this.listType) ? 0 : 1
        this.listQuery.noneHigh = ['3','7', '8'].includes(this.listType) ? 0 : 1
        this.listQuery.visit = ['4','7', '8'].includes(this.listType) ? 0 : 1
        this.listQuery.sortRule = this.listType === '1' ? { title: '最后回访', type: 1, column: "lastConsultTime" }
          : this.listType === '4' ? { title: '添加日期', type: 1, column: 'addTime' }
          : this.listType === '5' ? { title: '添加日期', type: 1, column: 'addTime' }
          : this.listType === '7' ? { title: '投放日期', type: 1, column: 'seaPutTime' } 
          : this.listType === '8' ? { title: '添加日期', type: 1, column: 'addTime' } 
          : this.listType === 'yuYueZiXun' ? { title: '添加日期', type: 1, column: 'addTime' }: {}
      } else if (num === 4) {
        this.handleDateReset()
        this.listQuery.dateType = this.listType === '4' ? 1 : this.listType === '1' ? 3 : 2
        this.listQuery.startDate = null
        this.listQuery.endDate = null
      } else if (num === 8) {
        this.handleDisAndOverDateReset()
        this.listQuery.distributeType = null
        this.listQuery.distributeStartDate = null
        this.listQuery.distributeEndDate = null
      } else if (num === 'yuyue') {
        this.listQuery.yuYuetZiXunType = 8
      }
      // const obj = JSON.parse(JSON.stringify(this.paramProp))
    },
    handleConfirm() {
      this.$emit('onListQuery', this.listQuery)
      this.$refs.vanDropItem1 && this.$refs.vanDropItem1.toggle(false)
      this.$refs.vanDropItem2 && this.$refs.vanDropItem2.toggle(false)
      this.$refs.vanDropItem3 && this.$refs.vanDropItem3.toggle(false)
      this.$refs.vanDropItem4 && this.$refs.vanDropItem4.toggle(false)
      this.$refs.vanDropItem8 && this.$refs.vanDropItem8.toggle(false)
      this.$refs.vanDropItem9 && this.$refs.vanDropItem9.toggle(false)
    },

    handleQuickDate(e) {
      this.defaultDate = [dayjs(e.time[0]).toDate(), dayjs(e.time[1]).toDate()]
      this.listQuery.startDate = e.time[0]
      this.listQuery.endDate = e.time[1]
    },

    handleDisAndOverQuickDate(e) {
      this.defaultDisAndOverDate = [dayjs(e.time[0]).toDate(), dayjs(e.time[1]).toDate()]
      this.listQuery.distributeStartDate = e.time[0]
      this.listQuery.distributeEndDate = e.time[1]
    },
    // 更多重置
    handleMoreReset() {
      this.listQuery.shellIds = []
      this.listQuery.shellIdsLocal = null
      this.listQuery.schoolId = []
      this.listQuery.schoolIdLocal = null
      this.listQuery.cityId = null
      this.listQuery.sourceId = null
      this.listQuery.intentionCourseIds = []
      this.listQuery.consultType = []
      this.listQuery.consultTypeLocal = null
      this.listQuery.examYear = []
      this.listQuery.examYearLocal = null
      this.listQuery.isFresh = []
      this.listQuery.isFreshLocal = null
      this.listQuery.campus = []
      this.listQuery.campusLocal = null
      this.listQuery.areaId = []
      this.listQuery.own = []
      this.listQuery.ownLocal = null
      this.listQuery.graduationYear = []
      this.listQuery.graduationYearLocal = null
      this.listQuery.resultId = []
      this.listQuery.resultIdLocal = null
      this.listQuery.consultantId = []
      this.listQuery.consultantIdLocal = null
    },
    handleMoreConfirm() {
      // this.$refs.filterForm.validate().then(() => {
      this.$emit('onListQuery', this.listQuery)
      this.moreFilterShow = false
      // }).catch(rec => {
      //   console.log(rec, 2)
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
