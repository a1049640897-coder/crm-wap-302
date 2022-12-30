<template>
  <div id="consulationHeader">
    <div class="hf-l-seacrch" v-if="isSearch">
      <form action="/">
        <van-search v-model="listQuery.keyword" shape="round" show-action :placeholder="listType == 2 ? '请输入活动名称':'请输入讲座名称'" :clearable="false" @search="onKeywordSearch" @cancel="onKeywordCancel" @clear="onKeywordClear" />
      </form>
    </div>

    <div class="header-filter" v-else-if="listType!=='4'">
      <div class="hf-l-list">
        <van-dropdown-menu class="hf-l-list-menu">
          <!-- 讲座/活动类型 -->
          <van-dropdown-item :title="listType == 2 ? '活动类型':'讲座类型'" :title-class="isHtab1 ? 'common-act-color' : ''" @open="handleDropOpen(1)" ref="vanDropItem1">
            <div class="hf-drop-view" v-if="types.length">
              <div class="hf-drop-contain">
                <div class="hr-drop-filter-item" @click="handleType(item.value)" v-for="item in types" :key="item.id">
                  <div v-if="listType == 2">
                    <van-icon v-if="listQuery.sendBookType && item.value == listQuery.sendBookType" name="success" color="#0088FE" />
                    <span :class="{'hr-drop-filter-item-act': listQuery.sendBookType && item.value == listQuery.sendBookType }">{{item.text}}</span>
                  </div>
                  <div v-else>
                    <van-icon v-if="listQuery.type && item.value == listQuery.type" name="success" color="#0088FE" />
                    <span :class="{'hr-drop-filter-item-act': listQuery.type && item.value == listQuery.type }">{{item.text}}</span>
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
          <!-- 授课类型 -->
          <van-dropdown-item v-if="listType != 2" title="授课类型" :title-class="isHtab2 ? 'common-act-color' : ''" @open="handleDropOpen(2)" ref="vanDropItem2">
            <div class="hf-drop-view" v-if="methods.length">
              <div class="hf-drop-contain">
                <div class="hr-drop-filter-item" @click="handleMethod(item.value)" v-for="item in methods" :key="item.id">
                  <van-icon v-if="listQuery.method && listQuery.method == item.value" name="success" color="#0088FE" />
                  <span :class="{'hr-drop-filter-item-act': listQuery.method && listQuery.method == item.value }">{{item.text}}</span>
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
          <!-- 针对对象 -->
          <van-dropdown-item title="针对对象" :title-class="isHtab3 ? 'common-act-color' : ''" @open="handleDropOpen(3)" ref="vanDropItem3">
            <div class="hf-drop-view" v-if="targets.length">
              <div class="hf-drop-contain">
                <div class="hr-drop-filter-item" @click="handleIntention(item.value)" v-for="item in targets" :key="item.id">
                  <van-icon v-if="listQuery.targets && listQuery.targets == item.value" name="success" color="#0088FE" />
                  <span :class="{'hr-drop-filter-item-act': listQuery.targets && listQuery.targets == item.value }">{{item.text}}</span>
                </div>
              </div>
              <div class="common-double-button">
                <van-button class="common-double-button-l" @click="handleReset(3)">重置</van-button>
                <van-button class="common-double-button-r" @click="handleConfirm">确定</van-button>
              </div>
            </div>
            <div v-else class="hf-drop-contain-empty">
              暂无数据
            </div>
          </van-dropdown-item>

          <!-- 讲座日期 -->
          <van-dropdown-item :title="listType != 2 ? '讲座日期' : '活动日期'" :title-class="isHtab4 ? 'common-act-color' : ''" @open="handleDropOpen(5)" ref="vanDropItem4">
            <div class="hf-drop-view">
              <div class="hf-drop-quick" style="margin-top: 0;">
                <div class="hf-drop-quick-item" style="margin-bottom: 0;">
                  <ReQuickDateBtns @change="handleQuickDate" :startData="listQuery.startDate" :endData="listQuery.endDate" style="margin-top: 1rem;" />
                  <div class="hf-drop-quick-calendar">
                    <van-calendar ref="vanCalendar" :formatter="dayTextFormatter" @select="handleDateSelect" :default-date="defaultDate" :poppable="false" type="range" :show-title="false" color="#0088FE" :show-confirm="false" allow-same-day :min-date="new Date('2000/01/01')" :style="{ height: '400px' }" />
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

    <!-- 今日活动筛选头 -->
    <div class="header-filter" v-if="['4'].includes(listType)">
      <div class="hf-l-list">
        <van-dropdown-menu class="hf-l-list-menu">
          <!-- 8 类型 -->
          <van-dropdown-item :title="nowTitle" :title-class="isHtab8 ? 'common-act-color' : ''" @open="handleDropOpen(8)" ref="vanDropItem8">
            <div class="hf-drop-view" v-if="queryList.waitNowTypeList.length">
              <div class="hf-drop-contain">
                <div class="hr-drop-filter-item" @click="handleWaitFollowType(null)">
                  <van-icon v-if="!listQuery.distributeType" name="success" color="#0088FE" />
                  <span :class="{'hr-drop-filter-item-act': !listQuery.distributeType }">全部</span>
                </div>

                <div class="hr-drop-filter-item" @click="handleWaitFollowType(item.id)" v-for="item in queryList.waitNowTypeList" :key="item.id">
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

        </van-dropdown-menu>
      </div>
      <!-- 今日活动部门 -->
      <div :class="listQuery.nowActivityshellId ?'now-activity-shellId active':'now-activity-shellId'" @click="handleShow" v-if="nowAuthDepartList.length">{{nowActivityshellIdName}}
        <van-icon name="arrow-down" class="arrow-down" v-if="!listQuery.nowActivityshellId" />
        <van-icon name="cross" class="arrow-down" v-else @click.stop="handleClearShow" />
      </div>
      <RePick v-model="listQuery.nowActivityshellId" ref="nowActivityshellId" label="部门名称" @changeAll="handleNowShell" v-show="false" :list="nowAuthDepartList" titleKey="text" idKey="value" clearable />
    </div>

    <van-popup position="bottom" safe-area-inset-bottom v-model="moreFilterShow" round>
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
          <RePick v-model="listQuery.shellIdsLocal" label="部门名称" @change="handleShell" :list="authDepartList" isCascader isShowSearch isCell clearable childrenKey="child" />
          <RePick v-model="listQuery.collegeInfoIdLocal" label="院校名称" :list.sync="schoolList" isCascader isShowSearch isCell clearable isOriginSchoolSearch />
          <RePick v-model="listQuery.teacherIds" v-if="listType == 1" label="讲师姓名" :list="teachers" titleKey="text" isShowSearch idKey="value" isCell clearable />
          <RePick v-model="listQuery.chargePersonIds" v-if="listType != 3" label="负责人" :list="chargePersonsList" :emptyToastTitle="'请先筛选部门'" isShowSearch isCell clearable />
          <RePick v-model="listQuery.usePersonId" v-if="listType != 3" label="参与人" :list="chargePersonsList" :emptyToastTitle="'请先筛选部门'" isShowSearch isCell clearable />
          <RePick v-model="listQuery.opponent" v-if="listType == 3" label="对手名称" :list="opponents" titleKey="text" idKey="value" isCell clearable />
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
import { commonShellAllUserApi } from '@/api/common'
import { getActivityChargeListApi } from '@/api/potentialGuest/activity'
import { dayTextFormatter } from '@/utils'
export default {
  props: {
    listType: String,
    paramProp: Object,
    moreActLecture: Object
  },
  components: {
    ReQuickDateBtns: () => import('@/components/ReComponents/ReQuickDateBtns'),
    RePick: () => import('@/components/ReComponents/RePick'),
    // ReYear: () => import('@/components/ReComponents/ReYear')
  },
  data() {
    return {
      isSearch: false,
      userPersons: [],
      title: '请选择',
      moreFilterShow: false,
      defaultDate: null,
      listQuery: { keyword: '' },
      schoolList: [],
      pickerCheckValue: null,
      nowTitle: '全部',
      nowActivityshellIdName: '所属部门',
      chargePersonsList: [],
      dayTextFormatter: dayTextFormatter
    }
  },
  computed: {
    ...mapState({
      queryList: state => state.activity.queryList,
      nowAuthDepartList: state => state.common.user.nowAuthDepartList,
      authDepartList: state => state.common.user.authDepartList,
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
      const listQuery = this.moreActLecture || {}
      // const { shellIdsLocal, collegeInfoIdLocal, teacherIds, chargePersonIds, usePersonId, opponent } = listQuery
      // if (shellIdsLocal || collegeInfoIdLocal || teacherIds || chargePersonIds || usePersonId || opponent) {
      //   bol = true
      // }
      const { chargePersonIds, collegeInfoId, shellIds, teacherIds, usePersonId, opponent } = listQuery
      if (shellIds && shellIds.length || collegeInfoId && collegeInfoId.length || teacherIds && teacherIds.length ||
        chargePersonIds && chargePersonIds.length || usePersonId || opponent) {
        bol = true
      }
      return bol
    },
    isHtab1() {
      // let isShow = true
      // if (this.listType == 2 && this.paramProp.sendBookType) isShow = true
      // else if (this.listType != 2 && this.paramProp.type) isShow = true
      return true
    },
    isHtab2() {
      // let isShow = false
      // if (this.paramProp.method) isShow = true
      return true
    },
    isHtab3() {
      // let isShow = false
      // if (this.paramProp.targets) isShow = true
      return true
    },
    isHtab4() {
      let isShow = false
      if (this.paramProp.startDate) isShow = true
      return isShow

    },
    isHtab8() {
      // let isShow = false
      // if (this.paramProp.distributeType) {
      //   isShow = true
      // }
      return true
    },
  },
  methods: {
    // 设置今日活动默认的部门
    handleSetNoWDept(val, title) {
      this.$set(this.listQuery, 'nowActivityshellId', val)
      this.nowActivityshellIdName = title
    },
    dealDateFormat(val) {
      return dayjs(val).format('YYYY/MM/dd')
    },
    handleNowShell(e) {
      const { title } = e
      this.nowActivityshellIdName = title || '所属部门'
      this.$emit('onListQuery', this.listQuery)
    },
    handleShow() {
      this.handleInit()
      this.$refs.nowActivityshellId.handleShow(true)
    },

    handleClearShow() {
      this.handleReset(9)
      this.$emit('onListQuery', this.listQuery)
    },
    handleWaitFollowType(e) {
      this.$set(this.listQuery, 'distributeType', e)
    },
    onKeywordSearch() {
      this.$emit('onListQuery', this.listQuery)
    },
    onKeywordClear(val) {
    },
    onKeywordCancel() {
      this.listQuery.keyword = null
      this.$emit('onListQuery', this.listQuery)
      this.isSearch = false
    },
    handleQuickDate(e) {
      this.defaultDate = [dayjs(e.time[0]).toDate(), dayjs(e.time[1]).toDate()]
      this.listQuery.startDate = `${e.time[0]} 00:00:00`
      this.listQuery.endDate = `${e.time[1]} 23:59:59`
    },
    handleInit() {
      this.defaultDate = null
      this.listQuery = {
        ...this.paramProp,
        shellIds: this.paramProp.shellIds ? [...this.paramProp.shellIds] : [],
        sendBookType: this.paramProp.sendBookType ? this.paramProp.sendBookType : 5,
        type: this.paramProp.type ? this.paramProp.type : 5,
        method: this.paramProp.method ? this.paramProp.method : 5,
        targets: this.paramProp.targets ? this.paramProp.targets : 5,
        /* targets: [...this.paramProp.targets],
        usePersonId: [...this.paramProp.usePersonId],
        teacherIds: [...this.paramProp.teacherIds],
        chargePersonIds: [...this.paramProp.chargePersonIds] */
      }
      if (this.listQuery.startDate && this.listQuery.endDate) {
        this.defaultDate = [dayjs(this.listQuery.startDate).toDate(), dayjs(this.listQuery.endDate).toDate()]
      } else {
        this.handleDateReset()
      }
    },
    handleSetDept(nowActivityshellId) {
      this.$set(this.listQuery, 'nowActivityshellId', nowActivityshellId)
    },
    handleDropOpen(val) {
      this.handleInit()
      this.$nextTick(() => {
        if (val === 5) {
          this.$refs.vanCalendar.scrollToDate(new Date())
        }
      })
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
    // 讲座类型
    handleType(val) {
      if (this.listType == 2) {
        this.$set(this.listQuery, 'sendBookType', val ? val : null)
      } else
        this.$set(this.listQuery, 'type', val ? val : null)
    },
    // 授课类型
    handleMethod(val) {
      this.listQuery.method = val ? val : null
    },
    // 针对对象
    handleIntention(val) {
      this.listQuery.targets = val ? val : null
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
        this.listQuery.startDate = `${dayjs(val[0]).format('YYYY/MM/DD')} 00:00:00 `
        this.listQuery.endDate = `${dayjs(val[1]).format('YYYY/MM/DD')} 23:59:59 `
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
          this.listQuery.sendBookType = 5
        } else this.listQuery.type = 5
      } else if (num === 2) {
        this.listQuery.method = 5
      } else if (num === 3) {
        this.listQuery.targets = 5
      } else if (num === 4) {
        this.handleDateReset()
        this.listQuery.startDate = null
        this.listQuery.endDate = null
      } else if (num === 8) {
        this.handleDateReset()
        this.listQuery.distributeType = null
      }
      else if (num === 9) {
        this.listQuery.nowActivityshellId = null
        this.nowActivityshellIdName = '所属部门'
      }
      // const obj = JSON.parse(JSON.stringify(this.paramProp))
    },
    handleConfirm() {
      if (this.listType == 4) {
        this.$refs.vanDropItem8.toggle(false)
        const { title } = this.queryList.waitNowTypeList.find(v => v.id == this.listQuery.distributeType) || {}
        this.nowTitle = title || '全部'
      } else {
        this.$refs.vanDropItem1.toggle(false)
        if (this.listType != 2) this.$refs.vanDropItem2.toggle(false)
        this.$refs.vanDropItem3.toggle(false)
        this.$refs.vanDropItem4.toggle(false)
      }
      console.log('this.listQuery', this.listQuery);
      this.$emit('onListQuery', this.listQuery)
    },

    // 部门
    handleShell(e) {
      e && commonShellAllUserApi(e).then(res => {
        this.userPersons = res.data || []
      })
      // 获取参与人和负责人
      if (e) {
        getActivityChargeListApi(e).then(res => {
          this.chargePersonsList = res.data || []
          this.listQuery.chargePersonIds = null
          this.listQuery.usePersonId = null
        })
      } else {
        this.chargePersonsList = []
        this.listQuery.chargePersonIds = null
        this.listQuery.usePersonId = null
      }
    },

    // 更多重置
    handleMoreReset() {
      this.listQuery.shellIds = [] // 部门
      this.listQuery.shellIdsLocal = null
      this.listQuery.collegeInfoId = []
      this.listQuery.collegeInfoIdLocal = null
      this.listQuery.startDate = null // 开始时间
      this.listQuery.endDate = null // 结束时间
      this.listQuery.keyword = null // 关键词
      this.listQuery.type = null
      this.listQuery.sendBookType = null
      this.listQuery.method = null
      this.listQuery.targets = null
      this.listQuery.usePersonId = null
      this.listQuery.teacherIds = null
      this.listQuery.chargePersonIds = null
      this.listQuery.opponent = null
    },
    handleMoreConfirm() {
      this.$emit('onListQuery', this.listQuery)
      this.moreFilterShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
