
<template>
  <div class="home-tab-view">
    <van-tabs v-model="counselTab" @change="counselTabChange" title-inactive-color='#999999' title-active-color='#333333' color='#333333' lazy-render>
      <van-tab title="讲座登记" v-if="tab1" name="LectureReg">
        <LectureReg :counselTab="counselTab" ref="lectureReg" />
      </van-tab>
      <van-tab title="营销活动" v-if="tab2" name="MarketAct">
        <MarketAct :counselTab="counselTab" ref="marketAct" />
      </van-tab>
      <van-tab title="对手讲座" v-if="tab3" name="RivalLecture">
        <RivalLecture :counselTab="counselTab" ref="rivalLecture" />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import { menuPermissionUtil } from '@/utils'
export default {
  name: 'activities-index',
  components: {
    LectureReg: () => import('./LectureReg'), // 讲座登记
    MarketAct: () => import('./MarketAct'), // 营销活动
    RivalLecture: () => import('./RivalLecture'), // 对手讲座
  },
  data() {
    return {
      // counselTab: null,
      tab1: menuPermissionUtil('MARKET:SCHOOL'), // 讲座登记
      tab2: menuPermissionUtil('MARKET:BOOK'), // 营销活动
      tab3: menuPermissionUtil('MARKET:OPPONENT'), // 对手讲座
      counselTab: this.tab1 ? 'LectureReg' : this.tab2 ? 'MarketAct' : this.tab3 ? 'RivalLecture' : null
    }
  },
  created() {
    this.handleInit()
  },
  computed: {
    ...mapState({
      activityIsUpdate: state => state.activity.activityIsUpdate, // 活动编辑刷新
      quesConnectObj: state => state.activity.quesConnectObj, // 问卷对象
      quesConnectObjIsUpdate: state => state.activity.quesConnectObjIsUpdate, // 保存关联问卷刷新
      activityIsAddUpdate: state => state.activity.activityIsAddUpdate, // 活动添加刷新
    })
  },
  activated() {
    if (this.activityIsUpdate) {
      this.$nextTick(() => {
        let ref = this.counselTab == 'LectureReg' ? this.$refs.lectureReg : this.counselTab == 'MarketAct' ? this.$refs.marketAct : this.$refs.rivalLecture
        ref.$refs.userList && ref.$refs.userList.resetSingleList()
        // 重置
        this['SET_ACTIVITYSTATE']()
      })
    }

    if (this.quesConnectObjIsUpdate) {
      this.$nextTick(() => {
        let ref = this.counselTab == 'LectureReg' ? this.$refs.lectureReg : this.counselTab == 'MarketAct' ? this.$refs.marketAct : this.$refs.rivalLecture
        ref.$refs.userList && ref.$refs.userList.hanleShowCode()
        ref.$refs.userList && ref.$refs.userList.resetSingleList()
        // 关闭问卷弹窗的时候重置所以这边不做处理
      })
    }

    if (this.activityIsAddUpdate) {
      this.$nextTick(() => {
        let ref = this.counselTab == 'LectureReg' ? this.$refs.lectureReg : this.counselTab == 'MarketAct' ? this.$refs.marketAct : this.$refs.rivalLecture
        ref.$refs.userList && ref.$refs.userList.handleRefresh()
        // 重置
        this['SET_ACTIVITYADDSTATE']()
      })
    }

    // 重置详情进入标识判断 详情删除跳转
    this['SET_DETAILFLAG']({ flag: false })

    // 重置讲座、活动详情缓存
    this.$EventBus.$emit('handleResetLive', 'activities-lectureDetails')

    //  删除关联问卷的标识
    sessionStorage.removeItem('counselTab')

    // 重置问卷预览缓存
    this.$EventBus.$emit('handleResetLive', 'activities-QuesConnect')
  },
  methods: {
    ...mapActions('activity', ['queryListAct']),
    ...mapActions('common/global', ['setAuthorityTree']),
    ...mapMutations('common/global', ['SET_ACTIVE_DEFAULT_TAB']),
    ...mapMutations('activity/', ['SET_ACTIVITYSTATE', 'SET_ACTIVITYADDSTATE', 'SET_DETAILFLAG']),
    handleInit() {
      this.queryListAct()
      this.setAuthorityTree()
      this.handleTabInit()
    },
    handleTabInit() {
      let tab = this.$route.params.tab
      this.counselTab = tab
    },
    // tab切换改变设置默认的tab
    counselTabChange(val) {
      this.counselTab = val
    }
  },
  destroyed() {
    this.$EventBus.$emit('handleResetLive', 'activities-lectureDetails')
  }
}
</script>
