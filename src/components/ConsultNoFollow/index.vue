<template>
  <div>
    <van-popup position="bottom" safe-area-inset-bottom v-model="isDialog" round get-container="#app">
      <div class="common-popup">
        <div class="common-popup-header">
          <div></div>
          <div class="common-popup-header-title">
            <span>无需跟进</span>
          </div>
          <div></div>
        </div>
        <div class="common-popup-body">
          <div style="text-align: center; font-size: 0.86rem; margin-bottom: 2rem;">
            <p>该线索还未添加咨询记录</p>
            <p>你确定要将该潜在用户从待跟进移除吗？</p>
          </div>
          <div class="common-popup-footer">
            <van-button style="width: 8rem; margin-right: 1rem;" @click="handleClose">取消</van-button>
            <van-button type="info" style="width: 8rem;" @click="handleConfirm">确定</van-button>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
// 无需跟进
import { unFollowApi } from '@/api/potentialGuest/consultation'

export default {
  name: 'ConsultSea',
  props: {
    isOpen: {
      default: false,
      type: Boolean
    },
    // 学生id
    sId: {
      require: true,
      type: Number
    },
    // 活动id
    aId: Number
  },
  data() {
    return {
      isDialog: false,
      listQuery: {}
    }
  },
  watch: {
    isOpen(val) {
      this.isDialog = val
    },
    isDialog(val) {
      this.$emit('update:isOpen', val)
    }
  },
  methods: {
    handleClose() {
      this.isDialog = false
    },
    handleConfirm() {
      this.$loading(true, 'ConsultSea')
      unFollowApi(this.sId).then(res => {
        this.$sm(res.data)
        this.$emit('complete')
        this.handleClose()
      }).finally(() => {
        this.$loading(false, 'ConsultSea')
      })
    }
  }
}
</script>
