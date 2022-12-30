<template>
  <div class="student-card common-list-contain" @click="handleStudentInfo">
    <div class="student-base">
      <div class="student-header">
        <div class="SH-l">
          <span class="SH-name" v-if="listType ==3 ">{{studentData.abbreviation}} {{studentData.title}}</span>
          <span class="SH-name" v-else> {{studentData.title}}</span>
          <span class="SH-tag" :class="studentData.state == 1 ? 'SH-tag-green':  studentData.state == 2 ? 'SH-tag-blue' : 'SH-tag-gray'" v-if="studentData.state">{{studentData.state == 1 ? '未开始' :studentData.state == 2 ? '进行中' : '已结束' }}</span>
          <span class="SH-tag SH-tag-blue" v-else-if="studentData.opponent">{{studentData.opponent}}</span>
        </div>
        <div class="SH-r">
          <div class="SH-r-icon" v-if="listType == 3" v-permission="'MARKET:OPPONENT:EDIT'">
            <img class="SH-r-icon" src="@/assets/images/icons/recordEdit.png" alt="" @click="handleEdit">
          </div>
          <div class="SH-r-none" @click.stop="handleOperatShow" v-else>
            <van-popover v-model="showPopover" @select="handlePopSelect" class="demo" trigger="click" :actions="actions(studentData)" placement="bottom-end" :offset="[9,8]">
              <template #reference>
                <span>...</span>
              </template>
            </van-popover>
          </div>
        </div>
      </div>
      <div class="student-subtitle" :class="studentData.state == 1 ? 'subtitle-green':  studentData.state == 2 ? 'subtitle-blue' : 'subtitle-gray'">
        <span>{{studentData.dateStr}}</span><span v-if="listType != 2">{{studentData.method == 2 ? '面授' : '网授'}}</span><span v-if="listType != 2">{{studentData.teachers}}主讲</span>
      </div>
      <div class="student-extraInfo">
        <span class="extra-info-item" v-if="listType == 3 && studentData.attendance">到场{{studentData.attendance}}人<div class="extra-info-item-line"></div> </span>
        <span class="extra-info-item" v-if="listType != 3 && (studentData.chargePersonName || studentData.chargePerson)">{{studentData.chargePersonName || studentData.chargePerson}}负责<div class="extra-info-item-line"></div> </span>
        <span class="extra-info-item" v-if="studentData.commonSchoolInfo">{{studentData.commonSchoolInfo[2]}} <div class="extra-info-item-line"></div> </span>
        <span class="extra-info-item" v-if="studentData.sendBookType">{{studentData.sendBookType}} <div class="extra-info-item-line"></div> </span>
        <span class="extra-info-item" v-if="studentData.type">{{studentData.type}}<div class="extra-info-item-line"></div> </span>
        <span class="extra-info-item" v-if="studentData.targets">{{studentData.targets}}<div class="extra-info-item-line"></div> </span>
      </div>
      <div class="student-series" v-if="listType != 3">
        <div v-if="listType == 1">{{studentData.attendance  || '-'}}<span>到场人数</span></div>
        <div>{{studentData.partNum  || '-'}}<span>参与人数</span></div>
        <div>{{studentData.newStudentNum  || '-'}}<span class="color-green">新用户</span></div>
        <div>{{studentData.appointmentNum  || '-'}}<span>预约咨询</span></div>
        <div>{{studentData.handoverNum  || '-'}}<span>移交人数</span></div>
      </div>

    </div>
    <ShareTips :deptIsShow="deptIsShow" @compelete="handleCompelete" :activityId="studentData.id" />
    <ShareCode :isOpen="shareCodeIsOpen" :counselTab="filterCounselTab()" ref="shareCode" :sId="studentData.id" :sysShellId="sysShellId" @close="handleClose" />
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
  props: {
    sId: Number,
    listType: String, // 4 代表的是今日活动！！
    studentData: {
      required: true,
      default: () => { }
    },
    isJumpStudentInfo: Boolean,
    isCloseBtn: Boolean, // 关闭按钮
    counselTab: String
  },
  components: {
    ShareTips: () => import('@/components/ShareCodeTips'),
    ShareCode: () => import('@/components/ShareCode')
  },
  data() {
    return {
      deptIsShow: false,
      sysId: null,
      operatShow: false, // 操作栏是否显示
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
      // 宏医 聚创 网校
      system_hy_jc_wx: [62, 1, 47],
      // 专升本 聚创专插本 江西聚创专升本 公务员
      system_zsb_jczsb_jxzsb_gwy: [49, 76, 77, 22],
      jumoStudentId: null,
      shareCodeIsOpen: false,
      shareCodeObj: {},
      sysShellId: '',
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
    }
  },
  activated() {
    this.operatShow = false
    this.showPopover = false
  },
  mounted() {
    this.$emit('onStudentCardMounted')
  },
  computed: {
    ...mapGetters(['permission_btns']),
    ...mapState({
      currentSystemId: state => state.common.systems.currentSystem.id
    }),
  },
  methods: {
    handleCloseSelect() {
      console.log('关闭了...');
    },
    filterCounselTab() {
      if (this.studentData.activityType) {
        return this.studentData.activityType == 1 ? 'LectureReg' : 'MarketAct'
      } else {
        return this.counselTab
      }
    },
    ...mapMutations('common/global', ['SET_ACTIVITYID']),
    actions(val) {
      let arr
      const { questionnaireId } = val
      if (questionnaireId) {
        arr = [
          { text: '编辑', dialogName: 'isConsultSubscribeShow', permission_btn: this.counselTab == 'LectureReg' ? 'MARKET:SCHOOL:LECTURE_EDIT' : 'MARKET:BOOK:EDIT' },
          { text: '重新关联', dialogName: 'isConsultDistributeShow', permission_btn: this.counselTab == 'LectureReg' ? 'MARKET:SCHOOL:INFO_RELATIONQ' : 'MARKET:ACT:INFO_RELATIONQ' },
          { text: '生成签到码', dialogName: 'isConsultMarketAreaShow', permission_btn: this.counselTab == 'LectureReg' ? 'MARKET:SCHOOL:INFO_SIGNCODE' : 'MARKET:ACT:INFO_SIGNCODE' }
        ]
      } else {
        arr = [
          { text: '编辑', dialogName: 'isConsultSubscribeShow', permission_btn: this.counselTab == 'LectureReg' ? 'MARKET:SCHOOL:LECTURE_EDIT' : 'MARKET:BOOK:EDIT' },
          { text: '关联问卷', dialogName: 'isConsultDistributeShow', permission_btn: this.counselTab == 'LectureReg' ? 'MARKET:SCHOOL:INFO_RELATIONQ' : 'MARKET:ACT:INFO_RELATIONQ' }
        ]
      }
      arr = arr.filter(item => this.permission_btns.includes(item.permission_btn))
      return arr
    },
    handleEdit() {
      this.$router.push({
        path: `ActiveAddEdit/${this.studentData.id}/2/${this.counselTab}`,
      })
    },

    handleOperatShow() {
      this.operatShow = true
    },
    handleClose() {
      this.shareCodeIsOpen = false
    },

    handleCompelete(val) {
      if (val) {
        const { sysShellId, marketAreaId } = val
        this.sysShellId = sysShellId || marketAreaId
        this.$loading(true)
        this.$nextTick(() => {
          this.$refs.shareCode.checkCodeIsShow().then(() => {
            this.$loading(false)
            this.shareCodeIsOpen = true
          }).catch(() => {
            this.$loading(false)
          })
        })
        this.deptIsShow = false
        this.operatShow = false
      } else {
        this.deptIsShow = false
        this.operatShow = false
      }
    },

    handleRotate() {
      this.isRotate = !this.isRotate
    },
    handlePopSelect(e) {
      // 设置活动id
      this.handleSetActivityId(this.studentData.id)

      const { dialogName } = e
      if (dialogName === 'isConsultDistributeShow') {
        this.$nextTick(() => {
          this.showPopover = false
          this.operatShow = false
          // 跳转..
          this.$router.push(`/QuesConnect/${this.studentData.id}`)
          // 设置sessionStore来判断是否从关联问卷或者重新关联进入
          sessionStorage.setItem('counselTab', this.counselTab)
        })
      }

      if (dialogName === 'isConsultMarketAreaShow') {
        this.deptIsShow = true
        this.showPopover = false
      }

      if (dialogName === 'isConsultSubscribeShow') {
        let type = this.listType == 3 ? 2 : this.listType == 2 ? 3 : this.listType
        this.$nextTick(() => {
          this.showPopover = false
          this.operatShow = false
          if (this.listType == 4) {
            // 今日活动
            this.$router.push(`/ActiveAddEdit/${this.studentData.id}/${this.studentData.activityType}/${'LectureReg'}`)
          } else {
            this.$router.push({
              path: `ActiveAddEdit/${this.studentData.id}/${type}/${this.counselTab}`,
            })
          }
        })
      }

      this[e.dialogName] = true
    },

    handleStudentInfo() {
      this.handleSetActivityId(this.studentData.id)
      this.jumoStudentId = this.sId
      if (this.listType == 3) return
      let newCounselTab = this.studentData.activityType == 1 ? 'LectureReg' : this.studentData.activityType == 3 ? 'MarketAct' : null
      let newListType = this.studentData.activityType == 1 ? 1 : this.studentData.activityType == 3 ? 2 : null
      this.$router.push(`/lectureDetails/${this.sId}/${newListType ? newListType : this.listType}/${newCounselTab ? newCounselTab : this.counselTab}`)
    },

    handleSetActivityId(activityId) {
      this['SET_ACTIVITYID']({ activityId })
    }

  }
}
</script>

<style lang="scss" >
@import './index.scss';
.van-popover__action-text {
  display: flex !important;
  justify-content: flex-start !important;
}
</style>