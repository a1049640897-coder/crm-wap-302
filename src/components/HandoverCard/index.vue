<template>
  <div class="student-card common-list-contain">
    <div class="student-base" @click="handleCard">
      <div class="receive-time" v-if="typeTab==='MyReceive' && studentData.secondsDown">距离自动接收还剩：
        <div v-if="studentData.secondsDown > 86400"><span>{{receiveObj.day}}</span>天</div>
        <div v-else><span>{{receiveObj.hour}}</span>：<span>{{receiveObj.minute}}</span>：<span>{{receiveObj.second}}</span></div>
      </div>
      <div style="background: #ffffff;padding:0.68rem 0.68rem 0 0.68rem;border-radius: 0.3rem;">
        <div class="student-header">
          <div class="SH-l">
            <span class="SH-name">{{studentData.studentName}}</span>
            <span class="SH-tag" v-if="typeTab == 'MyReceived'">{{handoverStateFilter(studentData.handoverState)}}</span>
            <span class="SH-tag SH-tag-green" v-else-if="typeTab == 'MyReceive'">{{studentData.exist | filterState(existOptions)}}</span>
          </div>
          <div class="SH-r" v-if="typeTab == 'MyHandover'">
            <div class="SH-r-none" @click.stop="handleOperatShow">
              <van-popover v-model="showPopover" @select="handlePopSelect" trigger="click" :actions="actions" placement="bottom-end" :offset="[9,8]">
                <template #reference>
                  <span>...</span>
                </template>
              </van-popover>
            </div>
          </div>
        </div>

        <!-- 移交次数 -->
        <div class="student-body-1" v-if="!['MyReceived','MyReceive'].includes(typeTab)  &&(studentData.handoverState || studentData.handoverCount)">
          <img src="@/assets/images/icons/over.png" alt="" class="info-img"><span v-if="studentData.handoverState"> {{handoverStateFilter(studentData.handoverState)}}</span><span v-if="studentData.handoverState && studentData.handoverCount"> | </span><span v-if="studentData.handoverCount">移交{{studentData.handoverCount}}次</span>
        </div>

        <!-- 2 联系方式 -->
        <div class="student-info-item" v-if="studentData.mobileNumber || studentData.wxNumber || studentData.qqNumber">
          <div class="info-item" v-if="studentData.mobileNumber">
            <img src="@/assets/images/icons/mobile.png" alt="" class="info-img">
            <a @click.stop="handlePhone" :href="`tel: ${studentData.mobileNumber}`">{{studentData.mobileNumber || '-' }}</a>
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

        <!-- 来源渠道 -->
        <div class="student-footer">
          <div class="student-footer-header" v-if="studentData.sourceChannel">
            <img src="@/assets/images/icons/source.png" alt="" class="info-img"> <span>来源渠道: {{studentData.sourceChannel || '-' }}</span>
          </div>
          <div class="student-footer-body" v-if="studentData.handoverInfoMap">
            <div class="student-footer-body-item" v-for="(item, index) in  filterHandoverInfoMap(studentData.handoverInfoMap) " :key="index">
              <span class="dot"></span> <span :style="{color:item.title === '拒绝'? '#F56C6C':'#0088FE'}">{{item.title}}</span> <span>{{item.text}}</span>
            </div>
          </div>
          <div class="student-footer-page" v-if="studentData.handoverInfoMap && studentData.handoverInfoMap[6]">
            <div class="student-footer-page-top">
              <img src="@/assets/images/icons/record.png" alt="" class="info-img">
              <span> {{filterHandoverInfoMap(studentData.handoverInfoMap)[1].reason}}</span>
            </div>
            <div class="student-footer-page-bottom" v-if="!studentData.handoverInfoMap[6] && filterConsultRecordList(studentData.consultRecordList).addTime">
              {{filterConsultRecordList(studentData.consultRecordList).addTime}} {{filterConsultRecordList(studentData.consultRecordList).consultTypeName}}
              {{studentData.creator}}
            </div>
            <div class="record_img_list" v-if="studentData && studentData.handoverInfoMap[7] && studentData.handoverInfoMap[7].length">
              <van-image class="record_img" v-for="(imgItem, imgIndex) in studentData.handoverInfoMap[7]" :key="imgIndex" width="4rem" height="4rem" fit="cover" :src="imgItem" @click.stop="handleImgClick(imgIndex)" />
              <van-image-preview v-model="previewImgShow" :images="studentData.handoverInfoMap[7]" :startPosition="startPosition" />
            </div>
            <div style="text-align:center;margin-bottom:0.68rem;" @click.stop="isReceiveShow = true" v-permission="'HO:OVERSTU:RECEIVE'" v-if="typeTab == 'MyReceived'">
              <van-icon name="passed" class="green_icon" />&nbsp;重新接收
            </div>
          </div>
          <div class="student-footer-page" v-else>
            <div class="student-footer-page-top" v-if="filterConsultRecordList(studentData.consultRecordList).courseNames">
              <img src="@/assets/images/icons/record.png" alt="" class="info-img">
              <span style="color:#0088FE"> {{filterConsultRecordList(studentData.consultRecordList).courseNames}}</span>
              ： {{filterConsultRecordList(studentData.consultRecordList).content}}
            </div>
            <div class="student-footer-page-bottom" v-if="filterConsultRecordList(studentData.consultRecordList).addTime">
              {{filterConsultRecordList(studentData.consultRecordList).addTime}} {{filterConsultRecordList(studentData.consultRecordList).consultTypeName}}
              {{studentData.creator}}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="student-btns" v-if="typeTab == 'MyReceive'">
      <van-button class="student-btn-item" v-permission="'HO:WAIT:RECEIVE'" v-if="[1,3].includes(studentData.handoverState)  && studentData.permissions" @click.stop="isReceiveShow = true">
        <van-icon name="passed" />
        <span>接收</span>
      </van-button>
      <van-button class="student-btn-item" v-permission="'HO:WAIT:REJECT'" @click.stop="isRefuseShow = true" v-if="studentData.handoverState == 1 && studentData.permissions">
        <van-icon name="close" /><span>拒绝</span>
      </van-button>
    </div>
    <div class="student-btns" v-if="typeTab == 'MyReceived' && (studentData.handoverInfoMap && !studentData.handoverInfoMap[6])">
      <van-button class="student-btn-item" @click.stop="handleConsulRecord" v-permission="'HO:RECEPTION:RECORD_ADD'">
        <img src="@/assets/images/icons/btn_record.png" alt="">
        <span>添加咨询记录</span>
      </van-button>
      <van-button class="student-btn-item" @click.stop="handleDistributConsult" v-permission="'HO:RECEPTION:RESCOULT'">
        <img src="@/assets/images/icons/ConsultSubscribe.png" alt="">
        <span>分配咨询</span>
      </van-button>
    </div>
    <!-- 移交 -->
    <AddHandoverPerson :is-open.sync="isAddHandoverPersonShow" :sId="sId" :handoverId="handoverId" @complete="handleUpFollow" />
    <!-- 关联收据 -->
    <RelatedReceipt :is-open.sync="showRelatedReceipt" :aId="studentData.handoverId" @complete="handleUpFollow" />
    <!-- 取消关联 -->
    <CancelRelatedReceipt :is-open.sync="isDisassociateShow" :aId="studentData.handoverId" @complete="handleUpFollow" />
    <!-- 分配咨询师 -->
    <ConsultDistribute :is-open.sync="isConsultDistributeShow" :sId="sId" @complete="handleUpFollow" />
    <!-- 接收学员 -->
    <ReceiveSudents :is-open.sync="isReceiveShow" :sId="studentData.id" :aId="studentData.handoverId" @complete="handleUpFollow" />
    <!-- 拒绝学员 -->
    <RefuseSudents :is-open.sync="isRefuseShow" :sId="studentData.id" :aId="studentData.handoverId" @complete="handleUpFollow" />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { consultationInfoApi } from '@/api/potentialGuest/consultation'
