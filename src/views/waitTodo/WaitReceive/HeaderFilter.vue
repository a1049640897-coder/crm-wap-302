<template>
  <div id="consulationHeader">
    <div class="hf-l-seacrch" v-if="isSearch">
      <form action="/">
        <van-search v-model="listQuery.handoverKeyword" shape="round" show-action placeholder="请输入学员姓名、手机号码、微信、QQ" :clearable="false" @search="onKeywordSearch" @cancel="onKeywordCancel" @clear="onKeywordClear" />
      </form>
    </div>
    <div class="header-filter" v-else>
      <div class="hf-l-list">
        <van-dropdown-menu class="hf-l-list-menu">
          <!-- 承接事业部 -->
          <van-dropdown-item v-if="isUndertakBranchList.length" title="承接事业部" :title-class="isHtab1 ? 'common-act-color' : ''" @open="handleDropOpen(1)" ref="vanDropItem1">
            <div class="hf-drop-view">
              <div class="hf-drop-contain">
                <div class="hr-drop-filter-item" @click="handleBranch(item.value)" v-for="item in isUndertakBranchList" :key="item.value">
                  <div>
                    <van-icon v-if="listQuery.targetShellId && listQuery.targetShellId.includes(item.value)" name="success" color="#0088FE" />
                    <span :class="{'hr-drop-filter-item-act': listQuery.targetShellId && listQuery.targetShellId.includes(item.value) }">{{item.text}}</span>
                  </div>
                </div>
              </div>
              <div class="common-double-button">
                <van-button class="common-double-button-l" @click="handleReset(1)">重置</van-button>
                <van-button class="common-double-button-r" @click="handleConfirm">确定</van-button>
              </div>
            </div>
          </van-dropdown-item>

          <!-- 存在状态 -->
          <van-dropdown-item title="存在状态" :title-class="isHtab2 ? 'common-act-color' : ''" @open="handleDropOpen(2)" ref="vanDropItem2">
            <div class="hf-drop-view" v-if="isExistenceStateList.length">
              <div class="hf-drop-contain">
                <div class="hr-drop-filter-item" @click="handleType(null)">
                  <div>
                    <van-icon v-if="listQuery.exist == null" name="success" color="#0088FE" />
                    <span :class="{'hr-drop-filter-item-act': listQuery.exist == null }">全部</span>
                  </div>
                </div>
                <div class="hr-drop-filter-item" @click="handleType(item.value)" v-for="item in isExistenceStateList" :key="item.value">
                  <div>
                    <van-icon v-if="listQuery.exist != null && item.value == listQuery.exist" name="success" color="#0088FE" />
                    <span :class="{'hr-drop-filter-item-act': listQuery.exist != null  && item.value == listQuery.exist }">{{item.text}}</span>
                  </div>
                </div>
              </div>
              <div class="common-double-button">
                <van-button class="common-double-button-l" @click="handleReset(2)">重置</van-button>
                <van-button class="common-double-button-r" @click="handleConfirm">确定</van-button>
              </div>
            </div>
            <div v-else class="hf-drop-contain-empty">
              暂无数据
            </div>
          </van-dropdown-item>
        </van-dropdown-menu>
      </div>
      <div class="hf-r-list">
        <div class="hf-r-list-item" @click="handleSearch">
          <div class="hf-r-icon-bg">
            <van-icon name="search" class="hf-r-icon" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { yuYueZixunDepartApi } from '@/api/potentialGuest/consultation'
export default {
  props: {
    paramProp: Object
  },
  data() {
    return {
      isSearch: false,
      isUndertakBranchList: [],
      isExistenceStateList: [{ value: 1, text: '已存在' }, { value: 0, text: '不存在' }],
      listQuery: { handoverKeyword: null, exist: null, targetShellId: [] }
    }
  },
  computed: {
    ...mapState({
      currentSystemId: state => state.common.systems.currentSystem.id
    }),
    isHtab1() {
      let isShow = false
      if (this.paramProp.targetShellId && this.paramProp.targetShellId.length) isShow = true
      return isShow
    },
    isHtab2() {
      let isShow = false
      if (this.paramProp.exist || this.paramProp.exist === 0) isShow = true
      return isShow
    }
  },
  created() {
    this.handleTargetSysId()
  },
  methods: {
    handleTargetSysId() {
      yuYueZixunDepartApi(this.currentSystemId).then(res => {
        this.isUndertakBranchList = res.data || []
        if (this.isUndertakBranchList.length) {
          this.$set(this.listQuery, 'targetShellId', [this.isUndertakBranchList[0].value])
        }
        this.$emit('onListQuery', this.listQuery)
      })
    },
    onKeywordSearch() {
      this.$emit('onListQuery', this.listQuery)
    },
    onKeywordClear(val) {
    },
    onKeywordCancel() {
      this.isSearch = false
    },
    handleDropOpen(val) {
      // this.handleInit()
    },
    // 搜索
    handleSearch() {
      this.listQuery.handoverKeyword = this.paramProp.handoverKeyword
      this.isSearch = true
    },
    // 承接事业部
    handleBranch(val) {
      this.$set(this.listQuery, 'targetShellId', this.listQuery.targetShellId.includes(val) ? [] : [val])
    },
    // 存在状态
    handleType(val) {
      this.$set(this.listQuery, 'exist', val)
    },
    handleReset(num) {
      if (num === 1) {
        this.listQuery.targetShellId = []
      } else if (num === 2) {
        this.listQuery.exist = null
      }
    },
    handleConfirm() {
      this.$refs.vanDropItem1.toggle(false)
      this.$refs.vanDropItem2.toggle(false)
      this.$emit('onListQuery', this.listQuery)
    },
  }
}
</script>
<style lang="scss" scoped>
@import '../../handover/components/index.scss';
</style>