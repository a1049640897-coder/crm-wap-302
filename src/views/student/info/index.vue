<template>
  <div class="student">
    <RMList :refreshing.sync="refreshing" @onRefresh="handleRefresh" minHeight="85">
      <div class="student-detail">
        <StudentCard v-if="sId" ref="StudentCard" :sId="sId" :studentData="studentInfo" isCloseBtn @onStudentCardMounted="handleStudentCardMounted" @onComplete="handleRefresh" isDetail />
      </div>
      <div class="common-list-contain">
        <div class="student-records">
          <van-tabs v-model="recordsTab" title-inactive-color='#999999' title-active-color='#333333' color='#333333' lazy-render>
            <van-tab title="咨询记录">
              <CounselRecord ref="CounselRecordRef" :sId="sId" :isAutoScroll.sync="isAutoScroll" @listLength="handleSetCounselRecordLength" :editFlag="listType != 7" />
            </van-tab>
            <van-tab title="活动记录">
              <ActiveRecord ref="ActiveRecordRef" :sId="sId" :isAutoScroll.sync="isAutoScroll" />
            </van-tab>
            <van-tab title="图书订单">
              <BookOrder ref="BookOrderRef" :sId="sId" :isAutoScroll.sync="isAutoScroll" />
            </van-tab>
          </van-tabs>
        </div>
      </div>
    </RMList>
    <div class="student-btns" v-if="isStudentCard && listType != '7'">
      <van-button class="student-b-btn" v-permission="'PG:STU:RECORD_ADD'" @click="handleBtn('counselRecord')">
        <img src="@/assets/images/icons/btn_record.png" alt="">
        <div>添加咨询记录</div>
      </van-button>
      <van-button class="student-b-btn" v-permission="'PG:STU:CONSULT'" @click="handleBtn('isConsultSubscribeShow', counselRecordLength ? '修改预约' : '预约咨询')">
        <img src="@/assets/images/icons/yuyue.png" alt="">
        <div>{{counselRecordLength ? '修改预约' : '预约咨询'}}</div>
      </van-button>
      <van-button class="student-b-btn" v-permission="'PG:STU:FILE_EDIT'" @click="handleBtn('studentInfoEdit')">
        <img src="@/assets/images/icons/btn_edit.png" alt="">
        <div>编辑</div>
      </van-button>
      <van-button class="student-b-btn" v-permission="'PG:STU:ADD_ORDER'" @click="handleBtn()">
        <img src="@/assets/images/icons/addOrder.png" alt="">
        <div>新增订单</div>
      </van-button>
      <van-button class="student-b-btn" @click="handleBtn('more')">
        <img src="@/assets/images/icons/btn_moe.png" alt="">
        <div>更多</div>
      </van-button>
    </div>
    <van-popup position="bottom" safe-area-inset-bottom v-model="isDialog" round get-container="#app">
      <div class="common-popup">
        <div class="common-popup-header">
          <div style="word-break: keep-all;">更多操作</div>
          <div class="common-popup-header-title">
          </div>
          <div>
            <van-icon name="cross" color="#999999" @click="isDialog = false" />
          </div>
        </div>
        <div class="student-more-btns">
          <van-button class="student-b-btn" v-permission="'PG:STU:BATCH_DISTRIBUTION'" @click="handleBtn('isConsultDistributeShow')">
            <img src="@/assets/images/icons/ConsultSubscribe.png" alt="">
            <div>分配咨询</div>
          </van-button>
          <van-button class="student-b-btn" v-permission="'PG:STU:MARKET_AREA'" @click="handleBtn('isConsultMarketAreaShow')">
            <img src="@/assets/images/icons/btn_edit.png" alt="">
            <div>修改市场区域</div>
          </van-button>
          <van-button class="student-b-btn" v-permission="'PG:STU:HAND_OVER'" @click="handleBtn('isConsultDeliverShow')">
            <img src="@/assets/images/icons/hand_on.png" alt="">
            <div>移交</div>
          </van-button>
          <van-button class="student-b-btn" v-permission="'PG:STU:DELIVER'" @click="handleBtn('isConsultHandOverShow')">
            <img src="@/assets/images/icons/hand_over.png" alt="">
            <div>转交</div>
          </van-button>
          <van-button class="student-b-btn" v-permission="'PG:STU:PUT_PUBLIC'" @click="handleBtn('isConsultSeaShow')">
            <img src="@/assets/images/icons/international_waters.png" alt="">
            <div>放入公海</div>
          </van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { consultationInfoApi, appointmentConsultationInfoApi } from '@/api/potentialGuest/consultation'
