<template>
  <div class="Re-select">
    <div v-if="isUseSlot" @click="handleShow(true)">
      <slot></slot>
      <div v-show="false">
        <span v-if="multiple">{{ multipleValueShow.length }}</span>
        <span v-else>{{ showValue }}</span>
      </div>
    </div>
    <div class="Re-show" v-else @click="handleShow(true)">
      <div class="Re-show-label" v-if="lable">{{ lable }}</div>
      <div class="Re-show-view">
        <div class="Re-show-default-value Re-show-placeholder"
          v-if="multiple ? !multipleValueShow.length : !showValue.id">{{ placeholder }}</div>
        <div class="Re-show-default-value Re-show-value" :class="{ 'text-hidden': isValueHidden }" v-else>
          <span v-if="multiple">{{ multipleValueShow | titleFilter }}</span>
          <span v-else>{{ showValue.title || '' }}</span>
        </div>
        <div class="Re-show-icon" v-if="!clearable ? true : multiple ? !multipleValueShow.length : !showValue.id">
          <van-icon name="arrow" />
        </div>
        <div class="Re-show-icon" v-else>
          <van-icon name="close" @click.stop="handleClear" />
        </div>
      </div>
    </div>
    <div>
      <van-popup v-model="isPopupShow" position="bottom" round safe-area-inset-bottom lock-scroll lazy-render>
        <div class="Re-select-popup">
          <div class="Re-select-header">
            <div class="Re-select-header-cancel" @click="handleShow(false)">取消</div>
            <div class="Re-select-header-title">{{ title }}</div>
            <div class="Re-select-header-confirm" @click="handleConfirm">确认</div>
          </div>
          <div class="Re-select-bread" v-if="isCascader" :style="`padding: ${isCascader ? '5px 10px' : '10px'}`">
            <div v-for="(item, index) in breadList" :key="item.id" class="bread-item">
              <div :class="{ 'bread-active': index === breadList.length - 1 }" @click="handleLevel(item, index)">
                {{ item.title }}</div>
              <van-icon name="arrow" v-if="index != breadList.length - 1" />
            </div>
          </div>
          <form action="javascript:return true;" v-if="isShowSearch">
            <!-- <div class="Re-search-input">
              <van-icon class="Re-search-icon Re-search-lefticon" name="search" /> -->
            <!-- <input v-model="searchValue" class="Re-input" type="search" placeholder="请输入搜索关键词" /> -->
            <!-- <van-icon v-if="searchValue" class="Re-search-icon Re-search-righticon" name="clear" @click="handleSearchClear"/>
            </div> -->
            <van-search ref="search" v-model="searchValue" placeholder="请输入搜索关键词" clear-trigger="always" />
          </form>
          <div class="Re-select-contain" style="height: 40vh">
            <div v-if="!!showList.length">
              <van-checkbox-group v-model="multipleValue" v-if="multiple">
                <van-cell-group>
                  <div v-for="item in showList" :key="item.id" class="flex flex-c-center">
                    <van-cell clickable @click="toggle(item.id)">
                      <template #title>
                        <div v-if="searchValue && isCascader">
                          <span v-for="(el, i) in item.treeList" :key="el.id">
                            <span>{{ el.title }}</span>
                            <van-icon name="arrow" v-if="i < item.treeList.length - 1" />
                          </span>
                        </div>
                        <div v-else>{{ item.title }}</div>
                      </template>
                      <template #right-icon>
                        <van-checkbox :name="item.id" ref="checkboxes" shape />
                      </template>
                    </van-cell>
                    <van-button v-if="isCascader && !searchValue" :disabled="!item.children.length" type="info"
                      size="small" class="nextBtn" @click="handleNext(item)">下级</van-button>
                  </div>
                </van-cell-group>
              </van-checkbox-group>
              <van-radio-group v-model="selectValue" v-else>
                <van-cell-group>
                  <div v-for="item in showList" :key="item.id" class="flex flex-c-center">
                    <van-cell clickable @click="handleRadio(item.id)">
                      <template #title>
                        <div v-if="searchValue && isCascader">
                          <span v-for="(el, i) in item.treeList" :key="el.id">
                            <span>{{ el.title }}</span>
                            <van-icon name="arrow" v-if="i < item.treeList.length - 1" />
                          </span>
                        </div>
                        <div v-else>{{ item.title }}</div>
                      </template>
                      <template #right-icon>
                        <van-radio :name="item.id" ref="radioboxes" />
                      </template>
                    </van-cell>
                    <van-button v-if="isCascader && !searchValue" :disabled="!item.children.length" type="info"
                      size="small" class="nextBtn" @click="handleNext(item)">下级</van-button>
                  </div>
                </van-cell-group>
              </van-radio-group>
            </div>
            <div v-else class="empty-text">暂无数据</div>
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import {Form, Picker, Button, Cell, Popup, Field, Cascader, Icon, Uploader, CellGroup, Toast, RadioGroup, Radio } from 'vant';
/**
  * @param {Boolean} isUseSlot 是否使用插槽
  * @param {Array} list 选项
  * @param {String} title 弹窗的标题
  * @param {String} lable 框的左边label值
  * @param {String} titleKey 数据结构 title
  * @param {String} idKey 数据结构 id
  * @param {String} placeholder 提示语
  * @param {Boolean} isValueHidden 是否隐藏值 - 单行显示，超出...
  * @param {Boolean} clearable 是否清除
  * @param {Boolean} multiple 是否多选
  * @param {Boolean} isShowSearch 是否可搜索
  * @param {Boolean} isCascader 是否级联
  * @param {String, Number, Array} value v-model
*/
export default {
    components: {
        vanCascader: Cascader,
        [Field.name]: Field,
        [Icon.name]: Icon,
        [Popup.name]: Popup,
        [Button.name]: Button,
        [Picker.name]: Picker,
        [Form.name]: Form,
        [Uploader.name]: Uploader,
        [Cell.name]: Cell,
        [Toast.name]: Toast,
        [CellGroup.name]: CellGroup,
        [RadioGroup.name]: RadioGroup,
        [Radio.name]: Radio,
    },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    isUseSlot: Boolean,
    list: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    },
    lable: {
      type: String,
      default: ''
    },
    titleKey: {
      type: String,
      default: 'title'
    },
    idKey: {
      type: String,
      default: 'id'
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    isValueHidden: Boolean,
    clearable: Boolean,
    multiple: Boolean,
    isShowSearch: Boolean,
    isCascader: Boolean,
    value: [String, Number, Array],
  },
  data() {
    return {
      // 当前的列
      currentList: [],
      isPopupShow: false,
      searchValue: '',
      breadList: [{ id: -1, title: '所有', children: [] }],
      // 选中的值
      selectValue: null,
      // 多选
      multipleValue: []
    }
  },
  computed: {
    allList() {
      this.handleDataInit()
      return this.handleData(this.list, [])
    },
    showList() {
      if (this.isCascader) {
        if (this.searchValue) {
          const info = []
          this.handleSearchCascaderFind(this.allList, this.searchValue, info)
          return info
        } else {
          return this.currentList
        }
      } else {
        return this.searchValue ? this.currentList.filter(item => item.title.indexOf(this.searchValue) > -1) : this.currentList
      }
    },
    showValue() {
      let info = { id: this.value, title: this.value }
      if (this.value) {
        if (this.isCascader) {
          info = this.handleCascaderFind(this.allList, this.value) || info
        } else {
          info = this.allList.find(item => this.value === item.id) || info
        }
      }
      if (this.isUseSlot) {
        this.$emit('change', this.value)
        this.$emit('changeAll', info)
      }
      return info
    },
    multipleValueShow() {
      let info = []
      if (this.value.length) {
        if (this.isCascader) {
          this.handleCascaderFind(this.allList, this.value, info)
        } else {
          info = this.value.map(item => this.allList.find(el => el.id === item) || item)
        }
      }
      if (this.isUseSlot) {
        this.$emit('change', this.value)
        this.$emit('changeAll', info)
      }
      return info
    }
  },
  filters: {
    titleFilter(arr) {
      return arr.map(item => item.title || item).join('、')
    },
    treeListTitleFilter(arr) {
      return arr.treeList.map(item => item.title)
    }
  },
  methods: {
    handleDataInit() {
      this.currentList = this.handleData(this.list, [])
    },
    handleData(list, arr = []) {
      return list.map(item => {
        const treeList = arr.concat([item])
        return {
          ...item,
          id: item[this.idKey],
          treeList: treeList,
          title: item[this.titleKey],
          children: item.children ? this.handleData(item.children, treeList) : []
        }
      })
    },
    handleShow(val) {
      if (val) {
        if (this.multiple) {
          if (Array.isArray(this.value)) this.multipleValue = this.value.length ? [...this.value] : []
          else {
            throw new Error('v-model字段类型错误，只可传入数组')
          }
        } else {
          this.selectValue = this.value
        }
      }
      this.isPopupShow = val
    },
    handleCascaderFind(list, value, infoArr) {
      if (this.multiple) {
        for (let index = 0; index < list.length; index++) {
          const element = list[index]
          if (this.value.includes(element.id)) {
            infoArr.push(element)
          }
          if (element.children && element.children.length && this.isCascader) {
            this.handleCascaderFind(element.children, value, infoArr)
          }
        }
      } else {
        for (let index = 0; index < list.length; index++) {
          const element = list[index]
          if (element.id === value) {
            return element
          }
          if (element.children && element.children.length && this.isCascader) {
            const info = this.handleCascaderFind(element.children, value)
            if (info) return info
          }
        }
      }
    },

    handleSearchCascaderFind(list, searchValue, infoArr) {
      for (let index = 0; index < list.length; index++) {
        const element = list[index]
        if (element.title.indexOf(searchValue) > -1) {
          infoArr.push(element)
        }
        if (element.children && element.children.length && this.isCascader) {
          this.handleSearchCascaderFind(element.children, searchValue, infoArr)
        }
      }
    },
    // 清空选中的值
    handleClear() {
      if (this.multiple) {
        this.multipleValue = []
        this.$emit('change', [])
        this.$emit('changeAll', [])
      } else {
        this.selectValue = null
        this.$emit('change', null)
        this.$emit('changeAll', null)
      }
    },
    handleSearchClear() {
      this.searchValue = ''
    },
    handleLevel(item, index) {
      if (item.id === -1) {
        this.currentList = this.handleData(this.list)
        this.breadList.splice(1, this.breadList.length - 1)
      } else {
        this.currentList = item.children
        this.breadList = this.breadList.slice(0, index + 1)

      }
    },
    handleNext(item) {
      this.currentList = item.children
      this.breadList.push(item)
    },
    handleConfirm() {
      if (this.multiple) {
        this.$emit('change', this.multipleValue)
        this.$emit('changeAll', this.multipleValueShow.map(item => {
          return { ...item }
        }))
        this.isPopupShow = false
      } else {
        if (this.isCascader) {
          this.$emit('change', this.selectValue)
          this.$emit('changeAll', { ...this.handleCascaderFind(this.allList, this.selectValue) || {} })
        } else {
          this.$emit('change', this.selectValue)
          this.$emit('changeAll', { ...this.currentList.find(item => item.id === this.selectValue) || {} })
        }
        this.isPopupShow = false
      }
    },

    toggle(val) {
      this.$refs.checkboxes.find(item => item.name === val).toggle()
    },

    handleRadio(val) {
      this.selectValue = val
    }
  }
}
</script>
<style lang="scss">
@import './ReCommon.scss';
</style>
