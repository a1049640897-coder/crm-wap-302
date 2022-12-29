<template>
  <div class="student-info-edit">
    <van-form ref="recordForm" :show-error-message="false" validate-trigger="" :submit-on-enter="false">
      <div class="student-info-edit-title">
        <span>必填信息</span>
      </div>
      <RePick v-if="!sId && !$route.query.onlyReadObj" v-model="listQuery.entity.sysShellId" label="所属分校" :list="shellList" @change="handleSysShellId" isShowSearch isCascader name="sysShellId" childrenKey="child" :disabled="shellList.length === 1 && (!shellList[0].hasChildren || shellList[0].child.length === 1)" isRequrie isCell clearable />
      <van-field v-if="$route.query.onlyReadObj" v-model="$route.query.onlyReadObj.shell" clear-trigger="always" input-align="right" label="所属分校" disabled maxlength="50" placeholder="请输入" />

      <RePick v-if="!sId && roleFlag !== 2" v-model="listQuery.entity.belongSysShellId" label="所属部门" :placeholder="!listQuery.entity.sysShellId ? '请先选择所属分校':'请选择'" :disabled="!listQuery.entity.sysShellId || departList.length === 1" :list="departList" isShowSearch idKey="value" titleKey="text" name="belongSysShellId" isRequrie isCell clearable />
      <RePick v-model="listQuery.entity.crmMarketAreaId" label="市场区域" :placeholder="!listQuery.entity.sysShellId ? '请先选择所属分校': !areaList.length ?'请先补充市场区域':'请选择'" :disabled="!listQuery.entity.sysShellId || !areaList.length || areaList.length === 1" :list="areaList" isShowSearch name="crmMarketAreaId" isRequrie isCell clearable @change="handlemarketAreaSelect" />
      <van-field v-model.trim="listQuery.entity.name" clear-trigger="always" name="name" required clearable input-align="right" label="学生姓名" maxlength="50" placeholder="请输入" :rules="[
        { required: true, message: '请输入' }
      ]" />
      <van-field v-model.trim="listQuery.entity.realName" clear-trigger="always" name="realName" clearable input-align="right" label="真实姓名" maxlength="50" placeholder="请输入" />
      <van-field v-model="listQuery.entity.mobile" :rules="[{ validator: VerifyFunc.poPhone, message: '请输入' }]" @blur="verityHasUser" clear-trigger="always" maxlength="11" clearable input-align="right" type="tel" label="手机号码" name="mobile" placeholder="请输入" />
      <van-field v-model="listQuery.entity.qqNumber" :rules="[{ validator: VerifyFunc.qq, message: '请输入' }]" @blur="verityHasUser" clear-trigger="always" clearable input-align="right" type="tel" label="QQ" maxlength="50" name="qqNumber" placeholder="请输入" />
      <van-field v-model="listQuery.entity.wxNumber" :rules="[{ validator: VerifyFunc.wx, message: '请输入' }]" @blur="verityHasUser" clear-trigger="always" clearable input-align="right" label="微信" maxlength="50" name="wxNumber" placeholder="请输入" />
      <ReYear v-if="!([50].includes(systemId)) && isRequireYear" v-model="listQuery.entity.graduationYear" name="graduationYear" clearable :isRequrie="isRequireYear" title="毕业年份" label="毕业年份" @change="changeGraduationYear" :rules="[{ required: isRequireYear, message: '请选择' }]" />
      <ReYear v-if="!([50].includes(systemId)) && ([70].includes(systemId))" v-model="listQuery.entity.examYear" name="examYear" clearable :isRequrie="[70].includes(systemId)" :title="examYearText" :label="examYearText" />
      <RePick v-if="systemId === 50" v-model="listQuery.entity.education" label="当前学历" :list="xueLiList" name="education" :isRequrie="systemId === 50" idKey="id" titleKey="text" isCell clearable />
      <div v-if="isRequireSchoolId" class="common-mbLine">
        <RePick v-model="listQuery.entity.attributeId" label="院校属性" :list="schoolTypeList" @change="handleSchoolType" name="attributeId" :isRequrie="isRequireSchoolId" isCell clearable />
        <RePick v-model="listQuery.entity.goSchoolId" label="就读学校" :list.sync="schoolList" ref="goSchoolRef" @change="handleSchool" isShowSearch isOriginSchool :originSchoolAttr="listQuery.entity.attributeId" name="goSchoolId" originSchoolType="1" v-if="listQuery.entity.attributeId != -1" :isRequrie="isRequireSchoolId" isCell clearable />
        <RePick v-model="listQuery.entity.majorId" label="院系/专业" :list.sync="professionList" ref="majorRef" @change="handleSchoolAndMajorMarketArea" isShowSearch isOriginSchool :originSchoolAttr="listQuery.entity.goSchoolId" name="majorId" originSchoolType="2" v-if="listQuery.entity.attributeId != -1" :isRequrie="[1].includes(this.systemId)" isCell clearable />
      </div>
      <RePick v-if="!$route.query.onlyReadObj" v-model="listQuery.entity.crmSourceChannelId" label="来源渠道" :list="sourceChannelList" isShowSearch isCascader name="crmSourceChannelId" isRequrie isCell clearable isLastSelect />
      <van-field v-else v-model="$route.query.onlyReadObj.crmSourceChannelName" clear-trigger="always" input-align="right" label="来源渠道" disabled maxlength="50" placeholder="请输入" />

      <div class="student-info-edit-title" @click="handleExpend">
        <span>选填信息</span>
        <div style="vertical-align: middle;">
          <img src="@/assets/images/icons/expend_b.png" :class="{'rotate': isExpend}" alt="">
        </div>
      </div>
      <div v-show="isExpend">
        <van-field label="性别" name="sex" input-align="right">
          <template #input>
            <van-radio-group v-model="listQuery.entity.sex" direction="horizontal">
              <van-radio name="1">男</van-radio>
              <van-radio name="2">女</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <ReYear v-if="!([50].includes(systemId)) && !isRequireYear" v-model="listQuery.entity.graduationYear" name="graduationYear" clearable :isRequrie="isRequireYear" title="毕业年份" label="毕业年份" @change="changeGraduationYear" :rules="[{ required: isRequireYear, message: '请选择' }]" />
        <ReYear v-if="!([50].includes(systemId)) && !([70].includes(systemId))" v-model="listQuery.entity.examYear" name="examYear" clearable :isRequrie="[70].includes(systemId)" :title="examYearText" :label="examYearText" />

        <div v-if="!isRequireSchoolId" class="common-mbLine">
          <RePick v-model="listQuery.entity.attributeId" label="院校属性" :list="schoolTypeList" @change="handleSchoolType" name="attributeId" :isRequrie="isRequireSchoolId" isCell clearable />
          <RePick v-model="listQuery.entity.goSchoolId" label="就读学校" :list.sync="schoolList" ref="goSchoolRef" @change="handleSchool" isShowSearch isOriginSchool :originSchoolAttr="listQuery.entity.attributeId" name="goSchoolId" originSchoolType="1" :isRequrie="isRequireSchoolId" isCell clearable />
          <RePick v-model="listQuery.entity.majorId" label="院系/专业" :list.sync="professionList" ref="majorRef" @change="handleSchoolAndMajorMarketArea" isShowSearch isOriginSchool :originSchoolAttr="listQuery.entity.goSchoolId" name="majorId" originSchoolType="2" :isRequrie="[1].includes(this.systemId)" isCell clearable />
        </div>

        <RePick v-if="systemId !== 50" v-model="listQuery.entity.education" label="当前学历" :list="xueLiList" name="education" :isRequrie="systemId === 50" idKey="id" titleKey="text" isCell clearable />
        <RePick v-model="listQuery.entity.cityId" label="所在城市" :list="allProvicesAndCitys" isShowSearch isCascader name="cityId" titleKey="text" isCell clearable isCascaderAllLevelName />

        <!-- 活动，讲座 -->
        <van-field v-if="['Active', 'Register'].includes(potentialType)" v-model="listQuery.extend.signTeacher" clear-trigger="always" name="signTeacher" clearable input-align="right" label="报名老师" placeholder="请输入" />
        <van-field v-if="['Active', 'Register'].includes(potentialType)" v-model="listQuery.extend.currentCity" clear-trigger="always" name="currentCity" clearable input-align="right" label="当前所在城市" placeholder="请输入" />
        <RePick v-if="['Active'].includes(potentialType)" v-model="listQuery.extend.materialIds" label="领用资料" :list="ziLiaoList" multiple isShowSearch name="materialIds" isCell clearable />
        <RePick v-if="['Active'].includes(potentialType)" v-model="listQuery.extend.courseIds" label="课程资料" :list="keChengList" multiple isShowSearch name="courseIds" isCell clearable />
        <van-field name="switch" v-if="roleFlag != 1" label="是否分配咨询师" input-align="right" label-width="7em">
          <template #input>
            <van-switch v-model="listQuery.entity.isAllowAllot" size="20" />
          </template>
        </van-field>
        <!-- 47网校 + 1聚创 + 62宏医 -->
        <div v-if="[1, 47, 62].includes(systemId)" class="common-mbLine">
          <van-field v-model="listQuery.extend.intentionSchool" clear-trigger="always" name="intentionSchool" clearable input-align="right" label="意向学校" maxlength="50" placeholder="请输入" />
          <van-field v-model="listQuery.extend.intentionCollege" clear-trigger="always" name="intentionCollege" clearable input-align="right" label="意向院系" maxlength="50" placeholder="请输入" />
          <van-field v-model="listQuery.extend.intentionProfession" clear-trigger="always" name="intentionProfession" clearable input-align="right" label="意向专业" maxlength="50" placeholder="请输入" />
        </div>
        <!-- 3教招 + 66资格证 + 74辅导员 + 97学考 -->
        <div v-if="[3, 66, 74, 97].includes(systemId)" class="common-mbLine">
          <van-field label="资格证笔试是否通过" name="writtenPass" input-align="right" label-width="9em">
            <template #input>
              <van-radio-group v-model="listQuery.extend.writtenPass" direction="horizontal">
                <van-radio name="1">是</van-radio>
                <van-radio name="0">否</van-radio>
              </van-radio-group>
            </template>
          </van-field>
          <van-field label="资格证面试是否通过" name="interviewPass" input-align="right" label-width="9em">
            <template #input>
              <van-radio-group v-model="listQuery.extend.interviewPass" direction="horizontal">
                <van-radio name="1">是</van-radio>
                <van-radio name="0">否</van-radio>
              </van-radio-group>
            </template>
          </van-field>
        </div>
        <!-- 22公务员 + 49专升本 + 76聚创专插本 + 77江西聚创专升本 -->
        <div v-if="[76, 77, 22, 49].includes(systemId)" class="common-mbLine">
          <RePick v-model="listQuery.extend.registerSubjectLocal" label="报考科目" :list="subjectList" multiple isShowSearch name="registerSubjectLocal" isCell clearable />
        </div>
        <!-- 公务员 -->
        <div v-if="systemId === 22" class="common-mbLine">
          <van-field v-model="listQuery.extend.registerUnit" clear-trigger="always" name="registerUnit" clearable input-align="right" label="报考单位" maxlength="50" placeholder="请输入" />
          <van-field v-model="listQuery.extend.registerJob" clear-trigger="always" name="registerJob" clearable input-align="right" label="报考职位" maxlength="50" placeholder="请输入" />
        </div>
        <!-- 学历 -->
        <div v-if="systemId === 50" class="common-mbLine">
          <van-field v-model="listQuery.extend.recommender" clear-trigger="always" name="recommender" clearable input-align="right" label="推荐人" maxlength="50" placeholder="请输入" />
        </div>
        <!-- 93宏医医疗 -->
        <div v-if="[93].includes(systemId)" class="common-mbLine">
          <van-field v-model="listQuery.extend.registerUnit" clear-trigger="always" name="registerUnit" clearable input-align="right" label="备考地区" maxlength="50" placeholder="请输入" />
          <RePick v-model="listQuery.extend.registerJob" label="报考岗位专业" :list="consultTypeList" idKey="registerJob" isShowSearch name="registerJob" isCell clearable />
          <!-- <van-field v-model="listQuery.extend.registerJob" clear-trigger="always" name="registerJob" clearable input-align="right" label="报考岗位专业" placeholder="请输入" /> -->
        </div>
        <van-field v-model="listQuery.entity.remark" clear-trigger="always" rows="3" autosize type="textarea" name="remark" clearable input-align="right" label="备注" maxlength="500" show-word-limit placeholder="请输入" />
      </div>
      <div class="student-info-edit-footer">
        <!-- <van-button class="record-btn record-btn-danger" style="margin-right: 1rem;" v-if="eId" @click="handleDel">删除</van-button> -->
        <van-button class="record-btn" type="info" :loading="loading" @click.stop="handleConfirm">保存</van-button>
        <van-button class="record-btn" type="info" :loading="loading" v-if="!sId" style="margin-left: 1rem; word-break: keep-all;" @click.stop="handleConfirmRecord">保存并添加咨询记录</van-button>
        <van-button class="record-btn" type="info" :loading="loading" v-if="!sId" style="margin-left: 1rem; word-break: keep-all;" @click.stop="handleConfirmOrder">保存并新增订单</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { branchUnitTree, getSchoolMarketAreaApi, getRoleMarketAreaApi, sourceCascadeApi, getAcitveMaterialList, getAcitveCourseList, getEnrollSubjectDrop, addClient, editClientApi, getStudentAttrApi } from '@/api/potentialGuest/studentInfoEdit'
