<template>
  <div>
    <van-popup position="bottom" safe-area-inset-bottom v-model="isDialog" round get-container="#app">
      <div class="common-popup">
        <div class="common-popup-header">
          <div></div>
          <div class="common-popup-header-title">
            <span>放入公海</span>
          </div>
          <div></div>
        </div>
        <div class="common-popup-body">
          <div style="text-align: center; font-size: 0.86rem; margin-bottom: 2rem;">
            <p>放入公海后该学员将</p>
            <p>不再属于你，您确定要将该学员放入公海吗？</p>
          </div>
          <div class="common-popup-footer">
            <van-button style="width: 8rem; margin-right: 1rem;" @click="handleClose">取消</van-button>
            <van-button type="info" style="width: 8rem;" @click="handleConfirm">放入</van-button>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
// 放入公海
import { seaTipsApi, puttingSeaApi } from '@/api/potentialGuest/consultation'

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
      if (val) {
        // this.handleInit().then(() => {
          this.isDialog = val
        // })
      } else {
        this.isDialog = val
      }
    },
    isDialog(val) {
      this.$emit('update:isOpen', val)
    }
  },
  methods: {
    handleInit() {
      return new Promise((resolve) => {
        this.$loading(true, 'ConsultSea')
        seaTipsApi(this.sId).then(() => {
          resolve()
        }).catch(() => {
          this.$emit('update:isOpen', false)
        }).finally(() => {
          this.$loading(false, 'ConsultSea')
        })
      })
    },
    
    handleClose() {
      this.isDialog = false
    },
    handleConfirm() {
      this.$loading(true, 'ConsultSea')
      puttingSeaApi(this.sId).then(res => {
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
