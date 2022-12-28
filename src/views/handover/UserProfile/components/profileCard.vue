<template>
  <div class="student-info common-list-contain" style="padding-top: 0;padding-bottom: 0;">
    <!-- 1 姓名 -->
    <div class="student-name">{{studentData.name}}
      <img v-permission="'HO:OVERSTU:CHANGEST'" v-if="activeOn == 0 && $route.params.type == 1 && !['1','3'].includes($route.params.type.handoverState)" @click="handleReplaceStudents" src="@/assets/images/icons/replace_students_icon.png" width="18px" height="18px" style="float: right;margin-top: 8px;" />
    </div>
    <!-- 2 联系方式 -->
    <div class="student-info-item" v-if="studentData.mobile || studentData.qqNumber || studentData.wxNumber">
      <div class="info-item" v-if="studentData.mobile">
        <img src="@/assets/images/icons/mobile.png" alt="" class="info-img">
        <a @click.stop="handlePhone" href="tel: 18856665654">{{studentData.mobile}}</a>
      </div>
      <div class="info-item" v-if="studentData.qqNumber">
        <img src="@/assets/images/icons/qq.png" alt="" class="info-img">
        <span>{{studentData.qqNumber}}</span>
      </div>
      <div class="info-item" v-if="studentData.wxNumber">
        <img src="@/assets/images/icons/wechat.png" alt="" class="info-img">
        <span>{{studentData.wxNumber}}</span>
      </div>
    </div>
    <!-- 3 毕业年份+属性+性别+考试年份/考试界别/入学年份 -->
    <div class="student-info-item">
      <div class="info-item">
        <img src="@/assets/images/icons/graduateYear.png" alt="" class="info-img">
        <span>
          <span v-if="studentData.graduationYear">{{studentData.graduationYear}}毕业</span>
          （<span v-if="studentData.isFresh || studentData.isFresh === 0">{{studentData.isFresh == 1 ? '在校生': '社会考生'}}<span v-if="studentData.sex">；</span></span>
          <span v-if="studentData.sex">{{studentData.sex === 1 ? '男' : '女'}}</span>）
        </span>
      </div>
      <div class="info-item" v-if="studentData.examYear">
        <img src="@/assets/images/icons/examYear.png" alt="" class="info-img">
        <span>{{studentData.examYear}}考试</span>
      </div>
    </div>
    <!-- 4 就读学校 -->
    <div class="student-info-item">
      <div class="info-item">
        <img src="@/assets/images/icons/school.png" alt="" class="info-img">
        <span>就读学校：{{studentData.schoolName || '-'}}</span>
      </div>
    </div>
    <div class="student-more" v-if="studentData.crmSourceChannel ">
      <div class="student-line">
        <div class="line-square"></div>
      </div>
      <!-- 5 来源渠道 -->
      <div class="student-info-item" v-if="studentData.crmSourceChannel">
        <div class="info-item">
          <img src="@/assets/images/icons/source.png" alt="" class="info-img">
          <span>{{studentData.crmSourceChannel}}</span>
        </div>
      </div>
      <!-- 6 所在城市 -->
      <div class="student-info-item" v-if="studentData.city">
        <div class="info-item">
          <img src="@/assets/images/icons/city.png" alt="" class="info-img">
          <span>{{studentData.city}}</span>
        </div>
      </div>
      <!-- 7 备注 -->
      <div class="student-info-item">
        <div class="info-item">
          <span>
            <span class="gray-title-color">备注：</span>
            <span>{{studentData.remark || '-'}}</span>
          </span>
        </div>
      </div>
    </div>
    <van-popup class="replace-cont" v-model="showReplace" round position="bottom" :style="{ height: '70%' }">
      <p class="replace-title">更换学员</p>
      <div class="replace-input">
        <span class="left-icon">*</span>
        <div class="input-cont">
          <van-field v-model="form.title" type="tel" label-width="3.5rem" name="title" label="手机号码" style="float:left;" placeholder="请输入手机号码" :border="false" :rules="[{ required: true, message: '手机号码不能为空', trigger: 'onBlur' }, { validator: asyncPhoneValidator, message: '手机号码格式错误！', trigger: 'onBlur'}]"></van-field>
        </div>
        <span class="btn" @click="handleSearchPhone">查询</span>
      </div>
      <div class="replace-student-info" v-if="studentObj && studentObj.id">
        <p style="font-size: 0.72rem;">根据您输入的手机号码, 找到以下学员, 请确认后再跟换</p>
        <p class="replace-student-title">{{studentObj.name}}</p>
        <p>手机号码：{{studentObj.mobile}}</p>
        <p>微信：{{studentObj.wxNumber}}</p>
        <p>QQ：{{studentObj.qqNumber}}</p>
        <p>毕业年份：{{studentObj.year}}</p>
        <p>就读学校：{{studentObj.school}}</p>
        <p>所属分校：{{studentObj.branch}}</p>
      </div>
      <div class="btn-group">
        <van-button type="default" style="margin-right: 0.68rem;" @click="handleCancel">取消</van-button>
        <van-button type="info" :disabled="!studentObj || !studentObj.id" @click="handleReplace">更换</van-button>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { getUserInfoByTelApi, putStudyInfoByTelApi } from '@/api/potentialGuest/paymentRecord'
