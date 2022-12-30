<template>
  <div>
    <HandoverFilter :listType="listType" :moreActLecture="moreActLecture" :paramProp="listQuery.handoverParameterVO" :filterProp="listFilterObj" @onListQuery="handleListQuery" v-if="firstList.length" />
    <div class="count-cont" v-if="firstList.length">
      <div class="count-list">
        <van-loading v-if="cloading" size="0.6rem" style="margin-bottom:0.4rem" />
        <div v-else class="count-title" style="color:  #0088FE">应收：{{countObj.amountMoney || '0.00'}}万元</div>
      </div>
      <div class="count-list">
        <van-loading v-if="cloading" size="0.6rem" style="margin-bottom:0.4rem" />
        <div v-else class="count-title" style="color:  #67C23A">已收：{{countObj.receivedMoney || '0.00'}}万元</div>
      </div>
      <div class="count-list">
        <van-loading v-if="cloading" size="0.6rem" style="margin-bottom:0.4rem" />
        <div v-else class="count-title" style="color:  #EB0101">余款：{{countObj.balanceMoney || '0.00'}}万元</div>
      </div>
    </div>
    <RMList v-if="tableList.length" :moreLoading.sync="moreLoading" :refreshing.sync="refreshing" :finished.sync="finished" @onLoad="handleLoad" @onRefresh="handleRefresh" isMore :tableList="tableList">
      <div>
        <StudentCard v-for="(item, index) in tableList" :key="item.id" :sId="item.id" :studentData="item" @onUpdataInfo="handleUpdataInfo($event, item, index)" :listType="'9'" />
      </div>
    </RMList>
    <div class="common-empty" v-else style="background: #ffffff;">
      <img src="@/assets/images/icons/empty.png" alt="">
      <div>暂无数据</div>
    </div>
  </div>
