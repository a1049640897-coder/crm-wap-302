<template>
  <div class="home-tab-view">
    <van-tabs v-model="counselTab" title-inactive-color='#999999' title-active-color='#333333' color='#333333' lazy-render>
      <van-tab title="咨询用户" name="CounselUser" v-if="tab1">
        <CounselUser />
      </van-tab>
      <van-tab title="未咨询" name="NoCounsel" v-if="tab2">
        <NoCounsel />
      </van-tab>
      <van-tab title="待分配" name="CounselDistribute" v-if="tab3">
        <CounselDistribute />
      </van-tab>
      <van-tab title="公海" name="CounselSea" v-if="tab4">
        <CounselSea />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { menuPermissionUtil } from '@/utils'

export default {
  name: 'home-consultation',
  components: {
    CounselUser: () => import('./CounselUser'), // 咨询用户
    NoCounsel: () => import('./NoCounsel'), // 未咨询
    CounselDistribute: () => import('./CounselDistribute'), // 待分配
    CounselSea: () => import('./CounselSea') // 公海
  },
  data() {
    return {
      tab1: menuPermissionUtil('PG:STU'),
      tab2: menuPermissionUtil('PG:NOCOUNSEL'),
      tab3: menuPermissionUtil('PG:WAITSTU'),
      tab4: menuPermissionUtil('PG:HS'),
      counselTab: this.tab1 ? 'CounselUser' : this.tab2 ? 'NoCounsel' : this.tab3 ? 'CounselDistribute' : this.tab4 ? 'CounselSea' : null
    }
  },
  activated() {
    this.handleTabInit()
  },
  methods: {
    handleTabInit() {
      let tab = this.$route.params.tab
      if (tab) {
        this.counselTab = tab
        this.$nextTick(() => {
          window.scrollTo(0, 0)
        })
      }
    }
  }
}
</script>
