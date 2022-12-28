<template>
  <div class="user-profile">
    <div class="choose-cont">
      <div class="choose-item" @click="handleActive(0)" :class="{'active-item': activeOn === 0}">对方档案</div>
      <div class="choose-item" @click="handleActive(1)" :class="{'active-item': activeOn === 1}">己方档案</div>
    </div>
    <div class="common-empty" v-if="activeOn === 0 && !detailObj.oppositeSide" style="background: #fff;">
      <img src="@/assets/images/icons/empty.png" alt="">
      <div>暂无档案记录</div>
    </div>
    <div v-else>
      <profileCard :activeOn="activeOn" :studentData="activeOn === 0 ? detailObj.oppositeSide : detailObj.oneSelf" />
      <div class="common-list-contain" style="padding: 0.6rem 0;">
        <div class="student-records">
          <van-tabs v-model="recordsTab" title-inactive-color='#999' title-active-color='#333' color='#333' lazy-render>
            <van-tab title="咨询记录">
              <CounselRecord ref="CounselRecordRef" :sId="$route.params.id" :isAutoScroll.sync="isAutoScroll" :editFlag="false" />
            </van-tab>
            <van-tab title="活动记录">
              <ActiveRecord ref="ActiveRecordRef" :sId="$route.params.id" :isAutoScroll.sync="isAutoScroll" />
            </van-tab>
            <van-tab title="报名订单" v-if="activeOn === 0 && $route.params.type == 1">
              <EnrollmentOrder ref="EnrollmentOrderRef" :sId="detailObj.oppositeSide.studentId" :isAutoScroll.sync="isAutoScroll" />
            </van-tab>
            <van-tab title="图书订单" v-if="activeOn === 1">
              <BookOrder ref="BookOrderRef" :sId="detailObj.oneSelf.id" :isAutoScroll.sync="isAutoScroll" />
            </van-tab>
          </van-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { SplicingDatahandel } from '@/utils'
import { studentDetailsApi } from '@/api/potentialGuest/paymentRecord'
export default {
  name: 'handover-UserProfile',
  data() {
    return {
      recordsTab: 0,
      isAutoScroll: false,
      activeOn: 0,
      detailObj: {
        oneSelf: {},
        oppositeSide: {}
      }
    }
  },
  components: {
    profileCard: () => import('./components/profileCard'),
    CounselRecord: () => import('../../student/info/components/CounselRecord'),
    ActiveRecord: () => import('../../student/info/components/ActiveRecord'),
    BookOrder: () => import('../../student/info/components/BookOrder'),
    EnrollmentOrder: () => import('./components/EnrollmentOrder')
  },
  created() {
    this.handleInit()
  },
  methods: {
    handleActive(val) {
      this.activeOn = val
      this.recordsTab = 0
    },
    handleInit() {
      this.$loading(true, 'UserProfile')
      const type = Number(this.$route.params.type)
      this.$route.meta.title = type == 1 ? '移交用户档案' : '承接用户档案'
      document.title = this.$route.meta.title
      studentDetailsApi(type, this.$route.params.handoverId).then(res => {
        this.detailObj = res.data || {}
        if (this.detailObj.oneSelf) {
          this.detailObj.oneSelf.schoolName = this.detailObj.oneSelf.commonSchoolInfo ? SplicingDatahandel(this.detailObj.oneSelf.commonSchoolInfo.extend) : null
        }
        if (this.detailObj.oppositeSide) {
          this.detailObj.oppositeSide.schoolName = this.detailObj.oppositeSide.commonSchoolInfo ? SplicingDatahandel(this.detailObj.oppositeSide.commonSchoolInfo.extend) : null
        }
      }).finally(() =>
        this.$loading(false, 'UserProfile'))
    }
  }
}
</script>
<style lang="scss" scoped>
.user-profile {
  background-color: #fafafa;
  .choose-cont {
    padding: 0.68rem;
    display: flex;
    .choose-item {
      width: 5.2rem;
      height: 2.2rem;
      font-size: 0.86rem;
      line-height: 2.2rem;
      background-color: white;
      text-align: center;
      margin-right: 0.6rem;
      border-radius: 0.3rem;
      position: relative;
    }
    .active-item {
      color: white;
      background-color: #0088fe;
    }
    .active-item::after {
      content: '';
      width: 0;
      height: 0;
      border: 0.6rem solid;
      position: absolute;
      bottom: -1rem;
      left: 2rem;
      color: white;
      border-color: #0088fe transparent transparent;
    }
  }

  .student-records {
    padding: 0 0.68rem;
  }
}
</style>