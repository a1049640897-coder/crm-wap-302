<template>
  <div>
    <van-popup position="bottom" safe-area-inset-bottom v-model="isDialog" round get-container="#app">
      <div class="common-popup">
        <div class="common-popup-header">
          <div></div>
          <div class="common-popup-header-title">
            <span>接收</span>
          </div>
          <div></div>
        </div>
        <div class="common-popup-body" v-if="deliverId">
          <div style="text-align: center; font-size: 0.86rem; margin-bottom: 2rem;">
            <p>潜在用户已接收成功！</p>
            <p class="belong-text" v-if="belongName">
              <van-icon name="warning-o" />该潜在用户已存在于系统中,所属人是{{belongName}}
            </p>
          </div>
          <div class="common-popup-footer">
            <div class="deBtn" round @click="handleDeliver(1)" color="#fafafa" size="mini">
              <van-icon name="friends" />分配自己
            </div>
            <div class="deBtn" round @click="handleDeliver(2)" color="#fafafa" size="mini" style="margin:0 0.6rem">
              <van-icon name="smile-comment" />分配咨询
            </div>
            <div class="deBtn" round @click="handleDeliver(3)" color="#fafafa" size="mini">
              <van-icon name="umbrella-circle" />转交
            </div>
          </div>
        </div>
        <div class="common-popup-body" v-else>
          <div style="text-align: center; font-size: 0.86rem; margin-bottom: 2rem;">
            <p>接收成功后, 你们将共享该潜在用户的全部信息</p>
            <p>你确定要接收吗？</p>
          </div>
          <div class="common-popup-footer">
            <van-button style="width: 5rem; margin-right: 1rem;" @click="handleClose" size="small">取消</van-button>
            <van-button type="info" style="width: 5rem;" @click="handleConfirm" size="small">接收</van-button>
          </div>
        </div>
      </div>
    </van-popup>
    <!-- 转交 -->
    <ConsultDeliver :is-open.sync="isConsultDeliverShow" :sId="sId" @complete="handleUpdataInfo" />
    <!-- 分配咨询 -->
    <ConsultDistribute :is-open.sync="isConsultDistributeShow" :sId="sId" @complete="handleUpdataInfo" />
  </div>
</template>

<script>
// 接收学员
import { confirmHandoverApi, getBelongNameApi, allotOneselfApi } from '@/api/potentialGuest/paymentRecord'

export default {
  name: 'ConsultSea',
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
    aId: Number
  },
  components: {
    ConsultDeliver: () => import('../ConsultDeliver/index'),
    ConsultDistribute: () => import('../ConsultDistribute/index')
  },
  data() {
    return {
      isConsultDeliverShow: false, // 转交弹窗显示
      isConsultDistributeShow: false, // 分配咨询弹窗显示
      isDialog: false,
      listQuery: {},
      deliverId: null,
      belongName: null
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
  methods: {
    handleClose() {
      this.isDialog = false
    },
    handleDeliver(key) {
      switch (key) {
        case 1:
          this.$loading(true, 'ConsultReceive')
          allotOneselfApi(this.aId).then(res => {
            if (res.status !== 200) return
            this.$fm(res.data)
            this.isDialog = false
            this.handleUpdataInfo()
          }).finally(_ => (this.$loading(false, 'ConsultReceive')))
          break;
        case 2:
          this.isConsultDistributeShow = true
          break;
        case 3:
          this.isConsultDeliverShow = true
          break;
      }
    },
    handleUpdataInfo() {
      this.$emit('complete')
    },
    handleConfirm() {
      this.$loading(true, 'ConsultReceive')
      confirmHandoverApi(this.aId).then(res => {
        this.$emit('complete')
        this.deliverId = res.data.studentId
        getBelongNameApi(res.data.studentId).then(res => {
          if (res.data && res.data.length > 0) {
            if (res.data.length === 1) {
              this.belongName = res.data[0].title
            } else {
              res.data.forEach(v => {
                this.belongName += v.title + '、'
              })
            }
          } else {
            this.belongName = null
          }
        })
      }).finally(() => {
        this.$loading(false, 'ConsultReceive')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.common-popup-body {
  .belong-text {
    color: #666666;
  }
  .van-icon {
    font-size: 0.9rem;
    margin-right: 0.3rem;
    color: #0088fe;
  }
  .common-popup-footer {
    .deBtn {
      float: left;
      height: 1.6rem;
      color: #333;
      border-radius: 47px;
      font-size: 0.86rem;
      padding: 0 0.68rem;
      // text-align: center;
      line-height: 1.6rem;
      background: #fafafa;
    }
  }
}
</style>
