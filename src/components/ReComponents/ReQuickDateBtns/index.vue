<template>
  <div class="data-quick-btns">
    <div class="data-quick-btns-item" :class="{'act-color': item.isHeight}" v-for="(item, index) in arr" :key="index" @click="handleTime(item)">{{item.title}}</div>
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  props: {
    startData: String,
    endData: String
  },
  data() {
    return {
      arr: [
        { title: '昨日', value: 0, isHeight: false, isDisabled: false, time: [dayjs().subtract(1, 'day').format('YYYY/MM/DD'), dayjs().subtract(1, 'day').format('YYYY/MM/DD')] },
        { title: '今日', value: 1, isHeight: false, isDisabled: false, time: [dayjs().format('YYYY/MM/DD'), dayjs().format('YYYY/MM/DD')] },
        { title: '上周', value: 2, isHeight: false, isDisabled: false, time: dayjs().day() ? [dayjs().startOf('week').subtract(6, 'day').format('YYYY/MM/DD'), dayjs().startOf('week').format('YYYY/MM/DD')] : [dayjs().subtract(13, 'day').format('YYYY/MM/DD'), dayjs().subtract(7, 'day').format('YYYY/MM/DD')] },
        { title: '本周', value: 3, isHeight: false, isDisabled: false, time: [dayjs().day() ? dayjs().day(1).format('YYYY/MM/DD') : dayjs().subtract(6, 'day').format('YYYY/MM/DD'), dayjs().format('YYYY/MM/DD')] },
        { title: '上月', value: 4, isHeight: false, isDisabled: false, time: [dayjs().subtract(1, 'month').startOf('month').format('YYYY/MM/DD'), dayjs().subtract(1, 'month').endOf('month').format('YYYY/MM/DD')] },
        { title: '本月', value: 5, isHeight: false, isDisabled: false, time: [dayjs().startOf('month').format('YYYY/MM/DD'), dayjs().format('YYYY/MM/DD')] },
        { title: '上季', value: 6, isHeight: false, isDisabled: false, time: Number(dayjs().format('MM')) > 9 ? [dayjs().month(6).startOf('month').format('YYYY/MM/DD'), dayjs().month(8).endOf('month').format('YYYY/MM/DD')] : Number(dayjs().format('MM')) > 6 ? [dayjs().month(3).startOf('month').format('YYYY/MM/DD'), dayjs().month(5).endOf('month').format('YYYY/MM/DD')] : Number(dayjs().format('MM')) > 3 ? [dayjs().month(0).startOf('month').format('YYYY/MM/DD'), dayjs().month(2).endOf('month').format('YYYY/MM/DD')] : [dayjs().subtract(1, 'year').month(9).startOf('month').format('YYYY/MM/DD'), dayjs().subtract(1, 'year').month(11).endOf('month').format('YYYY/MM/DD')] },
        { title: '本季', value: 7, isHeight: false, isDisabled: false, time: Number(dayjs().format('MM')) > 9 ? [dayjs().month(9).startOf('month').format('YYYY/MM/DD'), dayjs().format('YYYY/MM/DD')] : Number(dayjs().format('MM')) > 6 ? [dayjs().month(6).startOf('month').format('YYYY/MM/DD'), dayjs().format('YYYY/MM/DD')] : Number(dayjs().format('MM')) > 3 ? [dayjs().month(3).startOf('month').format('YYYY/MM/DD'), dayjs().format('YYYY/MM/DD')] : [dayjs().month(0).startOf('month').format('YYYY/MM/DD'), dayjs().format('YYYY/MM/DD')] },
        { title: '去年', value: 8, isHeight: false, isDisabled: false, time: [dayjs().subtract(1, 'year').startOf('year').format('YYYY/MM/DD'), dayjs().subtract(1, 'year').endOf('year').format('YYYY/MM/DD')] },
        { title: '今年', value: 9, isHeight: false, isDisabled: false, time: [dayjs().startOf('year').format('YYYY/MM/DD'), dayjs().format('YYYY/MM/DD')] }
      ]
    }
  },
  watch: {
    startData: {
      handler(val) {
        this.handleHeight(val, this.endData)
      },
      immediate: true
    },
    endData: {
      handler(val) {
        this.handleHeight(this.startData, val)
      },
      immediate: true
    }
  },
  methods: {
    handleTime(item) {
      if (item.isDisabled) return
      this.$emit('change', item)
    },
    handleHeight(val1, val2) {
      if (val1 && val2) {
        this.arr.forEach(item => {
          if (item.time[0] === dayjs(val1).format('YYYY/MM/DD') && item.time[1] === dayjs(val2).format('YYYY/MM/DD')) {
            this.$set(item, 'isHeight', true)
          } else {
            this.$set(item, 'isHeight', false)
          }
        })
      } else {
        this.arr.forEach(item => {
          this.$set(item, 'isHeight', false)
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.data-quick-btns {
  display: flex;
  .data-quick-btns-item {
    font-size: 0.86rem;
    width: 100%;
  }
}
</style>