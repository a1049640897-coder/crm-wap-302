<template>
  <div class="student-info-edit-new">
    <van-form ref="activityForm" :show-error-message="false" validate-trigger="" :submit-on-enter="false">
      <RePick v-model="submitForm.shellId" label="部门名称" name="shellId" :list="departList" @change="handleDept" isCascader childrenKey="child" isRequrie isCell clearable />
      <RePick v-model="submitForm.attributeId" label="院校属性" :list="schoolTypeList" @change="handleSchoolType" name="attributeId" :isRequrie="false" isCell clearable />
      <RePick v-model="submitForm.collegeInfoId" label="院校名称" ref="yxmc" v-if="collegeInfoIdIsShow" :list.sync="schoolList" @change="handleSchool" isShowSearch isOriginSchool :originSchoolAttr="submitForm.attributeId" name="collegeInfoId" originSchoolType="1" :isRequrie="false" isCell clearable />
      <!-- <RePick v-model="submitForm.collegeInfoId" label="院校名称" ref="yxmc" isOriginActivitySchoolSearch @change="handleSchool" :list.sync="schoolList" originSchoolType="1" isShowSearch name="collegeInfoId" isCell clearable /> -->

      <RePick v-model="submitForm.opponentId" label="对手名称" name="opponentId" v-if="[2].includes(activityType)" isShowSearch :list="opponentOptions" isRequrie isCell clearable />
      <van-field v-model="submitForm.title" :label="[1,2].includes(activityType) ? '讲座名称' :'活动名称'" required clear-trigger="always" name="title" clearable input-align="right" maxlength="50" placeholder="请输入" :rules="[{ required: true, message: '请输入' }]" />
      <RePick v-model="submitForm.sendBookType" :label="[1].includes(activityType) ? '讲座类型' :'活动类型'" v-if="[3].includes(activityType)" isRequrie :list.sync="activityTypeList" name="sendBookType" isCell clearable />
      <RePick v-model="submitForm.lectureType" :label="[1,2].includes(activityType) ? '讲座类型' :'活动类型'" v-if="[1,2].includes(activityType)" name="lectureType" :list="lectureTypeListL" isRequrie isCell clearable />
      <!-- <van-field v-model="submitForm.followPeriod" label="跟进期限" type="number" v-if="[2].includes(activityType)" required clear-trigger="always" clearable input-align="right" placeholder="请输入" :rules="[{ required: true, message: '请输入' }]" /> -->
      <van-field v-model="submitForm.address" :label="[1,2].includes(activityType) ? '讲座地点' :'活动地点'" v-if="[1,2,3].includes(activityType)" required clear-trigger="always" maxlength="50" clearable input-align="right" placeholder="请输入" :rules="[{ required: true, message: '请输入' }]" />
      <RePick v-model="submitForm.crmSourceChannelId" label="来源渠道" name="crmSourceChannelId" isCascaderAllLevelName v-if="[1,3].includes(activityType)" :list="sourceList" isCascader isShowSearch isRequrie isCell clearable />
      <van-field label="授课类型" name="teachMethod" required input-align="right" label-width="9em" v-if="[1,2].includes(activityType)" :rules="[{ required: true, message: '请选择' }]">
        <template #input>
          <van-radio-group v-model="submitForm.teachMethod" direction="horizontal">
            <van-radio name="1">网授</van-radio>
            <van-radio name="2">面授</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-field v-model="submitForm.rivalTeacher" :label="'讲师姓名'" v-if="[2].includes(activityType)" required clear-trigger="always" maxlength="50" clearable input-align="right" placeholder="请输入" :rules="[{ required: true, message: '请输入' }]" />
      <RePick v-model="submitForm.materialId" label="资料清单" name="materialId" v-if="[3].includes(activityType)" :list="dataList" isShowSearch isCell multiple clearable />
      <RePick v-model="submitForm.courseIds" label="课程清单" name="courseIds" v-if="[3].includes(activityType)" :list="courseList" isShowSearch isCell multiple clearable />
      <van-field :label=" this.activityType == 1 ? '讲师类型' :'授课类型'" name="teacherType" required input-align="right" label-width="9em" v-if="[1].includes(activityType)">
        <template #input>
          <van-radio-group v-model="submitForm.teacherType" @change="handleTeach" direction="horizontal">
            <van-radio name="1">{{activityType == 1 ? '内部' : '网授' }}</van-radio>
            <van-radio name="2">{{activityType == 1 ? '外部' : '面授' }}</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <RePick v-model="submitForm.lecturer" label="讲师姓名" isRequrie :list.sync="teacherInsideNameList" isShowSearch multiple name="lecturer" isCell clearable v-if="[1].includes(activityType) && submitForm.teacherType == 1" isUseLimitPage />
      <RePick v-model="submitForm.lecturer" label="讲师姓名" isRequrie :list.sync="teacherOutNameList" isShowSearch multiple name="lecturer" isCell clearable v-if="[1].includes(activityType) && submitForm.teacherType == 2" />
      <div class="add-lecturer" v-if="[1].includes(activityType) && submitForm.teacherType == 2">没有匹配到讲师? <span @click.stop="handleAddLecture">去添加讲师</span> </div>
      <van-field v-model="submitForm.studyUrl" label="上课链接" clear-trigger="always" clearable input-align="right" maxlength="100" placeholder="http://" v-if="[1,3].includes(activityType)" />
      <van-field v-model="submitForm.date" label="讲座日期" class="activity-common" disabled v-if="[1,2].includes(activityType)" clear-trigger="always" @click="handleShowDate" required input-align="right" placeholder="请选择" :rules="[{ required: true, message: '请选择' }]" />
      <van-field v-model="submitForm.startTime" class="activity-common" :label="[1,2].includes(activityType) ? '讲座开始时间' :'活动开始时间'" disabled clear-trigger="always" required @click="handleShowStartTime" input-align="right" placeholder="请选择" :rules="[{ required: true, message: '请选择' }]" />
      <van-field v-model="submitForm.endTime" class="activity-common" :label="[1,2].includes(activityType) ? '讲座结束时间' :'活动结束时间'" disabled clear-trigger="always" required @click="handleShowEndTime" input-align="right" placeholder="请选择" :rules="[{ required: true, message: '请选择' }]" />
      <!-- <van-field v-model="submitForm.time" label="讲座时间" clear-trigger="always" @click="handleShowTime" clearable input-align="right" placeholder="请输入" /> -->
      <van-field v-model="submitForm.followPeriod" label="跟进期限" type="number" v-if="[1,3].includes(activityType)" :rules="[{ validator: asyncValidatorPeopleNum, message: '请输入' }]" name="followPeriod" clear-trigger="always" clearable input-align="right" placeholder="请输入" />
      <RePick v-model="submitForm.target" label="针对对象" name="target" v-if="[1,2,3].includes(activityType)" :list="keyObjList" isRequrie multiple isCell clearable />
      <RePick v-model="submitForm.chargePerson" label="负责人" name="chargePerson" isShowSearch v-if="[1,3].includes(activityType)" :list="chargeList" isRequrie isCell clearable />
      <RePick v-model="submitForm.participantsIds" label="参与人" name="participantsIds" isShowSearch v-if="[1,3].includes(activityType)" :list="participantList" multiple isCell clearable />
      <van-field v-model.trim="submitForm.bePresentNumber" label="到场人数" name="bePresentNumber" clear-trigger="always" :rules="[{ validator: asyncValidatorPeopleNum, message: '请输入' }]" v-if="[1,2].includes(activityType)" type="number" clearable input-align="right" placeholder="请输入" />
      <van-field clearable label="上传海报" v-if="[1,3].includes(activityType)">
        <template #input>
          <van-uploader v-model="bg" :max-count="1" :before-read="handleFileBeforeRead" :before-delete="handleBeforeDel" :max-size="1024 * 1024" @oversize="onOversize" />
        </template>
      </van-field>
      <van-field v-model="submitForm.remark" type="textarea" label="备注" maxlength="50" clear-trigger="always" max clearable input-align="right" placeholder="请输入" />
      <div class="student-info-edit-footer">
        <van-button class="record-btn record-btn-danger" style="margin-right: 1rem;" native-type="button" v-if="activityId!=='null'" v-permission="checkDelPerminssionStatus(activityType)" @click="handleDel">删除</van-button>
        <van-button class="record-btn" type="info" native-type="button" :loading="loading" @click.stop="handleConfirm(1)">保存</van-button>
        <van-button class="record-btn" type="info" native-type="button" :loading="loading" v-if="(!activityId || activityId=='null') && activityType!==2" style="margin-left: 1rem; word-break: keep-all;" v-permission="checkSavePerminssionStatus(activityType)" @click.stop="handleConfirm(2)">保存并关联问卷</van-button>
        <van-button class="record-btn" type="info" native-type="button" plain :loading="loading" v-if="!sId" style="margin-left: 1rem; word-break: keep-all;" @click.stop="handleCancel">取消</van-button>
      </div>
    </van-form>

    <!-- 讲座日期 -->
    <van-calendar color="#0088FE" v-model="dateIsShow" ref="calendar" :min-date="minDate" :default-date="defaultDate" @confirm="hanldeOnConfirm" />

    <!-- 讲座开始时间 -->
    <van-popup v-model="timeIsShow" position="bottom" round>
      <div v-if="[1,2].includes(activityType)">
        <van-datetime-picker v-model="submitForm.newStartTime" @confirm="handleStartTimeConfirm" ref="newStartTime" @cancel="handleTimeCancel" v-if="timeType" type="time" />
        <van-datetime-picker v-model="submitForm.newEndTime" @confirm="handleEndTimeConfirm" ref="newEndTime" @cancel="handleTimeCancel" v-else type="time" />
      </div>
      <div v-if="[3].includes(activityType)">
        <van-datetime-picker v-model="submitForm.newStartTime" @confirm="handleStartTimeConfirm" ref="newStartTime" @cancel="handleTimeCancel" v-if="timeType" type="datetime" />
        <van-datetime-picker v-model="submitForm.newEndTime" @confirm="handleEndTimeConfirm" ref="newEndTime" @cancel="handleTimeCancel" v-else type="datetime" />
      </div>
    </van-popup>

    <!--  添加外部讲师  -->
    <van-popup v-model="lecturerIsShow" position="bottom" round>
      <div class="lectureForm-title">添加讲师</div>
      <van-form ref="lectureForm" :show-error-message="false" validate-trigger="" :submit-on-enter="false">
        <van-field v-model="lectureForm.name" label="姓名" required name="name" maxlength="50" clear-trigger="always" clearable input-align="right" placeholder="请输入" :rules="[{ required: true, message: '请输入' }]" />
        <van-field label="性别" name="sex" required input-align="right" label-width="9em">
          <template #input>
            <van-radio-group v-model="lectureForm.sex" direction="horizontal">
              <van-radio name="1">男</van-radio>
              <van-radio name="2">女</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field v-model="lectureForm.mobile" label="手机号码" required name="mobile" clear-trigger="always" clearable input-align="right" placeholder="请输入" :rules="[{ required: true, message: '手机号码不能为空' }, { validator: asyncPhoneValidator, message: '手机号码格式错误！'}]" />
        <van-field v-model="lectureForm.email" label="邮箱" name="email" maxlength="50" clear-trigger="always" clearable input-align="right" placeholder="请输入" :rules="[{ validator: asyncEmailValidator, message: '邮箱格式错误！'}]" />
        <div class="lecture-form-btn">
          <van-button class="record-btn" type="info" native-type="button" :loading="lectureloading" @click.stop="handleLectureConfirm">保存</van-button>
          <van-button class="record-btn" type="info" native-type="button" plain style="margin-left: 1rem; word-break: keep-all;" @click.stop="handleLectureCancel">取消</van-button>
        </div>
      </van-form>
    </van-popup>
  </div>
