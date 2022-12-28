<template>
  <div>
    <van-popup position="bottom" safe-area-inset-bottom v-model="isDialog" round get-container="#app">
      <div class="common-popup">
        <div class="common-popup-header">
          <div></div>
          <div class="common-popup-header-title">
            <span>{{reserveConsultResult ? '修改' : '添加'}}咨询结果</span>
          </div>
          <div></div>
        </div>
        <div class="common-popup-body">
          <van-form ref="ConsultSubscribeResultForm" @submit="handleConfirm" :show-error-message="false" validate-trigger="onSubmit">
            <RePick ref="consultantRef" v-model="listQuery.resultId" label="咨询结果" :list="zxjgList" name="consultantId" titleKey="text" isRequrie isCell />
            <div class="common-popup-footer">
              <van-button style="width: 8rem; margin-right: 1rem;" native-type="button" @click="handleClose">取消</van-button>
              <van-button type="info" style="width: 8rem;" native-type="submit">保存</van-button>
            </div>
          </van-form>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
// 咨询结果
import { commonCascadeApi } from '@/api/common'
import { updateReserveConsultResultApi } from '@/api/potentialGuest/consultation'

export default {
  name: 'ConsultSubscribeResult',
  props: {
    isOpen: {
      default: false,
      type: Boolean
    },
    // 咨询id
    id: Number,
    // 学生id
    sId: {
      require: true,
      type: Number
    },
    // 活动id
    aId: Number,
    reserveConsultResult: String
  },
  components: {
    RePick: () => import('../ReComponents/RePick')
  },
  data() {
    return {
      isDialog: false,
      zxjgList: [],
      listQuery: {}
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
      this.zxjgList = []
      this.listQuery = {
        id: this.sId,
        resultId: null,
        activityId: this.aId,
        studentId: this.sId
      }
      this.$refs.ConsultSubscribeResultForm && this.$refs.ConsultSubscribeResultForm.resetValidation()
    },
    handleInit() {
        this.handleDataInit()
        commonCascadeApi('zxjg').then(res => {
          this.zxjgList = res.data || []
        })
    },
    handleClose() {
      this.handleDataInit()
      this.isDialog = false
    },
    handleConfirm() {
      this.$loading(true, 'ConsultSubscribeResult')
      // this.listQuery.id = 245
      // this.listQuery.studentId = this.id
      updateReserveConsultResultApi(this.listQuery).then(res => {
        this.$sm(res.data)
        this.$emit('complete')
        this.handleClose()
      }).finally(() => {
        this.$loading(false, 'ConsultSubscribeResult')
      })
    }
  }
}
</script>