</template>
<script>
import { activityhandoverListApi, activityheaderStatisticalApi } from '@/api/potentialGuest/activity'
import { mapState } from 'vuex'
// 移交情况
export default {
  props: {},
  components: {
    HandoverFilter: () => import('./HandoverFilter'),
    RMList: () => import('@/components/ReComponents/RMList'),
    StudentCard: () => import('@/components/HandoverCard')
  },
  computed: {
    ...mapState({
      pageSize: state => state.common.setting.pageSize,
    })
  },
  data() {
    return {
      cloading: false,
      countObj: { total: 0, amountMoney: '0.00', balanceMoney: '0.00', receivedMoney: '0.00' }, // 统计
      sId: null,
      listType: '1',
      refreshing: false,
      finished: false,
      listConditonObj: {},
      listFilterObj: {}, // 移交统计所展示的统计数据
      tableList: [],
      listQuery: {
        handoverParameterVO: {
          activityId: 236,
          beginDate: null,
          endDate: null,
          day: 6,
          handoverKeyword: null,
          handoverShellId: [],
          handoverState: null,
          handoverType: null,
          handoverUserId: [],
          // isShow: 0,
          potentialState: null,
          signUpBegin: null,
          signUpEnd: null,
          targetShellId: [],
          targetSysId: null,
          targetUserId: [],
          titleType: 1,
          type: 1
        },
        pageinfo: { pageNum: 1, pageSize: 20, sort: [{ type: 1, column: 'addTime' }] }
      },
      firstList: [],
      moreActLecture: {}
    }
  },
  created() {
    let sId = Number(this.$route.params.sid)
    if (!Number.isNaN(sId)) { this.sId = sId }
    this.handleInit('firstRequest')
  },
  methods: {
    handleInit(val) {
      this.getTableList('init', val)
    },
    handleListQuery(paramProp) {
      const { handoverShellId, handoverUserId, targetShellId, targetUserId } = paramProp
      this.listQuery.pageinfo.sort = paramProp.sortRule ? [{ ...paramProp.sortRule }] : [{ type: 1, column: 'addTime' }]
      this.listQuery.handoverParameterVO = {
        ...this.listQuery.handoverParameterVO,
        ...paramProp,
        type: this.listType == 1 ? 1 : 3,
        activityId: this.sId,
        handoverShellId: Array.isArray(handoverShellId) ? handoverShellId : handoverShellId ? [handoverShellId] : [],
        handoverUserId: Array.isArray(handoverUserId) ? handoverUserId : handoverUserId ? [handoverUserId] : [],
        targetShellId: Array.isArray(targetShellId) ? targetShellId : targetShellId ? [targetShellId] : [],
        targetUserId: Array.isArray(targetUserId) ? targetUserId : targetUserId ? [targetUserId] : [],
      }
      if ([1, 13, 11, 12].includes(this.listQuery.handoverParameterVO.titleType)) {
        this.listQuery.handoverParameterVO.isShow = 0
      } else {
        this.listQuery.handoverParameterVO.isShow = 1
      }

      // if 
      this.finished = false
      this.handleRefresh()
    },
    getTableList(val, type) {
      this.moreLoading = true
      this.$loading(true, 'partStudentTableLoading')
      const { shellIdsLocal, schoolIdLocal, consultTypeLocal, examYearLocal, isFreshLocal, campusLocal, ownLocal, graduationYearLocal, sortRule } = this.listQuery.handoverParameterVO
      const query = {
        pageinfo: {
          ...this.listQuery.pageinfo,
          pageSize: this.pageSize/* ,
          // sort: [this.listQuery.pageinfo.sort] */
        },
        handoverParameterVO: {
          ...this.listQuery.handoverParameterVO,
          type: this.listType == 1 ? 1 : 3,
          activityId: this.sId
        }
      }
      this.moreActLecture = query.handoverParameterVO

      let data = []

      let arr = [
        'handoverShellId',
        // 'sourceChannelId',
        'handoverUserId',
        'targetSysId',
        'targetUserId',
        'targetShellId',
        // 'examYear',
        'handoverType',
        'endDate',
        'beginDate',
        'handoverKeyword',
        'handoverState',
        'potentialState',
        'signUpBegin',
        'signUpBegin'
      ]

      delete query.handoverParameterVO.isShow

      for (let prop in query.handoverParameterVO) {
        if ((arr.includes(prop) && query.handoverParameterVO[prop]) || query.handoverParameterVO[prop] === 0) {
          if (Array.isArray(query.handoverParameterVO[prop]) && query.handoverParameterVO[prop].length > 0) {
            data.push(prop)
          } else if (!Array.isArray(query.handoverParameterVO[prop])) {
            data.push(prop)
          }
        }
      }


      if ([1, 13, 11, 12].includes(query.handoverParameterVO.titleType)) {
        query.handoverParameterVO.isShow = 0
      } else {
        query.handoverParameterVO.isShow = 1
      }
      if (data.length > 0) {
        query.handoverParameterVO.isShow = 1
      }


      activityhandoverListApi(query).then(res => {
        if (['init', 'refresh'].includes(val)) {
          this.getListCount()
          this.tableList = res.data || []
        } else {
          this.tableList = this.tableList.concat(res.data || [])
        }
        if (res.data.length < this.pageSize) {
          this.finished = true
        }
        if (type == 'firstRequest') {
          this.firstList = res.data || []
        }
      }).finally(() => {
        this.$nextTick(() => {
          this.moreLoading = false
          this.refreshing = false
        })
        this.$loading(false, 'partStudentTableLoading')
      })
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
    getListCount() {
      this.cloading = true
      this.listQuery.handoverParameterVO.activityId = this.sId
      activityheaderStatisticalApi(this.listQuery.handoverParameterVO).then(res => {
        this.countObj = res.data || { total: 0, amountMoney: '0.00', balanceMoney: '0.00', receivedMoney: '0.00' }
        this.listFilterObj = res.data || {}
      }).finally(() => {
        this.cloading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.count-cont {
  background-color: white;
  padding: 0.6rem;
  display: flex;

  .count-list {
    flex: 1;
    text-align: center;

    .count-title {
      font-size: 0.8rem;
      margin-bottom: 0.3rem;
    }
    .count-num {
      font-size: 1.4rem;
    }
  }
}
</style>