<template>
  <div>
    <RMList v-if="tableList.length" :moreLoading.sync="moreLoading" :refreshing.sync="refreshing" :finished.sync="finished" @onLoad="handleLoad" @onRefresh="handleRefresh" isMore :tableList="tableList">
      <div>
        <StudentCard v-for="(item) in  tableList" :branchId="branchId" :key="item.id" :sId="sId" :counselTab="counselTab" :costData="item" @onUpdataInfo="handleUpdataInfo" />
      </div>
    </RMList>
    <div class="common-empty" v-else style="background: #ffffff;">
      <img src="@/assets/images/icons/empty.png" alt="">
      <div>暂无数据</div>
    </div>
    <div class="common-bottom-btns" v-permission="checkPermissionStatus(counselTab)">
      <div class="common-bottom-btn" @click="handleAddStudent">
        <img src="@/assets/images/icons/add.png" alt="">
        <span>录入成本</span>
      </div>
    </div>

    <!-- 成本添加 -->
    <CostResult :is-open.sync="costIsShow" :branchId="branchId" :title="'录入成本'" :sId="sId" @complete="handleUpdataInfo"></CostResult>
  </div>
</template>
<script>
import { activityDetailCostApi } from '@/api/potentialGuest/activity'
// 问卷信息
export default {
  props: {
    branchId: [Number, String],
    counselTab: String
  },
  components: {
    RMList: () => import('@/components/ReComponents/RMList'),
    StudentCard: () => import('@/components/CostCard'),
    CostResult: () => import('@/components/CostResult/index'),
  },
  data() {
    return {
      cloading: false,
      costIsShow: false,
      sId: null,
      listType: '1',
      listConditonObj: {},
      finished: false,
      tableList: [],
      refreshing: false,
      listQuery: {
        activityId: null,
        itemsType: null,
        keyword: null,
        pageinfo: { pageNum: 1, pageSize: 999, sort: [] }
      }
    }
  },
  created() {
    let sId = Number(this.$route.params.sid)
    if (!Number.isNaN(sId)) { this.sId = sId }
    this.handleInit()
  },
  methods: {
    // counselTab : LectureReg : 讲座登记 其他：营销活动
    checkPermissionStatus(counselTab) {
      if (counselTab == 'LectureReg') {
        return 'MARKET:SCHOOL:COST_INPUTCOST'
      } else {
        return 'MARKET:ACT:COST_INPUTCOST'
      }
    },
    handleAddStudent() {
      this.costIsShow = true
    },
    handleUpdataInfo() {
      this.getTableList('refresh')
    },
    handleToConnect() {
      this.$router.push({
        path: `/QuesConnect/null`,
        // query: {
        //   counselTab: this.counselTab
        // }
      })
    },
    handleShowCode() {

    },
    handleInit() {
      this.getTableList('init')
    },
    getTableList(val) {
      this.moreLoading = true
      this.$loading(true, 'partStudentTableLoading')
      const query = {
        pageinfo: {
          ...this.listQuery.pageinfo,
        },
        activityId: this.sId,
        itemsType: this.listQuery.itemsType,
        keyword: this.listQuery.keyword
      }
      activityDetailCostApi(query).then(res => {
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
  }
}
</script>
<style lang="scss" scoped>
.ques-header {
  display: flex;
  padding: 0.6rem 0.8rem;
  background: #ffffff;
  justify-content: space-between;
  .header-lf {
    // border-left: 0.3rem solid #0088fe;
    display: flex;
    align-items: center;
    .header-lf-line {
      display: inline-block;
      width: 0.2rem;
      height: 100%;
      background: #0090f0;
      margin-right: 0.5rem;
    }
  }
  .header-rt {
    display: flex;
    .img-info {
      width: 1.5rem;
      height: 1.5rem;
      margin-right: 0.3rem;
    }
  }
}
</style>