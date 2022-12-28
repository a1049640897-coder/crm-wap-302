<template>
  <div class="common-mbLine">
    <van-field readonly :name="name" input-align="right" :value="value" :required="isRequrie" :rules="[{ required: isRequrie, message: '请选择' + label }]" :label="label" :placeholder="placeholder" @click="yearShow = true">
      <template #button>
        <van-icon v-if="value && clearable" name="clear" color="#C8C9CC" size="16" @click.stop="handleClear" />
        <van-icon v-else name="arrow" color="#969799" size="16" />
      </template>
    </van-field>
    <van-popup position="bottom" safe-area-inset-bottom v-model="yearShow">
      <van-picker :title="title" show-toolbar :columns="yearList" :default-index="currentYearIndex" @confirm="onConfirm" @cancel="onCancel" />
    </van-popup>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import dayjs from 'dayjs'
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: Number,
    title: {
      type: String,
      default: '年份'
    },
    name: {
      type: String,
      default: 'year'
    },
    label: {
      type: String,
      default: '年份'
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    isRequrie: Boolean,
    clearable: Boolean
  },
  data() {
    return {
      yearShow: false
    }
  },
  computed: {
    ...mapState({
      yearList: state => state.common.setting.yearList,
      currentYearIndex: function(state) {
        let yearStart = state.common.setting.yearStart
        if (this.value) {
          return Number(this.value) - yearStart
        }
        return Number(dayjs().format('YYYY')) - yearStart
      }
    })
  },
  methods: {
    onConfirm(value) {
      this.handleUpdate(value)
      this.yearShow = false
    },
    onCancel() {
      this.yearShow = false
    },
    handleClear() {
      this.handleUpdate(null)
    },
    handleUpdate(e) {
      this.$emit('change', e)
    }
  }
}
</script>