export default {
  props: {
    studentData: Object,
    activeOn: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      form: {
        title: null,
        id: Number(this.$route.params.handoverId)
      },
      studentObj: {
        attendSchoolId: null,
        branch: null,
        id: null,
        mobile: null,
        name: null,
        qqNumber: null,
        school: null,
        wxNumber: null,
        year: null
      },
      showReplace: false
    }
  },
  methods: {
    onSubmit() {

    },
    async handleReplace() {
      const { status } = putStudyInfoByTelApi(this.studentObj)
      if (status === 200) {
        this.$notify({ type: "success", message: '更换成功' })
        this.handleCancel()
      } else {
        this.$notify({ type: "warning", message: '更换失败' })
      }
    },
    handleCancel() {
      this.studentObj = {}
      this.showReplace = false
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
    handleSearchPhone() {
      getUserInfoByTelApi(this.form).then(res => {
        this.studentObj = res.data || {}

        if (!res.data.id) {
          this.$notify({ type: 'warning', message: '学员不存在' })
        }
      })
    },
    handlePhone() {
    },
    handleReplaceStudents() {
      this.$set(this.form, 'title', null)
      this.showReplace = true
    }
  }
}
</script>
<style lang="scss" scoped>
.student-info {
  font-size: 0.86rem;
  background-color: white;
  border-radius: 0.3rem;
  margin: 0 0.68rem;
  padding: 0.6rem;
  .student-name {
    line-height: 2rem;
    height: 2rem;
    font-size: 1rem;
  }
  .student-info-item {
    .info-item {
      display: inline-block;
      position: relative;
      margin-right: 1rem;
      margin-bottom: 0.5rem;
      color: #333333;

      &::after {
        top: 50%;
        position: absolute;
        content: '';
        width: 1px;
        height: 80%;
        background: #999999;
        margin: 0 0.5rem;
        transform: translate(-50%, -50%);
      }

      .info-img {
        width: 1rem;
        height: auto;
        vertical-align: text-bottom;
        margin-right: 0.2rem;
      }

      .info-item-time {
        color: #999999;
        margin-left: 1.2rem;
      }
    }

    .info-item:last-child {
      &::after {
        display: none;
      }
    }
  }

  .student-more {
    .student-line {
      position: relative;
      width: 100%;
      height: 1px;
      background: #f3f3f3;
      margin-bottom: 0.6rem;

      .line-square {
        position: absolute;
        top: 50%;
        left: 49%;
        padding: 0.34rem;
        background: #f3f3f3;
        transform: rotate(45deg) translate(-50%, -50%);
        transform-origin: left top;
      }
    }
  }

  .replace-cont {
    padding: 0 0.68rem;
    .replace-title {
      text-align: center;
    }

    .replace-input {
      border-bottom: 1.5px solid #dddddd41;
      display: flex;
      .left-icon {
        color: rgb(255, 44, 44);
        font-size: 1.8rem;
        margin-top: 0.6rem;
      }
      .input-cont {
        /deep/.van-cell {
          padding: 10px 8px;
        }
      }
      .btn {
        margin-top: 0.6rem;
        position: absolute;
        right: 0.68rem;
        color: #0088fe;
      }
    }

    .replace-student-info {
      font-size: 0.72rem;

      .replace-student-title {
        font-size: 0.86rem;
      }
    }

    .btn-group {
      position: absolute;
      bottom: 1rem;
      left: 50%;
      transform: translateX(-50%);

      /deep/.van-button {
        width: 5rem;
        height: 2rem;
        line-height: 2rem;
      }
    }
  }
}
</style>