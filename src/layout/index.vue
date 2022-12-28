<template>
  <div class="layout-contain">
    <div class="layout-view" :style="`padding-bottom: ${isTabeRouter ? safeHeight : 0 }px;`">
      <transition :name="transitionActive ? 'fade' : ''" mode="out-in">
        <keep-alive :include="isTabeRouter ? homeArr : aliveArr">
          <router-view />
        </keep-alive>
      </transition>
    </div>
    <transition :name="transitionActive ? 'fade' : ''" mode="out-in">
      <div class="layout-tab" v-show="isTabeRouter">
        <van-tabbar v-model="active" fixed ref="layoutTab">
          <!-- :to="{ path: item.path, query: { tab: 0 } }" -->
          <van-tabbar-item v-for="(item, index) in tabArr" :key="index" :name="item.name" :to="item.path" replace>
            <span v-if="item.path === '/consultation'" style="display: flex; flex-direction: column; align-items: center;">
              <img v-if="active === item.name" src="@/assets/images/tabbar/consultation-act.png" style="width: 1rem; height: auto;" alt="">
              <img v-else src="@/assets/images/tabbar/consultation.png" style="width: 1rem; height: auto;" alt="">
              <div style="margin-top: 0.3rem;">{{item.meta.title}}</div>
            </span>
            <span v-else-if="item.path === '/home'">
              <img src="@/assets/images/tabbar/home.png" style="width: 2rem; height: auto;" alt="">
            </span>
            <span v-else-if="item.path === '/handover'" style="display: flex; flex-direction: column; align-items: center;">
              <img v-if="active === item.name" src="@/assets/images/tabbar/handover-act.png" style="width: 1rem; height: auto;" alt="">
              <img v-else src="@/assets/images/tabbar/handover.png" style="width: 1rem; height: auto;" alt="">
              <div style="margin-top: 0.3rem;">{{item.meta.title}}</div>
            </span>
            <span v-else-if="item.path === '/orderManage'" style="display: flex; flex-direction: column; align-items: center;">
              <img v-if="active === item.name" src="@/assets/images/tabbar/orderManage-act.png" style="width: 1rem; height: auto;" alt="">
              <img v-else src="@/assets/images/tabbar/orderManage.png" style="width: 1rem; height: auto;" alt="">
              <div style="margin-top: 0.3rem;">{{item.meta.title}}</div>
            </span>
            <span v-else-if="item.path === '/stat'" style="display: flex; flex-direction: column; align-items: center;">
              <img v-if="active === item.name" src="@/assets/images/tabbar/stat-act.png" style="width: 1rem; height: auto;" alt="">
              <img v-else src="@/assets/images/tabbar/stat.png" style="width: 1rem; height: auto;" alt="">
              <div style="margin-top: 0.3rem;">{{item.meta.title}}</div>
            </span>
            <span v-else>{{item.meta.title}}</span>
          </van-tabbar-item>
        </van-tabbar>
      </div>
    </transition>
    <Feedback></Feedback>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  components: {
    Feedback: () => import('./components/Feedback')
  },
  data() {
    return {
      safeHeight: 0,
      active: 'home-index',
      aliveArr: [],
      tabArr: [],
      homeArr: ['home-consultation', 'home-handover', 'home-index', 'home-orderManage', 'home-stat'],
      isTabeRouter: false
    }
  },
  computed: {
    ...mapState('common', {
      transitionActive: state => state.setting.active,
    })
  },
  created() {
    this.handleInit()
    this.handleAlive()
  },
  watch: {
    $route: {
      handler(to) {
        this.isTabeRouter = !!to.meta.isTab
        if (this.isTabeRouter) {
          this.active = to.name
          this.isTabeRouter = true
        }
      },
      immediate: true
    }
  },
  mounted() {
    if (this.$refs.layoutTab) {
      this.safeHeight = this.$refs.layoutTab.$el.clientHeight
    }
    this.$EventBus.$on('handleResetLive', (name) => {
      this.handleResetLive(name)
    })
  },
  methods: {
    handleInit() {
      const homeRoute = this.$router.options.routes.find(item => item.name === 'Home')
      this.tabArr = homeRoute ? homeRoute.children : []
    },
    handleAlive() {
      this.handleAliveSet(this.$router.options.routes)
    },
    handleAliveSet(routerArr) {
      routerArr.forEach(el => {
        if (el.meta && el.meta.cache) {
          this.aliveArr.push(el.name)
        }
        if (el.children && el.children.length) {
          this.handleAliveSet(el.children)
        }
      })
    },
    handleResetLive(name) {
      const num = this.aliveArr.findIndex(item => item === name)
      if (num > -1) {
        this.aliveArr.splice(num, 1)
        this.$nextTick(() => {
          this.aliveArr.push(name)
        })
      }
    }
  }
}
</script>
