<!-- 问卷预览界面 -->
<template>
  <div class="view-box">
    <iframe :src="newUrl" ref="iframe" id="iframeId" frameBorder="0" width="100%" style="height:100vh"></iframe>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      origin: window.location.origin,
      authorization: window.localStorage.getItem('accessToken'),
      questionId: 0,
      viewport: null,
      domainNameList: [
        {
          gateway: ['http://59.61.85.58:13568'],
          outGateway: 'http://59.61.85.58:13567/outPage/#/mobileQuestions?questionId='
        },
        {
          gateway: ['http://59.61.85.58:8029', 'http://itest.joineast.com'],
          outGateway: 'https://test.joineast.com/outPage/#/mobileQuestions?questionId='
        },
        {
          gateway: ['http://192.168.50.21:8029', 'http://isim.joineast.com'],
          outGateway: 'https://sim.joineast.com/outPage/#/mobileQuestions?questionId='
        },
        {
          gateway: ['http://www.joineast.com', 'https://www.joineast.com'],
          outGateway: 'https://out.joineast.com/outPage/#/mobileQuestions?questionId='
        }
      ]
    }
  },
  created() {
    const { id } = this.$route.params
    this.questionId = id
    if (process.env.NODE_ENV === 'development') {
      this.newUrl = 'http://59.61.85.58:13567/outPage/#/mobileQuestions?questionId=' + this.questionId + '&isPreview=1&activityId=null'
    } else {
      const originObj = this.domainNameList.find(e => e.gateway.includes(this.origin))
      this.newUrl = originObj.outGateway + this.questionId + '&isPreview=1&activityId=null'
    }
  },
  destroyed() {
    this.handleViewport()
  },
  components: {},

  computed: {},

  methods: {
    handleViewport() {
      // document.getElementById("viewport").content = this.viewport
    }
  }
}

</script>
<style lang='scss' scoped>
@import './index.scss';
</style>