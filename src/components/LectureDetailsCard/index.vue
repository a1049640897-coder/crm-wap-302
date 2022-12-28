<template>
  <div class="student-card common-list-contain">
    <div class="student-base">
      <div class="student-header common-list-contain">
        <div class="SH-l">
          <div class="SH-name">{{studentData.title}}</div>
          <div class="SH-tags">
            <span class="SH-tag" :class="studentData.state == 1 ? 'SH-tag-green':  studentData.state == 2 ? 'SH-tag-blue' : 'SH-tag-gray'" v-if="studentData.state">{{studentData.state == 1 ? '未开始' :studentData.state == 2 ? '进行中' : '已结束' }}</span>
          </div>
        </div>
        <div class="SH-e" @click="handleEdit(studentData)" v-permission=" counselTab == 'LectureReg'  ?  'MARKET:SCHOOL:LECTURE_EDIT' : 'MARKET:BOOK:EDIT'">
          <img class="SH-r-icon" src="@/assets/images/icons/recordEdit.png" alt="">
        </div>
        <div class="SH-r">
          <div class="SH-r-icon" @click.stop="handleRotate">
            <img class="SH-r-icon" :class="{'IconRotate': isRotate}" src="@/assets/images/icons/expend.png" alt="">
          </div>
        </div>
      </div>
      <div class="student-subtitle" :class="studentData.state == 1 ? 'subtitle-green':  studentData.state == 2 ? 'subtitle-blue' : 'subtitle-gray'">
        <span>{{studentData.dateStr}}</span><span v-if="listType != 2">{{studentData.teachMethod == 1 ? '网授' : '面授'}}</span><span v-if="listType != 2 && studentData.lecturers && studentData.lecturers.length">{{studentData.lecturers.join("、")}}主讲</span>
      </div>
      <div class="student-extraInfo common-list-contain">
        <span class="extra-info-item" v-if="listType == 3">到场{{studentData.attendance}}人<div class="extra-info-item-line"></div> </span>
        <span class="extra-info-item" v-if="listType != 3 && studentData.chargePersonName">{{studentData.chargePersonName}} 负责<div class="extra-info-item-line"></div> </span>
        <span class="extra-info-item" v-if="studentData.commonSchoolInfo && studentData.commonSchoolInfo.extend[2]">{{studentData.commonSchoolInfo.extend[2].text}} <div class="extra-info-item-line"></div> </span>
        <span class="extra-info-item" v-if="studentData.lectureTypeName">{{studentData.lectureTypeName}}<div class="extra-info-item-line"></div> </span>
        <span class="extra-info-item" v-if="studentData.targetName && studentData.targetName.length">{{studentData.targetName.join("、")}}<div class="extra-info-item-line"></div> </span>
      </div>
      <div class="student-info common-list-contain" style="padding-bottom: 0;" v-if="isRotate">
        <div class="student-more">
          <div class="student-line">
            <div class="line-square"></div>
          </div>
          <!-- 来源渠道 -->
          <div class="student-info-item" v-if="studentData.crmSourceChannelName">
            <div class="info-item">
              <img src="@/assets/images/icons/source.png" alt="" class="info-img">
              <span>{{studentData.crmSourceChannelName | italicSplicText}}</span>
            </div>
          </div>
          <!-- 地点 -->
          <div class="student-info-item" v-if="studentData.address">
            <div class="info-item">
              <img src="@/assets/images/icons/city.png" alt="" class="info-img">
              <span>{{studentData.address}}</span>
            </div>
          </div>
          <!-- 上课链接 -->
          <div class="student-info-item" v-if="studentData.studyUrl">
            <div class="info-item">
              <img src="@/assets/images/icons/earth.png" alt="" class="info-img">
              <span>{{studentData.studyUrl}}</span>
            </div>
          </div>
          <!-- 部门名称 -->
          <div class="student-info-item">
            <div class="info-item">
              <span>
                <span class="gray-title-color">部门名称：</span>
                <span>{{studentData.shellName | italicSplicText}}</span>
              </span>
            </div>
          </div>
          <!-- 参与人 -->
          <div class="student-info-item">
            <div class="info-item">
              <span>
                <span class="gray-title-color">参与人：</span>
                <span>{{studentData.participantsList.join("/")}}</span>
              </span>
            </div>
          </div>
          <!-- 跟进期限 -->
          <div class="student-info-item">
            <div class="info-item">
              <span>
                <span class="blue-title-color">跟进期限：</span>
                <span>{{studentData.followPeriod}}天</span>
              </span>
            </div>
          </div>
          <!-- 备注 -->
          <div class="student-info-item">
            <div class="info-item">
              <span>
                <span class="gray-title-color">备注：</span>
                <span>{{studentData.remark}}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 预约咨询 -->
    <ConsultSubscribe :is-open.sync="isConsultSubscribeShow" :sId="studentData.id" @complete="handleUpdataInfo" :reserveConsultId="reserveConsultId" />
    <!-- 分配咨询师 -->
    <ConsultDistribute :is-open.sync="isConsultDistributeShow" :sId="studentData.id" @complete="handleUpdataInfo" />
    <!-- 移交 -->
    <ConsultHandOver :is-open.sync="isConsultHandOverShow" :sId="studentData.id" @complete="handleUpdataInfo" />
    <!-- 转交 -->
    <ConsultDeliver :is-open.sync="isConsultDeliverShow" :sId="studentData.id" @complete="handleUpdataInfo" />
    <!-- 放入公海 -->
    <ConsultSea :is-open.sync="isConsultSeaShow" :sId="studentData.id" @complete="handleUpdataInfo" />
    <!-- 修改市场区域 -->
    <ConsultMarketArea :is-open.sync="isConsultMarketAreaShow" :sId="studentData.id" :branchId="studentData.branchId" :markerAreaId="studentData.crmMarketAreaId" :markerAreaTitle="studentData.crmMarketAreaTitle" @complete="handleUpdataInfo" />
    <!-- 咨询结果 -->
    <ConsultSubscribeResult :is-open.sync="isConsultSubscribeResultShow" :id="studentData.id" :sId="studentData.studentId" :reserveConsultResult="studentData.reserveConsultResult" @complete="handleUpdataInfo" />
    <!-- 公海领取 -->
    <ConsultGetConsultSea :is-open.sync="isGetConsultSeaShow" :sId="studentData.id" :reserveConsultResult="studentData.reserveConsultResult" @complete="handleUpdataInfo" />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { consultationInfoApi } from '@/api/potentialGuest/consultation'

