<template>
  <div class="bookOrder">
    <div class="bookOrder-list" v-if="sId && bookOrderList.length">
      <div class="bookOrder-list-item" v-for="item in bookOrderList" :key="item.id">
        <div class="bookOrder-header">
          <div class="bookOrder-title">订单号：{{item.orderNo}}</div>
          <div class="bookOrder-extra" :style="{color: getStatus(item.state).color}">{{getStatus(item.state).text}}</div>
        </div>
        <div class="bookOrder-content">
          <div class="content-item" v-for="it in item.booksDetails" :key="it.id">
            <span class="content-item-title">
              <img src="@/assets/images/icons/bookOrder.png" alt="">
              <span>{{it.materialTitle}}</span>
            </span>
            <span class="content-item-info">x {{it.purchaseNum}}</span>
          </div>
        </div>
        <div class="bookOrder-count">
          <div class="bookOrder-count-l">收款日期：{{item.createTime}}</div>
          <div class="bookOrder-count-r">合计收款：{{item.productsPrice}}</div>
        </div>
      </div>
    </div>
    <div v-else class="common-empty" style="background: #ffffff;">
      <img src="@/assets/images/icons/empty.png" alt="">
      <div>暂无数据</div>
    </div>
  </div>
</template>

<script>
import { bookRecordListApi } from '@/api/potentialGuest/student'

export default {
  name: 'infoBookOrder',
  props: {
    sId: [String, Number]
  },
  data() {
    return {
      loading: false,
      bookOrderList: []
    }
  },
  watch: {
    loading(val) {
      this.$loading(val, 'infoBookOrder')
    }
  },
  created() {
    if (this.sId) this.getTableList()
  },
  methods: {
    getTableList() {
      return new Promise(resolve => {
        this.loading = true
        bookRecordListApi(this.sId).then(res => {
          this.bookOrderList = res.data || []
          resolve()
        }).finally(() => {
          this.loading = false
        })
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
.bookOrder {
  .bookOrder-list {
    .bookOrder-list-item {
      margin-bottom: 1rem;
      padding: 0.6rem;
      background: #ffffff;
      border-bottom-left-radius: 0.6rem;
      border-bottom-right-radius: 0.6rem;
      .bookOrder-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.6rem;
        .bookOrder-title {
          font-size: 0.76rem;
          color: #999999;
        }
        .bookOrder-extra {
          font-size: 0.76rem;
        }
      }
      .bookOrder-content {
        border-bottom: 1px solid #eeeeee;
        .content-text {
          font-size: 0.86rem;
          margin-bottom: 0.6rem;
          display: inline-block;
        }
        .content-item {
          font-size: 0.9rem;
          margin-bottom: 0.6rem;
          display: flex;
          justify-content: space-between;
          .content-item-title {
            img {
              vertical-align: sub;
              width: 1.1rem;
              height: auto;
              margin-right: 0.3rem;
            }
          }
        }
      }

      .bookOrder-count {
        margin: 0.5rem 0;
        display: flex;
        justify-content: space-between;
        color: #666666;
        font-size: 0.86rem;
      }
    }
  }
}
</style>
  