<template>
  <div class="student-info-edit-new">
    <van-form ref="formRef" :show-error-message="false" validate-trigger="onSubmit" :submit-on-enter="false" @submit="handleFormSubmit" @failed="handleFormFailed">
      <van-field v-model="studentInfo.name" type="text" isRequrie label="学生姓名" clearable input-align="right" required placeholder="请输入" maxlength="50" :rules="[{ required: true, message: '请填写学生姓名' }]" />
      <van-field v-model="studentInfo.mobile" :rules="[{ validator: VerifyFunc.poPhone, message: '请输入' }]" @blur="verityHasUser" name="mobile" maxlength="11" clearable input-align="right" type="tel" label="手机号码" placeholder="请输入" />
      <van-field v-model="studentInfo.wxNumber" :rules="[{ validator: VerifyFunc.wx, message: '请输入' }]" @blur="verityHasUser" clearable input-align="right" label="微信" name="wxNumber" placeholder="请输入" maxlength="50" />
      <van-field v-model="studentInfo.qqNumber" :rules="[{ validator: VerifyFunc.qq, message: '请输入' }]" @blur="verityHasUser" clearable input-align="right" type="tel" label="QQ" name="qqNumber" placeholder="请输入" maxlength="50" />
      <RePick v-model="studentInfo.handoverShellId" label="移交部门" v-if="authDepartList.length" :list="authDepartList" isCascader isRequrie isShowSearch isCell clearable childrenKey="child" />
      <RePick v-model="studentInfo.targetSysId" label="承接系统" isShowSearch :list="undertakSystemList" isCell isRequrie />
      <RePick ref="userIdRef" v-model="studentInfo.userId" label="承接对象" isShowSearch :list="userList" name="userId" isRequrie isCell />
      <RePick v-model="studentInfo.targetShellIdLocal" label="承接部门" :disabled="!studentInfo.targetSysId" :list="undertakBranchList" titleKey="text" isRequrie isCascader isShowSearch isCell clearable />
      <van-field v-model="studentInfo.remark" type="textarea" label="备注" clearable input-align="right" placeholder="请输入" maxlength="500" />
      <div class="student-info-edit-footer">
        <van-button class="record-btn record-btn-danger" style="margin-right: 1rem;" @click="handleDel" :loading="delLoading" loading-text="删除中...">删除</van-button>
        <van-button class="record-btn" type="info" native-type="submit" :loading="loading || verityLoading" :loading-text="verityLoading ? '验证中...' : '保存中...'">保存</van-button>
      </div>
    </van-form>
  </div>
