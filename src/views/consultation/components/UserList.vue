<template>
  <div>
    <HeaderFilter :listType="listType" @onListQuery="handleListQuery" :paramProp="listQuery.param" />
    <RMList :moreLoading.sync="moreLoading" :refreshing.sync="refreshing" :finished.sync="finished" @onLoad="handleLoad" @onRefresh="handleRefresh" isMore :tableList="tableList">
      <div>
        <StudentCard v-for="(item, index) in tableList" :key="item.id" :sId="listType === 'yuYueZiXun' ? item.studentId : item.id" :studentData="item" @onUpdataInfo="handleUpdataInfo($event, index)" :listType="listType" @onAllRefresh="handleAllRefresh" />
      </div>
    </RMList>
    <div class="common-bottom-btns" v-if="['1', '4'].includes(listType)">
      <div class="common-bottom-btn" @click="handleAddStudent">
        <img src="@/assets/images/icons/add.png" alt="">
        <span>添加用户</span>
      </div>
    </div>
  </div>
</template>

<script>
// 咨询用户
import { getScrollTop } from '@/utils'
import { allStudentApi, yuYueZixunListApi } from '@/api/potentialGuest/consultation'
import { mapState } from 'vuex'

export default {
  props: {
    listType: String
  },
  components: {
    HeaderFilter: () => import('./HeaderFilter'),
    RMList: () => import('@/components/ReComponents/RMList'),
    StudentCard: () => import('@/components/StudentCard')
  },
  data() {
    return {
      height: 0,
      isRefreshTable: false,
      moreLoading: false,
      refreshing: false,
      finished: false,
      counselTab: 1,
      tableList: [],
      listQuery: {
        pageinfo: {
          pageNum: 1,
          pageSize: this.pageSize,
          count: false,
          sort: []
        },
        param: {
          type: this.listType,
          /** * 1、咨询用户（至少有一条咨询记录）
           * 2、有效线索（除公海外所有线索）
           * 3、已报高端（状态=已报高端）
           * 4、未咨询（有绑定所属人但还没有咨询记录）
           * 5、待分配（没有所属人但【是否分配咨询师=是】的潜在用户）
           * 6、全部潜在用户包括公海
           * 7、公海（currentState必须为空
           * 8、待跟进
           * yuYueZiXun: 预约咨询, 另外的接口
           * */
          activityId: null, // 活动id
          shellIds: [], // 部门
          shellIdsLocal: null, // 部门 -- 本地使用(更多)
          schoolId: [], // 就读学校
          schoolIdLocal: null, // 就读学校 -- 本地使用(更多)
          cityId: null, // 所在城市(更多)
          sourceId: null, // 来源渠道(更多)
          intentionIds: [], // 意向类型
          intentionCourseIds: [], // 意向班型(更多)
          dateType: this.listType === '4' ? 1 : this.listType === '1' ? 3 : 2, // 日期类型
          startDate: null, // 开始时间
          endDate: null, // 结束时间
          dateRange: '',// 日期区间
          keyword: null, // 关键词
          consultType: [], // 咨询类型
          consultTypeLocal: null, // 咨询类型 -- 本地(更多)
          examYear: [], // 考试年份
          examYearLocal: null, // 考试年份 -- 本地(更多)
          isFresh: [], // 属性
          isFreshLocal: null, // 属性 -- 本地(更多)
          campus: [], // 市场区域负责人
          campusLocal: null, // 市场区域负责人 -- 本地(更多)
          areaId: [], // 市场区域(更多)
          returnVisitType: null, // 统计类型
          statisticsType: null, // 统计类型
          currentState: [], // 状态
          own: [], // 所属人
          ownLocal: null, // 所属人 -- 本地(更多)
          reserveState: [], // 预约咨询
          resultId: [], // 咨询结果
          resultIdLocal: null, // 咨询结果 -- 本地(更多)
          consultantId: [], // 咨询结果
          consultantIdLocal: null, // 咨询/市场 -- 本地(更多)
          showConsultRecord: 1, // 是否加载咨询记录
          handover: ['7', '8'].includes(this.listType) ? 0 : 1, // 是否不看移交
          noneHigh: ['3','7', '8'].includes(this.listType) ? 0 : 1, // 是否不看已报高端
          visit: ['4','7', '8'].includes(this.listType) ? 0 : 1, // 是否无需回访
          graduationYear: [], // 毕业年份
          graduationYearLocal: null, // 毕业年份 -- 本地(更多)
          consultState: null, // 状态
          sortRule: this.listType === '1' ? { title: '最后回访', type: 1, column: "lastConsultTime" }
          : this.listType === '4' ? { title: '添加日期', type: 1, column: 'addTime' }
          : this.listType === '5' ? { title: '添加日期', type: 1, column: 'addTime' }
          : this.listType === '7' ? { title: '投放日期', type: 1, column: 'seaPutTime' } 
          : this.listType === '8' ? { title: '添加日期', type: 1, column: 'addTime' } 
          : this.listType === 'yuYueZiXun' ? { title: '添加日期', type: 1, column: 'addTime' }: {},

          // 8 类型
          distributeType: null,
          distributeStartDate: null,
          distributeEndDate: null,
          
          seaPutUserIdsLocal: null, // 投放人 -- 本地
          seaPutUserIds: [], // 公海-投放人

          creatorIdsLocal: null, // 添加人 -- 本地
          creatorIds: [], // 公海-添加人

          yuYuetZiXunType: 8
        }
      }
    }
  },
  computed: {
    ...mapState({
      pageSize: state => state.common.setting.pageSize
      // isRefreshTable: state => state.consultation.isRefreshTable
    })
  },
  activated() {
    this.handleScrollInit()
    if (this.isRefreshTable) {
      this.handleInit()
      this.isRefreshTable = false
    }
  },
  deactivated() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  created() {
    this.handleInit()
    this.handleScrollInit()
  },
  methods: {
    // ...mapActions('isRefreshTableAct', ['consultation']),
    handleScrollInit() {
      window.addEventListener('scroll', this.handleScroll)
      window.scrollTo(0, this.height)
    },
    handleInit() {
      this.getTableList('init')
    },

    getTableList(val, propPage) {
      this.moreLoading = true
      this.$loading(true, `cTableLoading_${this.listType}`)
      const { shellIdsLocal, schoolIdLocal, consultTypeLocal, examYearLocal, isFreshLocal, campusLocal, ownLocal, graduationYearLocal, sortRule, resultIdLocal, consultantIdLocal, seaPutUserIdsLocal, creatorIdsLocal, distributeStartDate, distributeEndDate } = this.listQuery.param
      const query = {
        pageinfo: {
          ...this.listQuery.pageinfo,
          pageSize: this.pageSize,
          sort: Object.keys(sortRule).length ? [sortRule] : []
        },
        param: {
          ...this.listQuery.param,
          type: this.listType === 'yuYueZiXun' ? this.listQuery.param.yuYuetZiXunType : this.listType,
          showConsultRecord: 1,
          branchId: this.listType === 'yuYueZiXun' ? shellIdsLocal : null,
          beginAppointmentTime: this.listType === 'yuYueZiXun' ? distributeStartDate : null,
          endAppointmentTime: this.listType === 'yuYueZiXun' ? distributeEndDate : null,
          shellIds: this.listType === 'yuYueZiXun' ? [] : shellIdsLocal ? [shellIdsLocal] : [], // 部门
          schoolId: schoolIdLocal ? [schoolIdLocal] : [], // 就读学校 
          consultType: consultTypeLocal ? consultTypeLocal === -1 ? [] : [consultTypeLocal] : [], // 咨询类型
          examYear: examYearLocal ? [examYearLocal] : [], // 考试年份
          isFresh: this.listType === 'yuYueZiXun' ? isFreshLocal || null : isFreshLocal ? [isFreshLocal] : [], // 属性
          campus: campusLocal ? [campusLocal] : [], // 市场区域负责人
          own: ownLocal ? [ownLocal] : [], // 所属人
          graduationYear: graduationYearLocal ? [graduationYearLocal] : [], // 毕业年份
          resultId: resultIdLocal ? [resultIdLocal] : [], // 咨询结果
          consultantId: consultantIdLocal ? [consultantIdLocal] : [], // 咨询结果
          seaPutUserIds: seaPutUserIdsLocal ? [seaPutUserIdsLocal] : [], // 公海-投放人
          creatorIds: creatorIdsLocal ? [creatorIdsLocal]: [] // 公海-添加人
        }
      }
      if (propPage) {
        query.pageinfo = {
          ...query.pageinfo,
          ...propPage
        }
      }
      let api = this.listType === 'yuYueZiXun' ? yuYueZixunListApi : allStudentApi
      api(query).then(res => {
        if (['init', 'refresh'].includes(val)) {
          this.tableList = res.data || []
        } else {
          this.tableList = this.tableList.concat(res.data || [])
        }
        if (res.data.length < this.pageSize) {
          this.finished = true
        }
      }).finally(() => {
        this.$nextTick(() => {
          this.moreLoading = false
          this.refreshing = false
        })
        this.$loading(false, `cTableLoading_${this.listType}`)
      })
    },
    handleScroll() {
      getScrollTop().then(height => {
        this.height = height
      })
    },

    handleListQuery(paramProp) {
      this.listQuery.pageinfo.sort = paramProp.sortRule ? [{ ...paramProp.sortRule }] : []
      this.listQuery.param = {
        ...paramProp,
        shellIds: [...paramProp.shellIds],
        intentionIds: [...paramProp.intentionIds],
        intentionCourseIds: [...paramProp.intentionCourseIds],
        consultType: [...paramProp.consultType],
        examYear: [...paramProp.examYear],
        isFresh: [...paramProp.isFresh],
        campus: [...paramProp.campus],
        currentState: [...paramProp.currentState],
        own: [...paramProp.own],
        reserveState: [...paramProp.reserveState],
        graduationYear: [...paramProp.graduationYear],
        resultId: [...paramProp.resultId],
        consultantId: [...paramProp.consultantId],
        sortRule: paramProp.sortRule ? { ...paramProp.sortRule } : {}
      }
      this.finished = false
      this.handleRefresh()
    },

    handleLoad() {
      this.listQuery.pageinfo.pageNum += 1
      this.getTableList('more')
    },
    handleRefresh() {
      this.listQuery.pageinfo.pageNum = 1
      this.finished = false
      this.getTableList('refresh')
    },
    handleStudent() {
      if (this.refreshing || this.moreLoading) return
      // getScrollTop().then(height => {
      //   this.height = height
      // })
      this.$router.push('/studentinfo')
    },
    handleUpdataInfo(obj, index) {
      if (obj) {
        this.tableList.splice(index, 1, obj)
      } else this.tableList.splice(index, 1)
    },
    handleAddStudent() {
      this.isRefreshTable = true
      this.$router.push({
        path: `/studentinfoedit/null`
      })
    },

    handleAllRefresh() {
      const propPage = {
        pageNum: 1,
        pageSize: this.listQuery.pageinfo.pageNum * this.pageSize 
      }
      this.getTableList('refresh', propPage)
    }
  }
}
</script>
