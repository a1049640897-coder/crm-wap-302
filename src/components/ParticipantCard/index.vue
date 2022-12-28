<template>
  <div class="student-card common-list-contain">
    <div class="student-base">
      <div class="student-header common-list-contain" @click="handleStudentInfo">
        <div class="SH-l">
          <div class="SH-name">{{studentData.name}}</div>
          <!-- 标签1 -->
          <div class="SH-tags">
            <div class="SH-tag" :class="studentData.targetOne.isNew == 1 ? 'SH-tag-green':'SH-tag-yellow'" v-if="studentData.targetOne && studentData.targetOne.isNew != null">{{studentData.targetOne.isNew == 1 ? '新用户' : '老用户'}}</div>
            <div class="SH-tag" v-if="studentData.followState && studentData.followState">{{studentData.followState}}</div>
            <div class="SH-tag" v-if="studentData.targetOne && Number.isInteger(studentData.targetOne.reserveState)">{{studentData.targetOne.reserveState ? '已预约已完成' : '已预约未完成'}}</div>
            <div class="SH-tag" v-if="studentData.targetOne && studentData.targetOne.attribute">{{ studentData.targetOne.attribute | classLevel }}</div>
          </div>
        </div>

        <div class="SH-r">
          <div class="SH-r-icon" @click.stop="handleRotate">
            <img class="SH-r-icon" :class="{'IconRotate': isRotate}" src="@/assets/images/icons/expend.png" alt="">
          </div>
        </div>
      </div>
      <!-- 预约咨询记录 -->
      <div class="student-extraInfo" v-if="studentData.reserveStateWap || studentData.affiliatedNameWap || studentData.reserveRemark" @click="handleStudentInfo">
        <span class="extra-info-item">预约咨询：{{studentData.reserveStateWap}} <div class="extra-info-item-line"></div> </span>
        <span class="extra-info-item">咨询/市场：{{studentData.affiliatedNameWap}} <div class="extra-info-item-line"></div> </span>
        <span class="extra-info-item">预约备注：{{studentData.reserveRemark}}</span>
      </div>
      <div class="student-info common-list-contain" style="padding-top: 0;" @click="handleStudentInfo">
        <!-- 转交、移交时间 待跟进才有-->
        <div v-if="(studentData.deliverOwn || studentData.distributeOwn) && listType === '8'">
          <div class="student-turn-info" v-if="studentData.deliverOwn">
            <span class="student-turn-info-title mr5">转交</span>
            <span class="mr5">{{studentData.deliverOwn.sysUserName}}</span>
            <span class="mr5">{{studentData.deliverOwn.addTime}}</span>
          </div>
          <div class="student-turn-info" v-if="studentData.distributeOwn">
            <span class="student-turn-info-title mr5">分配</span>
            <span class="mr5">{{studentData.distributeOwn.sysUserName}}</span>
            <span class="mr5">{{studentData.distributeOwn.addTime}}</span>
          </div>
        </div>
        <!-- 1 咨询次数、参与活动次数、移交次数 标签2 -->
        <div class="student-info-item green-color" v-if="isTargetExist(studentData.targetTwo)">
          <img src="@/assets/images/icons/over.png" alt="" class="info-img">
          <div class="info-item" v-if="studentData.targetTwo && studentData.targetTwo.consultCount">
            <span>咨询{{studentData.targetTwo.consultCount}}次</span>
          </div>
          <div class="info-item" v-if="studentData.targetTwo && studentData.targetTwo.activityCount">
            <span>参与活动{{studentData.targetTwo.activityCount}}次</span>
          </div>
          <div class="info-item" v-if="studentData.targetTwo && studentData.targetTwo.handoverCount">
            <span>移交{{studentData.targetTwo.handoverCount}}次</span>
          </div>
        </div>
        <!-- 2 联系方式 -->
        <div class="student-info-item">
          <div class="info-item" v-if="studentData.mobile">
            <img src="@/assets/images/icons/mobile.png" alt="" class="info-img">
            <a @click.stop="handlePhone" :href="`tel: ${studentData.mobile}`">{{studentData.mobile}}</a>
          </div>
          <div class="info-item" v-if="studentData.qq">
            <img src="@/assets/images/icons/qq.png" alt="" class="info-img">
            <span>{{studentData.qq}}</span>
          </div>
          <div class="info-item" v-if="studentData.weChat || studentData.wx">
            <img src="@/assets/images/icons/wechat.png" alt="" class="info-img">
            <span>{{studentData.wx}}</span>
          </div>
        </div>
        <!-- 3 毕业年份、属性、性别、考试年份/考试界别/入学年份 -->
        <div class="student-info-item" v-if="listType != 9">
          <div class="info-item">
            <img src="@/assets/images/icons/graduateYear.png" alt="" class="info-img">
            <span>
              <span v-if="studentData.year">{{studentData.year}}毕业</span>
              （<span v-if="listType === 'yuYueZiXun' || $route.params.listtype === 'yuYueZiXun'">{{studentData.isFresh == 1 ? '在校生' : studentData.isFresh == -1 || studentData.isFresh === '未知' ? '未知' : '社会考生'}}</span>
              <span v-else>{{studentData.isFresh}}</span>
              <span v-if="studentData.sex">；{{studentData.sex === 1 ? '男' : '女'}}</span>）
            </span>
          </div>
          <div class="info-item" v-if="studentData.examYear">
            <img src="@/assets/images/icons/examYear.png" alt="" class="info-img">
            <span>{{studentData.examYear}}{{examYearText}}</span>
          </div>
        </div>
        <!-- 4 就读学校 -->
        <div class="student-info-item" v-if="listType != 9">
          <div class="info-item">
            <img src="@/assets/images/icons/school.png" alt="" class="info-img">
            <span>就读学校：{{studentData.commonSchoolInfo | schoolFilter}}</span>
          </div>
        </div>
        <!-- 5 意向信息/报考科目 -->
        <div class="student-info-item" v-if="system_hy_jc_wx.includes(currentSystemId) || system_zsb_jczsb_jxzsb_gwy.includes(currentSystemId)">
          <div class="info-item">
            <img src="@/assets/images/icons/exMore.png" alt="" class="info-img">
            <span v-if="system_hy_jc_wx.includes(currentSystemId)">
              <span class="blue-title-color">意向信息：</span>
              <span>{{studentData.intentionSchool | intentionFilter(studentData.intentionCollege, studentData.intentionProfession)}}</span>
            </span>
            <span v-if="system_zsb_jczsb_jxzsb_gwy.includes(currentSystemId)">
              <span class="blue-title-color">报考科目：</span>
              <span>{{studentData.registerSubject}}</span>
            </span>
          </div>
        </div>
        <!-- 8 来源渠道 （未咨询）-->
        <div class="student-info-item" v-if="studentData.sourceName && listType == 4">
          <div class="info-item">
            <img src="@/assets/images/icons/source.png" alt="" class="info-img">
            <span>{{studentData.sourceName}}</span>
          </div>
        </div>
        <!-- 9 所在城市 （未咨询）-->
        <div class="student-info-item" v-if="studentData.cityName && listType == 4">
          <div class="info-item">
            <img src="@/assets/images/icons/city.png" alt="" class="info-img">
            <span>{{studentData.cityName}}</span>
          </div>
        </div>
        <!-- 12 备注 （未咨询）-->
        <div class="student-info-item" v-if="studentData.remark">
          <div class="info-item">
            <span>
              <span class="gray-title-color">备注：</span>
              <span>{{studentData.remark}}</span>
            </span>
          </div>
        </div>
        <!-- 公海 - 投放信息 学员档案不看-->
        <div class="student-info-item" v-if="!isDetail && listType === '7'">
          <div class="info-item">
            <img src="@/assets/images/icons/toufang.png" alt="" class="info-img">
            <span class="blue-title-color">投放信息：</span><span>{{studentData.seaPutTime}} {{studentData.seaPutUser}}</span>
          </div>
        </div>
        <!-- 预约咨询 - 咨询结果 学员档案不看 -->
        <div class="student-info-item" v-if="!isDetail && listType === 'yuYueZiXun'">
          <div class="info-item">
            <img src="@/assets/images/icons/counselResult.png" alt="" class="info-img">
            <span>咨询结果：<span class="blue-title-color">{{studentData.reserveConsultResult}}</span></span>
          </div>
        </div>
        <!-- 6 下次回访 学员档案/未咨询/公海 不看 -->
        <div class="student-info-item" v-if="!isDetail && [4, 7, 9].includes(listType) ">
          <div class="info-item">
            <img src="@/assets/images/icons/next.png" alt="" class="info-img">
            <span>下次回访：<span class="blue-title-color">{{studentData.nextConsultTIme}}</span></span>
          </div>
        </div>
        <!-- 7 意向类型/意向班型 （咨询记录）学员档案不看 -->
        <div class="student-info-item" v-if="!isDetail && studentData.consultRecordList && studentData.consultRecordList.length">
          <div class="info-item">
            <img src="@/assets/images/icons/record.png" alt="" class="info-img">
            <span>
              <span class="blue-title-color">
                <span :style="`color: ${studentData.color}`">{{studentData.consultRecordList[0].intentionName + '(' + studentData.consultRecordList[0].describe + ')'}} <span v-if="studentData.consultRecordList[0].courseNames">/{{studentData.consultRecordList[0].courseNames}}</span>：</span>
              </span>
              <span>{{studentData.consultRecordList[0].content}}</span>
            </span>
          </div>
        </div>
        <div class="student-info-item" v-if="!isDetail && studentData.consultRecordList && studentData.consultRecordList.length">
          <div class="info-item">
            <div class="info-item-time">
              <span class="mr5">{{studentData.consultRecordList[0].addTime}}</span>
              <span class="mr5">{{studentData.consultRecordList[0].consultTypeName}}</span>
              <span class="mr5">{{studentData.consultRecordList[0].creator}}</span>
            </div>
          </div>
        </div>
        <div class="student-more" v-if="isRotate">
          <div class="student-line">
            <div class="line-square"></div>
          </div>
          <!-- 9 毕业年份、属性、性别、考试年份/考试界别/入学年份 讲座登记，活动的参与人员使用-->
          <div class="student-info-item" v-if="listType == 9">
            <div class="info-item">
              <img src="@/assets/images/icons/graduateYear.png" alt="" class="info-img">
              <span>
                <span v-if="studentData.graduationYear">{{studentData.graduationYear}}毕业</span>
                （<span>{{studentData.isFresh === 1 ? '在校生' : '社会考生'}}</span><span v-show="studentData.sex">；</span>
                <span v-if="studentData.sex">{{studentData.sex === 1 ? '男' : '女'}}</span>）
              </span>
            </div>
            <div class="info-item" v-if="studentData.examYear">
              <img src="@/assets/images/icons/examYear.png" alt="" class="info-img">
              <span>{{studentData.examYear}}{{examYearText}}</span>
            </div>
          </div>
          <!-- 4 就读学校 -->
          <div class="student-info-item" v-if="listType == 9">
            <div class="info-item">
              <img src="@/assets/images/icons/school.png" alt="" class="info-img">
              <span>就读学校：{{studentData.commonSchoolInfo | schoolFilter}}</span>
            </div>
          </div>
          <!-- 8 来源渠道 -->
          <div class="student-info-item" v-if="studentData.sourceName && listType != 4">
            <div class="info-item">
              <img src="@/assets/images/icons/source.png" alt="" class="info-img">
              <span>{{studentData.sourceName}}</span>
            </div>
          </div>
          <!-- 9 所在城市 -->
          <div class="student-info-item" v-if="studentData.cityName && listType != 4">
            <div class="info-item">
              <img src="@/assets/images/icons/city.png" alt="" class="info-img">
              <span>{{studentData.cityName}}</span>
            </div>
          </div>
          <!-- 10 所属分校、市场区域 -->
          <div class="student-info-item">
            <div class="info-item">
              <span>
                <span class="gray-title-color">所属分校：</span>
                <span>{{studentData.shellNameWap || studentData.shellName}}</span>
              </span>
            </div>
            <div class="info-item">
              <span>
                <span class="gray-title-color">市场区域：</span>
                <span>{{studentData.crmMarketAreaTitle}}</span>
              </span>
            </div>
          </div>
          <!-- 11 所属人、市场区域负责人-->
          <div class="student-info-item">
            <div class="info-item">
              <span>
                <span class="blue-title-color">所属人：</span>
                <span>{{studentData.ownWap}}</span>
              </span>
            </div>
            <div class="info-item">
              <span>
                <span class="blue-title-color">市场区域负责人：</span>
                <span>{{studentData.campusWap}}</span>
              </span>
            </div>
          </div>
          <!-- 12 备注 -->
          <div class="student-info-item" v-if="listType != 4">
            <div class="info-item">
              <span>
                <span class="gray-title-color">备注：</span>
                <span>{{studentData.remark}}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!isCloseBtn">
        <!-- 1 咨询用户 -->
        <div class="student-btns" v-if="listType === '1' || listType === '9'">
          <van-button class="student-btn-item" v-permission="permissionList['RECORD_ADD'][listtype]" @click="handleConsulRecord">
            <img src="@/assets/images/icons/btn_record.png" alt="">
            <span>添加咨询记录</span>
          </van-button>
          <van-button class="student-btn-item" v-permission="permissionList['EDIT'][listtype]" @click="handleEditStudentInfo">
            <img src="@/assets/images/icons/btn_edit.png" alt="">
            <span>编辑</span>
          </van-button>
          <van-button class="student-btn-item" v-if="actions.length">
            <van-popover v-model="showPopover" @select="handlePopSelect" trigger="click" :actions="actions" placement="bottom-end">
              <template #reference>
                <van-button class="student-btn-item">
                  <img src="@/assets/images/icons/btn_moe.png" alt="">
                  <span>更多</span>
                </van-button>
              </template>
            </van-popover>
          </van-button>
        </div>
        <!-- 4 未咨询 -->
        <div class="student-btns" v-else-if="listType === '4' || listType === '9'">
          <van-button class="student-btn-item" v-permission="permissionList['RECORD_ADD'][listtype]" @click="handleConsulRecord">
            <img src="@/assets/images/icons/btn_record.png" alt="">
            <span>添加咨询记录</span>
          </van-button>
          <van-button class="student-btn-item" v-permission="permissionList['CONSULT'][listtype]" @click="handlePopSelect({ text: '预约咨询', dialogName: 'isConsultSubscribeShow' })">
            <img src="@/assets/images/icons/yuyue.png" alt="">
            <span>预约咨询</span>
          </van-button>
          <van-button class="student-btn-item" v-permission="permissionList['EDIT'][listtype]" @click="handleEditStudentInfo">
            <img src="@/assets/images/icons/btn_edit.png" alt="">
            <span>编辑</span>
          </van-button>
          <van-button class="student-btn-item" v-if="actions.length">
            <van-popover v-model="showPopover" @select="handlePopSelect" trigger="click" :actions="actions" placement="bottom-end" style="padding: 0 0.5rem;">
              <template #reference>
                <van-button class="student-btn-item">
                  <img src="@/assets/images/icons/btn_moe.png" alt="">
                  <span>更多</span>
                </van-button>
              </template>
            </van-popover>
          </van-button>
        </div>
        <!-- 5 待分配 -->
        <div class="student-btns" v-else-if="listType === '5'">
          <van-button class="student-btn-item" v-permission="permissionList['BATCH_DISTRIBUTION'][listtype]" @click="handlePopSelect({ text: '分配咨询', dialogName: 'isConsultDistributeShow' })">
            <img src="@/assets/images/icons/ConsultSubscribe.png" alt="">
            <span>分配咨询</span>
          </van-button>
          <van-button class="student-btn-item" v-permission="permissionList['CONSULT'][listtype]" @click="handlePopSelect({ text: '预约咨询', dialogName: 'isConsultSubscribeShow' })">
            <img src="@/assets/images/icons/yuyue.png" alt="">
            <span>预约咨询</span>
          </van-button>
          <van-button class="student-btn-item" v-if="actions.length">
            <van-popover v-model="showPopover" @select="handlePopSelect" trigger="click" :actions="actions" placement="bottom-end">
              <template #reference>
                <van-button class="student-btn-item">
                  <img src="@/assets/images/icons/btn_moe.png" alt="">
                  <span>更多</span>
                </van-button>
              </template>
            </van-popover>
          </van-button>
        </div>
        <!-- 7 公海 -->
        <div class="student-btns" v-else-if="listType === '7'">
          <van-button class="student-btn-item" v-permission="'PG:HS:GET'" @click="handleGetSea" :disabled="[1, 3].includes(roleFlag)">
            <img src="@/assets/images/icons/getConsultSea.png" alt="">
            <span>领取</span>
          </van-button>
          <van-button class="student-btn-item" v-permission="permissionList['BATCH_DISTRIBUTION'][listtype]" @click="handlePopSelect({ text: '分配咨询', dialogName: 'isConsultDistributeShow' })">
            <img src="@/assets/images/icons/ConsultSubscribe.png" alt="">
            <span>分配咨询</span>
          </van-button>
        </div>
        <!-- 8 待跟进 -->
        <div class="student-btns" v-else-if="listType === '8'">
          <van-button class="student-btn-item" v-permission="permissionList['RECORD_ADD'][listtype]" @click="handleConsulRecord">
            <img src="@/assets/images/icons/btn_record.png" alt="">
            <span>添加咨询记录</span>
          </van-button>
          <van-button class="student-btn-item" v-permission="permissionList['EDIT'][listtype]" @click="handleEditStudentInfo">
            <img src="@/assets/images/icons/btn_edit.png" alt="">
            <span>编辑</span>
          </van-button>
          <van-button class="student-btn-item" v-permission="'PG:WAIT:NOFOLLOW'" @click="handlePopSelect({ text: '无需跟进', dialogName: 'isConsultNoFollowShow' })">
            <img src="@/assets/images/icons/rubbish.png" alt="">
            <span>无需跟进</span>
          </van-button>
        </div>
        <!-- yuYueZiXun 预约咨询 -->
        <div class="student-btns" v-else-if="listType === 'yuYueZiXun'">
          <van-button class="student-btn-item" :disabled="!studentData.affiliatedNameWap" v-permission="permissionList['RECORD_ADD'][listtype]" @click="handleConsulRecord">
            <img src="@/assets/images/icons/btn_record.png" alt="">
            <span>添加咨询记录</span>
          </van-button>
          <!-- 下方的禁用暂时删除 !studentData.appointmentTimeState ||  -->
          <van-button class="student-btn-item" v-permission="'PG:RC:CR'" :disabled="!studentData.consultantName || !studentData.affiliatedNameWap" @click="handleAddConsulResult">
            <img src="@/assets/images/icons/addOrder.png" alt="">
            <span>咨询结果</span>
          </van-button>
          <van-button class="student-btn-item" v-permission="permissionList['EDIT'][listtype]" @click="handleEditStudentInfo">
            <img src="@/assets/images/icons/btn_edit.png" alt="">
            <span>编辑</span>
          </van-button>
          <!-- 下方的禁用暂时删除 !studentData.appointmentTimeState ||  -->
          <van-button class="student-btn-item" v-permission="permissionList['CONSULT'][listtype]" :disabled="studentData.targetOne.reserveState == 1" @click="handlePopSelect({ text: '预约咨询', dialogName: 'isConsultSubscribeShow' })">
            <img src="@/assets/images/icons/btn_edit.png" alt="">
            <span>修改预约</span>
          </van-button>
        </div>
      </div>
    </div>
    <!-- 预约咨询 counselState: 是否可以删除，1不能删， 0可以删 -->
    <ConsultSubscribe :is-open.sync="isConsultSubscribeShow" :sId="sId" @complete="handleUpdataInfo" :reserveConsultId="reserveConsultId" :counseltitle="dialogTitle" :counselState="studentData.state" @delcomplete="handleDelComplete" />
    <!-- 分配咨询师 -->
    <ConsultDistribute :is-open.sync="isConsultDistributeShow" :sId="sId" @complete="handleUpdataInfo" :listType="listType" @onAllRefresh="handleAllRefresh" />
    <!-- 移交 -->
    <ConsultDeliver :is-open.sync="isConsultHandOverShow" :sId="sId" @complete="handleUpdataInfo" />
    <!-- 转交 -->
    <ConsultHandOver :is-open.sync="isConsultDeliverShow" :sId="sId" @complete="handleUpdataInfo" />
    <!-- 放入公海 -->
    <ConsultSea :is-open.sync="isConsultSeaShow" :sId="sId" @complete="handleUpdataInfo" />
    <!-- 修改市场区域 -->
    <ConsultMarketArea :is-open.sync="isConsultMarketAreaShow" :sId="sId" :branchId="studentData.branchId" :markerAreaId="studentData.crmMarketAreaId" :markerAreaTitle="studentData.crmMarketAreaTitle" @complete="handleUpdataInfo" />
    <!-- 咨询结果 -->
    <ConsultSubscribeResult :is-open.sync="isConsultSubscribeResultShow" :id="sId" :sId="studentData.studentId" :reserveConsultResult="studentData.reserveConsultResult" @complete="handleUpdataInfo" />
    <!-- 公海领取 -->
    <ConsultGetConsultSea :is-open.sync="isGetConsultSeaShow" :sId="sId" @complete="handleUpdataInfo" />
    <!-- 无需跟进 -->
    <ConsultNoFollow :is-open.sync="isConsultNoFollowShow" :sId="sId" @complete="handleUpFollow" />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { consultationInfoApi, appointmentConsultationInfoApi } from '@/api/potentialGuest/consultation'

