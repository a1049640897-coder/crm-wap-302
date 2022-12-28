<template>
  <div>
    <van-popup class="replace-cont" position="bottom" safe-area-inset-bottom v-model="isDialog" round get-container="#app" :style="{ height: '70%' }">
      <p class="replace-title">关联收据</p>
      <div class="replace-input">
        <span class="left-icon">*</span>
        <div class="input-cont">
          <van-field v-model="formObj.receiptNo" type="tel" label-width="3.5rem" name="receiptNo" label="收据号" style="float:left;" placeholder="请输入" :border="false" :rules="[{ required: true, message: '收据号不能为空', trigger: 'onBlur' }]"></van-field>
        </div>
        <span class="btn" @click="handleSearchNo">查询</span>
      </div>
      <div class="replace-student-info" v-if="orderObj && orderObj.id">
        <p style="font-size: 0.72rem;">根据您输入的收据号, 找到以下订单, 请确认正确后再关联</p>
        <p class="replace-student-title">{{orderObj.name}}</p>
        <p>就读学校：{{orderObj.school}}</p>
        <p>手机号码：{{orderObj.mobile}}</p>
        <p>报名日期：{{orderObj.enrollDate}}</p>
        <p>报名课程包：{{orderObj.packetCourse}}</p>
        <p>状态：{{orderObj.state | stateFilter}}</p>
        <p>收据号：{{formObj.receiptNo}}</p>
        <p>应收金额：{{orderObj.collectAmount}}</p>
        <p>已收金额：{{orderObj.receivedAmount}}</p>
        <p>余款：{{orderObj.balance}}</p>
        <p>所属人：{{orderObj.belong}}</p>
      </div>
      <div class="btn-group">
        <van-button type="default" style="margin-right: 0.68rem;" @click="handleCancel">取消</van-button>
        <van-button type="info" :disabled="!orderObj || !orderObj.id" @click="handleReplace">关联</van-button>
      </div>
    </van-popup>
  </div>
</template>
<script>
// 关联收据
import { receiptCheckApi, relevanceReceiptApi } from '@/api/potentialGuest/paymentRecord'
export default {
  name: 'RelatedReceipt',
  props: {
    isOpen: {
      default: false,
      type: Boolean
    },
    aId: Number
  },
  watch: {
    isOpen(val) {
      this.isDialog = val
    },
    isDialog(val) {
      this.$emit('update:isOpen', val)
    }
  },
  data() {
    return {
      orderObj: {}, // 订单信息
      isDialog: false,
      formObj: { receiptNo: '', id: this.aId },
    }
  },
  methods: {
    handleSearchNo() {
      receiptCheckApi(this.formObj).then(res => {
        this.orderObj = res.data

        if (!res.data) {
          this.$notify({ type: 'warning', message: res.msg })
        }
      })
    },
    handleCancel() {
      this.$set(this.formObj, 'receiptNo', '')
      this.orderObj = {}
      this.isDialog = false
    },
    async handleReplace() {
      const { status } = await relevanceReceiptApi(this.formObj)
      if (status === 200) {
        this.$notify({ type: "success", message: '关联成功' })
        this.$emit('complete')
        this.handleCancel()
      } else {
        this.$notify({ type: "warning", message: '关联失败' })
      }
    },
  }
}
</script>
<style lang="scss" scoped>
.replace-cont {
  padding: 0 0.68rem;
  box-sizing: border-box;

  .replace-title {
    text-align: center;
  }

  .replace-input {
    border-bottom: 1.5px solid #dddddd41;
    display: flex;

    .left-icon {
      color: rgb(255, 44, 44);
      font-size: 1.8rem;
      margin-top: 0.6rem;
    }

    .input-cont {
      /deep/.van-cell {
        padding: 10px 8px;
      }
    }

    .btn {
      margin-top: 0.6rem;
      position: absolute;
      right: 0.68rem;
      color: #0088fe;
    }
  }

  .replace-student-info {
    font-size: 0.72rem;

    .replace-student-title {
      font-size: 0.86rem;
    }
  }

  .btn-group {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 1rem;

    /deep/.van-button {
      width: 5rem;
      height: 2rem;
      line-height: 2rem;
    }
  }
}
</style>