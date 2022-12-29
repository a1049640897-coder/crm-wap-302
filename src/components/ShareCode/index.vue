<template>
  <van-overlay class="share-box" :show="isOpen" @click.stop="handleStopClose" z-index="99999">
    <van-icon class="close-btn" name="close" @click.stop="handleClose" />
    <div class="container" v-if="isOpen">
     
      <div v-show="imageCanvas" v-if="canvasShow" class="canvas_img" id="imgCanvas"></div>
      <div v-if="!imageCanvas" ref="saveToImage" :class="resultObj.address && resultObj.address.length >30 ? 'box h-lg': 'box'">
        <div class="header">
          <div class="hd-lf">
            <img src="~@/assets/images/avatar_02.png" alt="">
          </div>
          <div class="hd-rt">
            让您学有所成, 让教育成就梦想  
          </div>
        </div>
        <div class="content">
          <span class="round" style="left:-12px;"></span>
          <span class="round" style="right:-12px;"></span>
          <div class="ct-hd">
            <div class="hd-lf"><span> {{counselTab == 'MarketAct' ? '营销活动' : '讲座登记'}}</span>
              <img :src="require('@/assets/images/tpLtBg.png')" />
            </div>
            <div class="hd-rt">
              <span :class="setColor(resultObj.state)" style="margin-right:1rem">{{filterState(resultObj.state)}}</span>
            </div>
          </div>
          <div class="ct-box">
            <div class="ct-box-in" id="order-box">
              <div class="bx-tt">
                <span class="vertical_icon"></span>
                <!-- <span v-for="(item, index) in list.orderPackets" :key="index">{{item}}<span v-show="index + 1 !== list.orderPackets.length">+</span> -->
                <!-- </span> -->
                {{resultObj.title}}
              </div>
              <div class="bx-nb color-blue">
                {{counselTab == 'MarketAct' ? '活动时间' : '讲座时间'}} :
                <span>
                  <span v-if="counselTab == 'MarketAct'">{{resultObj.startTime}} ~ {{resultObj.endTime}}</span>
                  <span v-else>{{resultObj.dateStr}}</span>
                </span>
              </div>
              <div class="bx-nb" v-if="counselTab !== 'MarketAct'">
                讲师姓名: <span>{{resultObj.teachers}}</span>
              </div>
              <div class="bx-nb">
                {{counselTab == 'MarketAct' ? '活动地点' : '讲座地点'}}: <span>{{resultObj.address}}</span>
              </div>
            </div>

            <div class="qr-wrapper" ref="ref_wrapper" v-if="!loading" :style="{'background': 'url('+ imgurl +')'}">
              <img :src="require('@/assets/jy.png')" height="20%" />
            </div>

            <div class="ft-tt" v-if="!loading">
              长按识别二维码
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="share_btn">长按上方海报分享给好友</div>
  </van-overlay>
</template>
<script>
import { Overlay, Icon, Loading } from 'vant'
// import { paymentOrderInfoApi, getPayingAgentApi, getWechatConfigApi } from '@/api/order'
import { getCodeActiveListApi, getCodeActiveMarketListApi } from '@/api/potentialGuest/activity'
import html2canvas from 'html2canvas'
import { mapState, mapMutations } from 'vuex'

export default {
  props: {
    isOpen: {
      type: Boolean,
      default: true
    },
    sysShellId: [String, Number], //分校的id
    sId: [String, Number], // 活动的id
    counselTab: {
      type: String,
      default: 'LectureReg' // 0 讲座登记  1 营销活动
    }
  },
  components: {
    [Loading.name]: Loading,
    [Overlay.name]: Overlay,
    [Icon.name]: Icon
  },
  computed: {
    ...mapState({
      roleFlag: state => state.common.user.info.roleFlag
    }),
  },
  watch: {
    isOpen(val) {
      if (val) this.ininForm()
    },
    showForm(val) {
      this.$emit('update:isOpen', val)
    }
  },
  filters: {
    // 加密姓名
    filterName(val) {
      if (val) {
        return '*' + (val.substring(1))
      }
    },
    // 加密手机号
    filterTel(val) {
      if (val) {
        return (val.substring(3, 0)) + '****' + (val.substring(7))
      }
    }
  },
  data() {
    return {
      canvasShow: false,
      imageCanvas: false,
      wechatConfig: null,
      thisPayment: localStorage.getItem('this-payment'),
      showForm: false,
      loading: false,
      imgurl: null,
      count: 0,
      list: {
        studentName: '',
        mobile: '',
        orderPackets: [],
        instructions: '',
        amountMoney: '',
        balance: '',
        isSecond: false
      },
      resultObj: {}
    }
  },
  methods: {
    ...mapMutations('activity/', ['SET_QUESOBJ']),
    setColor(val) {
      if (val == 1) {
        return 'color-green'
      } else if (val == 2) {
        return 'color-blue'
      } else {
        return 'color-gray'
      }
    },
    filterState(val) {
      if (val == 1) {
        return '未开始'
      } else if (val == 2) {
        return '进行中'
      } else {
        return '已结束'
      }
    },
    handleStopClose() {
    },
    handleClose() {
      this.canvasShow = false
      this.imageCanvas = false
      this.count = 0
      // 清楚关联问卷弹窗
      this['SET_QUESOBJ']({ quesConnectObjIsUpdate: false })
      this.$emit('close')
    },
    checkCodeIsShow() {
      let api = this.roleFlag == 2 ? getCodeActiveMarketListApi : getCodeActiveListApi
      return new Promise((resolve, reject) => {
        api(this.sId, this.sysShellId).then(res => {
          if (res && res.data) {
            resolve(res)
          } else {
            reject('err')
          }
        }).catch(() => {
          reject('err')
        })
      })
    },
    async ininForm() {
      this.resultObj = {}
      this.loading = true
      let api = this.roleFlag == 2 ? getCodeActiveMarketListApi : getCodeActiveListApi
      api(this.sId, this.sysShellId).then(res => {
        this.resultObj = res.data || {}
        this.imgurl = `data:image/png;base64,${this.resultObj.checkCode}`
        this.loading = false
        if (!this.canvasShow) this.initCanvas()
      }).catch(() => {
        this.loading = false
      })
    },
    initCanvas() {
      this.count += 1
      this.canvasShow = true
      if (this.$refs.saveToImage || this.count > 10) {
        this.$nextTick(() => {
          if (!this.$refs.saveToImage) return
          html2canvas(this.$refs.saveToImage, { backgroundColor: "#2438e7" }).then(canvas => {
            const canvseParent = document.getElementById('imgCanvas')
            const img = document.createElement("img");
            img.src = canvas.toDataURL(`image/png`)
            img.style.cssText = 'width: 100% !important;height: 100% !important;border-radius: 16px !important;'
            canvseParent.appendChild(img)
            this.imageCanvas = true
          })
        })
      } else this.initCanvas()
    }
  }
}
</script>

