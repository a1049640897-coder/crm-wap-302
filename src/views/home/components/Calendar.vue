<template>
  <div class="calendar-contain">
    <div class="calendar-header">
      <div class="calendar-header-icon" @click="handleSwitchMonth(-7)">
        <van-icon name="arrow-left" />
      </div>
      <div class="calendar-header-day">{{currentMonth}}</div>
      <div class="calendar-header-icon" @click="handleSwitchMonth(7)">
        <van-icon name="arrow" />
      </div>
    </div>
    <div class="calendar-view">
      <div class="day-list">
        <div class="day-list-item" :class="{'day-list-item-act': item.day === currentDay}" v-for="item in sevenDay" :key="item.title" @click="handleCurrent(item)">
          <div class="day-list-item-title">{{item.title}}</div>
          <div class="day-list-item-day">{{item.showValue}}</div>
        </div>
      </div>
      <div class="info-list" v-if="!!dayInfoList.length">
        <div class="info-list-item" v-for="item in dayInfoList" :key="item.id">
          <div class="dot-wap">
            <div class="dot"></div>
          </div>
          <div style="flex: 1;"><span style="font-size: 0.9rem">{{item.content}}</span></div>
        </div>
      </div>
      <div v-else class="info-empty">无日程</div>
      <div class="btn-plus" @click="handleAddCalendar">
        <svg t="1634717333311" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2404" width="64" height="64">
          <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z m192 472c0 4.4-3.6 8-8 8H544v152c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V544H328c-4.4 0-8-3.6-8-8v-48c0-4.4 3.6-8 8-8h152V328c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v152h152c4.4 0 8 3.6 8 8v48z" p-id="2405" fill="#409EFF"></path>
        </svg>
      </div>
    </div>
    <van-popup v-model="show" position="right">
      <div class="home-popup-contain">
        <div class="calendar-form">
          <div class="calendar-form-item">
            <div class="form-label">
              <span class="requireRed">*</span>
              <span>内容：</span>
            </div>
            <textarea class="form-info" rows="5" placeholder="请输入"></textarea>
          </div>
          <div class="calendar-form-item">
            <div class="form-label">
              <span class="requireRed">*</span>
              <span>时间：</span>
            </div>
            <div class="form-time-info" @click="handleShowTime">
              <span>请选择</span>
              <van-icon name="arrow" />
            </div>
          </div>
        </div>
        <!-- <div v-for="item in 100" :key="item">{{item}}</div> -->
      </div>
    </van-popup>
    <van-popup v-model="timeShow" position="bottom">
      <van-datetime-picker v-model="currentTime" type="time" title="选择时间" @confirm="handleTimeConfirm"/>
    </van-popup>
  </div>
</template>

<script>
// addCalendarApi
import { calendarListApi } from '../api'
import dayjs from 'dayjs'
export default {
  data() {
    return {
      show: false,
      timeShow: false,
      sevenDay: [{
        title: '周一',
        showValue: '',
        day: ''
      }, {
        title: '周二',
        showValue: '',
        day: ''
      }, {
        title: '周三',
        showValue: '',
        day: ''
      }, {
        title: '周四',
        showValue: '',
        day: ''
      }, {
        title: '周五',
        showValue: '',
        day: ''
      }, {
        title: '周六',
        showValue: '',
        day: ''
      }, {
        title: '周日',
        showValue: '',
        day: ''
      }],
      currentMonth: dayjs().format('YYYY-MM'),
      currentDay: dayjs().format('YYYY/MM/DD'),
      currentTime: null,
      num: 1,
      dayInfoList: []
    }
  },
  created() {
    this.handleInit()
    this.handleDayInfo()
  },
  methods: {
    handleInit() {
      this.sevenDay = this.sevenDay.map((item, index) => {
        const day = dayjs().startOf('week').add(this.num + index, 'day')
        return {
          ...item,
          showValue: day.format('DD'),
          day: day.format('YYYY/MM/DD')
        }
      })
    },

    handleDayInfo() {
      this.$loading(true)
      calendarListApi([this.currentDay]).then(res => {
        if (res.data && res.data.length) {
          this.dayInfoList = res.data[0].jobContent || []
        } else {
          this.dayInfoList = []
        }
      }).finally(() => {
        this.$loading(false)
      })
    },

    handleSwitchMonth(val) {
      this.num += val
      this.currentMonth = dayjs().startOf('week').add(this.num, 'day').format('YYYY-MM')
      this.handleInit()
    },

    handleCurrent(item) {
      this.currentMonth = dayjs(item.day).format('YYYY-MM')
      this.currentDay = item.day
      this.handleDayInfo()
    },

    handleAddCalendar() {
      this.show = true
    },

    handleShowTime() {
      this.timeShow = true
    },
    handleTimeConfirm() {
      this.timeShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
.calendar-contain {
  background: #ffffff;
  padding: 0.8rem;
  box-sizing: border-box;
  padding-bottom: 1.5rem;
  margin-bottom: 1rem;
  .calendar-header {
    display: flex;
    justify-content: center;
    align-items: center;
    .calendar-header-icon {
      font-size: 1.2rem;
    }
    .calendar-header-day {
      margin: 0 1rem;
    }
  }
  .calendar-view {
    margin-top: 0.5rem;
    position: relative;
    .day-list {
      display: flex;
      justify-content: space-between;
      .day-list-item {
        flex: 1;
        padding: 10px;
        border-radius: 0.2rem;
        color: #333333;
        font-size: 0.9rem;
        transition: all 0.2s ease;
        .day-list-item-title {
          color: #999;
          text-align: center;
        }
        .day-list-item-day {
          margin-top: 0.7rem;
          text-align: center;
        }
      }
      .day-list-item-act {
        .day-list-item-title,
        .day-list-item-day {
          color: #fff;
        }
        background-color: #409eff;
      }
    }
    .info-list {
      margin-top: 1rem;
      .info-list-item {
        display: flex;
        align-items: center;
        margin-bottom: 0.3rem;
      }
    }
  }
  .dot-wap {
    width: 0.9rem;
    height: 0.9rem;
    border-radius: 50%;
    margin-right: 0.15rem;
    border: 1px solid rgb(64, 158, 255);
    display: flex;
    justify-content: center;
    align-items: center;
    // margin-top: 0.4rem;
    margin-right: 0.5rem;
    .dot {
      width: 0.6rem;
      height: 0.6rem;
      border-radius: 50%;
      background-color: rgb(64, 158, 255);
    }
  }
  .btn-plus {
    position: absolute;
    right: 0;
    bottom: -1rem;
    width: 3rem;
    svg {
      width: 100%;
      height: 100%;
    }
  }

  .info-empty {
    min-height: 5rem;
    line-height: 5rem;
    color: rgb(153, 153, 153);
    text-align: center;
  }

  .home-popup-contain {
    width: 80vw;
    height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;
    padding: 1rem;
    .calendar-form {
      .calendar-form-item {
        display: flex;
        margin-bottom: 1rem;
        // .form-label {}
        .form-info {
          flex: 1;
          width: 100%;
          padding: 0.4rem;
          border-color: #dddddd;
          resize: none;
          &::placeholder {
            color: #999999;
          }
        }
        .form-time-info {
          flex: 1;
          text-align: right;
        }
      }
    }
  }
}
</style>