export default {
  props: {
    sId: Number,
    counselTab: String,
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
     * 
     * daiGenJin: 待跟进
     * yuYueZiXun: 预约咨询
    */
    listType: String
  },
  components: {
    ConsultSubscribe: () => import('../ConsultSubscribe/index'),
    ConsultDistribute: () => import('../ConsultDistribute/index'),
    ConsultHandOver: () => import('../ConsultHandOver/index'),
    ConsultDeliver: () => import('../ConsultDeliver/index'),
    ConsultSea: () => import('../ConsultSea/index'),
    ConsultMarketArea: () => import('../ConsultMarketArea/index'),
    ConsultSubscribeResult: () => import('../ConsultSubscribeResult/index'),
    ConsultGetConsultSea: () => import('../ConsultGetConsultSea/index')
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
      // 宏医 聚创 网校
      system_hy_jc_wx: [62, 1, 47],
      // 专升本 聚创专插本 江西聚创专升本 公务员
      system_zsb_jczsb_jxzsb_gwy: [49, 76, 77, 22],
      jumoStudentId: null,
      reserveConsultId: null,
    }
  },
  filters: {
    italicSplicText(src) {
      return src.split('-').join('/')
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
    if (this.jumoStudentId) {
      this.handleUpdataInfo()
    }
  },
  mounted() {
    this.$emit('onStudentCardMounted')
    // 重置详情进入标识

  },
  computed: {
    ...mapState({
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
    ...mapMutations('activity/', ['SET_DETAILFLAG']),
    handleEdit() {
      const { sid, listType, counselTab } = this.$route.params
      this.$emit('refresh')
      this.$router.push({
        path: `/ActiveAddEdit/${sid}/${listType == 2 ? 3 : listType}/${counselTab}`,
      })
      this['SET_DETAILFLAG']({ flag: true })
    },
    handleRotate() {
      this.isRotate = !this.isRotate
    },

    handlePhone() {
    },

    handleNoFollow() {
      this.$emit('noFollowRefresh')
    },

    handleUpdataInfo() {
      consultationInfoApi(this.sId, Number(this.listType)).then(res => {
        this.$emit('onUpdataInfo', res.data)
        this.jumoStudentId = null
      }).catch(() => {
        this.jumoStudentId = null
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>