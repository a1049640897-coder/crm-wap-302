<template>
  <div class="activeRecord">
    <div class="activeRecord-list" v-if="activeList && activeList.length">
      <div class="activeRecord-list-item" v-for="(item, index) in activeList" :key="index">
        <div class="activeRecord-header">
          <div class="activeRecord-title">{{item.participationDate}}</div>
          <div class="activeRecord-extra">第{{index + 1}}次参与</div>
        </div>
        <div class="activeRecord-content">
          <div class="content-item">
            <span class="content-item-title">活动名称：</span>
            <span class="content-item-info">{{item.title}}</span>
          </div>
          <div class="content-item">
            <span class="content-item-title">活动类型：</span>
            <span class="content-item-info">{{item.activityType === 1 ? '讲座登记' : '营销活动'}}</span>
          </div>
          <div class="content-item" v-if="item.useMaterial">
            <span class="content-item-title">领用资料：</span>
            <span class="content-item-info">{{item.useMaterial}}</span>
          </div>
          <div class="content-item" v-if="item.useCourse">
            <span class="content-item-title">领用课程：</span>
            <span class="content-item-info">{{item.useCourse}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="common-empty" v-else style="background: #ffffff;">
      <img src="@/assets/images/icons/empty.png" alt="" >
      <div>暂无数据</div>
    </div>
  </div>
</template>

<script>
import { activeRecordListApi } from '@/api/potentialGuest/student'

export default {
  name: 'infoActiveRecord',
  props: {
    sId: [String, Number]
  },
  data() {
    return {
      loading: false,
      listQuery: {
        potential: this.sId,
        discount: null,
        keyword: null,
        payState: null,
        pageinfo: {
          pageNum: 1,
          pageSize: 999,
          sort: [{ column: 'activityDate', type: 1 }]
        }
      },
      activeList: []
    }
  },
  watch: {
    loading(val) {
      this.$loading(val, 'infoActiveRecord')
    }
  },
  created() {
    this.getTableList()
  },
  methods: {
    getTableList() {
      return new Promise(resolve => {
        // this.activeList = []
        this.loading = true
        activeRecordListApi(this.listQuery).then(res => {
          let list = res.data || []
          this.activeList = list.filter(item => item).reverse()
          resolve()
        }).finally(() => {
          this.loading = false
        })
      })
    }
  }
}
</script>


<style lang="scss" scoped>
  .activeRecord {
    .activeRecord-list {
      .activeRecord-list-item {
        margin-bottom: 1rem;
        padding: 0.6rem;
        background: #ffffff;
        border-bottom-left-radius: 0.6rem;
        border-bottom-right-radius: 0.6rem;
        .activeRecord-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.6rem;
          .activeRecord-title {
            font-size: 1.2rem;
            color: #333333;
          }
          .activeRecord-extra {
            color: #0088fe;
            font-size: 0.76rem;
          }
        }
        .activeRecord-content {
          .content-text {
            font-size: 0.86rem;
            margin-bottom: 0.6rem;
            display: inline-block;
          }
          .content-item {
            font-size: 0.8rem;
            margin-bottom: 0.3rem;
            .content-item-title {
              color: #999999;
            }
            .content-item-info {
              color: #666666;
            }
          }
        }
      }
    }
  }
  </style>
  