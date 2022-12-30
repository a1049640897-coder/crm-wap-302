<!-- 关联问卷 -->
<template>
  <div class="ques-connnect-box">
    <van-form ref="quesConnect" validate-trigger="" :submit-on-enter="false" input-align="right" error-message-align="right">
      <RePick v-model="listQuery.sysShellId" v-if="roleFlag!==2" label="所属部门" :list="shellOptions" :disabled="isDisabled" :placeholderIShow="false" isRequrie name="sysShellId" titleKey="text" idKey="value" isCell clearable />
      <RePick v-model="listQuery.marketAreaId" v-else label="市场区域" :list="marketOptions" :disabled="isDisabled" :placeholderIShow="false" isRequrie name="marketAreaId" isCell clearable />
      <RePick v-model="listQuery.catory" label="问卷栏目" @change="handlecolumn" :list="quesOptions" :placeholderIShow="false" isRequrie name="catory" titleKey="text" idKey="id" isCascader isCell clearable />
      <RePick v-model="listQuery.questionnaire" label="问卷标题" :list="quesTitleOptions" @change="handleQueChange" :placeholderIShow="false" isRequrie name="questionnaire" isCell clearable />
      <van-field label="做题模式" name="answerPattern" input-align="right" required :rules="[{ required: true, message: '请选择' }]">
        <template #input>
          <van-radio-group direction="horizontal" v-model="listQuery.answerPattern">
            <van-radio name="1">表单</van-radio>
            <van-radio name="2">单选</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-field clearable label="问卷背景图">
        <template #input>
          <van-uploader v-model="bg" :max-count="1" :max-size="5120 * 1024" :before-read="handleFileBeforeRead" @oversize="onOversize" />
        </template>
      </van-field>
      <van-field clearable label="问卷提交成功页面">
        <template #input>
          <van-uploader v-model="successPage" :max-count="1" :max-size="5120 * 1024" :before-read="handleFileBeforeRead" @oversize="onOversize" />
        </template>
      </van-field>
      <div class="ques-connnect-btn">
        <van-button class="connnect-btn" type="danger" native-type="button" :loading="loading" plain @click="handleDel" v-permission="checkPermissionStatus()" v-if="isEdit">删除</van-button>
        <van-button class="connnect-btn" type="info" native-type="button" @click="handleReview" :loading="loading">预览</van-button>
        <van-button class="connnect-btn" type="info" native-type="button" @click="handleConfirm" :loading="loading">保存</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import {
  getActivityShellOptionApi, getActivityDepartmentApi, getActiveNomalCascaderListApi,
  getActiveQuesTitleListApi, patchActiveQuestionRelateApi, patchActiveQuestionDetailApi,
  patchActiveQuestionDelApi, marketAreaBranchSchoolApi
} from '@/api/potentialGuest/activity'
import { Notify, Dialog, Toast } from 'vant'
export default {
  name: 'activities-QuesConnect',
  data() {
    return {
      listQuery: {
        shellIdsLocal: null,
        catory: null,
        questionnaire: null,
        answerPattern: null,
      },
      bg: [],
      successPage: [],
      quesOptions: [],
      quesTitleOptions: [],
      loading: false,
      imgTypeArr: ['image/jpeg', 'image/jpg', 'image/png'],
      isEdit: false,
      quesId: null,
      isDisabled: false,
      marketOptions: []
    }
  },

  created() {
    this.handleInit()
  },
  components: {
    RePick: () => import('@/components/ReComponents/RePick')
  },

  computed: {
    ...mapState({
      shellOptions: state => state.activity.activatyShellOptions,
      roleFlag: state => state.common.user.info.roleFlag
    }),
  },


  methods: {
    checkPermissionStatus() {
      if (sessionStorage.getItem('counselTab') == 'LectureReg') {
        return 'MARKET:SCHOOL:INFO_DEL'
      } else {
        return 'MARKET:ACT:SCHOOL:INFO_DEL'
      }
    },
    onOversize(file) {
      Toast('文件大小不能超过 5M');
    },
    handleQueChange(val) {
    },

    handleOptions(type) {
      if (!type) {
        if (Array.isArray(this.shellOptions) && this.shellOptions.length == 1) {
          this.$set(this.listQuery, 'sysShellId', this.shellOptions[0].value)
          this.isDisabled = true
        } else {
          this.isDisabled = false
        }
      } else {
        if (Array.isArray(this.marketOptions) && this.marketOptions.length == 1) {
          this.$set(this.listQuery, 'marketAreaId', this.marketOptions[0].id)
          this.isDisabled = true
        } else {
          this.isDisabled = false
        }
      }
    },

    // type 0 非市场标识 1 市场标识
    handleInitDetail(type) {
      const { activitiId } = this.$route.params
      patchActiveQuestionDetailApi(activitiId).then(res => {
        const { id, questionnaireId } = res.data
        this.quesId = questionnaireId
        if (id) {
          this.isEdit = id ? true : false
          this.listQuery = {
            ...res.data,
            questionnaire: res.data.questionnaireId,
            catory: res.data.catory && res.data.catory[0],
            answerPattern: res.data.answerPattern && res.data.answerPattern.toString(),
          }
          this.handleOptions(type)
          res.data.catory && this.handlecolumn(this.listQuery.catory, 1)
          this.bg = this.listQuery.bgImgUrl ? [{ url: this.listQuery.bgImgUrl }] : []
          this.successPage = this.listQuery.resultImgUrl ? [{ url: this.listQuery.resultImgUrl }] : []
        } else {
          console.log('2', type);
          this.handleOptions(type)
        }
      })
    },
    handleFileBeforeRead(file) {
      if (!this.imgTypeArr.includes(file.type)) {
        this.$fm('只能上传图片')
        return false
      }
      return true
    },
    handleBack(num = -1) {
      setTimeout(() => {
        this.$loading(false)
        this.$router.go(num)
      }, 2000);
    },

    handleDel() {
      Dialog.confirm({
        title: '提示',
        message: '此操作将永久删除该记录, 是否继续?',
        beforeClose: (action, done) => {
          if (action === 'confirm') {
            const { activitiId } = this.$route.params
            this.$loading(true)
            patchActiveQuestionDelApi(activitiId).then(res => {
              this.$sm(res.data)
              done()
              this.handleUpdateQues()
              this.handleBack(-1)
            })
          } else {
            done()
          }

        }
      })
    },
    handleReview() {
      this.loading = true
      this.$refs.quesConnect.validate().then(() => {
        this.loading = false
        this.$router.push(`/QuersionRead/${this.quesId ? this.quesId : this.listQuery.questionnaire}/${this.$route.params.activitiId}`)
      }).catch(() => {
        this.loading = false
      })

    },
    handlecolumn(val, type) {
      getActiveQuesTitleListApi({
        questionnaireType: val
      }).then(res => {
        this.quesTitleOptions = res.data
      })
      if (!type) {
        this.listQuery.questionnaire = null
      }
    },
    ...mapActions({
      queryShellOptions: 'activity/queryShellOptions',
    }),
    ...mapMutations('activity/', ['SET_QUESOBJ', 'SET_QUESISUPDATE', 'SET_ACTIVITYSTATE']),
    ...mapMutations('common/global', ['SET_ACTIVITYID']),
    handleInit() {
      const { activitiId } = this.$route.params
      getActivityShellOptionApi(activitiId).then(res => {
        getActivityDepartmentApi(+res.data).then(result => {
          this.queryShellOptions(result.data)
          if (this.roleFlag == 2) {
            this.getMarketOptions(res.data).then(() => {
              this.handleInitDetail(1)
            })
          } else {
            this.handleInitDetail(0)
          }
        })
      })
      getActiveNomalCascaderListApi().then(res => {
        this.quesOptions = res.data
      })
    },

    getMarketOptions(id) {
      return new Promise((resolve) => {
        marketAreaBranchSchoolApi(id).then(res => {
          this.marketOptions = res.data || []
          if (this.marketOptions.length === 1) {
            this.$set(this.listQuery, 'marketAreaId', this.marketOptions[0].id)
            resolve()
          } else if (this.marketOptions.length === 0) {
            Notify({ type: 'warning', message: `请联系校长助理为你分配市场区域才能正常使用系统相关功能!` })
            resolve()
          } else {
            resolve()
          }
        })
      })
    },

    handleConfirm() {
      this.$refs.quesConnect.validate().then(() => {
        const { activitiId } = this.$route.params
        this.listQuery.activity = activitiId
        this.listQuery.bgImgUrl = this.bg.length && this.bg[0].url ? this.bg[0].url : null
        this.listQuery.resultImgUrl = this.successPage.length && this.successPage[0].url ? this.successPage[0].url : null
        let formData = new FormData()
        formData.append(
          'param',
          new Blob([JSON.stringify(this.listQuery)], { type: 'application/json' })
        )
        if (this.bg.length) {
          formData.append('bgImg', this.bg[0].file)
        }
        if (this.successPage.length) {
          formData.append('resultImg', this.successPage[0].file)
        }
        this.loading = true
        patchActiveQuestionRelateApi(formData).then((result) => {
          Notify({ type: 'success', message: `问卷关联成功!` })
          this.loading = false
          if (this.$route.query.counselTab == 'LectureReg' || this.$route.query.counselTab == 'MarketAct') {
            this['SET_QUESOBJ']({
              counselTab: this.$route.query.counselTab,
              id: Number(activitiId),
              sysShellId: this.roleFlag == 2 ? this.listQuery.marketAreaId : this.listQuery.sysShellId,
              quesConnectObjIsUpdate: true
            })
            this['SET_ACTIVITYID']({ activityId: Number(activitiId) })
            this.$router.go(-2)
          } else {
            this.handleUpdateQues()
            this.$router.back()
          }
        }).catch(() => {
          this.loading = false
        })
      })
    },

    handleUpdateQues() {
      this['SET_QUESISUPDATE']()
      this['SET_ACTIVITYSTATE']()
    }
  }
}

</script>
<style lang='scss' scoped>
.ques-connnect-box {
  .ques-bg {
    display: flex;
    flex-direction: column;
    position: relative;
    .upload-box {
      margin-top: 1rem;
    }
    .cus-icon {
      position: absolute;
      top: -1.5rem;
      right: 0;
      .qrCode {
        width: 1.5rem;
        height: 1.5rem;
      }
    }
  }
  .ques-connnect-btn {
    padding: 1rem 0.5rem;
    display: flex;
    .connnect-btn {
      border-radius: 0.5rem;
      width: 30%;
      flex: 1;
      margin: 0.2rem;
    }
  }
}
</style>