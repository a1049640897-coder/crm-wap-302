<template>
  <div>
    <van-popup position="bottom" safe-area-inset-bottom v-model="isDialog" round get-container="#app">
      <div class="common-popup">
        <div class="common-popup-header">
          <div></div>
          <div class="common-popup-header-title">
            <span>分配咨询</span>
          </div>
          <div></div>
        </div>
        <div class="common-popup-body">
          <van-form ref="ConsultDistributeForm" @submit="handleConfirm" :show-error-message="false" validate-trigger="onSubmit">
            <RePick ref="consultantRef" v-model="listQuery.batchNumbersLocal.id" label="咨询" :list="counselorList" @change="handleUserDeaprtment" name="consultantId" titleKey="name" isShowSearch isRequrie isCell />
            <RePick ref="consultantDepartRef" v-model="listQuery.batchNumbersLocal.sysShellId" :disabled="departList.length === 1" label="所属部门" :list="departList" name="branchId" idKey="value" titleKey="text" isShowSearch isRequrie isCell />
            <div class="common-popup-footer">
              <van-button style="width: 8rem; margin-right: 1rem;" native-type="button" @click="handleClose">取消</van-button>
              <van-button type="info" style="width: 8rem;" native-type="submit">分配</van-button>
            </div>
          </van-form>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
// 分配咨询功能
import { counseltDistributeCheckApi, getUserTypeApi, getUserTypeActApi, jobShellListApi, batchDistributeCounselApi } from '@/api/potentialGuest/consultation'

export default {
  name: 'ConsultSubscribe',
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
    aId: Number,
    listType: String
  },
  components: {
    RePick: () => import('../ReComponents/RePick')
  },
  data() {
    return {
      isDialog: false,
      agreeAllotCounselorObj: {},
      counselorList: [],
      departList: [],
      listQuery: {}
    }
  },
  watch: {
    isOpen(val) {
      if (val) {
        this.handleDataInit()
        this.handleInit().then(() => {
          this.isDialog = val
        })
      } else {
        this.isDialog = val
      }
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
      this.agreeAllotCounselorObj = {
        allowDistribute: [],
        branch: null,
        branchId: null
      }
      this.counselorList = []
      this.departList = []
      this.listQuery = {
        students: [this.sId],
        handoverIds: [],
        batchNumbersLocal: {
          id: null,
          number: '1',
          sysShellId: null
        },
        batchNumbers: []
      }
      this.$refs.ConsultDistributeForm && this.$refs.ConsultDistributeForm.resetValidation()
    },
    handleInit() {
      return new Promise((resolve, reject) => {
        this.$loading(true, 'ConsultSubscribe')
        this.handleDataInit()
        counseltDistributeCheckApi([this.sId]).then(res => {
          const { allowDistribute } = res.data || {}
          if (allowDistribute && allowDistribute.length) {
            this.agreeAllotCounselorObj = res.data
            this.handleUserType(resolve, reject)
          } else {
            this.$fm("您选择的学员已有相关的咨询师，不可重复分配")
            this.$emit('update:isOpen', false)
            reject()
          }
          this.$loading(false, 'ConsultSubscribe')
        }).catch(() => {
          this.$loading(false, 'ConsultSubscribe')
          this.$emit('update:isOpen', false)
        })
      })
    },
    handleUserType(resolve, reject) {
      if (this.aId) {
        getUserTypeActApi(this.aId, this.agreeAllotCounselorObj.allowDistribute[0].branch, 1).then(res => {
          this.counselorList = res.data || []
          resolve()
        }).catch(() => {
          reject()
        }).finally(() => {
          this.$loading(false, 'ConsultSubscribe')
        })
      } else {
        getUserTypeApi(this.agreeAllotCounselorObj.allowDistribute[0].branch, 1).then(res => {
          this.counselorList = res.data || []
          resolve()
        }).catch(() => {
          reject()
        }).finally(() => {
          this.$loading(false, 'ConsultSubscribe')
        })
      }
    },

    handleUserDeaprtment(e) {
      if (e) {
        jobShellListApi(this.agreeAllotCounselorObj.allowDistribute[0].branch, e).then(res => {
          this.departList = res.data || []
          this.handleClearDepartMent()
          this.$nextTick(() => {
            if (this.departList.length === 1) {
              this.listQuery.batchNumbersLocal.sysShellId = this.departList[0].value
            }
          })
        })
      } else {
        this.handleClearDepartMent()
      }
    },

    handleClearDepartMent() {
      this.listQuery.batchNumbersLocal.sysShellId = null
      this.$refs.consultantDepartRef.handleClear()
      this.$refs.consultantDepartRef.handleDataInit()
    },
    handleClose() {
      this.handleDataInit()
      this.isDialog = false
    },
    handleConfirm() {
      this.$loading(true, 'ConsultSubscribe')
      const query = {
        ...this.listQuery,
        batchNumbers: [this.listQuery.batchNumbersLocal]
      }
      batchDistributeCounselApi(query).then(res => {
        this.$sm(res.data)
        if (this.listType === '5') {
          this.$emit('onAllRefresh')
        } else {
          this.$emit('complete')
        }
        this.handleClose()
      }).finally(() => {
        this.$loading(false, 'ConsultSubscribe')
      })
    }
  }
}
</script>
