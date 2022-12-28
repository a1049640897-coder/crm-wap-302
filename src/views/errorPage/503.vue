<template>
  <div class="error-page">
    <img src="@/assets/images/503.png" alt="">
    <div class="err-title">系统维护中{{ form.startTime | safingTimeFilter(form.endTime)}}</div>
    <div style="text-align: left;box-shadow: -4px 1px 24px 0px rgba(70, 178, 242, 0.1); padding: 20px 30px; width: 80%;">
      <div style="color: #46B2F2; font-size: 16px;margin-bottom: 10px;">维护内容：</div>
      <div style="font-size: 16px; overflow: auto; max-height: 50vh; min-height: 30vh;"><span v-html="content"></span></div>
    </div>
  </div>
</template>

<script>
import { getSafing } from '@/api/login'
import dayjs from 'dayjs'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      form: {}
    }
  },
  filters: {
    safingTimeFilter(startTime, endTime) {
      return `${dayjs(startTime).format('MM-DD HH:mm')}-${dayjs(endTime).format('MM-DD HH:mm')}`
    }
  },
  computed: {
    ...mapGetters(['isSafing']),
    content() {
      if (this.form.remark) {
        return this.form.remark.replace(/\n/g, '<br/>')
      }
      return ''
    }
  },
  created() {
    this.handleInit()
  },
  methods: {
    handleInit() {
      getSafing().then(res => {
        this.form = res.data || {}
      }).catch(err => {
        if (err.status === 201) {
          let redirectUrl = this.$router.currentRoute.query.redirect
          if (redirectUrl) this.$router.replace('/' + decodeURIComponent(redirectUrl))
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>