import { dateCountDown } from '@/utils/date.js'

export default {
  props: {
    sId: Number,
    handoverId: Number,
    studentData: {
      required: true,
      default: () => { }
    },
    typeTab: {
      type: String,
      default: 'initialTransfer' // initialTransfer：默认初始移交  MyHandover：移交-我移交的 MyReceived：移交-我接收的 MyReceive：待接收
    },
    isCloseBtn: Boolean, // 关闭按钮
    listType: String
  },
  components: {
    ConsultDistribute: () => import('../ConsultDistribute/index'),
    AddHandoverPerson: () => import('@/views/handover/components/AddHandoverPerson'),
    ReceiveSudents: () => import('../ReceiveSudents/index'),
    RefuseSudents: () => import('../RefuseSudents/index'),
    RelatedReceipt: () => import('../RelatedReceipt/index'), // 关联收据
    CancelRelatedReceipt: () => import('../CancelRelatedReceipt/index') // 取消关联
  },
  data() {
    return {
      previewImgShow: false,
      startPosition: 0,
      isReceiveShow: false,
      isRefuseShow: false,
      isConsultDistributeShow: false,// 分配咨询
      showRelatedReceipt: false, // 关联收据是否显示
      isDisassociateShow: false, // 取消关联收据是否显示
      isRotate: false,
      showPopover: false,
      // 移交
      isAddHandoverPersonShow: false,
      // 宏医 聚创 网校
      system_hy_jc_wx: [62, 1, 47],
      // 专升本 聚创专插本 江西聚创专升本 公务员
      system_zsb_jczsb_jxzsb_gwy: [49, 76, 77, 22],
      jumoStudentId: null,
      reserveConsultId: null,
      titleList: ['移交', '承接', '分配', '报名', '收款'],
      existOptions: [{ value: 1, text: '已存在' }, { value: 0, text: '不存在' }],
      receiveTime: null,
      receiveObj: { day: 0, hour: 0, minute: 0, second: 0 },
      count: 0
    }
  },
  filters: {
    filterState(id, arr) {
      const obj = arr.find(e => e.value === id)
      if (!obj) return '-'
      return obj.text
    },
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
    stateFilter(v) {
      if (v === 1) return '待支付'
      if (v === 2) return '有余款'
      if (v === 3) return '已交清'
      if (v === 4) return '已取消'
      if (v === 5) return '已退款'
      if (v === 6) return '需退款'
    },
    schoolFilter(val) {
      if (val) {
        return Object.keys(val).map(item => val[item]).join('/')
      }
      return ''
    },
    intentionFilter(val1, val2, val3) {
      return [val1, val2, val3].filter(item => item).join('/')
    }
  },
  /* activated() {
    if (this.jumoStudentId) {
      this.handleUpdataInfo()
    }
  }, */
  mounted() {
    if (this.typeTab === 'MyReceive' && this.studentData.secondsDown) {
      this.receiveObj = dateCountDown(this.studentData.secondsDown)
      if (this.studentData.secondsDown < 86400) {
        this.setTime()
      }
    }
    this.$emit('onStudentCardMounted')
  },
  computed: {
    ...mapGetters(['permission_btns']),
    ...mapState({
      isHandoverStateList2: state => state.activity.isHandoverStateList2,
      isHandoverStateList: state => state.activity.isHandoverStateList,
      currentSystemId: state => state.common.systems.currentSystem.id,
      roleFlag: state => {
        return state.common.user.info.roleFlag
      }
    }),
    actions() {
      let arr = []
      if (this.permission_btns.includes('HO:OVERSTU:ADDHANDOVERUSER')) {
        arr.push({ text: '添加移交人', dialogName: 'isAddHandoverPersonShow' })
      }
      if (this.studentData.handoverState === 1 && this.permission_btns.includes('HO:OVERSTU:EDIT')) {
        arr.unshift({ text: '编辑', dialogName: 'isEditShow' })
      }
      if ([2, 9, 4].includes(this.studentData.handoverState) && this.permission_btns.includes('HO:OVERSTU:RECEIPT')) {
        arr.push({ text: '关联收据', dialogName: 'showRelatedReceipt' })
      }
      if ([5, 6, 7, 8].includes(this.studentData.handoverState) && this.permission_btns.includes('HO:OVERSTU:RECEIPT')) {
        arr.push({ text: '取消关联', dialogName: 'isDisassociateShow' })
      }
      return arr
    }
  },
  beforeDestroy() {
    clearInterval(this.receiveTime); // 清除定时器
    this.receiveTime = null;
  },
  methods: {
    setTime() {
      //每隔一分钟运行一次保存方法
      this.receiveTime = setInterval(() => {
        this.count += 1
        this.receiveObj = dateCountDown(this.studentData.secondsDown)
        this.$set(this.studentData, 'secondsDown', this.studentData.secondsDown - 1)
      }, 1000)
    },
    handleImgClick(index) {
      this.startPosition = index
      this.previewImgShow = true
    },
    // 添加咨询记录
    handleConsulRecord() {
      this.jumoStudentId = this.sId
      this.$router.push({
        path: `/counselrecord/${this.sId}/null`
      })
    },
    // 分配咨询
    handleDistributConsult() {
      this.isConsultDistributeShow = true
    },

    handleOperatShow() {

    },
    handleCard() {
      if ((this.permission_btns.includes('HO:CHECK_STUDENT_HAND_OVER') && this.typeTab == 'MyHandover') || (this.permission_btns.includes('HO:OVERSTU:CHECK_STUDENT_RECEIVE') && this.typeTab == 'MyReceived')) {
        const { id, handoverId, handoverState } = this.studentData
        this.$router.push(`/userProfile/${this.typeTab === 'MyHandover' ? 1 : 2}/${id}/${handoverId}/${handoverState}`)
      }
    },
    filterConsultRecordList(list) {
      if (list) {
        return list[0]
      } else {
        return {}
      }
    },
    filterHandoverInfoMap(obj) {
      if (obj) {
        let objList = []
        if (obj[6]) {
          objList = [{ title: '移交', text: obj[1] }, { title: '拒绝', text: obj[2], reason: obj[6] ? obj[6] : null, imgArr: obj[7] ? obj[7] : [] }]
        } else {
          for (let item in obj) {
            objList.push({
              title: this.titleList[Number(item - 1)],
              text: obj[item]
            })
          }
        }
        return objList
      } else {
        return []
      }
    },
    handoverStateFilter(v) { // 移交状态返回文本
      const listFind = this.typeTab === 'MyReceived' ? this.isHandoverStateList2 : this.isHandoverStateList
      const obj = listFind.find(e => v == e.value)
      if (!obj) return ''
      return obj.text
    },

    handlePopSelect(e) {
      const { text } = e
      if (text === '编辑') {
        this.$router.push({
          path: `/handoverRecord/${this.studentData.id}/${this.studentData.handoverId}`
        })
      }
      this[e.dialogName] = true
    },
    handlePhone() {
    },

    handleUpdataInfo() {
      consultationInfoApi(this.sId, Number(this.listType)).then(res => {
        let info = res.data
        if (this.listType === 'yuYueZiXun') {
          info.id = this.studentData.id
          info.studentId = this.studentData.studentId
        }
        setTimeout(() => {
          this.$emit('onComplete', info)
          this.$emit('onUpdataInfo', info)
        }, 2000)
        this.jumoStudentId = null
      }).catch(() => {
        this.jumoStudentId = null
      })
    },

    handleUpFollow() {
      this.$emit('onAllRefresh')
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>