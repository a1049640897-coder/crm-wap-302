<template>
  <div class="home-tab-view">
    <van-tabs v-model="counselTab" title-inactive-color='#999999' title-active-color='#333333' color='#333333' lazy-render>
      <van-tab title="我移交的" name="MyTransfer" v-if="tab1">
        <MyTransfer />
      </van-tab>
      <van-tab title="移交业绩" name="TransferKpi" v-if="tab2">
        <TransferKpi />
      </van-tab>
      <van-tab title="我接收的" name="MyReceive" v-if="tab3">
        <MyReceive />
      </van-tab>
      <van-tab title="接收业绩" name="ReceiveKpi" v-if="tab4">
        <ReceiveKpi />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { menuPermissionUtil } from '@/utils'

export default {
  name: 'home-handover',
  components: {
    MyTransfer: () => import('./MyTransfer'), // 我移交的
    TransferKpi: () => import('./TransferKpi'), // 移交业绩
    MyReceive: () => import('./MyReceive'), // 我接收的
    ReceiveKpi: () => import('./ReceiveKpi') // 接收业绩
  },
  data() {
    return {
      tab1: menuPermissionUtil('HO:OVERSTU'),
      tab2: menuPermissionUtil('HO:PAYREC'),
      tab3: menuPermissionUtil('HO:RECEPTION'),
      tab4: menuPermissionUtil('HO:RECIVE'),
      counselTab: this.tab1 ? 'MyTransfer' : this.tab2 ? 'TransferKpi' : this.tab3 ? 'MyReceive' : this.tab4 ? 'ReceiveKpi' : null
    }
  },
  created() {
    this.handleInit()
  },
  activated() {
    this.handleTabInit()
  },
  methods: {
    ...mapActions('handover', ['getConfigDetail']),
    handleInit() {
      this.getConfigDetail()
    },
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
