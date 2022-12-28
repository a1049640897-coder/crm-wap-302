<template>
  <div class="student-card common-list-contain">
    <div class="student-base">
      <div class="student-header">
        <div class="student-header-lf">{{studentData.baseName}} <span v-if="studentData.baseYear">{{studentData.baseYear}}{{studentData.baseYear && '毕业'}}</span></div>
        <div class="student-header-rt" @click="handleShowQus(studentData.id)">已答{{studentData.schedule}}题>></div>
      </div>

      <!-- 2 联系方式 -->
      <div class="student-info-item" v-if="studentData.baseMobile||studentData.baseQq || studentData.baseWechat ">
        <div class="info-item" v-if="studentData.baseMobile">
          <img src="@/assets/images/icons/mobile.png" alt="" class="info-img">
          <a @click.stop="handlePhone" :href="`tel: ${studentData.baseMobile}`">{{studentData.baseMobile}}</a>
        </div>
        <div class="info-item" v-if="studentData.baseQq">
          <span class="item-col" style="margin-right:0.2rem">|</span> <img src="@/assets/images/icons/qq.png" alt="" class="info-img">
          <span>{{studentData.baseQq}}</span>
        </div>
        <div class="info-item" v-if="studentData.baseWechat">
          <span class="item-col">|</span><img src="@/assets/images/icons/wechat.png" alt="" class="info-img">
          <span>{{studentData.baseWechat}}</span>
        </div>
      </div>

      <!-- 学校和城市  -->
      <div class="student-info-address" v-if="studentData.baseSchool || studentData.baseArea ">
        <div class="student-info-address-school" v-if="studentData.baseSchool">
          <img src="@/assets/images/icons/school.png" alt="" class="info-img">
          就读学校：{{studentData.commonSchoolInfo | schoolFilter}}
        </div>
        <div class="student-info-address-city" v-if="studentData.baseArea">
          <img src="@/assets/images/icons/city.png" alt="" class="info-img">
          所在城市：{{studentData.baseArea}}
        </div>
      </div>

      <!-- 问卷展示 -->
      <van-popup v-model="isQusShow" closeable position="center" round class="ques-overlay" :style="{ maxHeight: '50%', width:'80%' }" get-container="#app">
        <div class="ques-title">
          答题详情
        </div>
        <div class="ques-body">
          <div class="ques-body-item" v-for="(item,index) in quesList" :key="index">
            {{item.jyTitle}}: {{dealData(item.jyInfos, item.jyType)}}
          </div>
        </div>
      </van-popup>

    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import { activityQuesAnswerDetailApi } from '@/api/potentialGuest/activity'

export default {
  props: {
    sId: Number,
    studentData: {
      required: true,
      default: () => { }
    },
  },
  filters: {
    schoolFilter(val) {
      if (val) {
        return Object.keys(val).map(item => val[item]).join('/')
      }
      return '未知'
    }
  },
  data() {
    return {
      quesList: [],
      isQusShow: false,
    }
  },
  mounted() {
  },
  computed: {
    ...mapState({
      currentSystemId: state => state.common.systems.currentSystem.id,
      roleFlag: state => {
        return state.common.user.info.roleFlag
      }
    }),
  },
  methods: {
    dealData(obj, type) {
      if (obj) {
        if (type == 'jyRadio') {
          return (obj.jyList.find(v => v.id == obj.jyValue) || {}).jyListName
        }
        if (type == 'jyChecks') {
          let nameList = []
          obj.jyList.forEach(v => {
            if (obj.jyValue && obj.jyValue.split(',').includes(v.id.toString())) {
              nameList.push(v.jyListName)
            }
          });
          return nameList.join('、')
        }
        if (['jyInput', 'jyMultipleInput'].includes(type)) {
          if (obj.jyList.find(val => val.jyListValue)) {
            if (obj.jyList.length == 1) {
              return obj.jyList[0].jyListValue || obj.jyValue
            } else {
              let nameList = []
              obj.jyList.forEach(v => {
                nameList.push(v.jyListValue)
              })
              return nameList.join('、')
            }
          }
        }

        if (['jyGraduateYear', 'jyArea', 'jySchool'].includes(type)) {
          return obj.jyValue
        }

        if (['jySimpleSelect'].includes(type)) {
          let nameList = []
          // item.jyInfos.jyValue === el.id.toString()
          obj.jyList.forEach(v => {
            if (v.jyValue == v.id) {
              nameList.push(v.jyListName)
            }
          })
          return nameList.join('、')
        }



      }
    },
    // 展示问卷信息
    handleShowQus(id) {
      activityQuesAnswerDetailApi(id).then(res => {
        this.quesList = res.data.jyArr
      })
      this.isQusShow = true
    },
    handleRotate() {
      this.isRotate = !this.isRotate
    },

    handlePopSelect(e) {
      if (e.dialogName === 'isConsultSubscribeShow') {
        if (this.studentData.state === 3) {
          this.$fm('已完成预约！')
          return
        }
      } else if (e.dialogName === 'editStudent') {
        // this.handleStudentInfo()
        this.showPopover = false
        return
      } else if (e.dialogName === 'addCounselRecord') {
        this.showPopover = false
        this.$nextTick(() => {
          this.handleConsulRecord()
        })
        return
      }
      this.reserveConsultId = this.listType === 'yuYueZiXun' ? this.studentData.id : this.studentData.reserveConsultId
      this[e.dialogName] = true
    },

    handlePhone() {
    },

    handleEditStudentInfo() {
      this.jumoStudentId = this.sId
      this.$router.push({
        path: `/studentinfoedit/${this.sId}`
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