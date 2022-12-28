<!-- 生成二维码之前的提示 -->
<template>
  <div>
    <van-popup v-model="newDeptIsShow" position="bottom" :style="{ height: '20%' }" :close-on-click-overlay="false" @close="hanleCancel" get-container="#app" closeable>
      <div class="det-form-header">生成签到码</div>
      <div class="det-form">
        <van-form ref="deptForm" :show-error-message="false" validate-trigger="" :submit-on-enter="false">
          <RePick v-model="deptObj.sysShellId" v-if="roleFlag!==2" label="所属部门" :list="shellOptions" :disabled="isDisabled" isRequrie name="sysShellId" titleKey="text" idKey="value" isCell clearable />
          <RePick v-model="deptObj.marketAreaId" v-else label="市场区域" :list="marketOptions" :disabled="isDisabled" isRequrie name="marketAreaId" isCell clearable />
        </van-form>
        <div class="dept-form-footer">
          <van-button class="btn" type="info" native-type="buttton" @click.stop="handleSave" :loading="loading">保存</van-button>
          <van-button class="btn" type="info" native-type="buttton" @click.stop="hanleCancel" :loading="loading">取消</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { departmentSeaApi } from '@/api/potentialGuest/consultation'
import { mapState } from 'vuex'
import { Notify } from 'vant'
import {
  getActivityShellOptionApi, marketAreaBranchSchoolApi
} from '@/api/potentialGuest/activity'
export default {
  props: {
    deptIsShow: Boolean,
    activityId: [String, Number], // 活动id
  },
  name: '',
  data() {
    return {
      loading: false,
      deptObj: {
        sysShellId: null,
        marketAreaId: null
      },
      shellOptions: [],
      marketOptions: [],
      isDisabled: false,
      newDeptIsShow: this.deptIsShow
    }
  },

  watch: {
    deptIsShow: {
      handler(val) {
        if (val) {
          this.handleInit()
        }
        this.newDeptIsShow = val
      },
      deep: true
    }
  },
  computed: {
    ...mapState({
      roleFlag: state => state.common.user.info.roleFlag
    }),
  },

  components: {
    RePick: () => import('@/components/ReComponents/RePick'),
  },


  methods: {
    getMarketOptions(id) {
      return new Promise((resolve) => {
        marketAreaBranchSchoolApi(id).then(res => {
          this.marketOptions = res.data || []
          if (this.marketOptions.length === 1) {
            this.$set(this.listQuery, 'marketAreaId', this.marketOptions[0].id)
            resolve()
          } else if (this.marketOptions.length === 0) {
            this.$fm('请联系校长助理为你分配市场区域才能正常使用系统相关功能!')
            resolve()
          } else {
            resolve()
          }
        })
      })
    },
    handleInit() {
      // 通过活动id 获取分校id
      getActivityShellOptionApi(this.activityId).then(res => {
        if (!res || !res.data) return
        // 通过分校id获取部门列表
        if (this.roleFlag !== 2) {
          departmentSeaApi(+res.data).then(result => {
            this.shellOptions = result.data || []
            if (result.data.length == 1) {
              this.deptObj.sysShellId = result.data[0].value
              this.isDisabled = true
            } else {
              this.deptObj.sysShellId = null
              this.isDisabled = false
            }
          })
        } else {
          marketAreaBranchSchoolApi(res.data).then(res => {
            this.marketOptions = res.data || []
            if (this.marketOptions.length === 1) {
              this.deptObj.marketAreaId = this.marketOptions[0].id
              this.isDisabled = true
            } else {
              this.deptObj.marketAreaId = null
              if (this.marketOptions.length === 0) {
                Notify({ type: 'warning', message: `请联系校长助理为你分配市场区域才能正常使用系统相关功能!` })
              }
              this.isDisabled = false
            }
          })
        }
      })
    },
    handleSave() {
      this.$refs.deptForm.validate().then(() => {
        this.$emit('compelete', this.deptObj)
      })
    },
    hanleCancel() {
      this.$emit('compelete')
    }
  }
}

</script>
<style lang='scss' scoped>
@import './index.scss';
</style>