</template>

<script>

import VerifyFunc from '@/utils/verify'
import { getShellNullParamsApi, getDemandTypeApi, getSourceCascadeApi, getChidlrenLessonApi, infoSetApi } from '@/api/common'
import {
  getActivityMaterialListApi, getActivityOutTeacherListApi, getActivityChargeListApi,
  getActivitytListApi, addActivityLectRegisterApi, editActivityLectRegisterApi,
  addActivityCptLectApi, editActivityCptLectApi, addActivityMarketApi, editActivityMarketApi,
  getActivityLectRegisterDetailApi, getActivityCptLectDetailApi, getActivityMarketDetailApi, activityDelApi,
  getActivityInsideTeacherListApi, addOutLectureApi
} from '@/api/potentialGuest/activity'

import { mapState, mapMutations } from 'vuex'
import dayjs from 'dayjs'
import { Notify, Dialog } from 'vant'
import { commonSchoolInfohandle, transform } from '@/utils'
export default {
  name: 'StudentInfoEdit',
  components: {
    RePick: () => import('@/components/ReComponents/RePick'),
    // ReYear: () => import('@/components/ReComponents/ReYear')
  },
  props: {
  },
  data() {
    return {
      loading: false,
      // 活动，讲座的
      potentialType: 'potential',
      VerifyFunc: VerifyFunc,
      isExpend: true,
      repetitionName: '',
      sId: null,
      // eId: null,
      shellList: [],
      departList: [], // 所属部门
      areaList: [], // 市场区域
      sourceChannelList: [], // 来源渠道
      schoolList: [], // 院校名称
      professionList: [], // 就读院系/专业
      xueLiList: [], // 当前学历
      ziLiaoList: [], // 领用资料
      keChengList: [], // 课程资料
      subjectList: [], // 报考科目
      submitForm: {
        shellId: null, // 部门名称
        collegeInfoId: null, // 院校名称
        title: null, // 活动名称/讲座名称
        sendBookType: null, //活动类型
        address: null, //活动地点
        teacherType: '1', //讲师类型
        lectureType: null, // 讲座类型
        crmSourceChannelId: null, // 来源渠道
        materialId: [], // 资料清单
        courseIds: [], // 课程清单
        teachMethod: '1', // 授课类型
        lecturer: [], //讲师姓名
        studyUrl: null, // 上课链接
        date: dayjs().format('YYYY/MM/DD'), // 讲座日期
        startTime: null, // 讲座开始时间
        endTime: null, // 讲座结束时间
        followPeriod: 7, // 跟进期限
        target: [], // 针对对象
        chargePerson: null, // 负责人
        participantsIds: [], // 参与人员
        bePresentNumber: null, // 到场人数 
        remark: null, // 备注
        opponentId: null, //对手名称
        newStartTime: null,
        newEndTime: null,
        currentDate: null
      },
      opponentOptions: [],//对手名称列表
      oldMobile: null,
      oldQQ: null,
      oldWx: null,
      bg: [],
      activityTypeList: [],
      keyObjList: [],
      lectureTypeListL: [],
      sourceList: [],
      dataList: [], //资料清单
      courseList: [],
      teachMethodList: [
        { label: '网授', text: '网授', value: 1 },
        { label: '面授', text: '面授', value: 2 }
      ],
      teacherTypeList: [
        { label: '内部', text: '内部', value: 1 },
        { label: '外部', text: '外部', value: 2 }
      ],
      teacherOutNameList: [], // 外部讲师姓名
      teacherInsideNameList: [], // 内部讲师姓名
      dateIsShow: false,
      dateTimeIsShow: false,
      timeType: 1, // 1 开始时间 0 结束时间
      timeIsShow: false,
      chargeList: [], //负责人列表
      participantList: [], // 参与人员选项
      imgTypeArr: ['image/jpeg', 'image/jpg', 'image/png'],
      activityType: 1, // 活动类型: 1 讲座登记 2 对手讲座 3 营销活动3
      editId: null,
      activityId: null,
      defaultDate: new Date(),
      minDate: new Date('2000/01/01'),
      lecturerIsShow: false,
      lectureForm: {
        email: '',
        mobile: '',
        name: '',
        sex: '1'
      },
      lectureloading: false,
      collegeInfoIdIsShow: true,
      isLecturerChange: false // 讲师类型是否改变
    }
  },
  async created() {
    this.initList()
    this.handleInitDetail()
  },
  mounted() {
    window.scrollTo(0, 0)
  },
  watch: {
    loading(val) {
      this.$loading(val, 'StudentInfoEdit')
    },
    lecturerIsShow: {
      handler(val) {
        if (val) {
          this.hanleResetLectureForm()
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapState({
      systemId: state => state.common.systems.currentSystem.id,
      schoolTypeList: state => state.common.setting.schoolTypeList,
      isRequireStudent: state => state.common.setting.isRequireStudent,
      allProvicesAndCitys: state => state.common.setting.allProvicesAndCitys,
      examYearText: state => state.common.setting.examYearText,
      isRequireYear: state => state.common.setting.isRequireYear,
      isDetailsEnter: state => state.activity.isDetailsEnter,
    }),
  },
  methods: {
    // 判断保存并关联问卷 1 讲座登记 3 营销活动 2 对手讲座
    checkSavePerminssionStatus(type) {
      if (type == 1) {
        return 'MARKET:SCHOOL:HOME_QUESTION'
      }
      if (type == 3) {
        return 'MARKET:BOOK:HOME_QUESTION'
      }
    },
    // 判断删除权限 1 讲座登记 3 营销活动 2 对手讲座
    checkDelPerminssionStatus(type) {
      if (type == 1) {
        return 'MARKET:BOOK:DEL'
      }
      if (type == 3) {
        return 'MARKET:SCHOOL:LECTURE_DEL'
      } else {
        return 'MARKET:OPPONENT:DEL'
      }
    },
    handleTeach(val) {
      // 判断编辑还是添加
      this.submitForm.lecturer = []
    },
    onOversize() {
      this.$fm('文件大小不能超过1M');
    },
    hanleResetLectureForm() {
      this.lectureForm = {
        email: '',
        mobile: '',
        name: '',
        sex: '1'
      }
      this.$nextTick(() => {
        this.$refs.lectureForm.resetValidation()
      })
    },
    handleAddLecture() {
      this.lecturerIsShow = true
    },
    handleLectureConfirm() {
      this.lectureloading = true
      this.$refs.lectureForm.validate().then(() => {
        addOutLectureApi(this.lectureForm).then((res) => {
          this.lecturerIsShow = false
          this.lectureloading = false
          this.$set(this.submitForm, 'lecturer', [res.data.id])
          this.handleGetOutLectureList()
          this.hanleResetLectureForm()
        }).catch(() => {
          this.lectureloading = false
        })
      }).catch(err => {
        this.lectureloading = false
        let mobile = err.find(v => 'mobile' == v.name)
        if (mobile) {
          this.$fm(`${mobile.message}`)
          return
        }
        let email = err.find(v => "email" == v.name)
        if (email) {
          this.$fm(`${email.message}`)
        }
      })
    },
    handleLectureCancel() {
      this.lecturerIsShow = false
    },
    asyncEmailValidator(val) {
      return new Promise(resolve => {
        if (val && /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(val)) {
          resolve(true)
        } else {
          if (!val) {
            return resolve(true)
          }
          return resolve(false)
        }
      })
    },
    asyncPhoneValidator(val) {
      return new Promise(resolve => {
        if (val && /^1[3456789]\d{9}$/.test(val)) {
          resolve(true)
        } else {
          return resolve(false)
        }
      })
    },
    asyncValidatorPeopleNum(val) {
      return new Promise(resolve => {
        if (val && /^[+]{0,1}(\d+)$/.test(val)) {
          resolve(true)
        } else {
          if (!val) {
            return resolve(true)
          } else {
            return resolve(false)
          }
        }
      })
    },
    // 更新活动列表
    ...mapMutations('activity/', ['SET_ACTIVITYSTATE', 'SET_ACTIVITYADDSTATE']),
    // 处理院校属性
    handleSchoolType(val) {
      this.collegeInfoIdIsShow = val == -1 ? false : true
      this.$set(this.submitForm, 'collegeInfoId', null)
      this.schoolList = []
    },
    handleSet() {
      infoSetApi('DEFAULT_COLLEGE_ATTRIBUTE').then(res => {
        this.$set(this.submitForm, 'attributeId', res.data.value ? Number(res.data.value) : null)
      })
    },

    // 初始化细节
    handleInitDetail() {
      let api = this.activityType == 1 ? getActivityLectRegisterDetailApi : this.activityType == 2 ? getActivityCptLectDetailApi : getActivityMarketDetailApi

      // 编辑
      if (this.activityId !== 'null') {
        api(this.activityId).then(res => {
          this.submitForm = {
            ...this.submitForm,
            ...res.data,
            teachMethod: (res.data.teachMethod || '').toString(),
            teacherType: (res.data.teacherType || '').toString(),
            collegeInfoId: res.data.commonSchoolInfo && commonSchoolInfohandle(res.data.commonSchoolInfo, 'activitySchoolListNot')[0].value,
            // participantsIds: res.data.participantsIds
          }
          // 初始化院校名称
          this.bg = res.data.posterImg ? [{ url: res.data.posterImg }] : []
          if (res.data.commonSchoolInfo) {
            const educationData = commonSchoolInfohandle(res.data.commonSchoolInfo, 'education') // 属性
            const schoolnData = commonSchoolInfohandle(res.data.commonSchoolInfo, 'schoolListNot') // 院校
            // const schoolnData = res.data.commonSchoolInfo && commonSchoolInfohandle(res.data.commonSchoolInfo, 'activitySchoolListNot') // 院校
            this.submitForm.attributeId = educationData.value
            this.schoolList = schoolnData.map(item => {
              return {
                id: item.value,
                title: item.text
              }
            })
          } else {
            // this.handleSet()
          }
          // 初始化对手讲座
          this.handlePartcipantList(res.data.shellId, 1)
          // 设置日期
          let date = dayjs(this.submitForm.startTime).format('YYYY/MM/DD')
          this.defaultDate = new Date(date)
          this.$set(this.submitForm, 'date', date)
          // 设置活动/讲座 开始结束时间
          if ([1, 2].includes(this.activityType)) {
            this.$set(this.submitForm, 'startTime', dayjs(this.submitForm.startTime).format('HH:mm'))
            this.$set(this.submitForm, 'endTime', dayjs(this.submitForm.endTime).format('HH:mm'))
            this.$set(this.submitForm, 'newStartTime', this.submitForm.startTime)
            this.$set(this.submitForm, 'newEndTime', this.submitForm.endTime)
          } else {
            this.$set(this.submitForm, 'startTime', dayjs(this.submitForm.startTime).format('YYYY/MM/DD HH:mm'))
            this.$set(this.submitForm, 'endTime', dayjs(this.submitForm.endTime).format('YYYY/MM/DD HH:mm'))
            this.$set(this.submitForm, 'newStartTime', new Date(this.submitForm.startTime))
            this.$set(this.submitForm, 'newEndTime', new Date(this.submitForm.endTime))
          }

          // 编辑的时候将讲师类型重新赋值
          this.$nextTick(() => {
            this.submitForm.lecturer = res.data.lecturer
          })

        })
      }
      //  添加
      else {
        // 院校初始属性设置
        this.handleSet()
        this.handleInitTime()
      }
    },
    // 初始化时间 
    handleInitTime() {
      // 初始化讲座时间
      if ([1, 2].includes(this.activityType)) {
        this.submitForm.startTime = `00:00`
        this.submitForm.newStartTime = '00:00'
        this.submitForm.endTime = `23:59`
        this.submitForm.newEndTime = '23:59'
      }
      // 初始化活动时间
      else {
        this.submitForm.startTime = `${dayjs().format('YYYY/MM/DD')} 00:00`
        this.submitForm.newStartTime = dayjs().startOf('day').toDate()
        this.submitForm.endTime = `${dayjs().format('YYYY/MM/DD')} 23:59`
        this.submitForm.newEndTime = dayjs().endOf('day').toDate()
        // this.submitForm.newEndTime = val
      }
    },

    handleDel() {
      if (this.submitForm.part || this.submitForm.question) {
        if ([1, 2].includes(this.activityType)) {
          Notify({ type: 'warning', message: '该讲座已有相关用户参与，不能删除!' });
        } else {
          Notify({ type: 'warning', message: '该活动已有相关用户参与，不能删除!' });
        }
      } else {
        Dialog.confirm({
          title: '提示',
          message: '此操作将永久删除, 是否继续?',
        })
          .then(() => {
            activityDelApi(this.activityId).then(() => {
              Notify({ type: 'success', message: '删除成功!' });
              if (this.isDetailsEnter) {
                this.handleBack(-2, 0)
              } else {
                this.handleBack(-1, 0)
              }
            })
          })
      }
    },
    handleFileBeforeRead(file) {
      if (!this.imgTypeArr.includes(file.type)) {
        this.$fm('只能上传图片')
        return false
      }
      return true
    },

    handleDept(val) {
      this.handlePartcipantList(val)
    },

    //  type 0 清空 1 不清空
    handlePartcipantList(id, type) {
      // 参与人可选项/对手名称
      id && getActivityChargeListApi(id).then((res) => {
        this.participantList = res.data || []
        this.chargeList = res.data || []
        if (!type) {
          this.submitForm.chargePerson = null
          this.submitForm.participantsIds = []
        }
      })

      // 对手名称
      id && getActivitytListApi({ shellId: id }).then(res => {
        this.opponentOptions = res.data || []
      })
    },

    handleStartTimeConfirm(val) {
      if ([1, 2].includes(this.activityType)) {
        if (dayjs(`${this.submitForm.date} ${val}`).isSame(dayjs(`${this.submitForm.date} ${this.submitForm.endTime}`)) || dayjs(`${this.submitForm.date} ${val}`).isBefore(dayjs(`${this.submitForm.date} ${this.submitForm.endTime}`))) {
          this.submitForm.startTime = `${val}`
          this.submitForm.newStartTime = val
          this.submitForm.endTime = "23:59"
          this.submitForm.newEndTime = "23:59"
          this.timeIsShow = false
        } else {
          Notify({ type: 'warning', message: `讲座开始时间不能大于讲座结束时间` });
        }
      } else {
        if (dayjs(val).isSame(dayjs(this.submitForm.endTime)) || dayjs(val).isBefore(this.submitForm.endTime)) {
          this.submitForm.startTime = dayjs(val).format('YYYY/MM/DD HH:mm')
          this.submitForm.newStartTime = new Date(this.submitForm.startTime)
          this.submitForm.endTime = dayjs(val).format('YYYY/MM/DD 23:59')
          this.submitForm.newEndTime = new Date(dayjs(val).format('YYYY/MM/DD 23:59'))
          this.timeIsShow = false
        } else {
          Notify({ type: 'warning', message: `活动开始时间不能大于讲座结束时间` });
        }
      }
    },

    handleEndTimeConfirm(val) {
      if ([1, 2].includes(this.activityType)) {
        if (dayjs(`${this.submitForm.date} ${val}`).isSame(dayjs(`${this.submitForm.date} ${this.submitForm.startTime}`)) || dayjs(`${this.submitForm.date} ${val}`).isAfter(dayjs(`${this.submitForm.date} ${this.submitForm.startTime}`))) {
          this.submitForm.endTime = val
          this.submitForm.newEndTime = val
          this.timeIsShow = false
        } else {
          Notify({ type: 'warning', message: `讲座结束时间不能小于讲座开始时间` });
        }
      } else {
        if (dayjs(val).isSame(dayjs(this.submitForm.startTime)) || dayjs(val).isAfter(this.submitForm.startTime)) {
          this.submitForm.newEndTime = val
          this.submitForm.endTime = dayjs(val).format('YYYY/MM/DD HH:mm')
          this.timeIsShow = false
        } else {
          Notify({ type: 'warning', message: `讲座结束时间不能小于讲座开始时间` });
        }
      }
    },

    handleTimeCancel() {
      this.timeIsShow = false
    },

    handleShowStartTime() {
      const { date } = this.submitForm
      if (!date && [1, 2].includes(this.activityType)) {
        Notify({ type: 'warning', message: `请先选择讲座日期` });
      } else {
        this.timeType = 1
        this.timeIsShow = true
      }
    },
    handleShowEndTime() {
      const { startTime } = this.submitForm
      if (!startTime) {
        Notify({ type: 'warning', message: `请先选择${[1, 2].includes(this.activityType) ? '讲座' : '活动'}开始时间` });
      } else {
        this.timeType = 0
        this.timeIsShow = true
      }
    },

    hanldeOnConfirm(val) {
      this.submitForm.date = dayjs(val).format('YYYY/MM/DD')
      this.handleInitTime()
      // this.submitForm.startTime = null
      // this.submitForm.endTime = null
      this.dateIsShow = false
    },

    handleShowDate() {
      this.dateIsShow = true
      // this.defaultDate = new Date('2022/01/08')
      // this.$nextTick(() => {
      //   this.$refs.calendar.reset(new Date('2022/11/10'))
      // })
    },

    handleShowTime() {
      this.dateTimeIsShow = false
    },

    handleSchool() {
    },

    initList() {
      const { id, type } = this.$route.params
      this.activityId = id
      this.activityType = Number(type)
      getShellNullParamsApi().then(res => {
        this.departList = res.data || []
      })

      // 获取活动类型
      getDemandTypeApi('hdlx').then(res => {
        this.activityTypeList = res.data || []
      })

      // 获取针对对象
      getDemandTypeApi('zddx').then(res => {
        this.keyObjList = res.data || []
      })

      // 获取讲座类型
      getDemandTypeApi('jzlx').then(res => {
        this.lectureTypeListL = res.data || []
      })

      // 获取来源渠道
      getSourceCascadeApi('1').then(res => {
        this.sourceList = res.data || []
      })

      // 获取资料清单
      getActivityMaterialListApi().then(res => {
        this.dataList = res.data || []
      })

      // 获取课程清单
      getChidlrenLessonApi(0).then(res => {
        this.courseList = res.data || []
      })

      this.handleGetOutLectureList()

      getActivityInsideTeacherListApi().then(res => {
        this.teacherInsideNameList = res.data || []
      })
    },

    //获取外部讲师姓名讲师姓名
    handleGetOutLectureList() {
      getActivityOutTeacherListApi().then(res => {
        this.teacherOutNameList = res.data.map(item => {
          this.$set(item, 'title', item.title + '-' + item.extendTitle)
          return item
        })
      })
    },

    // type 0 ：添加  1 编辑 3 其他
    handleBack(num = -1, type) {
      setTimeout(() => {
        this.$loading(false, 'activityLoading')
        if (type == 1) {
          this['SET_ACTIVITYSTATE']()
        } else if (type == 0) {
          this['SET_ACTIVITYADDSTATE']()
        }
        this.$router.go(num)
      }, 500);
    },



    handleCancel() {
      this.$loading(true, 'activityLoading')
      this.handleBack(-1, 3)
    },

    //  type: 1 保存 2 保存并且关联问卷
    handleConfirm(type) {
      this.$refs.activityForm.validate().then(() => {
        this.$loading(true, 'activityLoading')
        let addApi = this.activityType == 1 ? addActivityLectRegisterApi : this.activityType == 2 ? addActivityCptLectApi : addActivityMarketApi
        let EditApi = this.activityType == 1 ? editActivityLectRegisterApi : this.activityType == 2 ? editActivityCptLectApi : editActivityMarketApi
        this.submitForm.takePartIn = null
        const {
          shellId, collegeInfoId, title, sendBookType, address, teacherType, lectureType, crmSourceChannelId, materialId, courseIds,
          teachMethod, lecturer, studyUrl, date, startTime, endTime, followPeriod, target, chargePerson, participantsIds, bePresentNumber, remark,
          opponentId, newStartTime, newEndTime, currentDate, takePartIn, posterImg, abbreviation, addDate, creator, updateDate, rivalTeacher, updater
        } = this.submitForm
        // 讲座登记/营销活动
        let submitBackEndData = {
          shellId,
          collegeInfoId,
          title,
          sendBookType,
          address,
          teacherType,
          lectureType,
          crmSourceChannelId,
          materialId,
          courseIds,
          teachMethod,
          lecturer,
          studyUrl,
          date,
          startTime: [1].includes(this.activityType) ? `${date} ${startTime}:00` : `${startTime}:00`,
          endTime: [1].includes(this.activityType) ? `${date} ${endTime}:00` : `${endTime}:00`,
          followPeriod,
          target,
          chargePerson,
          participantsIds,
          bePresentNumber,
          remark,
          opponentId,
          newStartTime,
          newEndTime,
          currentDate,
          takePartIn,
          posterImg,
          schoolSaveId: collegeInfoId
        }

        // 对手讲座
        let competeLectData = {
          abbreviation,
          addDate,
          address,
          bePresentNumber,
          collegeInfoId,
          creator,
          date,
          endTime: `${date} ${endTime}:00`,
          followPeriod,
          lectureType,
          opponentId,
          remark,
          rivalTeacher,
          shellId,
          startTime: `${date} ${startTime}:00`,
          target,
          teachMethod,
          time: [startTime, endTime],
          title,
          updateDate,
          updater,
          schoolSaveId: collegeInfoId
        }

        // 判断到场人数是否是正整数
       
        //  添加
        if (this.activityId == 'null') {
          if ([1, 3].includes(this.activityType)) {
            let formData = new FormData()
            if (this.bg.length && !submitBackEndData.posterImg) {
              formData.append('file', this.bg[0].file)
            } else {
              submitBackEndData.posterImg = null
            }
            formData.append('lecture', new Blob([JSON.stringify(submitBackEndData)], { type: 'application/json' }))
            addApi(formData).then((result) => {
              transform(result.data).then(response => {
                let isSuccess = response.status === 200
                Notify({ type: isSuccess ? 'success' : 'danger', message: isSuccess ? response.data.title : response.msg, });
                if (isSuccess) {
                  if (type == 1) {
                    this.handleBack(-1, 0)
                  } else {
                    this.$loading(false, 'activityLoading')
                    this.$router.push({
                      path: `/QuesConnect/${response.data.id}`,
                      query: {
                        counselTab: this.$route.params.counselTab
                      }
                    })
                  }
                }
                this.$loading(false, 'activityLoading')
              }).catch(() => {
                this.$loading(false, 'activityLoading')
              })
            }).catch(() => {
              this.$loading(false, 'activityLoading')
            })
          } else {
            addApi(competeLectData).then(() => {
              Notify({ type: 'success', message: '添加成功!' });
              this.handleBack(-1, 0)
            }).catch(() => {
              this.$loading(false, 'activityLoading')
            })
          }
        } else {
          //编辑
          submitBackEndData.id = this.submitForm.id
          submitBackEndData.lectureId = this.submitForm.lectureId
          if ([1, 3].includes(this.activityType)) {
            let formData = new FormData()
            if (this.bg.length && !submitBackEndData.posterImg) {
              formData.append('file', this.bg[0].file)
            }
            formData.append('lecture', new Blob([JSON.stringify(submitBackEndData)], { type: 'application/json' }))
            EditApi(formData).then((res) => {
              transform(res.data).then(response => {
                let isSuccess = response.status === 200
                Notify({ type: isSuccess ? 'success' : 'warning', message: isSuccess ? '修改成功' : response.msg });
                if (isSuccess) {
                  this.$loading(false, 'activityLoading')
                  this.handleBack(-1, 1)
                } else {
                  this.$loading(false, 'activityLoading')
                }
              }).catch(() => {
                this.$loading(false, 'activityLoading')
              })
            }).catch(() => {
              this.$loading(false, 'activityLoading')
            })
          } else {
            //编辑
            competeLectData.id = this.submitForm.id
            competeLectData.lectureId = this.submitForm.lectureId
            editActivityCptLectApi(competeLectData).then(() => {
              Notify({ type: 'success', message: '修改成功!' });
              this.handleBack(-1, 1)
            }).catch(() => {
              this.$loading(false, 'activityLoading')
            })
          }
        }
        // this.handleBack()
      }).catch(err => {
        let bePresentNumber = err.find(item => item.name === 'bePresentNumber')
        if (bePresentNumber) {
          this.$fm('到场人数必须是正整数')
          return
        }
        let followPeriod = err.find(item => item.name === 'followPeriod')
        if (followPeriod) {
          this.$fm('跟进期限必须是正整数')
        }
        // if (bePresentNumber && !this.asyncValidatorPeopleNum(bePresentNumber)) this.$fm('到场人数格式错误')
      })
    },

    handleBeforeDel() {
      this.submitForm.posterImg = null
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
::v-deep .activity-common {
  .van-cell__title {
    color: #333333 !important;
  }
  .van-field__control {
    color: #333333 !important;
    -webkit-text-fill-color: #333333 !important;
  }
}
</style>