<style lang="scss" scoped>
.share-box {
  z-index: 999999;
  .color-green {
    color: #67c23a;
  }
  .color-blue {
    color: #0088fe !important;
  }
  .color-gray {
    color: #999999;
  }
  .close-btn {
    position: absolute;
    right: 1%;
    top: 3rem;
    font-size: 30px;
    color: white;
  }
  .container {
    width: 100%;
    padding-top: 5rem;
    padding-bottom: 12px;
    justify-content: center;
    .canvas_img {
      height: 62vh;
      width: 92%;
      margin-left: 4%;
      font-size: 28px;
    }
    .box {
      border-radius: 16px;
      background-image: url('~@/assets/images/buleBg.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      height: 62vh;
      width: 92%;
      margin-left: 4%;
      // box-sizing: border-box;
      padding: 16px;
      .header {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .hd-lf {
          letter-spacing: 5px;
          img {
            width: 25px;
            height: 25px;
            vertical-align: middle;
          }
        }
        .hd-rt {
          height: 100%;
          vertical-align: middle;
          font-size: 12px;
          color: #fff;
          margin-left: 10px;
        }
      }
      .share-loading {
        display: flex;
        top: 40%;
        left: 50%;
        transform: translateX(-50%);
      }
      .content {
        border-radius: 16px;
        border-top-left-radius: 20px;
        background-color: white;
        margin-top: 16px;
        height: calc(100% - 50px);
        z-index: 10;
        position: relative;
        .ct-hd {
          height: 60px;
          width: 100%;
          z-index: 5;
          .hd-lf {
            float: left;
            height: 100%;
            object-fit: cover;
            width: 45%;
            border-top-left-radius: 16px;
            text-align: center;
            span {
              position: absolute;
              left: 16px;
              top: 0;
              line-height: 44px;
              font-size: 16px;
              color: #1f22a8;
              z-index: 100;
            }
            img {
              position: absolute;
              left: 0;
              top: 0;
              height: 60px;
              z-index: 10;
            }
          }
          .hd-rt {
            float: right;
            width: 55%;
            height: 100%;
            line-height: 44px;
            font-size: 14px;
            color: #1f22a8;
            text-align: right;
            text-indent: 1em;
          }
        }
        .ct-box {
          display: flex;
          flex-direction: column;
          position: absolute;
          left: 0;
          top: 42px;
          width: 100%;
          padding: 20px;
          height: calc(100% - 20px);
          font-size: 14px;
          line-height: 24px;
          flex: 1;

          .ct-box-in {
            .bx-tt {
              font-size: 18px;
              // font-weight: 600;
              margin-bottom: 12px;
              word-wrap: break-word;
              word-break: normal;

              .vertical_icon {
                height: 20px;
                background: #4148f4;
                display: inline-block;
                border: 2px solid #4148f4;
                vertical-align: text-top;
                margin-right: 6px;
              }
            }

            .bx-nb {
              color: gray;
              margin-left: 10px;
              // font-weight: 600;
            }

            .bx-rg {
              color: red;
              margin-left: 10px;
            }
          }

          .qr-wrapper {
            flex-grow: 1;
            text-align: center;
            flex: 1;
            height: 100%;
            margin-top: 10px;
            background-size: auto 100% !important;
            background-repeat: no-repeat !important;
            background-position: center !important;
            position: relative;
            img {
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translateX(-50%) translateY(-50%);
            }
          }

          .ft-tt {
            color: gray;
            text-align: center;
            // font-weight: 600;
            font-size: 15px;
            line-height: 36px;
          }
        }
        .round {
          position: absolute;
          bottom: 30%;
          display: block;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: #3a44f0;
        }
      }
    }
    .h-lg {
      height: 75vh;
    }
  }
  .share_btn {
    z-index: 1000;
    border-radius: 10px;
    width: 92%;
    margin-left: 4%;
    height: 50px;
    font-size: 18px;
    line-height: 50px;
    color: white;
    background-color: #4148f3;
    text-align: center;
  }
}
</style>