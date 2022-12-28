
<template>
  <div class="tabs-box">
    <div class="tabs-lf">
      <van-tabs v-model="counselTab" title-inactive-color='#999999' title-active-color='#333333' color='#333333' v-if="btnList.filter(v=>v.isShow).length" lazy-render>
        <van-tab v-for="(item,index) in  filterBtnList" :title="item.title" :name="item.name" :key="index" :badge="item.count">
          <WaitCounsel v-if="item.id == 2" :listType="item.listType" />
          <WaitReceive v-if="item.id == 3" @onListRefresh="handleInitHeaderTotal" :listType="item.listType" />
          <WaitFollow v-if="item.id == 1" :listType="item.listType" />
          <WaitNowActivity v-if="item.id == 4" ref="waitNowActivity" :listType="item.listType" />
        </van-tab>
      </van-tabs>
    </div>
    <div class="tabs-rt">
      <div class="setting-icon">
        <img :src="require('@/assets/images/home/set.png')" alt="" @click.stop="handleMenu">
      </div>
    </div>
    <QuickMenu :isOpen.sync="isQuickMenuDialog" quickName="waitTodoBtn" :btnListProp="filterBtnList" @onDealBtnList="handleDealBtnList" />
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import { getCommonHeaderTotal } from '@/api/common'
import { menuPermissionUtil } from '@/utils'

export default {
  name: 'home-WaitTodo',
  components: {
    WaitFollow: () => import('./WaitFollow'), // 待跟进
    WaitReceive: () => import('./WaitReceive'), // 待接收
    WaitCounsel: () => import('./WaitCounsel'), // 预约咨询
    WaitNowActivity: () => import('./WaitNowActivity'), // 今日活动
    QuickMenu: () => import('@/views/home/components/QuickMenu.vue')
  },
  data() {
    return {
      tab1: menuPermissionUtil('PG:WTW'),
      tab2: menuPermissionUtil('PG:RC'),
      tab3: menuPermissionUtil('HO:WAITRECEPTION'),
      tab4: true, // 已处理
      counselTab: this.tab1 ? 'WaitFollow' : this.tab2 ? 'WaitCounsel' : this.tab3 ? 'WaitReceive' : this.tab4 ? 'WaitNowActivity' : null,
      counselTabTotal: {
        tab_1_count: 0,
        tab_2_count: 0,
        tab_3_count: 0,
        tab_4_count: 0
      },
      btnList: [
        { id: 1, num: 0, title: '待跟进', isShow: true, tab: menuPermissionUtil('PG:WTW'), name: 'WaitFollow', count: 0, listType: 2 },
        { id: 2, num: 0, title: '预约咨询', isShow: true, tab: menuPermissionUtil('PG:RC'), name: 'WaitCounsel', count: 0, listType: 2 },
        { id: 3, num: 0, title: '待接收', isShow: true, tab: menuPermissionUtil('HO:WAITRECEPTION'), name: 'WaitReceive', count: 0, listType: 2 },
        { id: 4, num: 0, title: '今日活动', isShow: true, tab: true, name: 'WaitNowActivity', count: 0, listType: 2 },
      ],
      isQuickMenuDialog: false,

    }
  },
  computed: {
    filterBtnList: function () {
      return this.btnList.filter(function (val) {
        return val.isShow;   // 返回isShow=true的项
      })
    },
    ...mapState({
      activityIsUpdate: state => state.activity.activityIsUpdate, // 活动编辑刷新
      activityIsAddUpdate: state => state.activity.activityIsAddUpdate, // 活动添加刷新
    })
  },
  created() {
    this.handleInit()
    this.handleInitHeaderTotal()
  },
  activated() {
    if (this.activityIsUpdate) {
      this.$nextTick(() => {
        let ref = this.$refs.waitNowActivity
        ref && ref[0].$refs.userList.resetSingleList()
        this.handleInitHeaderTotal()
        // 重置
        this['SET_ACTIVITYSTATE']()
      })
    }

    if (this.activityIsAddUpdate) {
      this.$nextTick(() => {
        let ref = this.$refs.waitNowActivity
        ref && ref[0].$refs.userList.handleRefresh()
        this.handleInitHeaderTotal()
        // 重置
        this['SET_ACTIVITYADDSTATE']()
      })
    }
    this.$EventBus.$emit('handleResetLive', 'activities-lectureDetails')

    // 重置问卷预览缓存
    this.$EventBus.$emit('handleResetLive', 'activities-QuesConnect')
  },
  methods: {
    ...mapMutations('activity/', ['SET_ACTIVITYSTATE', 'SET_ACTIVITYADDSTATE']),
    handleDealBtnList(arr) {
      this.btnList = this.btnList.map(item => {
        let obj = arr.find(el => el.id === item.id)
        if (obj) {
          item.num = obj.num
          item.isShow = obj.isShow
        }
        return item
      }).sort((a, b) => {
        return a.num - b.num
      })
    },
    handleMenu() {
      this.isQuickMenuDialog = true
    },
    ...mapActions('common/db', ['get']),
    ...mapActions('consultation', ['queryListAct']),
    handleInit() {
      this.queryListAct(2)
      this.get({
        argu: 'quickBtn',
        user: true
      }).then(res => {
        if (res && Array.isArray(res) && res.filter(item => item).length) {
          this.handleDealBtnList(res)
        }
      })
    },
    handleInitHeaderTotal() {
      getCommonHeaderTotal().then(res => {
        const { followedCount, reserveConsultCount, todayActivityCount, toBeReceived } = res.data || {}
        // this.btnList.
        this.btnList.forEach(v => {
          if (v.name == 'WaitFollow') {
            this.$set(v, 'count', followedCount ? followedCount > 99 ? '...' : followedCount : 0)
          }
          if (v.name == 'WaitCounsel') {
            this.$set(v, 'count', reserveConsultCount ? reserveConsultCount > 99 ? '...' : reserveConsultCount : 0)
          }
          if (v.name == 'WaitReceive') {
            this.$set(v, 'count', toBeReceived ? toBeReceived > 99 ? '...' : toBeReceived : 0)
          }
          if (v.name == 'WaitNowActivity') {
            this.$set(v, 'count', todayActivityCount ? todayActivityCount > 99 ? '...' : todayActivityCount : 0)
          }
        });
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.tabs-box {
  display: flex;
  width: 100%;
  position: relative;

  .tabs-lf {
    width: 100%;
  }
  .tabs-rt {
    position: absolute;
    right: 0;
    top: 0;
    // background: #ffffff;
    display: flex;
    background: #ffffff;
    width: 3rem;
    height: 2.7rem;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    padding-right: 0.5rem;
  }
  .setting-icon {
    width: 1.5rem;
    height: 1.5rem;
    // background: red;
    img {
      width: 100%;
    }
  }
}
::v-deep .van-tabs__wrap {
  margin-right: 3rem;
}
</style>
