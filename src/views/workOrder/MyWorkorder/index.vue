<template>
  <div class="work">
    <div class="work-header">
      <van-search v-model="listQuery.param.keyword" class="header-search" placeholder="请输入问题描述关键词" input-align="center" @search="handleSearch" @clear="handleClear" />
      <img src="@/assets/images/workscreen.png" alt="" class="header-workscreen" @click="handleScreenShow">
    </div>
    <div class="work-box">
      <van-checkbox-group v-model="listQuery.param.state" class="box-group" @change="handleChangeBox">
        <van-checkbox v-for="item in states" :key="item.value" :name="item.value" shape="square">{{item.text}}</van-checkbox>
      </van-checkbox-group>
    </div>
    <div class="list-tip">提示：请点击卡片查看解决方案</div>
    <RMList :moreLoading.sync="loading" :refreshing.sync="refreshing" :finished.sync="finished" @onLoad="handleLoad" @onRefresh="handleRefresh" isMore :tableList="tableList">
      <div style="width:100;display:flex;flex-direction:column;align-items:center;">
        <div class="list-item" v-for="item in tableList" :key="item.id">
          <div class="item-top" @click="handleToDetail(item)">
            <div class="top-left">
              <div class="left-txt">
                {{item.systemName}}-{{item.platform == 1 ? 'PC' : 'WAP'}}-{{item.menuName}}
              </div>
              <div class="left-des">{{item.note}}</div>
              <div class="left-date">{{item.createTime}}</div>
            </div>
            <div class="top-right">
              <div class="right-status" :style="{color:item.state==1?'#F21414':item.state==2?'#0088FE':item.state==3 ? '#CCCCCC':'#999999'}">{{item.state == 1 ? '未处理' : item.state == 2 ? '处理中' : item.state == 3 ? '已处理' : item.state == 4 ? '已撤销' : null}}</div>
              <img v-show=" item.imgList&&item.imgList.length" :src="item.imgList&&item.imgList.length?item.imgList[0]:null" alt="">
            </div>
          </div>
          <div class="item-bottom">
            <div class="work_conter_bottom_item" v-show="!urgeShow(item.urgeTime, item.createTimeLong) && (item.state == 1 || item.state == 2)">
              <img src="@/assets/images/workurge.png" style="width: 0.3rem, height: 0.3rem, marginLeft: 10px" alt="" />
              <span class="textcolor" @click="handelurge(item)">催促</span>
            </div>
            <div class="work_conter_bottom_item" v-show="urgeShow(item.urgeTime, item.createTimeLong)&& (item.state == 1 || item.state == 2)">
              <img src="@/assets/images/huiseworkurge.jpg" style="width: 0.3rem, height: 0.3rem, margin-left:10px" alt="" />
              <span>催促</span>
            </div>
            <div class="work_conter_bottom_item" v-show="item.state == 1" style="border-right: #eee 1px solid;border-left: #eee 1px solid;">
              <img src="@/assets/images/workedit.png" style="width: 0.3rem, height: 0.3rem, margin-left:10px" alt="" />
              <span class="textcolor" @click="handeltoeditpage(item)">编辑</span>
            </div>
            <div class="work_conter_bottom_item" v-show="item.state == 1">
              <img src="@/assets/images/workrevoke.png" style="width: 0.3rem, height: 0.3rem, margin-left:10px" alt="" />
              <span class="textcolor" @click="handlerevokeshow(item)">撤销</span>
            </div>
            <div class="work_conter_bottom_item" v-show="item.state == 4">
              <img src="@/assets/images/chongxin.png" style="width: 0.3rem, height: 0.3rem, margin-left:10px" alt="" />
              <span class="textcolor" @click="handeltoeditpage(item)">重新提交</span>
            </div>
          </div>
        </div>
      </div>
    </RMList>
    <Screen :is-open.sync="screenShow" @complete="onComplete"></Screen>
  </div>
</template>

