<template>
  <div class="home-header" @click="handleVersion">
    <img class="home-header-img" src="@/assets/images/home/safeguard.png" alt="">
    <div class="home-headere-version">V{{JYversion.fNum}}.{{JYversion.sNum}}.{{JYversion.tNum}}</div>
    <van-popup v-model="isDialog" get-container="#app" round>
      <div style="padding: 1rem; max-height: 50vh; width: 80vw; overflow: auto">
        <div class="mb5" style="font-weight: bold;">更新内容</div>
        <div style="margin-bottom: 0.3rem; font-size: 0.86rem;" v-for="(item, index) in versionContent" :key="index">{{item}}</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { getVersionApi } from '@/api/home'

export default {
  data() {
    return {
      isDialog: false,
      JYversion: {
        fNum: 1,
        sNum: 0,
        tNum: 0
      },
      versionContent: []
    }
  },
  created() {
    this.handleInit()
  },
  methods: {
    handleInit() {
      getVersionApi().then(res => {
        if (!res.data || !res.data.maxVersion) return
        this.JYversion = res.data.maxVersion || {
          fNum: 1,
          sNum: 0,
          tNum: 0
        }
        const { introduce } = res.data.maxVersion
        this.versionContent = introduce ? introduce.split('\n') : ''
      })
    },
    handleVersion() {
      this.isDialog = true
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../index.scss';
</style>