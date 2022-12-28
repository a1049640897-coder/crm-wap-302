<template>
  <div>
    <van-search class="searchInput" v-model="listQuery.param.keyword" placeholder="请输入学员姓名、手机号码、微信、QQ" show-action background="#ffffff" @search="handleRefresh" @clear="handleClear">
      <template #action>
        <div @click="handleRefresh">搜索</div>
      </template>
    </van-search>
    <div>
      <RMList :moreLoading.sync="moreLoading" :refreshing.sync="refreshing" :finished.sync="finished" @onLoad="handleLoad" @onRefresh="handleRefresh" :tableList="tableList">
        <div>
          <StudentCard v-for="(item, index) in tableList" :key="item.id" :sId="item.id" :studentData="item" @onUpdataInfo="handleUpdataInfo($event, item, index)" listType="6" />
        </div>
      </RMList>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { allStudentApi } from '@/api/potentialGuest/consultation'

export default {
  name: 'allSearch-student',
  components: {
    RMList: () => import('@/components/ReComponents/RMList'),
    StudentCard: () => import('@/components/StudentCard')
  },
  data() {
    return {
      listQuery: {
        pageinfo: {
          pageNum: 1,
          pageSize: 999999
        },
        param: {
          keyword: '',
          type: '6',
          dateType: '1',
          showConsultRecord: 1
        }
      },
      moreLoading: false,
      refreshing: false,
      finished: false,
      tableList: []
    }
  },
  computed: {
    ...mapState({
      pageSize: state => state.common.setting.pageSize
    })
  },
  activated() {
    if (this.listQuery.keyword) {
      this.getTableList()
    }
  },
  methods: {
    getTableList(val) {
      this.$loading(false, 'SearchStudent')
      allStudentApi(this.listQuery).then(res => {
        if (['init', 'refresh'].includes(val)) {
          this.tableList = res.data || []
        } else {
          this.tableList = this.tableList.concat(res.data || [])
        }
        if (res.data.length < this.pageSize) {
          this.finished = true
        }
      }).finally(() => {
        this.$nextTick(() => {
          this.moreLoading = false
          this.refreshing = false
        })
        this.$loading(false, 'SearchStudent')
      })
    },
    handleClear() {
      this.listQuery.keyword = ''
      this.tableList = []
    },
    handleLoad() {
      this.listQuery.pageinfo.pageNum += 1
      this.getTableList('more')
    },

    handleRefresh() {
      this.listQuery.pageinfo.pageNum = 1
      this.finished = false
      this.getTableList('refresh')
    },

    handleUpdataInfo(obj, item, index) {
      this.tableList.splice(index, 1, obj)
    },
  }
}
</script>

<style lang="scss" scoped>
.searchInput {
  .van-search__content {
    background: #ffffff;
    border: 1px solid #f3f3f3;
    border-radius: 0.3rem;
    /deep/input {
      caret-color: #0088fe;
    }
  }
}
</style>