export default {
  props: {
    sId: Number,
    studentData: {
      required: true,
      default: () => { }
    },
    isCloseBtn: Boolean, // 关闭按钮
    isDetail: Boolean,
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
     * yuYueZiXun: 预约咨询, 另外的接口
     *  
    */
    listType: String,
    
  },
  components: {
    ConsultSubscribe: () => import('../ConsultSubscribe/index'),
    ConsultDistribute: () => import('../ConsultDistribute/index'),
    ConsultHandOver: () => import('../ConsultHandOver/index'), // 移交
    ConsultDeliver: () => import('../ConsultDeliver/index'), // 转交
    ConsultSea: () => import('../ConsultSea/index'),
    ConsultMarketArea: () => import('../ConsultMarketArea/index'),
    ConsultSubscribeResult: () => import('../ConsultSubscribeResult/index'),
    ConsultGetConsultSea: () => import('../ConsultGetConsultSea/index'),
    ConsultNoFollow: () => import('../ConsultNoFollow/index')
  },
  data() {
    return {
      listtype: this.$route.params.listtype ? this.$route.params.listtype === 'yuYueZiXun' ? 10 : this.$route.params.listtype : this.listType && this.listType === 'yuYueZiXun' ? 10 : this.listType,
      dialogTitle: null,
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
      jumoStudentId: null,
      reserveConsultId: null,
    }
  },
  filters: {
    classLevel(val) {
      let str = ''
      switch (val) {
        case 1:
          str = '已报免费'
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
        case 5:
          str = '已报转赠'
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
      return '未知'
    },
    intentionFilter(val1, val2, val3) {
      if (val1 || val2 || val3) {
        return [val1, val2, val3].map(item => {
          return item || '-'
        }).join('/')
      } return ''
    }
  },
  activated() {
    if (this.jumoStudentId) {
      console.log('7777');
      this.handleUpdataInfo()
    }
  },
  mounted() {
    this.$emit('onStudentCardMounted')
  },
  computed: {
    ...mapGetters(['permission_btns']),
    ...mapState({
      permissionList: state => state.consultation.permissionList,
      currentSystemId: state => state.common.systems.currentSystem.id,
      examYearText: state => {
        let str = '考试'
        if (state.common.setting.examYearText) {
          str = state.common.setting.examYearText.substring(0, 2)
        }
        return str
      },
      roleFlag: state => {
        return state.common.user.info.roleFlag
      }
    }),
    actions() {
      let arr
      if (this.listType === '1' || this.listType === '9') {
        return [
          { text: this.studentData.reserveConsultId ? '修改预约' : '预约咨询', dialogName: 'isConsultSubscribeShow', permission_btn: this.permissionList['CONSULT'][this.listtype] },
          { text: '分配咨询', dialogName: 'isConsultDistributeShow', permission_btn: this.permissionList['BATCH_DISTRIBUTION'][this.listtype] },
          { text: '修改市场区域', dialogName: 'isConsultMarketAreaShow', permission_btn: this.permissionList['MARKET_AREA'][this.listtype] },
          { text: '移交', dialogName: 'isConsultDeliverShow', permission_btn: this.permissionList['HAND_OVER'][this.listtype] },
          { text: '转交', dialogName: 'isConsultHandOverShow', permission_btn: this.permissionList['DELIVER'][this.listtype] },
          { text: '放入公海', dialogName: 'isConsultSeaShow', permission_btn: this.permissionList['PUT_PUBLIC'][this.listtype] },
          { text: '新增订单', dialogName: '', permission_btn: this.permissionList['ADD_ORDER'][this.listtype] }
        ]
      } else if (this.listType === '4') {
        arr = [
          { text: '分配咨询', dialogName: 'isConsultDistributeShow', permission_btn: this.permissionList['BATCH_DISTRIBUTION'][this.listtype] },
          { text: '修改市场区域', dialogName: 'isConsultMarketAreaShow', permission_btn: this.permissionList['MARKET_AREA'][this.listtype] },
          { text: '移交', dialogName: 'isConsultDeliverShow', permission_btn: this.permissionList['HAND_OVER'][this.listtype] },
          { text: '转交', dialogName: 'isConsultHandOverShow', permission_btn: this.permissionList['DELIVER'][this.listtype] },
          { text: '放入公海', dialogName: 'isConsultSeaShow', permission_btn: this.permissionList['PUT_PUBLIC'][this.listtype] },
          { text: '新增订单', dialogName: '', permission_btn: this.permissionList['ADD_ORDER'][this.listtype] }
        ]
      } else if (this.listType === '5') {
        arr = [
          { text: '编辑', dialogName: 'editStudent', permission_btn: this.permissionList['EDIT'][this.listtype] },
          { text: '添加咨询记录', dialogName: 'addCounselRecord', permission_btn: this.permissionList['RECORD_ADD'][this.listtype] },
          { text: '移交', dialogName: 'isConsultDeliverShow', permission_btn: this.permissionList['HAND_OVER'][this.listtype] },
          { text: '放入公海', dialogName: 'isConsultSeaShow', permission_btn: this.permissionList['PUT_PUBLIC'][this.listtype] },
          { text: '新增订单', dialogName: '', permission_btn: this.permissionList['ADD_ORDER'][this.listtype] }
        ]
      }
      arr = arr.filter(item => this.permission_btns.includes(item.permission_btn))
      return arr
    }
  },
  methods: {
    isTargetExist(val) {
      let isExist = false
      if (val && (val.consultCount || val.handoverCount || val.activityCount)) isExist = true
      return isExist
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
        this.handleEditStudentInfo()
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
      this.dialogTitle = e.text
      this[e.dialogName] = true
    },

    handlePhone() {
    },

    handleGetSea() {
      this.isGetConsultSeaShow = true
    },

    // 校验按钮详情权限
    handleDetailPermission() {
      let bol = false
      if (this.listType === '1') {
        bol = this.permission_btns.includes('PG:STU:CHECK_STUDENT')
      } else if (this.listType === '4') {
        bol = this.permission_btns.includes('PG:NOCOUNSEL:CHECK_STUDENT')
      } else if (this.listType === '5') {
        bol = this.permission_btns.includes('PG:WAITSTU:CHECK_STUDENT')
      } else if (this.listType === '6') {
        bol = this.permission_btns.includes('PG:ALLNEW:CHECK_STUDENT')
      } else if (this.listType === '7') {
        bol = this.permission_btns.includes('PG:HS:CHECK_STUDENT')
      } else if (this.listType === '8') {
        bol = this.permission_btns.includes('PG:WAIT:CHECK_STUDENT')
      } else if (this.listType === 'yuYueZiXun') {
        bol = this.permission_btns.includes('PG:RC:SEE_STU_DETAIL')
      }
      return bol
    },

    handleStudentInfo() {
      if (this.isDetail || this.showPopover) return
      // 校验按钮详情权限
      if (!this.handleDetailPermission()) return
      let listType = this.listType
      if (this.studentData.sea_flag) {
        listType = '7'
      }
      this.jumoStudentId = this.sId
      this.$router.push({
        path: `/studentinfo/${this.sId}/${listType}`
      })
    },

    handleAddConsulResult() {
      this.isConsultSubscribeResultShow = true
    },

    handleConsulRecord() {
      this.jumoStudentId = this.sId
      this.$router.push({
        path: `/counselrecord/${this.sId}/null`
      })
    },

    handleEditStudentInfo() {
      this.jumoStudentId = this.sId
      this.$router.push({
        path: `/studentinfoedit/${this.sId}`
      })
    },

    handleUpdataInfo() {
      const api = this.listType === 'yuYueZiXun' ? appointmentConsultationInfoApi : consultationInfoApi
      let info = {}
      api(this.sId, Number(this.listType)).then(res => {
        info = res.data
        if (this.listType === 'yuYueZiXun') {
          info.id = this.studentData.id
          info.studentId = this.studentData.studentId
        }
        setTimeout(() => {
          this.$emit('onUpdataInfo', info)
        }, 2000)
        this.jumoStudentId = null
      }).catch(() => {
        this.jumoStudentId = null
      }).finally(() => {
          this.$emit('onUpdataInfo', info)
      })
    },

    handleUpFollow() {
      this.handleAllRefresh()
    },
    handleDelComplete() {
      this.handleAllRefresh()
    },
    handleAllRefresh() {
      this.$emit('onAllRefresh')
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>