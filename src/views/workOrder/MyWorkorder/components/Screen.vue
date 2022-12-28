<template>
  <div>
    <van-popup position="bottom" safe-area-inset-bottom v-model="isDialog" get-container="#app" round>
      <div class="common-popup">
        <div class="common-popup-header">
          <div></div>
          <div class="common-popup-header-title">
            <span>筛选</span>
          </div>
          <div></div>
        </div>
        <div class="common-popup-body">
          <van-form ref="ScreenForm" @submit="handleConfirm" :show-error-message="false" validate-trigger="onSubmit">
            <RePick  v-model="form.systemId" label="所属系统" :list="systemList" isCell />
            <RePick  v-model="form.dateType" label="日期类型" :list="dateTypeList" isCell />
            <van-field readonly clearable clickable input-align="right" name="calendar" :value="showDate" :label="dateName" placeholder="点击选择日期" @click="dateShow = true" />
            <div class="common-popup-footer">
              <van-button style="width: 8rem; margin-right: 1rem;" native-type="button" @click="handleClose">取消</van-button>
              <van-button type="info" style="width: 8rem;" native-type="submit">确定</van-button>
            </div>
          </van-form>
        </div>
      </div>
    </van-popup>
    <van-calendar v-model="dateShow" ref="vanCalendar" @confirm="handleDateSelect" :default-date="defaultDate" type="range" color="#0088FE" allow-same-day :min-date="new Date()" />
  </div>

</template>

<script>
// import { getUserSystem } from '@/api/common'
import {systemboxApi} from '@/api/workOrder'
import dayjs from 'dayjs'
export default {
  name: 'Screen',
  components: {
    RePick: () => import('@/components/ReComponents/RePick')
  },
  props: {
    isOpen: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      isDialog: false,
      defaultDate: null,
      dateShow: false,
      form: {
        systemId: null,
        dateType: '',
        startDate: '',
        endDate: ''
      },
      dateTypeList: [
        {
          id: 1,
          title: '添加日期'
        },
        {
          id: 2,
          title: '解决日期'
        }
      ],
      systemList: []
    }
  },
  watch: {
    isOpen(val) {
      this.isDialog = val
    },
    isDialog(val) {
      this.$emit('update:isOpen', val)
    }
  },
  computed: {
    showDate() {
      if (this.form.startDate) {
        return this.form.startDate + '-' + this.form.endDate
      } else {
        return null
      }
    },
    dateName() {
      if (this.form.dateType == 1) {
        return '添加日期'
      } else {
        return '解决日期'
      }
    }
  },
  mounted() {
    this.getsysInfo()
  },
  methods: {
    handleConfirm() {
      this.$emit('complete',this.form)
      this.isDialog = false
    },
    handleClose() {
      this.isDialog = false
    },
    handleDateSelect(e) {
      this.defaultDate = e
      this.form.startDate = dayjs(e[0]).format('YYYY/MM/DD')
      this.form.endDate = dayjs(e[1]).format('YYYY/MM/DD')
      this.dateShow = false
    },
    getsysInfo() {
      systemboxApi().then(res => {
        this.systemList = res.data.map(item => {
          return {
            title: item.title,
            id: item.id
          }
        })
      })
    }
  }

}
</script>

<style>
</style>