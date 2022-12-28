<template>
  <div class="cost-card common-list-contain">
    <div class="cost-base">
      <div class="cost-header">
        <div class="cost-header-lf">{{costData.itemsType}}</div>
        <div class="cost-header-rt" v-permission="checkPermissionStatus(counselTab)">
          <img src="@/assets/images/icons/recordEdit.png" alt="" @click="handleEdit(costData)" class="img-info" style="margin-right:0.7rem">
        </div>
      </div>
      <!-- <div class="cost-info-item">
        代理姓名: {{costData.creater}}
      </div> -->
      <div class="cost-info-item">
        <span>
          <span v-if="costData.itemsType == '物料'">
            成本明细: {{ splitTitle(costData.costDetail,0) || '-'}} <span style="margin-left:1rem">{{splitTitle(costData.costDetail,1) }}</span>
          </span>
          <span v-else>
            <span>
              <span v-if="costData.itemsType == '代理'">代理姓名:</span>
              <span v-if="costData.itemsType == '其他'">成本说明:</span>
            </span> {{costData.costDetail}}
          </span>
        </span>
      </div>
      <div class="cost-info-item">
        备注: {{costData.remark}}
      </div>
      <div class="cost-info-item last-item">
        <span>
          {{costData.createTime}} {{costData.creater}}
        </span>
        <span class="last-rt">
          {{(costData.money).toFixed(2)}}
        </span>
      </div>
    </div>
    <!-- 成本管理编辑 -->
    <CostResult :is-open.sync="costIsShow"  :branchId="branchId" :title="'编辑成本'" :costData="costData" :isEdit="true" :sId="sId" @complete="handleUpdataInfo"></CostResult>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    sId: Number,
    reserveConsultId: Number,
    costData: {
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
    listType: String,
    counselTab: String,
    branchId: [Number, String]
  },
  components: {
    CostResult: () => import('../CostResult/index'),
  },
  data() {
    return {
      costIsShow: false,
      selectActList: [
        {
          value: 1,
          text: '物料'
        },
        {
          value: 2,
          text: '代理'
        },
        {
          value: 3,
          text: '其他'
        },
        {
          value: 4,
          text: '资料'
        }
      ]
    }
  },
  activated() {
    if (this.jumoStudentId) {
      this.handleUpdataInfo()
    }
  },
  mounted() {
    this.$emit('onStudentCardMounted')
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
    checkPermissionStatus(counselTab) {
      if (counselTab == 'LectureReg') {
        return 'MARKET:SCHOOL:COST_COMPILE'
      } else {
        return 'MARKET:ACT:COST_COMPILE'
      }
    },
    splitTitle(val, type) {
      if (val) {
        if (type) {
          return val && val.indexOf('(') > -1 ? `x${((val.toString()).split('(')[type]).split(')')[0]}` : ''
        } else {
          return val && val.indexOf('(') > -1 ? (val.toString()).split('(')[type] : ''
        }
      } else {
        return ''
      }
    },
    handleToConnect() {

    },
    handleEdit() {
      this.costIsShow = true
    },
    handleRotate() {
      this.isRotate = !this.isRotate
    },


    handleUpdataInfo() {
      this.$emit('onUpdataInfo')
    },

  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>