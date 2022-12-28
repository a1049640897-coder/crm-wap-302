<template>
  <div class="counselRecord">
    <div class="counselRecord-list" v-if="!!recordList.length">
      <div class="counselRecord-list-item" v-for="(item, index) in recordList" :key="index">
        <div class="counselRecord-header">
          <div class="counselRecord-title" :style="`color: ${item.color || '#333333'}`">{{item.intentionName}}-{{item.describe}}</div>
          <div v-if="editFlag" class="counselRecord-icon" @click="handleCounselEdit(item.id)">
            <img src="@/assets/images/icons/recordEdit.png" alt="" />
          </div>
        </div>
        <div class="counselRecord-content">
          <span class="content-text" v-if="item.courseNames || item.content"><span v-if="item.courseNames">{{item.courseNames}}</span><span v-if="item.courseNames && item.content">：</span><span v-if="item.content">{{item.content}}</span></span>
          <div class="content-imgs" v-if="item.imgList && item.imgList.length">
            <div v-for="(it, index) in item.imgList" :key="it.id" v-permission="'PG:STU:RECORD_EDIT'" @click="handleImageView(index, item.imgList)" style="padding: 0 0.76rem 0.76rem 0;">
              <img :src="it.title" alt="" />
            </div>
          </div>
          <div class="content-info">
            <span>{{item.addTime}}</span>
            <span>{{item.consultTypeName}}</span>
            <span>{{item.creator}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="common-empty" v-else style="background: #ffffff;">
      <img src="@/assets/images/icons/empty.png" alt="">
      <div>暂无数据</div>
    </div>
  </div>
</template>

<script>
import { consultRecordHistoryApi } from '@/api/potentialGuest/student'
import { ImagePreview } from 'vant'

export default {
  name: 'infoCounselRecord',
  props: {
    sId: [String, Number],
    isAutoScroll: Boolean,
    editFlag: {
      typeof: Boolean,
      default: true
    }
  },
  data() {
    return {
      loading: true,
      recordList: []
    }
  },
  watch: {
    loading(val) {
      this.$loading(val, 'infoCounselRecord')
    }
  },
  created() {
    this.getTableList()
  },
  methods: {
    getTableList() {
      return new Promise(resolve => {
        this.loading = true
        consultRecordHistoryApi(this.sId).then(res => {
          this.recordList = res.data || []
          this.$emit('listLength', this.recordList.length)
          resolve()
        }).finally(() => {
          this.loading = false
        })
      })
    },
    handleCounselEdit(id) {
      this.$emit('update:isAutoScroll', true)
      this.$router.push({
        path: `/counselrecord/${this.sId}/${id}`
      })
    },
    handleImageView(index, list) {
      const urlList = list.map(item => item.title)
      ImagePreview({
        images: urlList,
        startPosition: index
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.counselRecord {
  .counselRecord-list {
    .counselRecord-list-item {
      margin-bottom: 0.6rem;
      padding: 0.6rem;
      background: #ffffff;
      border-bottom-left-radius: 0.375rem;
      border-bottom-right-radius: 0.375rem;
      .counselRecord-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.6rem;
        .counselRecord-title {
          font-size: 0.9rem;
          color: #333333;
        }
        .counselRecord-icon {
          img {
            width: 1rem;
            height: auto;
          }
        }
      }
      .counselRecord-content {
        .content-text {
          font-size: 0.86rem;
          margin-bottom: 0.6rem;
          display: inline-block;
        }
        .content-imgs {
          display: flex;
          flex-wrap: wrap;
          img {
            border-radius: 0.3rem;
            width: 3.6rem;
            height: 3.6rem;
          }
          :nth-child(5n) {
            margin-right: 0;
          }
        }
        .content-info {
          color: #999999;
          font-size: 0.86rem;
          span {
            margin-right: 0.6rem;
          }
        }
      }
    }
  }
}
</style>