<script>
import { Toast, Dialog } from "vant";
import { getScrollTop } from "@/utils";
import {
  myworkOrderApi,
  workOrderTypeurgeApi,
  workOrderTyperevokeApi,
} from "@/api/workOrder";
export default {
  name: "workOrder-myworkorder",
  components: {
    RMList: () => import("@/components/ReComponents/RMList"),
    Screen: () => import("@/views/workOrder/MyWorkorder/components/Screen.vue"),
  },
  data() {
    return {
      states: [
        { value: 1, text: "未处理" },
        { value: 2, text: "处理中" },
        { value: 3, text: "已处理" },
        { value: 4, text: "已撤销" },
      ],
      listQuery: {
        param: {
          systemId: null,
          keyword: "",
          state: [],
          dateType: "",
          startDate: "",
          endDate: "",
        },
        pageInfo: {
          pageNum: 1,
          pageSize: 20,
          sort: [{ column: "createTime", type: 1 }],
        },
      },
      tableList: [],
      loading: false, //是否处于触底加载状态，加载过程中不触发load事件
      finished: false, //是否已加载完成，加载完成后不再触发load事件
      refreshing: false, //是否处于下拉加载中状态
      screenShow: false,
      height: 0,
    };
  },
  activated() {
    this.handleScrollInit();
  },
  deactivated() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  mounted() {
    this.handleInit()
    this.handleScrollInit();
  },
  methods: {
    handleInit() {
      if (this.$route.query && this.$route.query.id) {
        this.listQuery.param.keyword = this.$route.query.id
      }
      this.getTableList('init');
    },
    handleScroll() {
      getScrollTop().then((height) => {
        this.height = height;
      });
    },
    handleScrollInit() {
      window.addEventListener("scroll", this.handleScroll);
      window.scrollTo(0, this.height);
    },
    Init() {
      this.listQuery = {
        param: {
          systemId: null,
          keyword: "",
          state: [],
          dateType: 1,
          startDate: "",
          endDate: "",
        },
        pageInfo: {
          pageNum: 1,
          pageSize: 20,
          sort: [{ column: "createTime", type: 1 }],
        },
      };
    },
    urgeShow(urgeTime, createTimeLong) {
      let Timer = new Date().getTime();
      if (urgeTime) {
        if (Timer - Number(urgeTime) < 1000 * 60 * 60 * 2) {
          return true;
        } else {
          return false;
        }
      } else {
        if (Timer - Number(createTimeLong) < 1000 * 60 * 60 * 2) {
          return true;
        } else {
          return false;
        }
      }
    },
    // 获取列表数据
    getTableList(val) {
      this.loading = true;
      this.$loading(true, 'myWorkOrderList');
      myworkOrderApi(this.listQuery).then(res => {
        if (['init', 'refresh'].includes(val)) {
          this.tableList = res.data || []
        } else if (['urge'].includes(val)) {
          this.tableList = res.data || []
        } else {
          this.tableList = this.tableList.concat(res.data || [])
        }
        if (res.data.length < this.listQuery.pageInfo.pageSize) {
          this.finished = true
        }
      }).finally(() => {
        this.listQuery.param.pageNum = 20
        this.$nextTick(() => {
          this.refreshing = false;
          this.loading = false;
        });
        this.$loading(false, 'myWorkOrderList');
      })
    },
    // 重置列表
    resetPage() {
      this.tableList = [];
      this.listQuery.pageInfo.pageNum = 1;
      this.getTableList('init');
    },
    handleSearch() {
      this.finished = false
      this.listQuery.pageInfo.pageNum = 1;
      this.getTableList('init')
    },
    handleClear() {
      this.finished = false
      this.listQuery.pageInfo.pageNum = 1;
      this.getTableList('init');
    },
    handleChangeBox() {
      this.loading = false
      this.finished = false
      this.listQuery.pageInfo.pageNum = 1;
      this.getTableList('init')
    },
    // 下拉刷新
    handleRefresh() {
      this.refreshing = true;
      this.listQuery.pageInfo.pageNum = 1;
      this.finished = false
      this.getTableList('refresh')
    },
    // 触底加载
    handleLoad() {
      this.listQuery.pageInfo.pageNum += 1;
      this.getTableList('more');
    },
    // 点击催促
    handelurge(item) {
      workOrderTypeurgeApi(item.id).then(() => {
        Toast.success("已联系管理员处理，请耐心等待");
        this.finished = false
        this.listQuery.pageInfo.pageNum = 1
        this.getTableList('urge')
      }).finally(() => {
        window.scrollTo(0, this.height);
      });
    },
    // 编辑
    handeltoeditpage(val) {
      this.$router.push({
        path: 'supportWorkOrder',
        query: {
          workId: val.id
        }
      })
    },
    // 点击撤销
    handlerevokeshow(item) {
      Dialog.confirm({
        width: "75%",
        confirmButtonColor: "#FF3300",
        message: "确定撤销吗？",
      }).then(() => {
        workOrderTyperevokeApi(item.id).then(res => {
          if (res.status === 200) {
            this.finished = false
            this.listQuery.pageInfo.pageNum = 1
            this.getTableList('urge')
          }
        });
      }).catch(() => {
      }).finally(() => {
        window.scrollTo(0, this.height);

      });
    },
    handleScreenShow() {
      this.screenShow = true;
    },
    onComplete(val) {
      const { dateType, startDate, endDate, systemId } = val
      this.loading = false
      this.finished = false
      this.listQuery.param.dateType = dateType;
      this.listQuery.param.startDate = startDate;
      this.listQuery.param.endDate = endDate;
      this.listQuery.param.systemId = systemId;
      this.listQuery.pageInfo.pageNum = 1;
      this.getTableList('init');
    },
    handleToDetail(val) {
      this.$router.push({
        path: 'workDetail',
        query: {
          workId: val.id
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.work {
  width: 100%;
  height: 100%;
  background: #fff;
  .work-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .header-search {
      flex: 1;
    }
    .header-workscreen {
      width: 15px;
      height: 15px;
      margin: 5px;
    }
  }
  .work-box {
    width: 100%;
    .box-group {
      width: 100%;
      display: flex;
      justify-content: space-around;
      font-size: 0.86rem;
    }
  }
  .list-tip {
    width: 100%;
    color: #0088fe;
    font-size: 0.86rem;
    box-sizing: border-box;
    padding-left: 0.8rem;
    margin: 0.8rem 0;
  }
  .list-item {
    width: 95%;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    margin: 0.8rem 0;
    .item-top {
      width: 100%;
      height: 130px;
      display: flex;
      .top-left {
        flex: 1;
        width: 70%;
        box-sizing: border-box;
        padding: 0.8rem 0 0 0.8rem;
        .left-txt {
          font-size: 0.86rem;
        }
        .left-des {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin: 1rem 0;
        }
        .left-date {
          font-size: 0.86rem;
          color: #999999;
        }
      }
      .top-right {
        width: 30%;
        height: 100%;
        text-align: center;
        padding: 0.8rem 0 0 0.8rem;
        .right-status {
          font-size: 0.86rem;
        }
        img {
          margin-top: 10px;
          width: 60px;
          height: 60px;
        }
      }
    }
    .item-bottom {
      width: 100%;
      height: 2.2rem;
      margin-top: 0.2rem;
      border-top: 1px solid #eeeeee;
      display: flex;
      align-items: center;
      justify-content: center;
      .work_conter_bottom_item {
        min-width: 30%;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        // border-right: #eee 1px solid;
        :last-child {
          border: none !important;
        }
        span {
          margin-left: 0.1rem;
        }
        .textcolor {
          color: #0088fe;
        }
        img {
          width: 15px;
          height: 15px;
          margin-right: 5px;
        }
      }
      .work_conter_bottom_item:nth-child(4) {
        border: none;
      }
    }
  }
}
</style>