<template>
  <div id="consulationHeader">
    <div class="hf-l-seacrch" v-if="isSearch">
      <form action="/">
        <van-search v-model="listQuery.keyword" shape="round" show-action placeholder="请输入学员姓名、手机号码、QQ、微信" :clearable="false" @search="onKeywordSearch" @cancel="onKeywordCancel" @clear="onKeywordClear" />
      </form>
    </div>
    <div class="header-filter" v-else>
      <div class="hf-l-list">
        <van-dropdown-menu class="hf-l-list-menu">
          <!-- 预约状态 -->
          <van-dropdown-item title="预约状态" :title-class="isHtab1 ? 'common-act-color' : ''" @open="handleDropOpen(1)" ref="vanDropItem1">
            <div class="hf-drop-view" v-if="consultMobilesList.length">
              <div class="hf-drop-contain">
                <div class="hr-drop-filter-item" @click="handleConsultState(item.value)" v-for="item in consultMobilesList" :key="item.value">
                  <van-icon v-if="listQuery.consultState  && listQuery.consultState == item.value" name="success" color="#0088FE" />
                  <span :class="{'hr-drop-filter-item-act': listQuery.consultState && listQuery.consultState == item.value }">{{item.text}}</span>
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
          <!-- 跟进状态 -->
          <van-dropdown-item title="跟进状态" :title-class="isHtab2 ? 'common-act-color' : ''" @open="handleDropOpen(2)" ref="vanDropItem2">
            <div class="hf-drop-view" v-if="followUpStateList.length">
              <div class="hf-drop-contain">
                <div class="hr-drop-filter-item" @click="handleFollowUpState(item.value)" v-for="item in followUpStateList" :key="item.value">
                  <van-icon v-if="listQuery.followUpState !== null && listQuery.followUpState == item.value" name="success" color="#0088FE" />
                  <span :class="{'hr-drop-filter-item-act': listQuery.followUpState !== null && listQuery.followUpState == item.value }">{{item.text}}</span>
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
          <!-- 咨询结果 -->
          <van-dropdown-item title="咨询结果" :title-class="isHtab3 ? 'common-act-color' : ''" @open="handleDropOpen(3)" ref="vanDropItem3">
            <div class="hf-drop-view" v-if="paramProp.consultResults.length">
              <div class="hf-drop-contain">
                <div class="hr-drop-filter-item" @click="handleResult(item.id)" v-for="item in paramProp.consultResults" :key="item.id">
                  <van-icon v-if=" listQuery.result != null &&  listQuery.result == item.id" name="success" color="#0088FE" />
                  <span :class="{'hr-drop-filter-item-act': listQuery.result != null &&  listQuery.result == item.id  }">{{item.text}}</span>
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
          <!-- 意向类型 -->
          <van-dropdown-item title="意向类型" :title-class="isHtab4 ? 'common-act-color' : ''" @open="handleDropOpen(4)" ref="vanDropItem4">
            <div class="hf-drop-view" v-if="paramProp && paramProp.intentions && paramProp.intentions.length">
              <div class="hf-drop-contain">
                <div class="hr-drop-filter-item" @click="handleIntentionType(item.value)" v-for="item in paramProp.intentions" :key="item.id">
                  <van-icon v-if="listQuery.intentionType && listQuery.intentionType.includes(item.value)" name="success" color="#0088FE" />
                  <span :class="{'hr-drop-filter-item-act': listQuery.intentionType && listQuery.intentionType.includes(item.value) }">{{item.text}}</span>
                </div>
              </div>
              <div class="common-double-button">
                <van-button class="common-double-button-l" @click="handleReset(4)">重置</van-button>
                <van-button class="common-double-button-r" @click="handleConfirm">确定</van-button>
              </div>
            </div>
            <div v-else class="hf-drop-contain-empty">
              暂无数据
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
          <RePick v-model="listQuery.schoolIdLocal" label="就读学校" :list.sync="schoolList" isCascader isShowSearch isCell clearable isOriginSchoolSearch />
          <RePick v-model="listQuery.crmMarketAreaIds" label="市场区域" :list="authAreaList" multiple isCell clearable />
          <ReYear v-model="listQuery.graduationYearLocal" label="毕业年份" :list="years" titleKey="text" idKey="value" isCell clearable />
          <RePick v-model="listQuery.isFresh" label="属性" :list="paramProp.isFreshs" titleKey="text" idKey="value" isCell clearable />
          <ReYear v-model="listQuery.examYearLocal" label="考试年份" :list="years" titleKey="text" idKey="value" isCell clearable />
          <RePick v-model="listQuery.intentionClass" label="意向班型" isShowSearch :list="paramProp.intentionClasss" multiple titleKey="text" idKey="value" isCell clearable />
          <RePick v-model="listQuery.cityId" label="所在城市" :list="allProvicesAndCitys" isShowSearch isCascader name="cityClassList" titleKey="text" isCell clearable isCascaderAllLevelName />
          <RePick v-model="listQuery.campusLocal" label="市场区域负责人" isShowSearch :list="paramProp.schoolManagers" titleKey="text" idKey="value" isCell clearable />
          <RePick v-model="listQuery.ownLocal" label="所属人" isShowSearch :list="paramProp.owners" titleKey="text" idKey="value" isCell clearable />
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
import { getGenerousListApi, postPartStudentConditonApi } from '@/api/potentialGuest/activity'
export default {
  props: {
    listType: String,
    paramProp: Object,
    listQueryParam: Object,
    moreActLecture: Object, // 更多选择颜色变化
  },
  components: {
    ReQuickDateBtns: () => import('@/components/ReComponents/ReQuickDateBtns'),
    RePick: () => import('@/components/ReComponents/RePick'),
    ReYear: () => import('@/components/ReComponents/ReYear')
  },
  data() {
    return {
      // 年份选择数据源
      years: makeYear().reverse(),
      isSearch: false,
      userPersons: [],
      title: '请选择',
      moreFilterShow: false,
      defaultDate: null,
      listQuery: { keyword: '', crmMarketAreaIds: [] },
      schoolList: [],
      pickerCheckValue: null,
      addResOptions: [], // 咨询结果
      followUpStateList: [
        {
          text: '全部',
          value: 5
        },
        {
          text: '未跟进',
          value: 0
        },
        {
          text: '已跟进',
          value: 1
        }
      ],
      consultMobilesList: [
        {
          text: '全部',
          value: 5
        },
        {
          text: '已预约',
          value: 4
        },
        {
          text: '未预约',
          value: 1
        },
      ]
    }
  },
  // watch: {
  //   'listQuery.dateRange': {
  //     handler(val) {
  //     }
  //   }
  // },
  computed: {
    ...mapState({
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
      const listQuery = this.moreActLecture || {}
      const { attendSchools, crmMarketAreaIds, years, examYears, isFresh, intentionClass, schoolManager, owner } = listQuery
      // const { schoolIdLocal, crmMarketAreaIds, graduationYearLocal, examYearLocal,
      //  isFresh, intentionClass, campusLocal, ownLocal } = listQuery
      // if (
      //   schoolIdLocal || crmMarketAreaIds && crmMarketAreaIds.length || graduationYearLocal || examYearLocal ||
      //   isFresh || intentionClass && intentionClass.length || campusLocal || ownLocal
      // ) {
      //   bol = true
      // }
      if (
        attendSchools && attendSchools.length || crmMarketAreaIds && crmMarketAreaIds.length || years && years.length ||
        examYears && examYears.length || isFresh || intentionClass && intentionClass.length || schoolManager && schoolManager.length ||
        owner && owner.length
      ) {
        bol = true
      }
      return bol
    },
    isHtab1() {
      let isShow = true
      // console.log('this.listQuery', this.listQuery);
      // if (this.listQuery.consultState) isShow = true
      return isShow
    },
    isHtab2() {
      let isShow = true
      // if (this.listQuery.followUpState) isShow = true
      return isShow
    },
    isHtab3() {
      let isShow = true
      // if (this.listQuery.result && this.listQuery.result.length) isShow = true
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
    onKeywordSearch() {
      this.$emit('onListQuery', this.listQuery)
    },
    onKeywordClear(val) {
    },
    onKeywordCancel() {
      this.listQuery.keyword = ''
      this.onKeywordSearch()
      this.isSearch = false
    },
    handleQuickDate(e) {
      this.defaultDate = [dayjs(e.time[0]).toDate(), dayjs(e.time[1]).toDate()]
      this.listQuery.startDate = e.time[0]
      this.listQuery.endDate = e.time[1]
    },
    handleInit() {
      this.defaultDate = null
      this.listQuery = {
        ...this.listQueryParam,
        result: Array.isArray(this.listQueryParam.result) && this.listQueryParam.result.length ?
          this.listQueryParam.result[0] : 5, // 咨询结果
        consultState: this.listQueryParam.consultState ? this.listQueryParam.consultState : 5,
        followUpState: this.listQueryParam.followUpState ? this.listQueryParam.followUpState : this.listQueryParam.followUpState == 0 ? 0 : 5,

        schoolIdLocal: this.listQueryParam.attendSchools.length ? this.listQueryParam.attendSchools[0] : null, // 就读学校
        graduationYearLocal: Array.isArray(this.listQueryParam.years) && this.listQueryParam.years.length ?
          this.listQueryParam.years[0] : null, // 毕业年份
        examYearLocal: Array.isArray(this.listQueryParam.examYears) && this.listQueryParam.examYears.length ?
          this.listQueryParam.examYears[0] : null, // 考试年份
        campusLocal: this.listQueryParam.schoolManager.length ? this.listQueryParam.schoolManager[0] : null, // 市场区域负责人
        ownLocal: this.listQueryParam.owner.length ? this.listQueryParam.owner[0] : null, // 所属人


        intentionType: this.listQueryParam.intentionType ? [...this.listQueryParam.intentionType] : [],

        // crmMarketAreaIds: this.listQueryParam.areaId ? [...this.listQueryParam.areaId] : [], // 市场区域
      }

      if (this.listQueryParam.startDate && this.listQueryParam.endDate) {
        this.defaultDate = [dayjs(this.listQueryParam.startDate).toDate(), dayjs(this.listQueryParam.endDate).toDate()]
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
      this.listQuery.keyword = this.paramProp.keyword
      this.isSearch = true
    },
    // 更多筛选
    handleMoreFilter() {
      this.handleInit()
      this.moreFilterShow = true
    },
    // 预约状态
    handleConsultState(val) {
      this.listQuery.consultState = val ? val : null
    },
    // 跟进状态
    handleFollowUpState(val) {
      this.listQuery.followUpState = val ? val : val == 0 ? 0 : null
    },
    // 咨询结果
    handleResult(val) {
      this.listQuery.result = val ? val : null
    },
    // 意向类型
    handleIntentionType(val) {
      const i = this.listQuery.intentionType.findIndex(item => item === val)
      if (i > -1) {
        this.listQuery.intentionType.splice(i, 1)
      } else {
        this.listQuery.intentionType.push(val)
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
    handleCheck(name) {
      this.listQuery[name] = !this.listQuery[name]
    },
    handleDateSelect(val) {
      if (val.filter(item => item).length === 2) {
        this.listQuery.startDate = dayjs(val[0]).format('YYYY/MM/DD')
        this.listQuery.endDate = dayjs(val[1]).format('YYYY/MM/DD')
      }
    },
    // 日历重置
    handleDateReset() {
      this.defaultDate = null
      this.$refs.vanCalendar && this.$refs.vanCalendar.reset()
    },
    handleReset(num) {
      if (num === 1) {
        this.listQuery.consultState = 5
      } else if (num === 2) {
        this.listQuery.followUpState = 5
      } else if (num === 3) {
        this.listQuery.result = 5
      } else if (num === 4) {
        this.listQuery.intentionType = []
      }

      // const obj = JSON.parse(JSON.stringify(this.paramProp))
    },
    handleConfirm() {
      this.$refs.vanDropItem1.toggle(false)
      if (this.listType != 2) this.$refs.vanDropItem2.toggle(false)
      this.$refs.vanDropItem3.toggle(false)
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
      this.listQuery.schoolIdLocal = null // 就读学校
      this.listQuery.crmMarketAreaIds = [] // 市场区域
      this.listQuery.graduationYearLocal = null // 毕业年份
      this.listQuery.examYearLocal = null // 考试年份
      this.listQuery.isFresh = null // 属性
      this.listQuery.intentionClass = [] // 意向班型
      this.listQuery.cityId = null // 所在城市
      this.listQuery.campusLocal = null // 市场区域负责人
      this.listQuery.ownLocal = null

      // this.listQuery.schoolManager = [] // 校区主管
      // this.listQuery.sysShellId = [] // 所属部门
      // this.listQuery.shellIdsLocal = null

      // this.listQuery.attendSchools = [] // 就读院校
      // this.listQuery.schoolIdLocal = null
      // this.listQuery.cityId = null // 所在城市
      // this.listQuery.consultState = null // 预约状态
      // this.listQuery.owner = null // 所属人
      // this.listQuery.ownLocal = null
      // this.listQuery.sourceId = null
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