</template>
<script>
import { Notify, Dialog } from 'vant'
import { mapState } from 'vuex'
import VerifyFunc from '@/utils/verify'
import { verifyUserApi } from '@/api/potentialGuest/counselRecord'
import { getHandoverInfoApi, saveHandoverInfoApi, deleteHandoverInfoApi } from '@/api/potentialGuest/paymentRecord'
import { sysListApi, shellBoxBySysApi, getUndertakingApi, getDepsListApi } from '@/api/potentialGuest/consultation'
export default {
  data() {
    return {
      delLoading: false,
      loading: false,
      verityLoading: false,
      VerifyFunc: VerifyFunc,
      verifySubmit: true,
      authDepartList: [], // 移交部门
      undertakSystemList: [], // 承接系统列表
      userList: [], // 承接对象列表
      undertakBranchList: [], // 承接部门列表
      studentInfo: {
        name: null,
        mobile: null,
        qqNumber: null,
        wxNumber: null,
        targetSysId: null, // 移交系统
        targetShellId: null, // 移交部门
        targetUserId: null, // 移交对象
        remark: null
      }
    }
  },
  components: {
    RePick: () => import('@/components/ReComponents/RePick')
  },
  created() {
    this.initMethod()
  },
  methods: {
    initMethod() {
      this.getStudentInfo()
      this.getSystemList()
    },
    getDepartListList() {
      if (this.$route.params.id) {
        getDepsListApi([this.$route.params.id]).then(res => {
          this.authDepartList = res.data || []
          if (this.authDepartList.length) {
            const index = this.authDepartList.findIndex(v => v.id === this.studentInfo.handoverShellId)
            if (index == -1) {
              this.$set(this.studentInfo, 'handoverShellId', this.authDepartList.length === 1 ? res.data[0].id : null)
            }
          }
        })
      } else this.authDepartList = []
    },
    getStudentInfo() {
      this.$loading(true, `cTableLoading_editEecord`)
      getHandoverInfoApi(this.$route.params.handoverId).then(res => {
        if (res.status === 200) {
          this.studentInfo = res.data
          this.getShellList(this.studentInfo.targetSysId)
          this.getUndertakList(this.studentInfo.targetShellId)
        }
      }).finally(_ => {
        this.getDepartListList()
        this.$loading(false, `cTableLoading_editEecord`)
      })
    },
    getSystemList() {
      sysListApi().then(res => {
        if (res.status === 200) {
          this.undertakSystemList = res.data
        }
      })
    },
    // 根据系统id获取部门
    getShellList(id) {
      shellBoxBySysApi({ id: id, list: [Number(this.$route.params.id)] }).then(res => {
        if (res.status === 200) {
          this.undertakBranchList = res.data
          if (this.undertakBranchList.length === 1 && !this.undertakBranchList[0].children) {
            this.$set(this.studentInfo, 'targetShellIdLocal', res.data[0].id)
          }
        }
      })
    },
    getUndertakList(id) {
      getUndertakingApi(id).then(res => {
        if (res.status === 200) {
          this.userList = res.data || []
          if (this.userList.length === 1) {
            this.$set(this.studentInfo, 'userId', res.data[0].id)
          }
        }
      })
    },
    verityHasUser() {
      // 校验学生是否重复（手机、微信、QQ有修改时才调接口判断）
      if (this.loading) return
      const { mobile, wxNumber, qqNumber, potentialStudentId } = this.studentInfo
      if (!mobile && !wxNumber && !qqNumber) return
      this.verityLoading = true
      let newMobile, newQQ, newWx;
      if (mobile) {
        if (!VerifyFunc.poPhone(mobile)) return
        if (this.oldMobile !== mobile) {
          newMobile = mobile
        }
      }
      if (qqNumber) {
        if (!VerifyFunc.qq(qqNumber)) return
        if (this.oldQQ !== qqNumber) {
          newQQ = qqNumber
        }
      }
      if (wxNumber) {
        if (!VerifyFunc.wx(wxNumber)) return
        if (this.oldWx !== wxNumber) {
          newWx = wxNumber
        }
      }

      if (newMobile || newQQ || newWx) {
        verifyUserApi({ mobile: newMobile, qqNumber: newQQ, wxNumber: newWx, id: potentialStudentId }).then(res => {
          if (res.data.success) {
            this.$fm(`${res.data.userStr}`)
            this.verifySubmit = true
          } else {
            this.verifySubmit = false
          }
        }).finally(() => {
          this.verityLoading = false
        })
      }
    },
    handleFormFailed(errorInfo) {
      this.$fm(errorInfo.errors[0].message)
    },
    handleFormSubmit() {
      const { mobile, wxNumber, qqNumber } = this.studentInfo
      if (!mobile && !qqNumber && !wxNumber) {
        return this.$fm('手机号、QQ号、微信号必须填写一个')
      }
      if (this.verifySubmit) {
        this.btnLoading = true
        this.$set(this.studentInfo, 'getWaySysId', 1)
        saveHandoverInfoApi(this.studentInfo).then(res => {
          if (res.status !== 200) {
            return this.$fm(res.data)
          }
          this.$sm(res.data)
          this.handleBackRouter()
        }).finally(_ => (this.btnLoading = false))
      } else {
        this.$fm(`潜在用户已存在，请联系“${this.userStr}”进行移交`)
      }
    },
    handleDel() { // 删除移交
      Dialog.confirm({
        title: '提示',
        message: '删除后不可恢复，是否确认？',
      }).then(() => {
        this.delLoading = true
        deleteHandoverInfoApi([Number(this.$route.params.handoverId)]).then(res => {
          Notify({ type: res.status === 200 ? 'success' : 'warning', message: res.data });
          if (res.status === 200) this.handleBackRouter()
        }).finally(_ => (this.delLoading = false))
      }).catch(() => {
      })
    },
    handleBackRouter() {
      this.$router.push({
        path: '/handover', query: {
          tab: 0
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.student-info-edit-footer {
  background: #ffffff;
  position: absolute;
  width: 100%;
  bottom: 0;
  padding: 0.5rem;
  display: flex;
  justify-content: center;

  .record-btn {
    border-radius: 0.5rem;
    width: 100%;
  }

  .record-btn-danger {
    border-color: #f56c6c;
    color: #f56c6c;
  }
}
</style>