<template>
  <div class="cousel-record">
    <van-form ref="recordForm" :show-error-message="false" validate-trigger="" :submit-on-enter="false">
      <div class="cousel-record-title">
        <span>咨询记录</span>
      </div>
      <RePick v-model="listQuery.sysShellId" v-if="!isBelong && roleFlag !== 2" label="所属部门" :list="departList" :disabled="departList.length === 1" name="sysShellId" idKey="value" titleKey="text" isRequrie isCell clearable />
      <RePick v-model="listQuery.intention" label="意向类型" :list="intentionTypeList" name="intention" isRequrie isCell clearable />
      <RePick v-model="listQuery.coursesLocal" label="意向班型" :list="intentionClassList" name="intention" isShowSearch multiple isCell clearable />
      <van-field v-model="listQuery.content" clear-trigger="always" clearable input-align="right" rows="3" autosize type="textarea" label="咨询内容" placeholder="请输入" />
      <van-field clearable label="上传图片">
        <template #input>
          <van-uploader v-model="fileList" :max-count="9" :before-read="handleFileBeforeRead" :before-delete="handleDeleteFile" :max-size="5120 * 1024" @oversize="onOversize" />
        </template>
      </van-field>
      <van-field readonly name="calendar" input-align="right" :required="isRequireNextVisit" :value="listQuery.nextConsultTime" :rules="[{ required: isRequireNextVisit, message: '请选择下次回访' }]" label="下次回访" placeholder="请选择" @click="showCalendar = true">
        <template #button>
          <van-icon v-if="listQuery.nextConsultTime" name="clear" color="#C8C9CC" size="16" @click.stop="handleDateClear" />
          <van-icon v-else name="arrow" color="#C8C9CC" size="16" />
        </template>
      </van-field>
      <RePick v-model="listQuery.consultType" label="咨询方式" :list="consultTypeList" name="consultType" isRequrie isCell clearable />
      <van-field v-model="listQuery.consultSite" clear-trigger="always" clearable input-align="right" label="咨询地点" maxlength="50" placeholder="请输入" />
      <div class="cousel-record-title" @click="handleExpend">
        <span>用户信息</span>
        <div style="vertical-align: middle;">
          <img src="@/assets/images/icons/expend_b.png" :class="{'rotate': isExpend}" alt="">
        </div>
      </div>
      <div v-show="isExpend">
        <van-field v-model.trim="studentInfo.name" name="name" required clear-trigger="always" clearable input-align="right" label="学生姓名" maxlength="50" placeholder="请输入" :rules="[
          { required: true, message: '请输入学生姓名' }
        ]" />
        <van-field v-model="studentInfo.mobile" :disabled="!studentInfo.enable" clear-trigger="always" :rules="[{ validator: VerifyFunc.poPhone, message: '请输入' }]" @change="verityHasUser" maxlength="11" name="mobile" :clearable="studentInfo.enable" input-align="right" type="tel" label="手机号码" placeholder="请输入" />
        <van-field v-model="studentInfo.qqNumber" :disabled="!studentInfo.enable" clear-trigger="always" :rules="[{ validator: VerifyFunc.qq, message: '请输入' }]" @change="verityHasUser" maxlength="50" name="qqNumber" :clearable="studentInfo.enable" input-align="right" type="tel" label="QQ" placeholder="请输入" />
        <van-field v-model="studentInfo.wxNumber" :disabled="!studentInfo.enable" clear-trigger="always" :rules="[{ validator: VerifyFunc.wx, message: '请输入' }]" @change="verityHasUser" maxlength="50" name="wxNumber" :clearable="studentInfo.enable" input-align="right" label="微信" placeholder="请输入" />
        <ReYear v-model="studentInfo.graduationYear" name="graduationYear" clearable :isRequrie="[47].includes(currentSystemId) ? true : isRequireYear" title="毕业年份" label="毕业年份" />
        <ReYear v-model="studentInfo.examYear" name="examYear" clearable :isRequrie="[47].includes(currentSystemId)" :title="examYearText" :label="examYearText" />
        <RePick v-model="studentInfo.attributeId" label="院校属性" :list="schoolTypeList" @change="handleSchoolType" name="attributeId" :isRequrie="isRequireSchoolId" isCell clearable />
        <RePick v-model="studentInfo.schoolValue" label="就读学校" :list.sync="schoolList" @change="handleSchool" v-if="studentInfo.attributeId !== -1" isShowSearch isOriginSchool :originSchoolAttr="studentInfo.attributeId" name="schoolValue" originSchoolType="1" :isRequrie="isRequireSchoolId" isCell clearable />
        <RePick v-model="studentInfo.majorValue" label="就读专业" :list.sync="professionList" v-if="studentInfo.attributeId !== -1" isShowSearch isOriginSchool :originSchoolAttr="studentInfo.schoolValue" name="majorValue" originSchoolType="2" :isRequrie="[1].includes(currentSystemId)" isCell clearable />
        <RePick v-model="studentInfo.cityClassList" label="所在城市" :list="allProvicesAndCitys" isShowSearch isCascader name="cityClassList" titleKey="text" isCell clearable isCascaderAllLevelName />
      </div>
      <!-- <RePick v-model="studentInfo.graduationYear" label="毕业年份" :list="graduationList" titleKey="text" idKey="value" isCell clearable /> -->

      <div class="cousel-record-footer">
        <van-button class="record-btn record-btn-danger" style="margin-right: 1rem;" :loading="loading" v-if="eId" @click="handleDel">删除</van-button>
        <van-button class="record-btn" type="info" @click.stop="handleConfirm" :loading="loading">确认</van-button>
      </div>
    </van-form>
    <van-calendar v-model="showCalendar" @confirm="handleDateConfirm" :default-date="defaultDate" :show-title="false" color="#0088FE" />
  </div>
