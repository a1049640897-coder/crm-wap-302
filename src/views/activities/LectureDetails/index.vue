<template>
  <div>
    <LectureDetailsCard :sId="sId" :counselTab="counselTab" @refresh="handleRefresh" :studentData="studentInfo" isDetail />
    <div class="student-records">
      <van-tabs v-model="recordsTab" swipeable title-inactive-color='#999999' title-active-color='#333333' color='#333333' lazy-render>
        <van-tab title="参与人员">
          <ParticipantRecord ref="participantRecord" :onlyReadObj="onlyReadObj" :counselTab="counselTab" :sId="sId" :isAutoScroll.sync="isAutoScroll" />
        </van-tab>
        <van-tab title="移交情况">
          <HandoverRecord :sId="sId" :isAutoScroll.sync="isAutoScroll" />
        </van-tab>
        <van-tab title="问卷信息">
          <QuestionRecord :counselTab="counselTab" :sId="sId" :isAutoScroll.sync="isAutoScroll" />
        </van-tab>
        <van-tab title="成本管理">
          <CostRecord :sId="sId" :counselTab="counselTab" :branchId="studentInfo.branchId" :isAutoScroll.sync="isAutoScroll" />
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>
<script>
import { getLectureInfoApi } from '@/api/potentialGuest/activity'
import { mapState, mapMutations } from 'vuex'
export default {
  props: {
    listType: String
  },
  name: 'activities-lectureDetails',
  components: {
    ParticipantRecord: () => import('./components/ParticipantRecord'), // 参与人员
    HandoverRecord: () => import('./components/HandoverRecord'), // 移交情况
    QuestionRecord: () => import('./components/QuestionRecord'), // 问卷信息
    CostRecord: () => import('./components/CostRecord'), // 成本管理
    LectureDetailsCard: () => import('@/components/LectureDetailsCard')
  },
  computed: {
    ...mapState({
      activityPartId: state => state.activity.activityPartId,
      activityPartIsUpdate: state => state.activity.activityPartIsUpdate,
    }),
  },
  data() {
    return {
      recordsTab: 0,
      sId: null,
      isAutoScroll: false,
      studentInfo: {},
      counselTab: '',
      isReFresh: false,
      onlyReadObj: {}
    }
  },
  created() {
    this.sId = Number(this.$route.params.sid)
    this.handleDetail()
    // this.handleScrollInit()
  },
  activated() {
    if (this.isReFresh) {
      this.handleDetail()
    }
    // 重置问卷预览缓存
    this.$EventBus.$emit('handleResetLive', 'activities-QuesConnect')

    // 参与人员列表单独更新
    if (this.activityPartId) {
      this.$nextTick(() => {
        // this.$refs.participantRecord.reSetSingleList(this.activityPartId)
        this['SET_PARTACTID']({ activityPartId: null })
      })
    }

    // 参与人员列表刷新
    if (this.activityPartIsUpdate) {
      this.$nextTick(() => {
        this.$refs.participantRecord.handleRefresh()
        this['SET_PARTUSERUPDATE']({ activityPartIsUpdate: false })
      })
    }

  },
  methods: {
    ...mapMutations('activity', ['SET_PARTACTID', 'SET_PARTUSERUPDATE']),
    handleRefresh() {
      this.isReFresh = true
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
      this.counselTab = this.$route.params.counselTab
    },
    handleDetail() {
      return new Promise(resolve => {
        this.isReFresh = false
        getLectureInfoApi(this.sId).then(res => {
          this.onlyReadObj = {
            shellId: res.data.shellId,
            shell: res.data.shell,
            crmSourceChannelName: res.data.crmSourceChannelName,
            crmSourceChannelId: res.data.crmSourceChannelId,
          }
          this.$emit('onUpdataInfo', res.data)
          this.studentInfo = res.data || {}
          resolve()
        }).finally(() => {
          this.$loading(false, 'studentInfo')
        })
      })
    }
  }
}
</script>