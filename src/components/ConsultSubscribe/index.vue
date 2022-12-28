<template>
  <div>
    <van-popup position="bottom" safe-area-inset-bottom v-model="isDialog" get-container="#app" round>
      <div class="common-popup">
        <div class="common-popup-header">
          <div></div>
          <div class="common-popup-header-title">
            <span>{{counseltitle}}</span>
          </div>
          <div></div>
        </div>
        <div class="common-popup-body">
          <van-form ref="ConsultSubscribeForm" @submit="handleConfirm" :show-error-message="false" validate-trigger="onSubmit">
            <van-field label="预约周期" v-model="showDate" @click="handleDateShow" name="reserveTime" readonly clearable required input-align="right" :rules="[
              { required: true, message: '请选择预约周期' }
            ]" :right-icon="showDate ? 'clear' : 'arrow'" placeholder="请选择" @click-right-icon.stop="handleDateRightIcon" />
            <RePick ref="consultantRef" v-model="listQuery.consultantId" label="咨询/市场" :list="consultantList" name="consultantId" multiple isShowSearch isRequrie isCell />
            <van-field label="备注" v-model="listQuery.remark" name="reserveTime" clearable rows="3" autosize type="textarea" maxlength="500" input-align="right" placeholder="请输入" />
            <div class="common-popup-footer" style="padding: 0 1rem; box-sizing: boder-box;">
              <van-button style="width: 100%; margin-right: 1rem;" native-type="button" @click="handleClose">取消</van-button>
              <van-button type="danger" v-if="counseltitle === '修改预约'" style="width: 100%; margin-right: 1rem;" :disabled="!!counselState" plain @click="handleDel">删除</van-button>
              <van-button type="info" style="width: 100%;" native-type="submit">{{counseltitle === '修改预约' ? '保存' : '预约'}}</van-button>
            </div>
          </van-form>
        </div>
      </div>
    </van-popup>
    <van-calendar v-model="dateShow" ref="vanCalendar" @confirm="handleDateSelect" :default-date="defaultDate" type="range" color="#0088FE" allow-same-day :min-date="new Date('2013/01/01')" />
  </div>
</template>

<script>
// 预约咨询功能
import dayjs from 'dayjs'
import { batchCounselCheckApi, consultantListApi, getSimpleCounselInfoApi, patchSimpleCounselApi, putSimpleCounselApi, deleteSimpleCounselApi } from '@/api/potentialGuest/consultation'
import { Dialog } from 'vant'

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
    // 编辑Id
    reserveConsultId: Number,
    counselState: [String, Number],
    counseltitle: {
      type: String,
      default: '预约咨询'
    }
  },
  components: {
    RePick: () => import('../ReComponents/RePick')
  },
  data() {
    return {
      isDialog: false,
      dateShow: false,
      defaultDate: [dayjs().toDate(), null],
      consultantList: [],
      listQuery: {},
      showDate: null
    }
  },
  /* computed: {
    showDate() {
      if (this.listQuery.startReserveTime) {
        return this.listQuery.startReserveTime + '-' + this.listQuery.endReserveTime
      } else {
        return null
      }
    }
  }, */
  watch: {
    isOpen(val) {
      if (val) {
        this.handleDataInit()
        if (this.reserveConsultId) {
          this.handleConsultant()
          this.handleDetail()
          this.isDialog = val
        } else {
          this.handleInit(val).then(() => {
            this.isDialog = val
          })
        }
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
      this.listQuery = {
        consultantId: [],
        startReserveTime: null,
        endReserveTime: null,
        remark: '',
        student: this.sId
      }
      this.consultantList = []
      this.defaultDate = [dayjs().toDate(), null]
      this.$refs.ConsultSubscribeForm && this.$refs.ConsultSubscribeForm.resetValidation()
    },
    handleInit() {
      return new Promise((resolve, reject) => {
        this.$loading(true, 'ConsultSubscribe')
        this.handleDataInit()
        batchCounselCheckApi([{ studentId: this.sId, activityId: this.aId }]).then(res => {
          if (res.data.list.length) {
            this.handleConsultant()
            if (this.reserveConsultId) {
              this.handleDetail()
            }
            resolve()
          } else {
            this.$fm('该学员上一条预约咨询未完成，不可重复预约')
            this.$emit('update:isOpen', false)
            reject()
          }
        }).catch(() => {
          this.$emit('update:isOpen', false)
        }).finally(() => {
          this.$loading(false, 'ConsultSubscribe')
        })
      })
    },
    handleDateRightIcon() {
      if (this.showDate) {
        this.defaultDate = [dayjs().toDate(), null]
        this.listQuery.startReserveTime = null
        this.listQuery.endReserveTime = null
        this.showDate = null
      }
    },
    handleDetail() {
      this.$loading(true, 'ConsultSubscribe')
      getSimpleCounselInfoApi(this.reserveConsultId).then(res => {
        const { id, startReserveTime, endReserveTime, consultantId, remark } = res.data
        this.listQuery.id = id
        this.listQuery.consultantId = consultantId || []
        if (startReserveTime) {
          this.listQuery.startReserveTime = dayjs(startReserveTime).format('YYYY/MM/DD')
          this.listQuery.endReserveTime = dayjs(endReserveTime).format('YYYY/MM/DD')
          this.defaultDate = [dayjs(startReserveTime).toDate(), dayjs(endReserveTime).toDate()]
        } else {
          this.listQuery.startReserveTime = null
          this.listQuery.endReserveTime = null
          this.defaultDate = [dayjs().toDate(), null]
        }
        this.listQuery.remark = remark
      }).finally(() => {
        this.$loading(false, 'ConsultSubscribe')
      })
    },
    handleDateShow() {
      this.dateShow = true
    },
    handleConsultant() {
      consultantListApi([this.sId]).then(res => {
        this.consultantList = res.data || []
      })
    },
    handleDateSelect(e) {
      this.defaultDate = e
      this.listQuery.startReserveTime = dayjs(e[0]).format('YYYY/MM/DD')
      this.listQuery.endReserveTime = dayjs(e[1]).format('YYYY/MM/DD')
      this.showDate = this.listQuery.startReserveTime + '-' + this.listQuery.endReserveTime
      this.dateShow = false
    },
    handleClose() {
      this.handleDataInit()
      this.isDialog = false
    },
    handleDel() {
      Dialog.confirm({
        title: '提示',
        message: '是否删除？',
        beforeClose: (action, done) => {
          if (action === 'confirm') {
            this.$loading(true)
            deleteSimpleCounselApi({ id: this.reserveConsultId }).then(res => {
              this.$sm(res.data)
              this.$emit('delcomplete')
              this.handleClose()
              done()
            }).finally(() => {
              this.$loading(false)
            })
          } else {
            done()
          }
        }
      })
    },
    handleConfirm() {
      this.$loading(true, 'ConsultSubscribe')
      let api = this.reserveConsultId ? patchSimpleCounselApi : putSimpleCounselApi
      api(this.listQuery).then(res => {
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
