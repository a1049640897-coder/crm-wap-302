<template>
  <div class="count-cont" v-if="listType != 3">
    <div class="count-list" v-if="listType == 2">
      <div class="count-title"><span style="background-color: #0088FE"></span>活动场次</div>
      <van-loading v-if="cloading" size="1.2rem" style="margin-bottom:0.4rem" />
      <div v-else class="count-num">{{countData.events || '-'}}</div>
    </div>
    <div class="count-list" v-else>
      <div class="count-title"><span style="background-color: #0088FE"></span>讲座场次</div>
      <van-loading v-if="cloading" size="1.2rem" style="margin-bottom:0.4rem" />
      <div v-else class="count-num">{{countData.total || '-'}}</div>
    </div>
    <div class="count-list">
      <div class="count-title"><span style="background-color: #967ADC"></span>参与人数</div>
      <van-loading v-if="cloading" size="1.2rem" style="margin-bottom:0.4rem" />
      <div v-else class="count-num">{{listType == 2 ? (countData.peopleNum || '-') : (countData.number || '-')}}</div>
    </div>
    <div class="count-list">
      <div class="count-title"><span style="background-color: #E6A23C"></span>预约咨询</div>
      <van-loading v-if="cloading" size="1.2rem" style="margin-bottom:0.4rem" />
      <div v-else class="count-num">{{countData.appointmentNum || '-'}}</div>
    </div>
    <div class="count-list">
      <div class="count-title"><span style="background-color: #67C23A"></span>新用户</div>
      <van-loading v-if="cloading" size="1.2rem" style="margin-bottom:0.4rem" />
      <div v-else class="count-num">{{countData.newStudentNum || '-'}}</div>
    </div>
  </div>
</template>
<script>

export default {
  props: {
    listType: String,
    countData: {
      type: Object,
      default: () => { return { newStudentNum: null, number: null, total: null, appointmentNum: null } }
    },
    countLoading: {
      type: Boolean,
      default: false
    },
  },

  data() {
    return {
      cloading: false,
    }
  },

  watch: {
    countLoading(val) {
      this.cloading = val
    }
  }
}
</script>
<style lang="scss" scoped>
.count-cont {
  background-color: white;
  padding: 0.2rem 0.6rem 0.6rem;
  display: flex;

  .count-list {
    flex: 1;
    text-align: center;

    .count-title {
      font-size: 0.76rem;
      margin-bottom: 0.3rem;

      span {
        display: inline-block;
        height: 0.68rem;
        width: 0.18rem;
        border-radius: 0.1rem;
        position: relative;
        right: 0.4rem;
        top: 0.1rem;
      }
    }
    .count-num {
      font-size: 1.4rem;
    }
  }
}
</style>