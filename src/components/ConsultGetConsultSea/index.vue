

<template>
  <div>
    <van-popup position="bottom" safe-area-inset-bottom v-model="isDialog" round get-container="#app">
      <div class="common-popup">
        <div class="common-popup-header">
          <div></div>
          <div class="common-popup-header-title">
            <span>领取</span>
          </div>
          <div></div>
        </div>
        <div class="common-popup-body">
          <van-form ref="ConsultGetConsultSeaForm" @submit="handleConfirm" :show-error-message="false" validate-trigger="onSubmit">
            <RePick ref="consultantRef" v-model="sysShellId" label="所属部门" :list="shellList" name="consultantId" idKey="value" titleKey="text" isRequrie isCell />
            <div class="common-popup-footer">
              <van-button style="width: 8rem; margin-right: 1rem;" native-type="button" @click="handleClose">取消</van-button>
              <van-button type="info" style="width: 8rem;" native-type="submit">领取</van-button>
            </div>
          </van-form>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
// 公海领取
import { getSeaTipsApi, departmentSeaApi, gettingSeaApi } from '@/api/potentialGuest/consultation'

export default {
  name: 'ConsultGetConsultSea',
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
    }
  },
  components: {
    RePick: () => import('../ReComponents/RePick')
  },
  data() {
    return {
      isDialog: false,
      shellList: [],
      sysShellId: null
    }
  },
  watch: {
    isOpen(val) {
      if (val) {
        this.handleDataInit()
        this.handleInit().then(() => {
          this.isDialog = val
        })
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
      this.sysShellId = null
      this.shellList = []
      this.$refs.ConsultGetConsultSeaForm && this.$refs.ConsultGetConsultSeaForm.resetValidation()
    },
    handleInit() {
      return new Promise(resolve => {
        this.handleDataInit()
        this.$loading(true, 'ConsultGetConsultSea')
        getSeaTipsApi(this.sId).then(res => {
          if (res.status !== 200) return
          departmentSeaApi(res.data).then(list => {
            this.shellList = list.data || []
            if (this.shellList.length === 1) {
              this.sysShellId = this.shellList[0].value
            }
            resolve()
          }).finally(() => {
            this.$loading(false, 'ConsultGetConsultSea')
          })
        }).catch(() => {
          this.$loading(false, 'ConsultGetConsultSea')
          this.$emit('update:isOpen', false)
        })
      })
    },
    handleClose() {
      this.handleDataInit()
      this.isDialog = false
    },
    handleConfirm() {
      this.$loading(true, 'ConsultGetConsultSea')
      gettingSeaApi(this.sId, this.sysShellId).then(res => {
        this.$sm(res.data)
        this.$emit('complete')
        this.handleClose()
      }).finally(() => {
        this.$loading(false, 'ConsultGetConsultSea')
      })
    }
  }
}
</script>
