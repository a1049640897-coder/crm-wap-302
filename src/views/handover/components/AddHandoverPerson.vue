<template>
  <div>
    <van-popup position="bottom" safe-area-inset-bottom v-model="isDialog" round get-container="#app">
      <div class="common-popup">
        <div class="common-popup-header">
          <div></div>
          <div class="common-popup-header-title">
            <span>添加移交人</span>
          </div>
          <div></div>
        </div>
        <div class="common-popup-body">
          <van-form ref="AddHandoverPersonForm" @submit="handleConfirm" :show-error-message="false" validate-trigger="onSubmit">
            <RePick v-model="listQuery.handoverUserId" label="移交人" isShowSearch @change="handleHandoverUser" :list="handoverUser" isCell clearable isRequrie />
            <RePick v-model="listQuery.handoverShellId" label="移交部门" :list="shellList" isRequrie isShowSearch isCell clearable />
            <div class="common-popup-footer">
              <van-button style="width: 8rem; margin-right: 1rem;" native-type="button" @click="handleClose">取消</van-button>
              <van-button type="info" style="width: 8rem;" native-type="submit">添加</van-button>
            </div>
          </van-form>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
// 移交功能
import { handoverUserAddApi, getHandoverOtherUserListApi, getBranchInHandoverApi } from '@/api/potentialGuest/paymentRecord'
import { mapState } from 'vuex'

export default {
  name: 'AddHandoverPerson',
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
    handoverId: Number
  },
  components: {
    RePick: () => import('@/components/ReComponents/RePick'),
  },
  data() {
    return {
      isDialog: false,
      listQuery: {
        handoverUserId: null,
        handoverShellId: null
      },
      handoverUser: [],
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
  },
  created() {
    this.handleDataInit()
  },
  methods: {
    handleDataInit() {
      this.listQuery = {
        handoverUserId: null,
        handoverShellId: null
      }
      this.overDepartMentList = []
      this.sysList = []
      this.shellList = []
      this.userList = []
      this.$refs.AddHandoverPersonForm && this.$refs.AddHandoverPersonForm.resetValidation()
    },
    handleInit() {
      return new Promise((resolve, reject) => {
        // this.$loading(true, 'AddHandoverPerson')
        this.handleDataInit()
        getHandoverOtherUserListApi(this.handoverId).then(res => {
          this.handoverUser = res.data || []
          if (!this.handoverUser.length) {
            reject()
            this.$emit('update:isOpen', false)
            this.$fm('没有可以移交的学员！')
            return
          }
          // this.handleOverList()
          this.$loading(false, 'AddHandoverPerson')
          resolve()
        }).catch(() => {
          this.$emit('update:isOpen', false)
          this.$loading(false, 'AddHandoverPerson')
        })
      })
    },

    handleHandoverUser(id) {
      if (id) {
        this.$loading(true, 'AddHandoverPerson')
        getBranchInHandoverApi(this.sId, id).then(res => {
          this.shellList = res.data || []
          if (this.shellList.length === 1) {
            this.$set(this.listQuery, 'handoverShellId', res.data[0].id)
          }
        }).finally(() => {
          this.$loading(false, 'AddHandoverPerson')
        })
      } else {
        this.shellList = []
        this.$set(this.listQuery, 'handoverShellId', null)
      }
    },
    handleClose() {
      this.handleDataInit()
      this.isDialog = false
    },
    handleConfirm() {
      this.$loading(true, 'AddHandoverPerson')
      const query = {
        ...this.listQuery,
        id: this.handoverId
      }
      handoverUserAddApi(query).then(res => {
        this.$sm(res.data)
        if (res.status === 200) this.$emit('complete')

        this.handleClose()
      }).finally(() => {
        this.$loading(false, 'AddHandoverPerson')
      })
    }
  }
}
</script>
