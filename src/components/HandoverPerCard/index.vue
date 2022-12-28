<template>
  <div class="student-card common-list-contain">
    <div class="student-base">
      <div class="student-header">
        {{studentData.studentName}}
        <!-- 缴费类型 -->
        <van-tag v-if="studentData.payType" plain type="primary">{{studentData.payType == 1 ? '预缴' : studentData.payType == 2 ? '全款': '补缴'}}</van-tag>
      </div>

      <!-- 2 联系方式 -->
      <div class="student-info-item">
        <div class="info-item" v-if="studentData.mobile">
          <img src="@/assets/images/icons/mobile.png" alt="" class="info-img">
          <a @click.stop="handlePhone" :href="`tel: ${studentData.mobile}`">{{studentData.mobile || '-' }}</a>
        </div>
        <div class="info-item" v-if="studentData.wxNumber">
          <span class="item-col" style="margin-right:0.2rem">|</span> <img src="@/assets/images/icons/qq.png" alt="" class="info-img">
          <span>{{studentData.wxNumber || '-' }}</span>
        </div>
        <div class="info-item" v-if="studentData.qqNumber">
          <span class="item-col">|</span><img src="@/assets/images/icons/wechat.png" alt="" class="info-img">
          <span>{{studentData.qqNumber || '-' }}</span>
        </div>
      </div>

      <!-- 3 报名情况 依次读取报名日期和报名课程包，其中，多个报名课程包用/连接，状态不正常的课程包要括号标注状态-->
      <div class="student-info-item">
        <div class="info-item">
          <span>{{studentData.enrollDate | dateFmt }}报名</span>
        </div>
        <div class="info-item">
          <span class="item-col">|</span>
          <span>{{studentData.coursePacket}}</span>
        </div>
      </div>

      <!-- 4 收款情况1 依次读取收款日期和本次收款-->
      <div class="student-info-item">
        <div class="info-item">
          <span>{{studentData.collectedDate | dateFmt }}收款</span>
        </div>
        <div class="info-item">
          <span class="item-col" v-if="studentData.collectedDate">|</span>
          <span style="color:#0088FE">本次收款{{studentData.money || '0.00' }}</span>
        </div>
      </div>

      <!-- 5 收款情况2 依次读取该移交收款记录对应订单的应收金额、已收金额、余款-->
      <div class="student-info-item">
        <div class="info-item">
          <span>收款情况：&nbsp;应收{{studentData.collectAmount || '0' }}</span>
        </div>
        <div class="info-item">
          <span class="item-col">|</span>
          <span>已收{{studentData.receivedAmount || '0' }}</span>
        </div>
        <div class="info-item">
          <span class="item-col">|</span>
          <span>余款{{studentData.balance || '0' }}</span>
        </div>
      </div>

      <!-- 6 收据号 依次读取该移交收款记录对应的收据号和经办人-->
      <div class="student-info-item">
        <div class="info-item">
          <span>收据号：&nbsp;{{studentData.receipt || '-' }}</span>
        </div>
        <div class="info-item">
          <span class="item-col">|</span>
          <span>经办人：&nbsp;{{studentData.agent || '-' }}</span>
        </div>
      </div>

      <!-- 7 移交信息 依次读取移交分校、移交人，考虑手机端屏幕较小，移交部门只要往上读取到分校这一级即可 -->
      <div class="student-info-item">
        <div class="info-item">
          <span>移交信息：{{studentData.handoverShellName || '-' }}/{{studentData.handoverUserName}}</span>
        </div>
      </div>

      <!-- 8 承接信息 依次读取承接系统、承接分校、承接人。PS：考虑到手机端屏幕较小，承接部门只有往上读取到分校这一级即可-->
      <div class="student-info-item">
        <div class="info-item">
          <span>承接信息：{{studentData.targetShellName || '-' }}/{{studentData.targetUserName}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { mapState } from 'vuex'

export default {
  props: {
    sId: Number,
    studentData: {
      required: true,
      default: () => { }
    },
    isCloseBtn: Boolean, // 关闭按钮
    /**
     * listType
     * 1: 咨询用户
     * 2: 有效线索
     * 3: 已报高端
     * 4: 未咨询
     * 5: 待分配
     * 6: 全部潜在用户包括公海
     * 7: 公海
     * 8: 待跟进
     * 9: 讲座登记详情
     * yuYueZiXun: 预约咨询
    */
    listType: String
  },
  components: {
    // ConsultSubscribe: () => import('../ConsultSubscribe/index'),
    // ConsultDistribute: () => import('../ConsultDistribute/index'),
    // ConsultHandOver: () => import('../ConsultHandOver/index'),
    // ConsultDeliver: () => import('../ConsultDeliver/index'),
    // ConsultSea: () => import('../ConsultSea/index'),
    // ConsultMarketArea: () => import('../ConsultMarketArea/index'),
    // ConsultSubscribeResult: () => import('../ConsultSubscribeResult/index'),
    // ConsultGetConsultSea: () => import('../ConsultGetConsultSea/index'),
    // ConsultNoFollow: () => import('../ConsultNoFollow/index')
  },
  data() {
    return {
      isRotate: false,
      showPopover: false,
      // 预约咨询
      isConsultSubscribeShow: false,
      // 分配咨询师
      isConsultDistributeShow: false,
      // 移交
      isConsultHandOverShow: false,
      // 转交
      isConsultDeliverShow: false,
      // 公海
      isConsultSeaShow: false,
      // 修改市场区域
      isConsultMarketAreaShow: false,
      // 咨询结果
      isConsultSubscribeResultShow: false,
      // 领取
      isGetConsultSeaShow: false,
      // 无需跟进
      isConsultNoFollowShow: false,
      // 宏医 聚创 网校
      system_hy_jc_wx: [62, 1, 47],
      // 专升本 聚创专插本 江西聚创专升本 公务员
      system_zsb_jczsb_jxzsb_gwy: [49, 76, 77, 22],
      reserveConsultId: null,
      titleList: ['移交', '承接', '分配', '报名', '收款']
    }
  },
  filters: {
    classLevel(val) {
      let str = ''
      switch (val) {
        case 1:
          str = '免费'
          break;
        case 2:
          str = '已报低端'
          break;
        case 3:
          str = '已报中端'
          break;
        case 4:
          str = '已报高端'
          break;
        default:
          str = '未知'
          break;
      }
      return str
    },
    schoolFilter(val) {
      if (val) {
        return Object.keys(val).map(item => val[item]).join('/')
      }
      return ''
    },
    intentionFilter(val1, val2, val3) {
      return [val1, val2, val3].filter(item => item).join('/')
    },
    dateFmt(date) {
      return dayjs(date).format('YYYY/MM/DD')
    }
  },
  mounted() {
    this.$emit('onStudentCardMounted')
  },
  computed: {
    ...mapState({
      isHandoverStateList: state => state.activity.isHandoverStateList,
      currentSystemId: state => state.common.systems.currentSystem.id,
      roleFlag: state => {
        return state.common.user.info.roleFlag
      }
    }),
    actions() {
      let arr = [
        { text: '预约咨询', dialogName: 'isConsultSubscribeShow' },
        { text: '分配咨询', dialogName: 'isConsultDistributeShow' },
        { text: '修改市场区域', dialogName: 'isConsultMarketAreaShow' },
        { text: '移交', dialogName: 'isConsultHandOverShow' },
        { text: '转交', dialogName: 'isConsultDeliverShow' },
        { text: '放入公海', dialogName: 'isConsultSeaShow' },
        { text: '新增订单', dialogName: '' }
      ]
      if (this.listType === '4') {
        return arr.slice(1)
      } else if (this.listType === '5') {
        return [{ text: '编辑', dialogName: 'editStudent' }, { text: '添加咨询记录', dialogName: 'addCounselRecord' }].concat(arr.slice(2))
      }
      return arr
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>