<template>
  <div>
    <van-popup position="bottom" safe-area-inset-bottom v-model="isDialog" round get-container="#app">
      <div class="common-popup">
        <div class="common-popup-header">
          <div></div>
          <div class="common-popup-header-title">
            <span>移交</span>
          </div>
          <div></div>
        </div>
        <div class="common-popup-body">
          <van-form ref="ConsultHandOverForm" @submit="handleConfirm" :show-error-message="false" validate-trigger="onSubmit">
            <RePick ref="overDepartRef" v-model="listQuery.handoverShellId" label="移交部门" :list="overDepartMentList" name="handoverShellId" isRequrie isCell :disabled="overDepartMentList.length === 1" />
            <RePick ref="sysIdRef" v-model="listQuery.sysId" label="承接系统" :list="sysList" @change="handleSysId" name="sysId" isShowSearch isRequrie isCell />
            <RePick ref="userIdRef" v-model="listQuery.userId" label="承接对象" :list="userList" @change="handleShell" name="userId" isShowSearch isRequrie isCell />
            <RePick ref="shellIdRef" v-model="listQuery.shellId" label="承接部门" :list="shellList" name="shellId" isCascader isShowSearch isRequrie isCell :disabled="shellList.length === 1" />
            <van-field v-if="isAlikeSys" label-width="10em" right readonly label="是否复制咨询记录">
              <template #button>
                <van-switch size="20px" v-model="listQuery.copySearchRecord" />
              </template>
            </van-field>
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
import { checkTransferApi, sysListApi, getDepsListApi, shellBoxBySysApi, getUndertakingApi, postBatchTransferApi, handoveruserApi, handovershellApi } from '@/api/potentialGuest/consultation'
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
      overDepartMentList: [],
      sysList: [],
      shellList: [],
      userList: []
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
        student: [this.sId],
        shellId: null,
        handoverShellId: null,
        sysId: null,
        userId: null,
        copySearchRecord: true
      }
      this.overDepartMentList = []
      this.sysList = []
      this.shellList = []
      this.userList = []
      this.$refs.ConsultHandOverForm && this.$refs.ConsultHandOverForm.resetValidation()
    },
    handleInit() {
      return new Promise((resolve, reject) => {
        this.$loading(true, 'ConsultHandOver')
        this.handleDataInit()
        checkTransferApi([this.sId]).then(res => {
          if (!res.data.success) {
            reject()
            this.$emit('update:isOpen', false)
            this.$fm('没有可以移交的学员！')
            return
          }
          this.handleSysList()
          this.handleOverList()
          this.$loading(false, 'ConsultHandOver')
          resolve()
        }).catch(() => {
          this.$emit('update:isOpen', false)
          this.$loading(false, 'ConsultHandOver')
        })
      })
    },

    handleOverList() {
      getDepsListApi(this.listQuery.student).then(res => {
        this.overDepartMentList = res.data || []
        this.$nextTick(() => {
          if (this.overDepartMentList.length === 1) {
            this.listQuery.handoverShellId = this.overDepartMentList[0].id
          }
        })
      })
    },

    handleSysList() {
      sysListApi().then(res => {
        this.sysList = res.data || []
      })
    },

    handleSysId(e) {
      this.handleClearDepartMent()
      this.handleClearUser()
      if (!e) return
      this.$loading(true, 'ConsultHandOver')
      handoveruserApi({ id: e, keyword: null, potentialStudentId: this.sId }).then(res => {
        this.userList = res.data || []
      }).finally(() => {
        this.$loading(false, 'ConsultHandOver')
      })
    },

    handleShell(e) {
      this.handleClearDepartMent()
      if (!e) return
      this.$loading(true, 'ConsultHandOver')
      handovershellApi(e, this.listQuery.sysId, this.sId).then(res => {
        this.shellList = res.data || []
        this.$nextTick(() => {
          if (this.shellList.length === 1) {
            this.listQuery.shellId = this.shellList[0].id
          }
        })
      }).finally(() => {
        this.$loading(false, 'ConsultHandOver')
      })
    },

    handleClearDepartMent() {
      this.listQuery.shellId = null
      this.shellList = []
      this.$refs.shellIdRef.handleClear()
      this.$refs.shellIdRef.handleDataInit()
    },
    handleClearUser() {
      this.listQuery.userId = null
      this.userList = []
      this.$refs.userIdRef.handleClear()
      this.$refs.userIdRef.handleDataInit()
    },
    handleClose() {
      this.handleDataInit()
      this.isDialog = false
    },
    handleConfirm() {
      this.$loading(true, 'ConsultHandOver')
      const query = {
        ...this.listQuery,
        copySearchRecord: this.isAlikeSys ? this.listQuery.copySearchRecord : false
      }
      postBatchTransferApi(query).then(res => {
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
