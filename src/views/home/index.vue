<template>
  <div class="home-index common-list-contain">
    <Version />
    <div class="home-msg">
      <div class="home-msg-btn" v-for="item in waitList" :key="item.title" @click="handleRoute(item)">
        <div class="home-msg-img">
          <img :src="item.icon" alt="">
          <div class="home-msg-btn-tag">{{item.num}}</div>
        </div>
        <div class="home-msg-btn-text">{{item.title}}</div>
      </div>
    </div>
    <div class="home-quick common-list-contain">
      <div class="home-quick-header">
        <div class="home-quick-title">快捷入口</div>
        <div class="home-quick-set">
          <img src="@/assets/images/home/set.png" alt="" @click="handleMenu">
        </div>
      </div>
      <div class="home-quick-list">
        <div class="home-q-l-item" v-for="item in btnList" :key="item.title" @click="handleRoute(item)" v-show="item.isShow">
          <img class="home-q-l-item-img" :src="item.icon" alt="">
          <div class="home-q-l-item-title">{{item.title}}</div>
        </div>
      </div>
    </div>
    <QuickMenu :isOpen.sync="isQuickMenuDialog" :btnListProp="btnList" quickName="homeBtn" @onDealBtnList="handleDealBtnList" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { menuPermissionUtil } from '@/utils'

