<template>
  <div class="work_details">
    <div class="top">
      <span class="title">{{workData.title}}</span>
      <div class="woek_state">
        {{workData.state == 1 ? '未处理' : workData.state == 2 ? '处理中' : workData.state == 3 ? '已处理' : workData.state == 4 ? '已撤销' : null}}
      </div>
      <div class="work_note">
        {{workData.note}}
      </div>
      <div class="work_studentInfo" v-show="workData.studentInfo">
        <span>学员联系方式：</span>
        <span>
          {{workData.contactInformationType == 1 ? '手机号' : workData.contactInformationType == 2 ? '微信号' : workData.contactInformationType == 3 ? 'QQ号' : ''}}
          {{workData.studentInfo}}</span>
      </div>
      <div v-show="workData.imgList && workData.imgList.length">
        <div class="work_studentInfo mb">图片</div>
        <div class="workimg_cont">
          <div class="workimng">
            <img v-for="(item,index) in workData.imgList" :key="index" :src="item" class="workimngimg" alt="" @click="handleImageView(index, workData.imgList)">
          </div>
        </div>
      </div>
      <div class="work_studentInfo mb2" v-show="workData.fileName">
        <span>文件：</span>
        <span @click="openfile">{{workData.fileName}}</span>
      </div>
    </div>
    <div class="buttom">
      <div class="title">
        <div class="left"></div>
        <div class="right">解决方案</div>
      </div>
      <div class="worktypeName" v-show="workData.typeName">问题类型 {{workData.typeName}}</div>
      <div class="worksolution" v-show="workData.solution" v-html="workData.solution"></div>
      <div class="worksolutionsolutionTime" v-show="workData.solutionTime ">{{workData.solutionTime}}</div>
      <div v-show="workData.remark">
        <div class="worktypeName">备注</div>
        <div class="worksolution mb2">{{workData.remark}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  workOrderTypedetailApi
} from "@/api/workOrder";
import { ImagePreview } from 'vant'

export default {
  name: 'WorkDetail',
  data() {
    return {
      workId: null,
      workData: {
        title: null,
        state: null,
        note: null,
        studentInfo: null,
        imgList: [],
        fileName: null
      }
    }
  },
  mounted() {
    this.workId = this.$route.query.workId
    this.getDetail()
  },
  methods: {
    // 获取工单详情
    getDetail() {
      workOrderTypedetailApi(this.workId).then(res => {
        if (res.data.solution) {
          let reg = /<img/g
          res.data.solution = res.data.solution.replace(reg, '<img style="width:100%;height:100%"')
        }
        this.workData = res.data
      })
    },
    openfile() {
      window.open(this.workData.attachPath)
    },
    handleImageView(index, list) {
      ImagePreview({
        images: list,
        startPosition: index
      })
    }
  }

}
</script>

<style lang="scss" scoped>
.work_details {
  background: #ffffff;
  min-height: 100vh;
  .top {
    height: auto;
    padding: 1rem;
    background-color: #0088fe;
    .title {
      font-size: 0.86rem;
      font-weight: 400;
      color: #ffffff;
    }

    .woek_state {
      margin-top: 0.15rem;
      color: #ffffff;
    }

    .work_note {
      font-size: 0.86rem;
      color: #ffffff;
      margin-top: 0.6rem;
      word-break: break-all;
    }

    .work_studentInfo {
      font-size: 0.86rem;
      color: #ffffff;
      margin-top: 0.8rem;
    }
    .workimg_cont {
      width: 100%;
      overflow: auto;
      .workimng {
        display: flex;
        width: max-content;
        overflow: auto;
        .workimngimg {
          display: block;
          width: 4rem;
          height: 4rem;
          margin-right: 0.5rem;
          border-radius: 5px;
        }
      }
    }
  }
  .buttom {
    background-color: #ffffff;
    margin-top: -0.2rem;
    // border-radius: 10px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    padding: 0.2rem;
    .title {
      display: flex;
      align-items: center;
      height: 100%;
      .left {
        width: 4px;
        height: 18px;
        background: #409eff;
        border-radius: 3px;
        margin-right: 0.2rem;
      }
    }
    .worktypeName {
      margin-top: 0.2rem;
      margin-bottom: 0.2rem;
    }
    .worksolution {
      background-color: #f8f8f8;
      border-radius: 10px;
      padding: 0.1rem;
      img {
        width: 100%;
      }
    }
    .worksolutionsolutionTime {
      background-color: #f8f8f8;
      padding: 0.1rem;
    }
  }

  .mb {
    margin-bottom: 0.4rem;
  }

  .mb2 {
    margin: 0.8rem 0;
  }
}
</style>