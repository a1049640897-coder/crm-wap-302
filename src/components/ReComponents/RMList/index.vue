<template>
  <van-pull-refresh v-model="rloading" @refresh="onRefresh" loading-text="加载中..." success-text="刷新成功" :class="{'pull-contain': isListSlot}">
    <van-list v-model="mloading" :finished="finished" finished-text="到底了..." @load="onLoad" v-if="isListSlot" :immediate-check="false">
      <slot></slot>
    </van-list>
    <div v-else class="noMore" :style="`min-height: ${minHeight}vh`">
      <slot></slot>
      <div style="color: #969799; font-size: 0.86rem; display: flex; flex-direction: column; align-items: center;">
        <!-- <img src="@/assets/images/icons/empty.png" alt="" style="width: 10rem; height: auto;"> -->
        <span class="mt5">{{tableList ? tableList.length ? '到底了...' : '无数据' : ''}}</span>
      </div>
    </div>
  </van-pull-refresh>
</template>

<script>
import { mapState } from 'vuex'

export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    isMore: {
      type: Boolean,
      default: false
    },
    moreLoading: {
      type: Boolean,
      default: false
    },
    refreshing: {
      type: Boolean,
      default: false
    },
    finished: {
      type: Boolean,
      default: false
    },
    tableList: Array,
    minHeight: {
      type: [Number, String],
      default: 75
    }
  },
  data() {
    return {
      // list: [],
      mloading: false,
      rloading: false
    }
  },
  computed: {
    ...mapState({
      pageSize: state => state.common.setting.pageSize
    }),
    isListSlot() {
      return this.isMore && this.tableList && this.tableList.length > this.pageSize - 1
    }
  },
  watch: {
    moreLoading(val) {
      this.mloading = val
    },
    // mloading(val) {
    //   console.log(val, 'mloading')
    //   this.$emit('change', val)
    // },
    refreshing(val) {
      this.rloading = val
    },
    rloading(val) {
      this.$emit('update:refreshing', val)
    },
  },
  methods: {
    onLoad() {
      if (this.moreLoading || this.refreshing) return
      this.$emit('onLoad')
    },
    onRefresh() {
      if (this.moreLoading) return
      this.$emit('onRefresh')
    }
  }
}
</script>

<style lang="scss" scoped>
.pull-contain {
  /deep/.van-pull-refresh__track {
    min-height: 100vh;
  }
}
</style>