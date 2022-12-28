<template>
  <div>
    <van-popup position="bottom" safe-area-inset-bottom v-model="isDialog" round get-container="#app">
      <div class="common-popup">
        <div class="common-popup-header">
          <div></div>
          <div class="common-popup-header-title">
            <span>转交</span>
          </div>
          <div></div>
        </div>
        <div class="common-popup-body">
          <van-form ref="ConsultDeliverForm" @submit="handleConfirm" :show-error-message="false" validate-trigger="onSubmit">
            <RePick ref="rawUserIdRef" v-model="listQuery.rawUserId" label="原所属人" :disabled="ownList.length === 1" :list="ownList" @change="handleRawUser" name="handoverShellId" isRequrie isCell />
            <RePick ref="newOwnRef" v-model="listQuery.newOwnId" label="新所属人" :list="newOwnList" @change="handleNewOwnRef" name="sysId" titleKey="name" isShowSearch isRequrie isCell />
            <RePick ref="shellIdRef" v-model="listQuery.shellId" label="所属部门" :list="shellList" name="shellId" idKey="value" titleKey="text" isRequrie isCell :disabled="shellList.length === 1" />
            <div class="common-popup-footer">
              <van-button style="width: 8rem; margin-right: 1rem;" native-type="button" @click="handleClose">取消</van-button>
              <van-button type="info" style="width: 8rem;" native-type="submit">移交</van-button>
            </div>
          </van-form>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
// 移交功能
import { deliverTipsApi, getDeliverListApi, newOwnListApi, deliverShellApi, deliverApi } from '@/api/potentialGuest/consultation'
import { mapState } from 'vuex'

export default {
  name: 'ConsultHandOver',
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
  components: {
    RePick: () => import('../ReComponents/RePick')
  },
  data() {
    return {
      isDialog: false,
      listQuery: {},
      branchId: null,
      overDepartMentList: [],
      ownList: [],
      newOwnList: [],
      shellList: []
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
  computed: {
    ...mapState({
      currentSystemId: state => state.common.systems.currentSystem.id
    }),
    isAlikeSys() {
      if (this.listQuery.sysId && this.listQuery.sysId !== this.currentSystemId) {
        return true
      }
      return false
    }
  },
  created() {
    this.handleDataInit()
  },
  methods: {
    handleDataInit() {
      this.listQuery = {
        rawUserId: null,
        newOwnId: null,
        studentId: this.sId,
        shellId: null
      }
      this.branchId = null
      this.ownList = []
      this.newOwnList = []
      this.shellList = []
      this.$refs.ConsultDeliverForm && this.$refs.ConsultDeliverForm.resetValidation()
    },
    handleInit() {
      return new Promise((resolve, reject) => {
        this.$loading(true, 'ConsultHandOver')
        this.handleDataInit()
        deliverTipsApi([this.sId]).then(res => {
          if (res.data.beLongStudentIds && res.data.beLongStudentIds.length) {
            this.branchId = res.data.branchId
            this.handleOwnList(resolve)
          } else {
            this.$fm('没有可以移交的学员！')
            this.$emit('update:isOpen', false)
            reject()
          }
          this.$loading(false, 'ConsultHandOver')
        }).catch(() => {
          this.$loading(false, 'ConsultHandOver')
          this.$emit('update:isOpen', false)
        })
      })
    },

    handleOwnList(resolve) {
      getDeliverListApi(this.sId).then(res => {
        this.ownList = res.data || []
        this.$nextTick(() => {
          if (this.ownList.length === 1) {
            this.listQuery.rawUserId = this.ownList[0].id
            this.handleRawUser(this.listQuery.rawUserId)
          }
        })
        resolve()
      }).catch(() => {
        this.$emit('update:isOpen', false)
      })
    },

    handleRawUser(e) {
      this.handleClearNewOwn()
      this.handleClearShell()
      if (!e) return
      this.$loading(true, 'ConsultHandOver')
      const query = {
        id: e,
        list: [this.sId]
      }
      newOwnListApi(query).then(res => {
        this.newOwnList = res.data || []
      }).finally(() => {
        this.$loading(false, 'ConsultHandOver')
      })
    },

    handleNewOwnRef(e) {
      this.handleClearShell()
      if (!e) return
      this.$loading(true, 'ConsultHandOver')
      deliverShellApi(this.branchId, e).then(res => {
        this.shellList = res.data || []
        if (this.shellList.length === 1) {
          this.listQuery.shellId = res.data[0].value
        }
      }).finally(() => {
        this.$loading(false, 'ConsultHandOver')
      })
    },

    handleClearNewOwn() {
      this.listQuery.newOwnId = null
      this.newOwnList = []
      if (this.$refs.newOwnRef) {
        this.$refs.newOwnRef.handleClear()
        this.$refs.newOwnRef.handleDataInit()
      }
    },
    handleClearShell() {
      this.listQuery.shellId = null
      this.shellList = []
      if (this.$refs.shellIdRef) {
        this.$refs.shellIdRef.handleClear()
        this.$refs.shellIdRef.handleDataInit()
      }
    },
    handleClose() {
      this.handleDataInit()
      this.isDialog = false
    },
    handleConfirm() {
      this.$loading(true, 'ConsultHandOver')
      const { rawUserId, newOwnId, studentId, shellId } = this.listQuery
      deliverApi(rawUserId, newOwnId, studentId, shellId).then(res => {
        this.$sm(res.data)
        this.$emit('complete')
        this.handleClose()
      }).finally(() => {
        this.$loading(false, 'ConsultHandOver')
      })
    }
  }
}
</script>