export default {
  name: 'home-index',
  components: {
    QuickMenu: () => import('./components/QuickMenu.vue'),
    Version: () => import('./components/Version.vue')
  },
  data() {
    return {
      isQuickMenuDialog: false,
      waitList: [
        { title: '待办事项', icon: require('@/assets/images/home/waitTodo.png'), path: '/waittodo', name: 'home-WaitTodo', num: 99, query: {} },
        { title: '消息通知', icon: require('@/assets/images/home/waitMsg.png'), path: '', name: '', num: 2, query: {} },
      ],
      btnList: [
        { id: 1, num: 0, title: '讲座登记', icon: require('@/assets/images/home/jzdj.png'), path: '/activities', name: 'activities-index', query: { tab: 'LectureReg' }, isShow: true },
        { id: 2, num: 1, title: '营销活动', icon: require('@/assets/images/home/yxhd.png'), path: '/activities', name: 'activities-index', query: { tab: 'MarketAct' }, isShow: true },
        { id: 3, num: 2, title: '对手讲座', icon: require('@/assets/images/home/dsjz.png'), path: '/activities', name: 'activities-index', query: { tab: 'RivalLecture' }, isShow: true },

        { id: 4, num: 3, title: '咨询用户', icon: require('@/assets/images/home/zxyh.png'), path: '/consultation', name: 'home-consultation', query: { tab: 'CounselUser' }, isShow: true },
        { id: 5, num: 4, title: '未咨询', icon: require('@/assets/images/home/wzx.png'), path: '/consultation', name: 'home-consultation', query: { tab: 'NoCounsel' }, isShow: true },
        { id: 6, num: 5, title: '待分配', icon: require('@/assets/images/home/dfp.png'), path: '/consultation', name: 'home-consultation', query: { tab: 'CounselDistribute' }, isShow: true },
        { id: 7, num: 6, title: '公海', icon: require('@/assets/images/home/gh.png'), path: '/consultation', name: 'home-consultation', query: { tab: 'CounselSea' }, isShow: true },

        { id: 8, num: 7, title: '我移交的', icon: require('@/assets/images/home/wyjd.png'), path: '/handover', name: 'home-handover', query: { tab: 'MyTransfer' }, isShow: true },
        { id: 9, num: 8, title: '移交业绩', icon: require('@/assets/images/home/yjyj.png'), path: '/handover', name: 'home-handover', query: { tab: 'TransferKpi' }, isShow: true },
        { id: 10, num: 9, title: '我接收的', icon: require('@/assets/images/home/wjsd.png'), path: '/handover', name: 'home-handover', query: { tab: 'MyReceive' }, isShow: true },
        { id: 11, num: 10, title: '接收业绩', icon: require('@/assets/images/home/jsyj.png'), path: '/handover', name: 'home-handover', query: { tab: 'ReceiveKpi' }, isShow: true },

        { id: 12, num: 11, title: '报名订单', icon: require('@/assets/images/home/bmdd.png'), path: '', name: '', query: {}, isShow: true },
        { id: 13, num: 12, title: '报名收款', icon: require('@/assets/images/home/bmsk.png'), path: '', name: '', query: {}, isShow: true },
        { id: 14, num: 13, title: '课程包收款', icon: require('@/assets/images/home/kcbsk.png'), path: '', name: '', query: {}, isShow: true },
      ]
    }
  },
  created() {
    this.handleInit()
  },
  methods: {
    ...mapActions('common/db', ['get']),
    handleInit() {

      if (!menuPermissionUtil('MARKET')) {
        this.btnList = this.btnList.filter(item => ![1, 2, 3].includes(item.id))
      } else if (!menuPermissionUtil('MARKET:SCHOOL')) {
        this.btnList = this.btnList.filter(item => ![1].includes(item.id))
      } else if (!menuPermissionUtil('MARKET:BOOK')) {
        this.btnList = this.btnList.filter(item => ![2].includes(item.id))
      } else if (!menuPermissionUtil('MARKET:OPPONENT')) {
        this.btnList = this.btnList.filter(item => ![3].includes(item.id))
      }

      if (!menuPermissionUtil('PG')) {
        this.btnList = this.btnList.filter(item => ![4, 5, 6, 7].includes(item.id))
      } else if (!menuPermissionUtil('PG:STU')) {
        this.btnList = this.btnList.filter(item => ![4].includes(item.id))
      } else if (!menuPermissionUtil('PG:NOCOUNSEL')) {
        this.btnList = this.btnList.filter(item => ![5].includes(item.id))
      } else if (!menuPermissionUtil('PG:WAITSTU')) {
        this.btnList = this.btnList.filter(item => ![6].includes(item.id))
      } else if (!menuPermissionUtil('PG:HS')) {
        this.btnList = this.btnList.filter(item => ![7].includes(item.id))
      }

      if (!menuPermissionUtil('HANDOVER')) {
        this.btnList = this.btnList.filter(item => ![8, 9, 10, 11].includes(item.id))
      } else if (!menuPermissionUtil('HO:OVERSTU')) {
        this.btnList = this.btnList.filter(item => ![8].includes(item.id))
      } else if (!menuPermissionUtil('HO:PAYREC')) {
        this.btnList = this.btnList.filter(item => ![9].includes(item.id))
      } else if (!menuPermissionUtil('HO:RECEPTION')) {
        this.btnList = this.btnList.filter(item => ![10].includes(item.id))
      } else if (!menuPermissionUtil('HO:RECIVE')) {
        this.btnList = this.btnList.filter(item => ![11].includes(item.id))
      }

      if (!menuPermissionUtil('ORDERMANAGE')) {
        this.btnList = this.btnList.filter(item => ![12, 13].includes(item.id))
      } else if (!menuPermissionUtil('ORDERINFO')) {
        this.btnList = this.btnList.filter(item => ![12].includes(item.id))
      } else if (!menuPermissionUtil('OM:GATHERORDER')) {
        this.btnList = this.btnList.filter(item => ![13].includes(item.id))
      }

      if (!menuPermissionUtil('ORDER:SHORTCUT')) {
        this.btnList = this.btnList.filter(item => ![14].includes(item.id))
      }

      this.get({
        argu: 'homeBtn',
        user: true
      }).then(res => {
        if (res && Array.isArray(res) && res.filter(item => item).length) {
          this.handleDealBtnList(res)
        }
      })

    },
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
    handleRoute(e) {
      if (!e) return
      this.$router.push({
        name: e.name,
        params: {
          ...e.query
        }
      })
    },
    handleMenu() {
      this.isQuickMenuDialog = true
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