</template>

<script>
import { departmentSeaApi } from '@/api/potentialGuest/consultation'
import { detailClientApi, intentionTypeListApi, shellCoursePacketListApi, verifyUserApi, editClient, addConsultRecord, editConsultRecord, uploadRecordFile, getConsultRecordDetailApi, delRecordFile, deleteRecordApi } from '@/api/potentialGuest/counselRecord'
import { getDemandType, infoSetApi } from '@/api/common'
import { debounceFun, commonSchoolInfohandle } from '@/utils'
import VerifyFunc from '@/utils/verify'
import { mapState } from 'vuex'
import { Dialog } from 'vant'
import dayjs from 'dayjs'
export default {
  name: 'CounselRecord',
  components: {
    RePick: () => import('@/components/ReComponents/RePick'),
    ReYear: () => import('@/components/ReComponents/ReYear')
  },
  data() {
    return {
      loading: false,
      isExpend: true,
      VerifyFunc: VerifyFunc,
      imgTypeArr: ['image/jpeg', 'image/jpg', 'image/png'],
      isHasUser: false,
      showCalendar: false,
      showGraduateCalendar: false,
      isBelong: false,
      dateLocal: null,
      sId: null,
      eId: null,
      reserveId: null,
      studentInfo: {
        graduationYear: null,
        getExamYearStr: null,
        cityClassList: null,
        attributeId: null,
        schoolValue: null,
        majorValue: null
      },
      departList: [], // 所属部门
      intentionTypeList: [], // 意向类型
      intentionClassList: [], // 意向班型
      consultTypeList: [], // 咨询方式
      listQuery: {
        sysShellId: null,
        intention: null,
        courses: [],
        coursesLocal: [],
        content: '',
        nextConsultTime: '',
        consultType: null,
        consultSite: '',
      },
      fileList: [],
      schoolList: [], // 就读学校使用
      professionList: [], // 就读专业使用
      // ----------校验使用
      standbyObj: {},
      repetitionName: '',
      defaultDate: null,
      oldMobile: null,
      oldQQ: null,
      oldWx: null,
      // 咨询记录的部门id
      sysShellId: null
    }
  },
  computed: {
    ...mapState({
      currentSystemId: state => state.common.systems.currentSystem.id,
      highIntention: state => state.common.setting.highIntention,
      roleFlag: state => state.common.user.info.roleFlag,
      graduationList: state => state.consultation.queryList.graduationList,
      allProvicesAndCitys: state => state.common.setting.allProvicesAndCitys,
      schoolTypeList: state => state.common.setting.schoolTypeList,
      examYearText: state => state.common.setting.examYearText,
      isRequireStudent: state => state.common.setting.isRequireStudent,
      isRequireYear: state => state.common.setting.isRequireYear,

    }),
    isRequireNextVisit() {
      if (this.listQuery.intention && this.highIntention.includes(this.listQuery.intention)) {
        return true
      }
      return false
    },
    isRequireSchoolId() { // 判断就读学校是否必填
      if ([1].includes(this.currentSystemId)) return true
      if (this.studentInfo.graduationYear && this.isRequireStudent) {
        const currYearStmp = +new Date()
        const currYear = dayjs().format('YYYY')
        const yearStmp = +new Date(currYear + '-06-30')
        if (Number(this.studentInfo.graduationYear) > Number(currYear)) {
          return true
        } else if (Number(this.studentInfo.graduationYear) === Number(currYear) && currYearStmp <= yearStmp) {
          return true
        }
        return false
      }
      return false
    }
  },
  watch: {
    loading(val) {
      this.$loading(val, 'CounselRecord')
    }
  },
  created() {
    let sId = Number(this.$route.params.sid)
    let eId = Number(this.$route.params.eid)
    document.title = eId ? '编辑咨询记录' : '添加咨询记录'
    let reserveId = Number(this.$route.query.reserveId)
    if (!Number.isNaN(sId)) { this.sId = sId }
    if (!Number.isNaN(eId)) { this.eId = eId }
    if (!Number.isNaN(reserveId)) { this.reserveId = reserveId }
    this.handleInit()
  },
  mounted() {
    window.scrollTo(0, 0)
  },
  methods: {
    handleInit() {
      this.listQuery.crmPotentialStudentId = this.sId
      this.listQuery.reserveId = this.reserveId
      if (this.sId) {
        this.handleDetail()
      }
      if (this.eId) {
        this.handleCounselDetail()
      }
    },
    onOversize() {
      return this.$fm('图片大小不能超过 5M')
    },
    handleExpend() {
      this.isExpend = !this.isExpend
    },

    handleCounselDetail() {
      getConsultRecordDetailApi(this.eId).then(res => {
        this.listQuery = {
          ...res.data,
          coursesLocal: res.data.courses.map(item => item.id)
        }
        if (res.data.imgList) {
          this.fileList = [...res.data.imgList.map(item => {
            return {
              id: item.id,
              url: item.title
            }
          })]
        }
        if (res.data.nextConsultTime) {
          this.defaultDate = dayjs(res.data.nextConsultTime).toDate()
        }
      })
    },

    handleDetail() {
      this.loading = true
      detailClientApi(this.sId).then(res => {
        this.standbyObj = {
          mobile: res.data.mobile,
          qqNumber: res.data.qqNumber,
          wxNumber: res.data.wxNumber
        }

        this.oldMobile = res.data.mobile
        this.oldQQ = res.data.qqNumber
        this.oldWx = res.data.wxNumber
        this.studentInfo = {
          ...res.data,
          ...this.standbyObj,
          graduationYear: res.data.graduationYear ? Number(res.data.graduationYear) : null,
          examYear: res.data.examYear ? Number(res.data.examYear) : null,
          cityClassList: res.data.cityId
        }
        this.isBelong = res.data.isBelong
        if (!this.eId && this.studentInfo.consultRecordList && this.studentInfo.consultRecordList.length && this.studentInfo.consultRecordList[0].courses && this.studentInfo.consultRecordList[0].courses.length) {
          this.listQuery.coursesLocal = this.studentInfo.consultRecordList[0].courses.map(item => item.id)
        }
        if (this.studentInfo.commonSchoolInfo) {
          const facultyIdAndMajor = commonSchoolInfohandle(this.studentInfo.commonSchoolInfo, 'facultyIdAndMajor') // 专业
          const facultyIdAndMajorList = commonSchoolInfohandle(this.studentInfo.commonSchoolInfo, 'facultyIdAndMajorList') // 专业
          const educationData = commonSchoolInfohandle(this.studentInfo.commonSchoolInfo, 'education') // 属性
          const schoolnData = commonSchoolInfohandle(this.studentInfo.commonSchoolInfo, 'schoolListNot') // 院校
          this.$set(this.studentInfo, 'attributeId', educationData.value)
          this.$set(this.studentInfo, 'schoolValue', schoolnData.length ? schoolnData[0].value : null)
          this.$set(this.studentInfo, 'majorValue', facultyIdAndMajor.value)
          this.schoolList = schoolnData.map(item => {
            return {
              id: item.value,
              title: item.text
            }
          })
          this.professionList = facultyIdAndMajorList.map(item => {
            return {
              id: item.value,
              title: item.text
            }
          })
        }
        this.handleApiInit()
        if (!this.studentInfo.attributeId) {
          // 院校初始属性设置
          infoSetApi('DEFAULT_COLLEGE_ATTRIBUTE').then(res => {
            this.$set(this.studentInfo, 'attributeId', res.data.value ? Number(res.data.value) : null)
          })
        }
        // 咨询记录的部门id
        this.sysShellId = res.data.sysShellId
      }).catch(() => {
        this.loading = false
      })
    },
    handleApiInit() {
      departmentSeaApi(this.studentInfo.branchId).then(res => {
        this.departList = res.data || []
        if (this.departList.length === 1 && !this.eId) {
          this.listQuery.sysShellId = this.departList[0].value
        }
        if (this.departList.length) {
          // 咨询记录的部门id
          this.listQuery.sysShellId = this.sysShellId
        }
      })

      intentionTypeListApi().then(res => {
        if (res.data) {
          res.data.forEach(item => {
            item.title = item.title1 + '-' + item.title3
          })
          this.intentionTypeList = res.data
        }
      })

      shellCoursePacketListApi({ crmPotentialStudentId: this.sId }).then(res => {
        this.intentionClassList = res.data || []
        const intentionClassListIds = this.intentionClassList.map(item => item.id)
        if (this.listQuery.coursesLocal.length) {
          const list = this.listQuery.courses.filter(item => !intentionClassListIds.includes(item.id)).map(item => {
            return {
              ...item,
              disabled: true
            }
          })
          this.intentionClassList = this.intentionClassList.concat(list)
        }
      }).finally(() => {
        this.loading = false
      })

      getDemandType('zxlx').then(res => {
        this.consultTypeList = res.data || []
      })

    },

    handleFileBeforeRead(file) {
      return new Promise((resolve, reject) => {
        if (!this.imgTypeArr.includes(file.type)) {
          this.$fm('只能上传图片')
          reject(false)
        } else {
          this.$compressFile(file).then(res => {
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        }
      })
    },

    handleDateConfirm(e) {
      this.showCalendar = false
      this.listQuery.nextConsultTime = dayjs(e).format('YYYY/MM/DD')
    },
    handleDateClear() {
      this.listQuery.nextConsultTime = null
    },
    handleGraduateClear() {
      this.studentInfo.graduationYear = ''
    },
    verityHasUser: debounceFun(function () { // 校验学生是否重复（手机、微信、QQ有修改时才调接口判断）
      if (this.loading) return
      const { mobile, wxNumber, qqNumber } = this.studentInfo
      let newMobile, newQQ, newWx;
      if (mobile) {
        if (!VerifyFunc.poPhone(mobile)) return
        if (this.oldMobile !== mobile) {
          newMobile = mobile
        }
      }
      if (qqNumber) {
        if (!VerifyFunc.qq(qqNumber)) return
        if (this.oldQQ !== qqNumber) {
          newQQ = qqNumber
        }
      }
      if (wxNumber) {
        if (!VerifyFunc.wx(wxNumber)) return
        if (this.oldWx !== wxNumber) {
          newWx = wxNumber
        }
      }

      if (newMobile || newQQ || newWx) {
        this.repetitionName = null
        this.loading = true
        verifyUserApi({ mobile: newMobile, qqNumber: newQQ, wxNumber: newWx }).then(res => {
          if (res.data.success) {
            this.repetitionName = res.data.userStr
            this.$fm(`该学员已存在，无需重复添加，请联系“${this.repetitionName}”`)
            this.isHasUser = true
          } else {
            this.isHasUser = false
          }
        }).finally(() => {
          this.loading = false
        })
      } else {
        this.isHasUser = false
      }
    }, 300, false),
    handleConfirm() {
      if (this.loading) return
      this.$refs.recordForm.validate().then(() => {
        let isHasUser = this.isHasUser
        if (((this.oldMobile === this.studentInfo.mobile) || !this.studentInfo.mobile) && ((this.oldQQ === this.studentInfo.qqNumber) || !this.studentInfo.qqNumber) && ((this.oldWx === this.studentInfo.wxNumber) || !this.studentInfo.wxNumber)) {
          isHasUser = false
        }
        if (!this.studentInfo.mobile && !this.studentInfo.qqNumber && !this.studentInfo.wxNumber) {
          return this.$fm('手机号、QQ号、微信号必须填写一个')
        } else if (isHasUser) {
          return this.$fm(`该学员已存在，无需重复添加，请联系“${this.repetitionName}”`)
        } else if (!this.fileList.length && !this.listQuery.content) {
          return this.$fm('咨询内容和图片必填一项')
        }
        this.loading = true
        const objs = { extend: { ...this.studentInfo.extend }, entity: { ...this.studentInfo } }
        delete objs.entity.extend
        if (objs.entity.attributeId === -1) {
          objs.entity.schoolSaveId = null
        }
        if (objs.entity.majorValue && objs.entity.majorValue !== -1) {
          objs.entity.schoolSaveId = objs.entity.majorValue
        } else {
          objs.entity.schoolSaveId = objs.entity.schoolValue
        }
        delete objs.entity.attributeId
        if (objs.entity.attendSchool === -1) {
          objs.entity.attendSchool = null
        }

        editClient(objs).then(res => {
          if (res.status === 200) {
            this.saveRecord()
          } else {
            this.$fm(res.msg)
          }
        }).catch(() => {
          this.loading = false
        })
      })
    },
    handleDeleteFile(e) {
      return new Promise((resolve, reject) => {
        if (e.id) {
          Dialog.confirm({
            title: '提示',
            message: '删除后图片不可恢复，您确定要删除图片吗？',
            beforeClose: (action, done) => {
              if (action === 'confirm') {
                this.$loading(true)
                delRecordFile(e.id).then(res => {
                  this.$sm(res.data)
                  resolve(true)
                  done()
                }).finally(() => {
                  this.$loading(false)
                })
              } else {
                reject(false)
                done()
              }

            }
          })
        } else {
          resolve(true)
        }
      })
    },
    saveRecord() {
      let newArr = this.intentionClassList.filter(item => {
        return this.listQuery.coursesLocal.includes(item.id)
      })
      this.listQuery.courses = newArr
      let formData = new FormData()
      let imageArr = []
      if (this.fileList.length) {
        imageArr = this.fileList.filter(e => e.file)
        imageArr.forEach(item => {
          formData.append('imgList', item.file)
        })
      }
      if (this.eId) {
        editConsultRecord(this.listQuery).then(res => {
          if (res.status !== 200) return
          if (imageArr.length) {
            this.handleImageUp(res.data.id, formData)
          } else {
            this.$sm('修改成功！')
            this.loading = false
            this.handleBack()
          }
        }).catch(() => {
          this.loading = false
        })
      } else {
        addConsultRecord(this.listQuery).then(res => {
          if (res.status !== 200) {
            this.$sm(res.data.title)
            return
          }
          if (this.fileList.length) {
            this.handleImageUp(res.data.id, formData, res.data.title)
          } else {
            this.$sm(res.data.title)
            this.loading = false
            this.handleBack()
          }
        }).finally(() => (this.btnLoading = false))
      }
    },
    handleImageUp(id, formData, msgTitle) {
      uploadRecordFile(id, formData).then(() => {
        this.$sm(msgTitle)
        this.handleBack()
      }).catch(() => {
        this.$fm('图片未上传成功')
      }).finally(() => {
        this.loading = false
      })
    },
    handleSchoolType() {
      this.$set(this.studentInfo, 'schoolValue', null)
      this.schoolList = []
      this.$set(this.studentInfo, 'majorValue', null)
      this.professionList = []
    },
    handleSchool() {
      this.$set(this.studentInfo, 'majorValue', null)
      this.professionList = []
    },
    handleDel() {
      Dialog.confirm({
        title: '提示',
        message: '此操作将永久删除该记录, 是否继续?',
        beforeClose: (action, done) => {
          if (action === 'confirm') {
            this.$loading(true)
            deleteRecordApi(this.eId).then(res => {
              this.$sm(res.data)
              done()
              this.handleBack()
            }).finally(() => {
              this.$loading(false)
            })
          } else {
            done()
          }

        }
      })
    },
    handleBack(num = -1) {
      // setTimeout(() => {
      if (this.$route.query.isComeFrom === 'actPart') {
        this.$router.go(-2)
      } else {
        this.$router.go(num)
      }
      // }, 2000);
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
