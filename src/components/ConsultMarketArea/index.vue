<template>
  <div>
    <van-popup position="bottom" safe-area-inset-bottom v-model="isDialog" round get-container="#app">
      <div class="common-popup">
        <div class="common-popup-header">
          <div></div>
          <div class="common-popup-header-title">
            <span>修改市场区域</span>
          </div>
          <div></div>
        </div>
        <div class="common-popup-body">
          <div style="font-size: 0.86rem; margin: 0 1rem; line-height: 1.6rem;">
            <p>修改市场区域后，系统会重新关联对应的负责人，可能导致原来的市场区域负责人看不到该潜在用户</p>
          </div>
          <van-form ref="ConsultMarketAreaForm" @submit="handleConfirm" :show-error-message="false" validate-trigger="onSubmit">
            <RePick ref="markerAreaIdRef" v-model="listQuery.markerAreaId" label="市场区域" :list="marketAreaList" name="markerAreaId" isShowSearch isRequrie isCell :disabled="marketAreaList.length === 1" />
            <div class="common-popup-footer">
              <van-button style="width: 8rem; margin-right: 1rem;" native-type="button" @click="handleClose">取消</van-button>
              <van-button type="info" style="width: 8rem;" native-type="submit">修改</van-button>
            </div>
          </van-form>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
// 分配咨询功能
import { marketAreaBranchSchoolApi, batchMarketAreaApi } from '@/api/potentialGuest/consultation'

export default {
  name: 'ConsultMarketArea',
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
    // 部门id
    branchId: Number,
    markerAreaId: Number,
    markerAreaTitle: String
  },
  components: {
    RePick: () => import('../ReComponents/RePick')
  },
  data() {
    return {
      isDialog: false,
      listQuery: {},
      marketAreaList: []
    }
  },
  watch: {
    isOpen(val) {
      if (val) {
        this.handleDataInit()
        this.handleInit()
      }
      this.isDialog = val
    },
    isDialog(val) {
      this.$emit('update:isOpen', val)
    }
  },
  created() {
    this.handleDataInit()
  },
  methods: {
    handleDataInit() {
      this.marketAreaList = []
      this.listQuery = {
        students: [this.sId],
        markerAreaId: this.markerAreaId
      }
      this.$refs.ConsultMarketAreaForm && this.$refs.ConsultMarketAreaForm.resetValidation()
    },
    handleInit() {
      this.$loading(true, 'ConsultMarketArea')
      marketAreaBranchSchoolApi(this.branchId).then(res => {
        this.marketAreaList = res.data || []
        if (this.marketAreaList.findIndex(v => v.id === this.markerAreaId) === -1 || this.marketAreaList.length === 0) {
          this.marketAreaList.unshift({ id: this.markerAreaId, title: this.markerAreaTitle, disabled: true })
        }
      }).catch(() => {
        this.$emit('update:isOpen', false)
      }).finally(() => {
        this.$loading(false, 'ConsultMarketArea')
      })
    },
    handleClose() {
      this.handleDataInit()
      this.isDialog = false
    },
    handleConfirm() {
      const findObj = this.marketAreaList.find(v => v.id === this.listQuery.markerAreaId)
      if (findObj && findObj.disabled) {
        this.$fm('该市场区域状态已关闭或该市场区域已不在你权限范围内!')
        return
      }
      this.$loading(true, 'ConsultSubscribe')
      batchMarketAreaApi(this.listQuery).then(res => {
        this.$sm(res.data)
        this.$emit('complete')
        this.handleClose()
      }).finally(() => {
        this.$loading(false, 'ConsultSubscribe')
      })
    }
  }
}
</script>
