<template>
  <div>
    <van-popup class="replace-cont" v-model="isDialog" round position="bottom" :style="{ height: 'max-content' }">
      <p class="replace-title">取消关联</p>
      <div class="replace-receipt-info">
        <p style="font-size: 0.86rem;" v-if="relevanceList.length">取消关联后您将看不到对方录入的收款信息<br>您确定要取消关联吗</p>
        <p style="font-size: 0.86rem;" v-else>找不到关联的收据</p>
        <van-checkbox-group v-model="disassoValue">
          <van-checkbox v-for="item in relevanceList" :key="item.id" :name="item.id" shape="square">{{item.title}}</van-checkbox>
        </van-checkbox-group>
      </div>
      <div class="replace-btn-group">
        <van-button type="default" style="margin-right: 0.68rem;" @click="handleDisassociatCancel">取消</van-button>
        <van-button type="info" :disabled="!disassoValue.length" @click="handleDisassociatReplace">确定</van-button>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { cancelRelevanceReceiptApi, cancelRelevanceOptionsApi } from '@/api/potentialGuest/paymentRecord'
export default {
  props: {
    isOpen: {
      default: false,
      type: Boolean
    },
    aId: Number
  },
  data() {
    return {
      isDialog: false,
      disassoValue: [],
      relevanceList: []
    }
  },
  watch: {
    isOpen(val) {
      this.isDialog = val
    },
    isDialog(val) {
      this.$emit('update:isOpen', val)
    }
  },
  created() {
    this.getRelevanceOptions()
  },
  methods: {
    getRelevanceOptions() {
      cancelRelevanceOptionsApi(this.aId).then(res => {
        this.relevanceList = res.data || []
      })
    },
    async handleDisassociatReplace() {
      const { status } = await cancelRelevanceReceiptApi({ id: this.aId, list: this.disassoValue })
      if (status === 200) {
        this.$notify({ type: "success", message: '取消关联成功' })
        this.handleDisassociatCancel()
        this.$emit('complete')
      } else {
        this.$notify({ type: "warning", message: '取消关联失败' })
      }
    },
    handleDisassociatCancel() {
      this.relevanceList = []
      this.disassoValue = []
      this.isDialog = false
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

  .replace-receipt-info {
    text-align: center;
    font-size: 0.86rem;

    /deep/.van-checkbox {
      height: 2rem;
      width: fit-content;
      margin-left: 50%;
      transform: translateX(-50%);
    }
  }

  .replace-btn-group {
    height: 4rem;
    text-align: center;
    padding: 1rem;

    /deep/.van-button {
      width: 5rem;
      height: 2rem;
      line-height: 2rem;
    }
  }
}
</style>