import { getScrollTop } from '@/utils'
export default {
  name: 'student-info',
  components: {
    RMList: () => import('@/components/ReComponents/RMList'),
    StudentCard: () => import('@/components/StudentCard'),
    CounselRecord: () => import('./components/CounselRecord'),
    ActiveRecord: () => import('./components/ActiveRecord'),
    BookOrder: () => import('./components/BookOrder')
  },
  data() {
    return {
      counselRecordLength: 0,
      isAutoScroll: false,
      height: 0,
      sId: null,
      studentInfo: {},
      recordsTab: 0,
      refreshing: false,
      isStudentCard: false,
      isDialog: false,
      listType: null
    }
  },
  created() {
    this.handleInitSid()
    if (this.$route.query) {
      this.listType = this.$route.query.listType
    } else {
      this.listType = null
    }
  },
  activated() {
    this.handleInitSid()
    this.handleRefresh()
    if (!this.isAutoScroll) {
      this.recordsTab = 0
    }
    this.handleScrollInit()
  },
  deactivated() {
    window.removeEventListener('scroll', this.handleScroll)
    if (!this.isAutoScroll) {
      this.studentInfo = {}
    }
  },
  methods: {
    handleSetCounselRecordLength(length) {
      this.counselRecordLength = length
    },
    handleInitSid() {
      let sId = Number(this.$route.params.sid)
      let listType = this.$route.params.listtype
      if (!Number.isNaN(sId)) this.sId = Number(sId)
      if (listType) this.listType = listType
    },
    handleScrollInit() {
      if (this.isAutoScroll) {
        this.$nextTick(() => {
          window.scrollTo(0, this.height)
          this.isAutoScroll = false
        })
      } else {
        this.height = 0
        window.scrollTo(0, this.height)
        window.addEventListener('scroll', this.handleScroll)
      }
    },

    handleScroll() {
      getScrollTop().then(height => {
        this.height = height
      })
    },
    handleDetail() {
      return new Promise(resolve => {
        this.$loading(true, 'studentInfo')
        const api = this.listType === 'yuYueZiXun' ? appointmentConsultationInfoApi : consultationInfoApi
        api(this.sId, Number(this.$route.params.listtype)).then(res => {
          this.studentInfo = res.data || {}
          resolve()
        }).catch(() => {
          this.refreshing = false
        }).finally(() => {
          this.$nextTick(() => {
            this.$loading(false, 'studentInfo')
          })
        })
      })
    },
    handleRefresh() {
      this.handleDetail().then(() => {
        // if (this.recordsTab === 0) {
        this.$refs.CounselRecordRef && this.$refs.CounselRecordRef.getTableList().finally(() => {
          this.refreshing = false
        })
        // } else if (this.recordsTab === 1) {
        this.$refs.ActiveRecordRef && this.$refs.ActiveRecordRef.getTableList().finally(() => {
          this.refreshing = false
        })
        // } else if (this.recordsTab === 2) {
        this.$refs.BookOrderRef && this.$refs.BookOrderRef.getTableList().finally(() => {
          this.refreshing = false
        })
        // }
      })
    },
    handleStudentCardMounted() {
      this.isStudentCard = true
    },
    handleBtn(val, text = null) {
      if (!val) return
      if (val === 'studentInfoEdit') {
        this.isAutoScroll = true
        this.$router.push({
          path: `/studentInfoEdit/${this.sId}`
        })
      } else if (val === 'counselRecord') {
        this.isAutoScroll = true
        this.$router.push({
          path: `/counselrecord/${this.sId}/null`
        })
      } else if (val === 'more') {
        this.isDialog = true
      } else {
        this.isDialog = false
        this.$refs.StudentCard.handlePopSelect({ dialogName: val, text: text })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../index.scss';
</style>
