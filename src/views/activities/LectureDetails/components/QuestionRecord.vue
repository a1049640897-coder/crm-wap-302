<template>
  <div>
    <div class="ques-header" v-if="headerTitle">
      <div class="header-lf">
        <span class="header-lf-line"></span> {{headerTitle}}
      </div>
      <div class="header-rt">
        <img src="@/assets/images/icons/recordEdit.png" alt="" v-permission=" counselTab == 'LectureReg'  ?  'MARKET:SCHOOL:INFO_EDIT' : 'MARKET:BOOK:INFO_EDIT'" @click="handleToConnect" class="img-info" v-if="!tableList.length" style="margin-right:0.7rem">
        <img src="@/assets/images/icons/qrcode.png" alt="" v-permission=" counselTab == 'LectureReg'  ?  'MARKET:SCHOOL:INFO_SIGNCODE' : 'MARKET:ACT:INFO_SIGNCODE'" class="img-info" @click="handleShowCode">
      </div>
    </div>

    <RMList v-if="tableList.length" :moreLoading.sync="moreLoading" :refreshing.sync="refreshing" :finished.sync="finished" @onLoad="handleLoad" @onRefresh="handleRefresh" isMore :tableList="tableList">
      <div>
        <StudentCard v-for="(item, index) in tableList" :key="item.id" :sId="item.id" :studentData="item" @onUpdataInfo="handleUpdataInfo($event, item, index)" :listType="'9'" />
      </div>
    </RMList>
    <div class="common-empty" v-if="!headerTitle" style="background: #ffffff;">
      <img src="@/assets/images/icons/empty.png" alt="">
      <div class="ques-box">
        <div class="connect-ques" @click="handleToConnect" v-permission=" counselTab == 'LectureReg'  ?  'MARKET:SCHOOL:INFO_RELATIONQ' : 'MARKET:ACT:INFO_RELATIONQ'">关联问卷</div>
      </div>
      <!-- <div>暂无数据</div> -->
    </div>

    <ShareTips :deptIsShow="deptIsShow" @compelete="handleCompelete" :activityId="sId" />
    <ShareCode :isOpen="shareCodeIsOpen" ref="shareCode" :counselTab="counselTab" :sId="sId" :sysShellId="sysShellId" @close="handleClose" />
  </div>
</template>
<script>
import { activityQuesListApi, activityQuesDetailApi, activityQuesHeaderApi } from '@/api/potentialGuest/activity'
import { mapState } from 'vuex'
// 问卷信息
export default {
  props: {
    counselTab: String
  },
  components: {
    RMList: () => import('@/components/ReComponents/RMList'),
    StudentCard: () => import('@/components/QuestionCard'),
    ShareTips: () => import('@/components/ShareCodeTips'),
    ShareCode: () => import('@/components/ShareCode')
  },
  data() {
    return {
      cloading: false,
      countObj: { total: 0, amountMoney: '0.00', balanceMoney: '0.00', receivedMoney: '0.00' }, // 统计
      listType: '1',
      sysId: null,
      listConditonObj: {},
      finished: false,
      tableList: [],
      refreshing: false,
      listQuery: {
        sex: null,
        year: null,
        keyword: null,
        activityId: this.sId,
        pageinfo: { pageNum: 1, pageSize: 20, sort: [{ type: 1, column: 'addTime' }] }
      },
      headerTitle: null,
      deptIsShow: false,
      deptId: null,
      shareCodeIsOpen: false,
      sId: null,
      sysShellId: null,
    }
  },
  computed: {
    ...mapState({
      quesIsUpdate: state => state.activity.quesIsUpdate
    }),
  },
  created() {
    let sId = Number(this.$route.params.sid)
    if (!Number.isNaN(sId)) { this.sId = sId }
    this.handleInit()
  },
  watch: {
    quesIsUpdate: {
      handler() {
        this.getTableList('refresh')
      },
      deep: true
    }
  },
  methods: {
    handleClose() {
      this.shareCodeIsOpen = false
    },
    handleCompelete(val) {
      if (val) {
        const { sysShellId, marketAreaId } = val
        this.sysShellId = sysShellId || marketAreaId
        this.deptIsShow = false
        this.$loading(true)
        this.$nextTick(() => {
          this.$refs.shareCode.checkCodeIsShow().then(() => {
            this.shareCodeIsOpen = true
            this.$loading(false)
          }).catch(() => {
            this.$loading(false)
          })
        })
      } else {
        this.deptIsShow = false
      }
    },
    handleToConnect() {
      // 设置进入关联问卷的标识符
      sessionStorage.setItem('counselTab', this.counselTab)
      this.$router.push({
        path: `/QuesConnect/${this.sId}`,
      })
    },
    handleShowCode() {
      this.deptIsShow = true
    },
    handleInit() {
      this.getTableList('init')
    },

    getTableList(val) {
      this.moreLoading = true
      this.$loading(true, 'partStudentTableLoading')
      this.listQuery.activityId = this.sId
      activityQuesListApi(this.listQuery).then(res => {
        if (['init', 'refresh'].includes(val)) {
          this.tableList = res.data || []
        } else {
          this.tableList = this.tableList.concat(res.data || [])
        }
        if (res.data.length < this.pageSize) {
          this.finished = true
        }
        // 获取头部标题信息
        activityQuesDetailApi(this.sId).then(res => {
          res.data.questionnaireId ? activityQuesHeaderApi(res.data.questionnaireId, this.sId).then(headerRes => {
            this.headerTitle = headerRes.data.title
          }) : this.headerTitle = null

        })
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
.ques-box {
  width: 100%;
  display: flex;
  justify-content: center;
  .connect-ques {
    border: 1px solid #0088fe;
    border-radius: 10px;
    padding: 0.2rem;
    width: 5rem;
    color: #0088fe;
    margin-right: 3rem;
  }
}
</style>