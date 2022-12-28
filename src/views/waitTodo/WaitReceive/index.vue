<template>
  <div>
    <HeaderFilter :listType='listType' @onListQuery='handleListQuery' :paramProp='listQuery.handoverParameterVO' />
    <RMList :moreLoading.sync="moreLoading" :refreshing.sync="refreshing" :finished.sync="finished" @onLoad="handleLoad" @onRefresh="handleRefresh" isMore :tableList="tableList">
      <div>
        <HandoverCard v-for="(item, index) in tableList" :key="item.handoverId" :sId="item.id" :handoverId="item.handoverId" :studentData="item" typeTab="MyReceive" @onUpdataInfo="handleUpdataInfo($event, item, index)" :listType="listType" @onAllRefresh="handleAllRefresh" />
      </div>
    </RMList>
  </div>
</template>

<script>
import { getScrollTop } from '@/utils'
import { mapState } from 'vuex'
import { handoverListApi } from '@/api/potentialGuest/paymentRecord'
// 今日活动
export default {
  name: 'WaitReceive',
  components: {
    HeaderFilter: () => import('./HeaderFilter'),
    RMList: () => import('@/components/ReComponents/RMList'),
    HandoverCard: () => import('@/components/HandoverCard')
  },
  data() {
    return {
      listType: '2',
      tableList: [],
      finished: false,
      refreshing: false,
      moreLoading: false,
      listQuery: {
        handoverParameterVO: {
          beginDate: null,
          endDate: null,
          exist: null,
          handoverKeyword: "",
          handoverShellId: [],
          handoverSysId: null,
          handoverType: null,
          handoverUserId: [],
          targetShellId: [],
          targetSysId: null,
          targetUserId: null,
          branchId: null,
          type: 2
        },
        pageinfo: { pageNum: 1, pageSize: 20, sort: [{ type: 1, column: 'handoverTime' }] } // , sort: [{ type: 1, column: 'handoverTime' }, { type: 1, column: 'studentName' }] 
      }
    }
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
    this.handleScrollInit()
  },
  methods: {
    handleScrollInit() {
      window.addEventListener('scroll', this.handleScroll)
      window.scrollTo(0, this.height)
    },

    handleInit() {
      this.getTableList('init')
    },

    getTableList(val) {
      const { exist, handoverKeyword, targetShellId } = this.listQuery.handoverParameterVO
      const query = {
        pageinfo: {
          ...this.listQuery.pageinfo,
          pageSize: this.pageSize
        },
        handoverParameterVO: {
          type: 2,
          titleType: 4,
          day: this.day,
          beginDate: null,
          endDate: null,
          exist: exist,
          handoverKeyword: handoverKeyword,
          handoverShellId: [],
          handoverSysId: null,
          handoverType: null,
          handoverUserId: [],
          targetShellId: targetShellId,
          targetSysId: null,
          targetUserId: null
        }
      }
      this.moreLoading = true
      this.$loading(true, `cTableLoading_${this.listType}`)
      handoverListApi(query).then(res => {
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
      this.$emit('onListRefresh')
    }
  }
}
</script>