import { departmentSeaApi } from '@/api/potentialGuest/consultation'
import { verifyUserApi, detailClientApi } from '@/api/potentialGuest/counselRecord'
import { commonCascadeApi, infoSetApi } from '@/api/common'
import { addPartPoUser } from '@/api/potentialGuest/activity'

import VerifyFunc from '@/utils/verify'
import { commonSchoolInfohandle } from '@/utils'
import { mapState, mapMutations } from 'vuex'
import { Dialog } from 'vant'
import dayjs from 'dayjs'
export default {
  name: 'StudentInfoEdit',
  components: {
    RePick: () => import('@/components/ReComponents/RePick'),
    ReYear: () => import('@/components/ReComponents/ReYear')
  },
  data() {
    return {
      marketRoleFlag: true, // 是否-权限下的市场区域列表
      originalMarketAreaId: null, // 原市场区域选择id
      currentStudentsFlag: false, // 是否在校生
      loading: false,
      // 活动，讲座的
      activityId: null,
      potentialType: 'potential',
      VerifyFunc: VerifyFunc,
      isExpend: true,
      repetitionName: '',
      sId: null,
      // eId: null,
      shellList: [], // 所属分校
      departList: [], // 所属部门
      areaList: [], // 市场区域
      sourceChannelList: [], // 来源渠道
      schoolList: [], // 就读学校
      professionList: [], // 就读院系/专业
      xueLiList: [], // 当前学历
      ziLiaoList: [], // 领用资料
      keChengList: [], // 课程资料
      subjectList: [], // 报考科目
      listQuery: {
        entity: {
          sysShellId: null, // 所属分校
          belongSysShellId: null, // 所属部门
          crmMarketAreaId: null, // 市场区域
          name: null, // 姓名
          realName: null, // 真实姓名
          mobile: null, // 手机号码
          qqNumber: null, // qq
          wxNumber: null, // 微信
          crmSourceChannelId: null, // 来源渠道
          attributeId: null, // 院校属性
          goSchoolId: null, // 就读学校
          majorId: null, // 就读专业
          sex: null, // 性别
          graduationYear: null, // 毕业年份
          education: null, // 当前学历
          examYear: null, // 考试年份
          cityId: null, // 所在城市
          isAllowAllot: true, // 是否分配咨询师
          remark: null
        },
        extend: {
          signTeacher: null, // 报名老师
          currentCity: null, // 当前所在城市
          materialIds: [], // 领用资料
          courseIds: [], // 课程资料
          intentionSchool: null, // 意向学校
          intentionCollege: null, // 意向院系
          intentionProfession: null, // 意向专业
          writtenPass: null, // 资格证笔试是否通过
          interviewPass: null, // 资格证面试是否通过
          registerSubjectLocal: [], // 报考科目 - 本地
          registerSubject: null, // 报考科目
          registerUnit: null, // 报考单位 或 备考地区
          registerJob: null, // 报考职位 或 报考岗位专业
          recommender: null, // 推荐人

        }
      },
      oldMobile: null,
      oldQQ: null,
      oldWx: null
    }
  },
  async created() {
    await this.handleSubject()
    const sId = Number(this.$route.params.sid)
    // const eId = Number(this.$route.params.eid)
    if (!Number.isNaN(sId)) {
      this.sId = sId
      this.handleDetail()
    } else {
      this.handleSet()
    }
    // if (!Number.isNaN(eId)) { this.eId = eId }
    this.handleInitApi()
  },
  mounted() {
    window.scrollTo(0, 0)
  },
  watch: {
    loading(val) {
      this.$loading(val, 'StudentInfoEdit')
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
      consultTypeList: state => state.consultation.registerJobList,
      roleFlag: state => state.common.user.info.roleFlag
    }),
    isRequireSchoolId() { // 判断就读学校是否必填
      // && this.isRequireYear 去除系统年份限制
      if ([1].includes(this.systemId)) return true
      if (this.listQuery.entity.graduationYear && this.isRequireStudent) {
        const currYearStmp = +new Date()
        const currYear = dayjs().format('YYYY')
        const yearStmp = +new Date(currYear + '-06-30')
        if (Number(this.listQuery.entity.graduationYear) > Number(currYear)) {
          return true
        } else if (Number(this.listQuery.entity.graduationYear) === Number(currYear) && currYearStmp <= yearStmp) {
          return true
        }
        return false
      }
      return false
    }
  },
  methods: {
    ...mapMutations('activity', ['SET_PARTACTID', 'SET_PARTUSERUPDATE']),
    handlemarketAreaSelect(val) {
      if (this.marketRoleFlag) this.originalMarketAreaId = val
    },
    async changeGraduationYear(v) {
      if (this.isRequireSchoolId && this.listQuery.entity.goSchoolId === -1) {
        this.listQuery.entity.goSchoolId = null
        this.listQuery.entity.majorId = null
        this.schoolList = []
        this.professionList = []
      }
      if (v) {
        const { data } = await getStudentAttrApi(v)
        this.currentStudentsFlag = data === 1
      } else this.currentStudentsFlag = false
      if (this.currentStudentsFlag) { // 在校生
        const { goSchoolId, majorId } = this.listQuery.entity
        const value = majorId && majorId !== -1 ? majorId : goSchoolId && goSchoolId !== -1 ? goSchoolId : null
        if (value) this.getSchoolMarketArea(value)
      } else {
        this.useGetRoleMarketAreaOption()
      }
    },
    getSchoolMarketArea(schoolId) {
      this.marketRoleFlag = false
      let branchId = null
      if (this.roleFlag !== 2) {
        if (this.listQuery.entity.sysShellId) {
          branchId = this.listQuery.entity.sysShellId
        } else { this.$fm('请先选择所属分校!'); return }
      }
      getSchoolMarketAreaApi(schoolId, branchId).then(res => {
        if (res.data && res.data.length) {
          this.areaList = res.data || []
          const find = this.areaList.find(v => v.id === this.originalMarketAreaId)
          if (find) {
            this.$set(this.listQuery.entity, 'crmMarketAreaId', find.id)
            this.$set(this.listQuery.entity, 'crmMarketAreaText', find.title)
          } else {
            const findMarketAreaId = this.areaList.find(v => v.id === this.listQuery.entity.crmMarketAreaId)
            if (findMarketAreaId) return
            if (res.data.length === 1) {
              this.$nextTick(() => {
                this.$set(this.listQuery.entity, 'crmMarketAreaId', res.data[0].id)
                this.$set(this.listQuery.entity, 'crmMarketAreaText', res.data[0].title)
              })
            } else {
              this.$set(this.listQuery.entity, 'crmMarketAreaId', null)
              this.$set(this.listQuery.entity, 'crmMarketAreaText', '')
            }
          }
        } else {
          if (this.listQuery.entity.goSchoolId !== schoolId) {
            this.getSchoolMarketArea(this.listQuery.entity.goSchoolId)
          } else this.useGetRoleMarketAreaOption()
        }
      })
    },
    // 根据当前用户角色获取市场区域列表(非市场表示需要传所属分校)
    useGetRoleMarketAreaOption() {
      this.marketRoleFlag = true
      const sysShellId = ['Active', 'Register'].includes(this.potentialType) ? this.dataLists ? this.dataLists.shellids : null : this.listQuery.entity.sysShellId ? this.listQuery.entity.sysShellId : null
      if (sysShellId) {
        getRoleMarketAreaApi(sysShellId).then(res => {
          this.areaList = res.data || []
          if (!this.areaList.length) {
            this.$fm('请联系校长助理为你分配市场区域才能正常使用系统相关功能!', 5000)
          }
          if (this.originalMarketAreaId) {
            const index = this.areaList.findIndex(v => v.id === this.originalMarketAreaId)
            if (index !== -1) {
              this.$set(this.listQuery.entity, 'crmMarketAreaId', this.originalMarketAreaId)
            } else {
              this.originalMarketAreaId = null
              this.$set(this.listQuery.entity, 'crmMarketAreaId', null)
              this.$set(this.listQuery.entity, 'crmMarketAreaText', null)
            }
          } else if (res.data.length === 1) {
            this.$nextTick(() => {
              this.$set(this.listQuery.entity, 'crmMarketAreaId', res.data[0].id)
              this.$set(this.listQuery.entity, 'crmMarketAreaText', res.data[0].title)
            })
          } else {
            this.$set(this.listQuery.entity, 'crmMarketAreaId', null)
            this.$set(this.listQuery.entity, 'crmMarketAreaText', null)
          }
        })
      }
    },
    handleDetail() {
      detailClientApi(this.sId).then(res => {
        const { id, sysShellId, belongSysShellId, crmMarketAreaId, crmMarketAreaTitle, name, realName, mobile, qqNumber, wxNumber, crmSourceChannelId, commonSchoolInfo, graduationYear, education, examYear, cityId, isAllowAllot, remark, sex } = res.data
        const extend = res.data || {}
        this.listQuery.entity.id = id
        this.listQuery.entity.sysShellId = sysShellId
        this.handleSysShellId(sysShellId, crmMarketAreaId)
        this.listQuery.entity.belongSysShellId = belongSysShellId
        this.listQuery.entity.crmMarketAreaId = crmMarketAreaId
        this.listQuery.entity.crmMarketAreaTitle = crmMarketAreaTitle
        this.areaList = [{ id: crmMarketAreaId, title: crmMarketAreaTitle }]
        this.listQuery.entity.name = name
        this.listQuery.entity.realName = realName
        this.listQuery.entity.mobile = mobile
        this.listQuery.entity.qqNumber = qqNumber
        this.listQuery.entity.wxNumber = wxNumber
        this.oldMobile = mobile
        this.oldQQ = qqNumber
        this.oldWx = wxNumber
        this.listQuery.entity.sex = sex ? sex.toString() : null
        this.listQuery.entity.crmSourceChannelId = crmSourceChannelId

        // 处理学校
        if (commonSchoolInfo) {
          const facultyIdAndMajor = commonSchoolInfohandle(commonSchoolInfo, 'facultyIdAndMajor') // 专业
          const facultyIdAndMajorList = commonSchoolInfohandle(commonSchoolInfo, 'facultyIdAndMajorList') // 专业
          const educationData = commonSchoolInfohandle(commonSchoolInfo, 'education') // 属性
          const schoolnData = commonSchoolInfohandle(commonSchoolInfo, 'schoolListNot') // 院校
          this.listQuery.entity.attributeId = educationData.value
          this.listQuery.entity.goSchoolId = schoolnData.length ? schoolnData[0].value : null
          this.listQuery.entity.majorId = facultyIdAndMajor.value
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
        this.listQuery.entity.graduationYear = graduationYear
        this.listQuery.entity.education = education
        this.listQuery.entity.examYear = examYear
        this.listQuery.entity.cityId = cityId
        this.listQuery.entity.isAllowAllot = !!isAllowAllot
        this.listQuery.entity.remark = remark

        const registerSubject = extend.registerSubject || ''
        // 处理扩展信息
        this.listQuery.extend = {
          ...extend,
          ...extend.extend,
          materialIds: extend.materialIds || [],
          courseIds: extend.extend || [],
          registerSubjectLocal: registerSubject.split('、').map(item => {
            let subject = this.subjectList.find(el => el.title === item)
            if (subject) return subject.id
            return null
          }).filter(item => item),
          registerSubject: extend.registerSubject
        }
      })
    },

    handleInitApi() {
      // 所属分校

      if (!this.$route.query.onlyReadObj) {
        branchUnitTree().then(res => {
          this.shellList = res.data || []
          if (this.shellList.length === 1 && !this.shellList[0].hasChildren) {
            this.listQuery.entity.sysShellId = this.shellList[0].id
            this.handleSysShellId(this.shellList[0].id)
          } else if (this.shellList.length === 1 && this.shellList[0].child.length === 1) {
            this.listQuery.entity.sysShellId = this.shellList[0].child[0].id
            this.handleSysShellId(this.shellList[0].child[0].id)
          }
        })
      } else {
        const { shellId } = this.$route.query.onlyReadObj
        this.listQuery.entity.sysShellId = shellId
        this.handleSysShellId(shellId)
      }


      // 获取来源级联
      sourceCascadeApi(1).then(res => {
        this.sourceChannelList = res.data || []
      })

      // 学历信息
      commonCascadeApi('xl').then(res => {
        this.xueLiList = res.data || []
      })

      if (this.activityId) {
        // 领用资料
        getAcitveMaterialList(this.activityId).then(res => {
          this.options = res.data || []
        })

        // 课程资料
        getAcitveCourseList(this.activityId).then(res => {
          this.courseList = res.data || []
        })
      }
    },

    async handleSubject() {
      await getEnrollSubjectDrop().then(res => { // 科目可选项
        this.subjectList = res.data || []
      })
    },


    // 院校初始属性设置
    handleSet() {
      infoSetApi('DEFAULT_COLLEGE_ATTRIBUTE').then(res => {
        this.listQuery.entity.attributeId = res.data.value ? Number(res.data.value) : null
      })
    },

    handleSysShellId(e, crmMarketAreaId = null) {
      this.listQuery.entity.belongSysShellId = null
      this.departList = []
      if (crmMarketAreaId) {
        this.listQuery.entity.crmMarketAreaId = crmMarketAreaId
      } else {
        this.listQuery.entity.crmMarketAreaId = null
        this.areaList = []
      }
      if (e) {
        this.listQuery.entity.belongSysShellId = ''
        if (this.listQuery.entity.sysShellId) {
          departmentSeaApi(this.listQuery.entity.sysShellId).then(res => {
            this.departList = res.data || []
            if (res.data.length === 1) {
              this.listQuery.entity.belongSysShellId = res.data[0].value
            }
          })
        }
        if (crmMarketAreaId) return
        if (this.currentStudentsFlag) { // 在校生
          const { goSchoolId, majorId } = this.listQuery.entity
          const value = majorId && majorId !== -1 ? majorId : goSchoolId && goSchoolId !== -1 ? goSchoolId : null
          if (value) this.getSchoolMarketArea(value)
          else {
            this.useGetRoleMarketAreaOption()
          }
        } else this.useGetRoleMarketAreaOption()
      } else {
        this.departList = []
        this.listQuery.entity.belongSysShellId = null
        this.areaList = []
      }
    },

    // 校验是否存在
    verityHasUser() {
      if (this.loading) return
      const { mobile, wxNumber, qqNumber } = this.listQuery.entity
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
            this.isHasUser = true
            this.repetitionName = res.data.userStr
            Dialog.confirm({
              title: '温馨提示',
              message: res.data.userStr,
              confirmButtonText: '查看档案',
              showConfirmButton: !!res.data.id,
              beforeClose: (action, done) => {
                if (action === 'confirm') {
                  done()
                  this.$router.go(-1)
                  setTimeout(() => {
                    this.$router.push({
                      path: `/studentinfo/${res.data.id}/null`
                    })
                  }, 300);
                } else {
                  done()
                  this.$router.go(-1)
                }
              }
            })
          } else {
            this.isHasUser = false
          }
        }).finally(() => {
          this.loading = false
        })
      }
    },
    setSchoolMajor(obj, type) {
      if (type === 0) {
        this.listQuery.entity.attributeId = obj ? obj.value : null
        this.listQuery.entity.goSchoolId = null
        this.listQuery.entity.majorId = null
        this.schoolList = []
        this.professionList = []

        if (obj.value === -1) {
          this.$set(this.listQuery.entity, 'crmMarketAreaId', null)
          this.$set(this.listQuery.entity, 'crmMarketAreaText', '')
          this.useGetRoleMarketAreaOption()
        }
      } else if (type === 1) {
        this.listQuery.entity.goSchoolId = obj ? obj.value : null
        this.listQuery.entity.majorId = null
        this.professionList = []
      } else if (type === 2) {
        this.listQuery.entity.majorId = obj ? obj.value : null
      }
      if ([1, 2].includes(type) && this.currentStudentsFlag) {
        const { majorId, goSchoolId } = this.listQuery.entity
        const value = majorId && majorId !== -1 ? majorId : goSchoolId && goSchoolId !== -1 ? goSchoolId : null
        if (value) {
          this.getSchoolMarketArea(value)
        } else {
          this.useGetRoleMarketAreaOption()
        }
      }
    },

    // 处理就读学校属性
    handleSchoolType(val) {
      this.$refs.goSchoolRef.handleSearchClear()
      this.$set(this.listQuery.entity, 'goSchoolId', null)
      this.schoolList = []
      this.handleSchool()
      if (val === -1) {
        this.$set(this.listQuery.entity, 'crmMarketAreaId', null)
        this.$set(this.listQuery.entity, 'crmMarketAreaText', '')
        this.useGetRoleMarketAreaOption()
      }
    },
    handleSchool(e) {
      if (!e) {
        this.$refs.majorRef.handleSearchClear(true)
      }
      this.$set(this.listQuery.entity, 'majorId', null)
      this.professionList = []
      this.handleSchoolAndMajorMarketArea()
    },
    handleSchoolAndMajorMarketArea() {
      if (this.currentStudentsFlag) {
        const { majorId, goSchoolId } = this.listQuery.entity
        const value = majorId && majorId !== -1 ? majorId : goSchoolId && goSchoolId !== -1 ? goSchoolId : null
        if (value) {
          this.getSchoolMarketArea(value)
        } else {
          this.useGetRoleMarketAreaOption()
        }
      }
    },
    handleStudentSave() {
      if (this.loading) return
      return new Promise(resolve => {
        let isHasUser = this.isHasUser
        if (this.oldMobile === this.listQuery.entity.mobile && this.oldQQ === this.listQuery.entity.qqNumber && this.oldWx === this.listQuery.entity.wxNumber) {
          isHasUser = false
        }
        if (!this.listQuery.entity.mobile && !this.listQuery.entity.qqNumber && !this.listQuery.entity.wxNumber) {
          return this.$fm('手机号、QQ号、微信号必须填写一个')
        } else if (isHasUser) {
          return this.$fm(this.repetitionName)
        }
        this.$refs.recordForm.validate().then(() => {
          this.loading = true
          const { entity, extend } = this.listQuery
          let form = {
            entity: { ...entity },
            extend: { ...extend }
          }
          if (form.entity.attendSchool === -1) {
            form.entity.attendSchool = null
          }
          if (form.entity.education === -1) {
            form.entity.schoolSaveId = null
            form.entity.education = null
          } else if (!form.entity.majorId || form.entity.majorId === -1) {
            form.entity.schoolSaveId = form.entity.goSchoolId || null
          } else form.entity.schoolSaveId = form.entity.majorId

          form.entity.isAllowAllot = form.entity.isAllowAllot ? 1 : 0
          if (form.extend.registerSubjectLocal) {
            form.extend.registerSubject = this.subjectList.filter(item => {
              return form.extend.registerSubjectLocal.includes(item.id)
            }).map(item => item.title).join('、')
          }
          if (this.sId) {
            editClientApi(form).then(res => {
              this.$sm(res.data.title)
              this.loading = false

              // 参与人员编辑
              // if (this.$route.query.flag) {
              //   this['SET_PARTACTID']({ activityPartId: this.sId })
              // }
              this.handleBack()
            }).catch(() => {
              this.loading = false
            })
          } else {
            verifyUserApi({ mobile: form.entity.mobile, wxNumber: form.entity.wxNumber, qqNumber: form.entity.qqNumber }).then(verRes => {
              if (verRes.data.success) {
                this.$fm(verRes.data.userStr)
              } else {
                // 当是活动或讲座登记，添加用户的时候用
                if (['Active', 'Register'].includes(this.potentialType)) {
                  this.loading = false
                  // 向上更新
                } else if (this.potentialType === 'potential') {
                  // 参与人员添加潜在用户
                  const { sid } = this.$route.query
                  if (sid) {
                    addPartPoUser(form, sid).then(res => {
                      console.log('添加参与人员中....');
                      this['SET_PARTUSERUPDATE']({ activityPartIsUpdate: true })
                      this.$sm(res.data.title)
                      resolve(res.data)
                    }).catch(() => {
                      this.loading = false
                    })
                  } else {
                    addClient(form).then(res => {
                      this.$sm(res.data.title)
                      resolve(res.data)
                    }).catch(() => {
                      this.loading = false
                    })
                  }
                }
              }
            }).catch(() => {
              this.loading = false
            })
          }
        }).catch(err => {
          let mobile = err.find(item => item.name === 'mobile')
          if (mobile && !VerifyFunc.poPhone(mobile)) this.$fm('手机号码格式错误')
          let qqNumber = err.find(item => item.name === 'qqNumber')
          if (qqNumber && !VerifyFunc.poPhone(qqNumber)) this.$fm('qq格式错误')
          let wxNumber = err.find(item => item.name === 'wxNumber')
          if (wxNumber && !VerifyFunc.poPhone(wxNumber)) this.$fm('微信格式错误')
        })
      })
    },

    handleExpend() {
      this.isExpend = !this.isExpend
    },
    handleConfirm() {
      this.handleStudentSave().then(() => {
        this.loading = false
        this.handleBack()
      })
    },
    // 保存并添加咨询记录
    handleConfirmRecord() {
      this.handleStudentSave().then(res => {
        this.loading = false
        setTimeout(() => {
          console.log('sssss', this.$route.query.onlyReadObj);
          if (this.$route.query.onlyReadObj) {
            //  回退到参与人员标识
            this.$router.push({
              path: `/counselrecord/${res.id}/null`,
              query: {
                isComeFrom: 'actPart'
              }
            })
          } else {
            this.$router.push({
              path: `/counselrecord/${res.id}/null`,
            })
          }
        }, 2000)
      })
    },
    // 保存并新增订单
    handleConfirmOrder() {

    },
    handleBack() {
      setTimeout(() => {
        this.$router.go(-1)
      }, 2000)
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>