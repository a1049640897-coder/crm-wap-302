<template>
  <div class='feedback-container'>
    <div id='allBtns' class='float-btns' ref="allBtns">
      <div class='help-wrap' @click="handleToHelpCenter">
        <img class='img' src="@/assets/images/question.png" />
        <span>帮助中心</span>
      </div>
      <div class='help-wrap' @click="handleFeekback">
        <img class='img' src="@/assets/images/tigongdan.png" />
        <span>提交工单</span>
      </div>
      <div class='help-wrap' @click="handleMyworkOrder">
        <img class='img' src="@/assets/images/myworkrukou.png" />
        <span>我的工单</span>
      </div>
    </div>

    <div v-show="isShow">
      <div class="common-bottom-btns" v-for="(item,index) in columnBarList" :key="index" v-show="itemShowFilter(item)" :style="item.style">
        <div class="common-bottom-btn" @click="handleOpenBtns(item)" :id='item.id' :style="item.style">
          <img :src="`${item.src}`" alt="">
          <span>{{item.title}}</span>
        </div>
      </div>
    </div>

  </div>

</template>

<script>
import draggableMixin from "@/utils/draggable";
import { mapState } from 'vuex'

export default {
  mixins: [draggableMixin],
  data() {
    return {
      btnshow: false,
      columnBarList: [
        {
          title: '提交工单',
          id: 'btn',
          style: 'bottom: 5.5rem',
          src: require("@/assets/images/icons/feedback.png"),
          isShow: true
        },
        {
          title: '返回首页',
          id: 'btn',
          style: 'bottom: 8rem',
          src: require("@/assets/images/icons/home.png"),
          isShow: true
        }
      ]
    };
  },
  computed: {
    isShow() {
      let isShow = true
      console.log(this.$route);
      if (this.$route.meta.isCloseWorkOrder) isShow = false
      return isShow
    }
  },
  methods: {
    itemShowFilter(item) {
      if (item.title === '返回首页' && this.$route.name === 'home-index') {
        return false
      } else return item.isShow
    },
    handleOpenBtns(e) {
      if (e.title == '提交工单') {
        this.btnshow = !this.btnshow;
        if (this.btnshow) {
          this.$refs.allBtns.style.height = "7rem";
        } else {
          this.handleCloseBtns();
        }
      } else if (e.title == '返回首页') {
        this.$router.replace({ path: '/home' })
      }
    },
    handleCloseBtns() {
      this.$refs.allBtns.style.height = "0";
      this.btnshow = false;
    },
    handleToHelpCenter() {
      this.handleCloseBtns();
      this.$router.push("/workOrder/HelpCenter");
    },
    handleFeekback() {
      this.handleCloseBtns();
      this.$router.push("/workOrder/SupportWorkOrder");
    },
    handleMyworkOrder() {
      this.handleCloseBtns();
      this.$router.push("/workOrder/MyWorkorder");

    },
  },
};
</script>

<style lang="scss" scoped>
.feedback-container {
  .btn {
    position: fixed;
    right: 1rem;
    bottom: 3.6rem;
    z-index: 100;
    opacity: 1;
    transition: opacity 1s;
    width: 42px;
    height: 42px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background-color: #0088fe;
    color: #fff;
    .img {
      width: 12vw;
    }
  }

  .float-btns {
    position: fixed;
    right: 0.7rem;
    bottom: 7.5rem;
    z-index: 9999;
    height: 0;
    // height: 7.5rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    background-color: #fff;
    box-shadow: 0 0 10px #eee;
    box-sizing: border-box;
    transition: height 0.3s;
    .help-wrap {
      flex: 1;
      display: flex;
      align-items: center;
      padding: 0 0.3rem;
      font-size: 0.9rem;
    }
    .img {
      margin-right: 0.1rem;
      width: 1rem;
      margin-right: 0.3rem;
    }
  }
}
</style>