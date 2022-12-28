<template>
  <div>
    <HeaderFilter :listType='listType' :countData="countData" @onListQuery='handleListQuery' :paramProp='listQuery.handoverParameterVO' />
    <RMList :moreLoading.sync="moreLoading" :refreshing.sync="refreshing" :finished.sync="finished" @onLoad="handleLoad" @onRefresh="handleRefresh" isMore :tableList="tableList">
      <div v-if="['1', '3'].includes(this.listType)">
        <HandoverCard v-for="(item, index) in tableList" :key="item.handoverId" :sId="item.id" :handoverId="item.handoverId" :studentData="item" :typeTab="listType == 1 ? 'MyHandover':'MyReceived'" @onUpdataInfo="handleUpdataInfo($event, item, index)" :listType="listType" @onAllRefresh="handleAllRefresh" />
      </div>
      <div v-else>
        <HandoverPerCard v-for="(item, index) in tableList" :key="item.id + '-' + item.handoverId" :sId="item.id" :studentData="item" @onUpdataInfo="handleUpdataInfo($event, item, index)" :listType="listType" @onAllRefresh="handleAllRefresh" />
      </div>
    </RMList>
  </div>
</template>
<script>
import { getScrollTop } from '@/utils'
import { mapState } from 'vuex'
import { headerStatisticalApi, handoverListApi, sumPaymentRecordsApi, paymentRecordsListApi } from '@/api/potentialGuest/paymentRecord'
export default {
  props: {
    listType: String
  },
  data() {
    return {
      tableList: [],
      finished: false,
      refreshing: false,
      moreLoading: false,
      countData: {},
      listQuery: {
        handoverParameterVO: {
          dateType: '',
          handoverSysId: null,
          type: Number(this.listType),
          handoverShellId: [],
          handoverType: null,
          targetSysId: null,
          targetShellId: null,
          targetUserId: [],
          beginDate: null,
          endDate: null,
          signUpBegin: null,
          signUpEnd: null,
          handoverKeyword: null,
          handoverState: null,
          handoverUserId: [],
          sourceChannelId: null,
          examYear: null,
          potentialState: null,
          day: this.day,
          fillType: []
        },
        pageinfo: { pageNum: 1, pageSize: 20, sort: [{ type: 1, column: 'handoverTime' }] } // , sort: [{ type: 1, column: 'handoverTime' }, { type: 1, column: 'studentName' }] 
      }
    }
  },
  components: {
    HeaderFilter: () => import('./HeaderFilter'),
    RMList: () => import('@/components/ReComponents/RMList'),
    HandoverPerCard: () => import('@/components/HandoverPerCard'),
    HandoverCard: () => import('@/components/HandoverCard')
  },
  computed: {
    ...mapState({
      pageSize: state => state.common.setting.pageSize,
      day: state => state.handover.queryList.day
    })
  },
  activated() {
    this.handleScrollInit()
  },
  deactivated() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  created() {
    this.handleInit()
    this.handleScrollInit()
  },
  methods: {
    handleScrollInit() {
      window.addEventListener('scroll', this.handleScroll)
      window.scrollTo(0, this.height)
    },

    async handleInit() {
      this.getTableList('init')
    },
    getTableList(val) {
      const { dateType, startDateChoose, endDateChoose, type, shellIdsLocal, handoverType, fillType, titleType, targetSysId, handoverSysId, targetShellIdLocal, targetUserIdsLocal, handoverKeyword, handoverUserId, handoverUserIdLocal, sourceChannelId, examYear, potentialState } = this.listQuery.handoverParameterVO
      let titleTypeLocal = null
      let handoverStateLocal = null
      if (titleType > 10) {
        handoverStateLocal = titleType - 10
      } else {
        titleTypeLocal = titleType
      }
      const query = {
        pageinfo: {
          ...this.listQuery.pageinfo,
          pageSize: this.pageSize
        },
        handoverParameterVO: {
          type: type,
          day: this.day,
          titleType: titleTypeLocal,
          handoverShellId: shellIdsLocal ? [shellIdsLocal] : [], // 部门
          handoverType: handoverType,
          targetSysId: targetSysId,
          handoverSysId: handoverSysId,
          targetShellId: targetShellIdLocal ? [targetShellIdLocal] : [],
          targetUserId: targetUserIdsLocal ? [targetUserIdsLocal] : [],
          beginDate: dateType == 'handoverTime' ? startDateChoose : null,
          endDate: dateType == 'handoverTime' ? endDateChoose : null,
          signUpBegin: dateType == 'enrollTime' ? startDateChoose : null,
          signUpEnd: dateType == 'enrollTime' ? endDateChoose : null,
          confirmBeginDate: dateType == 'receiveTime' ? startDateChoose : null,
          confirmEndDate: dateType == 'receiveTime' ? endDateChoose : null,
          handoverKeyword: handoverKeyword,
          handoverState: handoverStateLocal,
          handoverUserId: this.listType == 1 ? handoverUserId : handoverUserIdLocal ? [handoverUserIdLocal] : null,
          sourceChannelId: sourceChannelId,
          examYear: examYear,
          potentialState: potentialState
        }
      }
      const api = ['1', '3'].includes(this.listType) ? handoverListApi : paymentRecordsListApi
      if (!api) return
      this.moreLoading = true
      this.$loading(true, `cTableLoading_${this.listType}`)
      api(['1', '3'].includes(this.listType) ? query : {
        pageinfo: { pageNum: query.pageinfo.pageNum, pageSize: query.pageinfo.pageSize }, param: {
          day: this.day,
          type: this.listType == '4' ? 2 : 1,
          beginTime: dateType == 'paymentTime' ? startDateChoose : null,
          endTime: dateType == 'paymentTime' ? endDateChoose : null,
          handoverBeginTime: dateType == 'handoverTime' ? startDateChoose : null,
          handoverEndTime: dateType == 'handoverTime' ? endDateChoose : null,
          belongUserId: null,
          createTimeBegin: dateType == 'additionPayTime' ? startDateChoose : null,
          createTimeEnd: dateType == 'additionPayTime' ? endDateChoose : null,
          fillType: fillType,
          handoverShellId: shellIdsLocal ? [shellIdsLocal] : null,
          handoverUserId: handoverUserId,
          keyword: query.handoverParameterVO.handoverKeyword,
          targetShellId: targetShellIdLocal,
          targetSysId: targetSysId,
          targetUserId: targetUserIdsLocal
        }
      }).then(res => {
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
      if (['init', 'refresh'].includes(val)) {
        this.countLoading = true
        const countApi = ['1', '3'].includes(this.listType) ? headerStatisticalApi : sumPaymentRecordsApi
        if (!countApi) return
        countApi(['1', '3'].includes(this.listType) ? query.handoverParameterVO : {
          type: this.listType == '4' ? 2 : 1,
          day: this.day,
          titleType: titleTypeLocal,
          beginTime: dateType == 'paymentTime' ? startDateChoose : null,
          endTime: dateType == 'paymentTime' ? endDateChoose : null,
          belongUserId: null,
          createTimeBegin: dateType == 'additionPayTime' ? startDateChoose : null,
          createTimeEnd: dateType == 'additionPayTime' ? endDateChoose : null,
          fillType: fillType, // 缴费类型
          handoverShellId: shellIdsLocal ? [shellIdsLocal] : null,
          handoverUserId: handoverUserId,
          keyword: query.handoverParameterVO.handoverKeyword,
          handoverState: handoverStateLocal,
          targetShellId: targetShellIdLocal,
          targetSysId: targetSysId,
          targetUserId: targetUserIdsLocal ? [targetUserIdsLocal] : null
        }).then(res => {
          this.countData = res.data || {}
        }).finally(() => {
          this.$nextTick(() => {
            this.countLoading = false
          })
        })
      }
    },
    handleScroll() {
      getScrollTop().then(height => {
        this.height = height
      })
    },

    handleListQuery(paramProp) {
      // this.listQuery.pageinfo.sort = paramProp.sortRule ? [{ ...paramProp.sortRule }] : [{ column: 'addTime', type: 1 }]
      this.listQuery.handoverParameterVO = {
        ...this.listQuery.handoverParameterVO,
        ...paramProp
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
    handleUpdataInfo(obj, item, index) {
      this.tableList.splice(index, 1, obj)
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
