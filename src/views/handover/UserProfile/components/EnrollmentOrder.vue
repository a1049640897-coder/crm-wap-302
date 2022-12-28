<template>
  <div class="activeRecord">
    <div class="activeRecord-list" v-if="sId && activeList && activeList.length">
      <div class="activeRecord-list-item" v-for="data in activeList" :key="data.id">
        <div class="activeRecord-header">
          <div class="activeRecord-title">报名日期：{{data.enrollDate}}</div>
          <div class="activeRecord-extra" :style="{color: getStatus(data.state).color}">{{getStatus(data.state).text}}</div>
        </div>
        <div class="activeRecord-content">
          <div class="content-item" v-for="item in data.orderPackets" :key="item.id">
            <img class="book_icon" :src="require('@/assets/images/icons/bookOrder.png')" height="18px">
            <span>{{item.title}}</span>
          </div>
        </div>
        <div class="activeRecord-money">
          <div class="money-item">应收金额<span>{{toFixed(data.collectAmount, 2) || '0'}}</span></div>
          <div class="money-item">已收金额<span>{{toFixed(data.receivedAmount, 2) || '0'}}</span></div>
          <div class="money-item">余款<span>{{toFixed(data.balance, 2) || '0'}}</span></div>
        </div>
      </div>
    </div>
    <div class="common-empty" v-else style="background: #ffffff;">
      <img src="@/assets/images/icons/empty.png" alt="">
      <div>暂无数据</div>
    </div>
  </div>
</template>

<script>

import { _toFixed } from '@/utils'
import { studentOrderListApi } from '@/api/potentialGuest/paymentRecord'

export default {
  name: 'EnrollmentOrder',
  props: {
    sId: [String, Number]
  },
  data() {
    return {
      toFixed: _toFixed,
      loading: false,
      activeList: []
    }
  },
  watch: {
    loading(val) {
      this.$loading(val, 'enrollmentOrder')
    }
  },
  created() {
    this.getTableList()
  },
  methods: {
    getTableList() {
      if (!this.sId) return
      this.loading = true
      studentOrderListApi(this.sId).then(res => {
        if (res.data) {
          res.data.forEach((item, index) => {
            if (index) {
              item.status = false
            } else {
              item.status = true
            }
          })
          this.activeList = res.data
        } else this.activeList = []
      }).finally(() => {
        this.loading = false
      })
    },
    getStatus(state) {
      if (state === 1) {
        return {
          color: '',
          text: '待支付'
        }
      } else if (state === 2) {
        return {
          color: '#F56C6C',
          text: '有余款'
        }
      } else if (state === 3) {
        return {
          color: '#333333',
          text: '已交清'
        }
      } else if (state === 4) {
        return {
          color: '#999999',
          text: '已取消'
        }
      } else if (state === 5) {
        return {
          color: '#999999',
          text: '已退款'
        }
      } else if (state === 6) {
        return {
          color: '#E6A23C',
          text: '需退款'
        }
      } else {
        return {
          color: '',
          text: ''
        }
      }
    }
  }
}
</script>


<style lang="scss" scoped>
.activeRecord {
  .activeRecord-list {
    .activeRecord-list-item {
      margin-bottom: 1rem;
      padding: 0.6rem;
      background: #ffffff;
      border-bottom-left-radius: 0.6rem;
      border-bottom-right-radius: 0.6rem;
      .activeRecord-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.6rem;
        .activeRecord-title {
          font-size: 0.86rem;
          color: #333333;
        }
        .activeRecord-extra {
          color: #0088fe;
          font-size: 0.76rem;
        }
      }
      .activeRecord-content {
        border-bottom: 2px solid #f3f3f3;
        margin-bottom: .4rem;
        .content-text {
          font-size: 0.86rem;
          margin-bottom: 0.6rem;
          display: inline-block;
        }
        .content-item {
          font-size: 1rem;
          margin-bottom: 1rem;
          color: #333333;
          .book_icon {
            position: relative;
            top: 0.2rem;
            margin-right: 0.3rem;
          }
          .content-item-title {
            color: #999999;
          }
          .content-item-info {
            color: #666666;
          }
        }
      }

      .activeRecord-money {
        font-size: 0.86rem;
        color: #999999;
        .money-item {
          display: flex;
          line-height: 1.6rem;
          justify-content: space-between;
          span {
            color: #f56c6c;
          }
        }
      }
    }
  }
}
</style>
  