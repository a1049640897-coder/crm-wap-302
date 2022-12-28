<template>
  <!-- 成本编辑/成本添加 -->
  <div>
    <van-popup position="bottom" class="hqf-class" safe-area-inset-bottom v-model="isDialog" :lock-scroll="false" get-container="#app" round>
      <div class="common-popup">
        <div class="common-popup-header">
          <div></div>
          <div class="common-popup-header-title">
            <span>{{title}}</span>
          </div>
          <div></div>
        </div>
        <div class="common-popup-body">
          <van-form ref="costForm" :show-error-message="false" validate-trigger="" :submit-on-enter="false">
            <div class="cost-form-item" v-for="(item,index) in costInfoList" :key="index">
              <div class="cost-form-title">
                <div class="form-title-lf"> 成本明细 <span v-if="!isEdit">{{index + 1}}</span></div>
                <div :class="costInfoList.length == 1 ? 'form-title-rt disbaled' : 'form-title-rt'" v-if="!isEdit" @click="delFrom(index)"> 删除</div>
              </div>
              <RePick v-model="item.costType" label="成本类型" :disabled="isEdit" :list="costTypeList" @change="handleCost($event, index,1)" name="costType" isRequrie isCell :clearable="false" :closeIsShow="false" />
              <RePick v-model="item.mainId" :label=" item.costType == 1 ? '成本明细':'代理姓名' " isShowSearch v-if="item.costType==1 || item.costType==2" :list="item.mainIdList" name="mainId" isRequrie isCell clearable />
              <van-field label="成本说明" required v-if="item.costType==3" v-model="item.costDetail" name="costDetail" clearable rows="3" autosize type="textarea " input-align="right" placeholder="请输入" :rules="[{ required: true, message: '请输入' }]" />
              <van-field label="数量" required v-if="item.costType==1" name="itemsNum" type="number" v-model.trim="item.itemsNum" input-align="right" :rules="[{ required: true, validator: VerifyFunc.validatorNumber, message: '请输入正整数'}]" placeholder="请输入" />
              <van-field label="金额" required v-model.trim="item.money" type="number" name="money" input-align="right" :rules="[{ required: true,validator: VerifyFunc.validatorMoney, message: '格式错误' }]" placeholder="请输入" />
              <van-field label="备注" v-model="item.remark" name="remark" clearable rows="3" autosize type="textarea" input-align="right" placeholder="请输入" />
            </div>
            <div class="cost-form-add" @click="handleAdd" v-if="!isEdit">+增加明细</div>
            <div class="common-popup-footer">
              <van-button class="footer-btn" style="width: 8rem; margin-right: 1rem;" native-type="button" @click="handleClose">取消</van-button>
              <van-button class="footer-btn" v-if="isEdit" style="width: 8rem; margin-right: 1rem;" native-type="button" plain type="danger" @click="handleDel(costData.id, costData.type)">删除</van-button>
              <van-button class="footer-btn" type="info" style="width: 8rem;" @click.stop="handleConfirm">保存</van-button>
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
import { batchCounselCheckApi, consultantListApi, getSimpleCounselInfoApi, patchSimpleCounselApi, putSimpleCounselApi } from '@/api/potentialGuest/consultation'
import { activityDetailCostDetailApi, activityDetailGetApi, activityDetailDelApi, activityDetailAddApi, activityDetailEditApi } from '@/api/potentialGuest/activity'
import { Dialog, Notify } from 'vant'
import VerifyFunc from '@/utils/verify'
// import {}
export default {
  name: 'ConsultSubscribe',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    isOpen: {
      default: false,
      type: Boolean
    },
    title: {
      default: '录入成本',
      type: String
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
    costData: {
      type: Object,
      default: () => {
        return {}
      } // 成本编辑的对象
    },
    branchId: [Number, String], // 分校id
  },
  components: {
    RePick: () => import('../ReComponents/RePick')
  },
  data() {
    return {
      isDialog: false,
      dateShow: false,
      defaultDate: null,
      costTypeList: [
        {
          id: 1,
          title: '物料'
        },
        {
          id: 2,
          title: '代理'
        },
        {
          id: 3,
          title: '其他'
        },
      ],
      costInfoList: [
        {
          activityId: this.sId, // 活动id
          costDetail: null, // 成本说明
          costType: null, // 成本类型
          itemsNum: null, //  数量
          mainId: null, // 成本明细/代理姓名
          money: null,
          remark: '',
          mainIdList: [] // 成本明细/代理姓名 列表
        }
      ],
      VerifyFunc:VerifyFunc
    }
  },
  computed: {
    showDate() {
      if (this.listQuery.startReserveTime) {
        return this.listQuery.startReserveTime + '-' + this.listQuery.endReserveTime
      } else {
        return null
      }
    }
  },
  watch: {
    isOpen(val) {
      if (val) {
        this.handleDataInit()
        this.isDialog = val
      } else {
        this.isDialog = val
      }
    },
    isDialog(val) {
      this.$emit('update:isOpen', val)
    }
  },
  created() {
    // this.handleDataInit()
  },
  methods: {

    handleCost(val, index, type) {
      return new Promise((resolve) => {
        if (val == 1 || val == 2) {
          activityDetailCostDetailApi(val, val == 2 ? this.branchId : null).then(res => {
            let filterList = (res.data || []).filter(v => v.extendNum)
            type && this.$set(this.costInfoList[index], 'mainId', null)
            this.$set(this.costInfoList[index], 'mainIdList', filterList)
            resolve(filterList)
          })
        } else {
          this.$set(this.costInfoList[index], 'mainIdList', [])
          resolve([])
        }
      })
    },
    delFrom(index) {
      this.costInfoList.splice(index, 1)
    },
    handleAdd() {
      this.costInfoList.push({
        activityId: this.sId, // 活动id
        costDetail: null, // 成本说明
        costType: null, // 成本类型
        itemsNum: null, //  数量
        mainId: null, // 成本明细/代理姓名
        money: null,
        remark: '',
        mainIdList: [] // 成本明细/代理姓名 列表
      })
      this.handleCost(1, this.costInfoList.length - 1)
    },
    handleDataInit() {
      if (this.isEdit) {
        const { id, type } = this.costData || {}
        console.log('id, type', id, type);
        activityDetailGetApi(id, type).then(res => {
          this.costInfoList = [res.data]
          this.handleCost(type, 0)
        })
      } else {
        this.costInfoList = [{
          activityId: this.sId, // 活动id
          costDetail: null, // 成本说明
          costType: null, // 成本类型
          itemsNum: null, //  数量
          mainId: null, // 成本明细/代理姓名
          money: null,
          remark: '',
          mainIdList: [] // 成本明细/代理姓名 列表
        }]
        this.handleCost(1, 0)
      }
      this.$refs.costForm && this.$refs.costForm.resetValidation()
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
    handleDetail() {
      this.$loading(true, 'ConsultSubscribe')
      getSimpleCounselInfoApi(this.reserveConsultId).then(res => {
        const { id, startReserveTime, endReserveTime, consultantId, remark } = res.data
        this.listQuery.id = id
        this.listQuery.consultantId = consultantId || []
        this.listQuery.startReserveTime = dayjs(startReserveTime).format('YYYY/MM/DD')
        this.listQuery.endReserveTime = dayjs(endReserveTime).format('YYYY/MM/DD')
        this.listQuery.remark = remark
        this.defaultDate = [dayjs(startReserveTime).toDate(), dayjs(endReserveTime).toDate()]
      }).finally(() => {
        this.$loading(false, 'ConsultSubscribe')
      })
    },
    handleDateShow() {
      this.dateShow = true
    },
    handleConsultant() {
      consultantListApi([this.sId]).then(res => {
        this.consultantList = res.data
      })
    },
    handleDateSelect(e) {
      this.defaultDate = e
      this.listQuery.startReserveTime = dayjs(e[0]).format('YYYY/MM/DD')
      this.listQuery.endReserveTime = dayjs(e[1]).format('YYYY/MM/DD')
      this.dateShow = false
    },
    handleDel(id, type) {
      Dialog.confirm({
        title: '提示',
        message: '此操作将永久删除, 是否继续?',
      })
        .then(() => {
          activityDetailDelApi({
            ids: [id],
            type
          }).then(() => {
            this.$emit('complete')
          })
        })

    },
    handleClose() {
      // this.handleDataInit()
      this.isDialog = false
    },
    handleConfirm() {
      this.$refs.costForm.validate().then((res) => {
        if (this.isEdit) {
          activityDetailEditApi(this.costInfoList[0]).then(() => {
            Notify({ type: 'success', message: '编辑成功!' });
            this.isDialog = false
            this.$emit('complete')
          })
        } else {
          activityDetailAddApi({
            crmCost: this.costInfoList
          }).then(res).then(() => {
            Notify({ type: 'success', message: '添加成功!' });
            this.isDialog = false
            this.$emit('complete')
          })
        }
      }).catch(err => {
        let itemsNum = err.find(item => item.name === 'itemsNum')
        if (itemsNum) {
          this.$fm('数量必填且是正整数')
          return
        }
        let money = err.find(item => item.name === 'money')
        if (money) {
          this.$fm('金额必填是正数且最多保留2位小数')
        }
      })
    }
  }
}
</script>

<style lang="scss">
.common-popup-footer {
  padding: 1rem;
  .footer-btn {
    border-radius: 0.5rem;
  }
}
.cost-form-item {
  .cost-form-title {
    padding: 0 0.5rem;
    font-size: 0.9rem;
    color: #999;
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    .form-title-rt {
      color: red;
    }
    .disbaled {
      color: #999;
      pointer-events: none;
    }
  }
}
.cost-form-add {
  display: flex;
  justify-content: center;
  color: #1989fa;
}
.hqf-class {
  max-height: 70vh;
  z-index: 99999;
}
</style>
