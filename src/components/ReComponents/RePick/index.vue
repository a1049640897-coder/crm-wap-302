<template>
  <div class="Re-select">
    <div v-if="isUseSlot" @click="handleShow(true)">
      <slot></slot>
      <div v-show="false">
        <span v-if="multiple">{{multipleValueShow.length}}</span>
        <span v-else>{{showValue}}</span>
      </div>
    </div>
    <van-field :name="name" v-else-if="isCell && multiple" :value="titleFilterFun(multipleValueShow)" :label="label" :required="isRequrie" :rules="[
        { required: isRequrie, message: '请选择' + label }
      ]" @click="handleShow(true)" :placeholder=" placeholderIShow ? placeholder : ''" :right-icon="multipleValueShow.length ? '' : 'arrow'" input-align="right" readonly autosize rows="1" type="textarea" :clearable="clearable && !!multipleValueShow.length " :disabled="isDisabled">
      <template v-if="multipleValueShow.length && !isDisabled && closeIsShow" #button>
        <van-icon name="clear" color="#C8C9CC" size="16" @click.stop="handleClear" />
      </template>
    </van-field>
    <van-field :name="name" v-else-if="isCell" :value="showValue.title" :label="label" :required="isRequrie" :rules="[
        { required: isRequrie, message: '请选择' + label }
      ]" @click="handleShow(true)" :placeholder=" placeholderIShow ? placeholder : ''" :right-icon="showValue.id ? '' : 'arrow'" input-align="right" readonly autosize rows="1" type="textarea" :clearable="clearable && !!showValue.id" :disabled="isDisabled">
      <template v-if="showValue.id && !isDisabled && closeIsShow" #button>
        <van-icon name="clear" color="#C8C9CC" size="16" @click.stop="handleClear" />
      </template>
    </van-field>
    <!-- <van-cell v-else-if="isCell" @click="handleShow(true)">
      <template #title>
        <span>{{label}}</span>
      </template>
      <template #default>
        <span v-if="multiple">{{titleFilterFun(multipleValueShow) || '请选择'}}</span>
        <span v-else>{{showValue.title || '请选择'}}</span>
      </template>
      <template #right-icon>
        <div class="Re-show-icon" v-if="!clearable ? true : multiple ? !multipleValueShow.length : !showValue.id">
          <van-icon name="arrow" />
        </div>
        <div class="Re-show-icon" v-else>
          <van-icon name="clear" color="#C8C9CC" size="16" @click.stop="handleClear" />
        </div>
      </template>
    </van-cell> -->
    <div class="Re-show" v-else @click="handleShow(true)">
      <div class="Re-show-label" v-if="label">{{label}}</div>
      <div class="Re-show-view">
        <div class="Re-show-default-value Re-show-placeholder" v-if="multiple ? !multipleValueShow.length : !showValue.id">{{placeholder}}</div>
        <div class="Re-show-default-value Re-show-value" :class="{'text-hidden': isValueHidden}" v-else>
          <span v-if="multiple">{{multipleValueShow | titleFilter}}</span>
          <span v-else>{{showValue.title || ''}}</span>
        </div>
        <div class="Re-show-icon" v-if="!clearable ? true : multiple ? !multipleValueShow.length : !showValue.id">
          <van-icon name="arrow" />
        </div>
        <div class="Re-show-icon" v-else>
          <van-icon name="clear" color="#C8C9CC" size="16" @click.stop="handleClear" />

        </div>
      </div>
    </div>
    <div>
      <van-popup v-model="isPopupShow" position="bottom" round safe-area-inset-bottom lock-scroll lazy-render get-container="#app">
        <div class="Re-select-popup">
          <div class="Re-select-header">
            <div class="Re-select-header-cancel" @click="handleShow(false)">取消</div>
            <div class="Re-select-header-title">{{label}}</div>
            <div class="Re-select-header-confirm" @click="handleConfirm">确认</div>
          </div>
          <form action="javascript:return true;" v-if="isShowSearch">
            <!-- <div class="Re-search-input">
              <van-icon class="Re-search-icon Re-search-lefticon" name="search" /> -->
            <!-- <input v-model="searchValue" class="Re-input" type="search" placeholder="请输入搜索关键词" /> -->
            <!-- <van-icon v-if="searchValue" class="Re-search-icon Re-search-righticon" name="clear" @click="handleSearchClear"/>
            </div> -->
            <!-- 咨询列表远程搜索 -->
            <van-search ref="search" v-if="isOriginSchoolSearch && !isOriginAndCurrent" v-model="originSchoolSearchValue" @input="handleOriginInput" placeholder="请输入搜索关键词" clear-trigger="always" />
            <van-search ref="search" v-else-if="isOriginAndCurrent" v-model="originCurrentSchoolSearchValue" placeholder="请输入搜索院系或专业" clear-trigger="always" />
            <!-- 活动列表远程搜搜 -->
            <van-search ref="search" v-else-if="isOriginActivitySchoolSearch" v-model="originSchoolSearchValue" @input="handleOriginInput" placeholder="请输入搜索关键词" clear-trigger="always" />
            <van-search ref="search" v-else-if="isOriginSchool" v-model="formOriginSearchVale" @input="handleFormOriginInput" placeholder="请输入搜索关键词" clear-trigger="always" />
            <van-search ref="search" v-else v-model="searchValue" placeholder="请输入搜索关键词" clear-trigger="always" />
          </form>
          <div class="Re-select-bread" v-if="isCascader" :style="`padding: ${isCascader ? '5px 10px': '10px'}`">
            <div v-for="(item, index) in breadList" :key="item.id" class="bread-item">
              <div :class="{'bread-active': index === breadList.length - 1}" @click="handleLevel(item, index)">{{item.title}}</div>
              <van-icon name="arrow" v-if="index != breadList.length - 1" />
            </div>
          </div>
          <div class="Re-select-contain" style="height: 40vh">
            <div v-if="!!showLimitList.length">
              <van-checkbox-group v-model="multipleValue" v-if="multiple">
                <van-cell-group>
                  <div v-for="item in showLimitList" :key="item.id" class="flex flex-c-center">
                    <van-cell clickable @click="toggle(item.id, item)">
                      <template #title>
                        <div v-if="searchValue && isCascader" class="flex flex-c-center">
                          <van-checkbox :name="item.id" ref="checkboxes" shape class="pr5" :disabled="item.disabled || (isLastSelect && !!item.children.length)" />
                          <div>
                            <span v-for="(el, i) in item.treeList" :key="el.id">
                              <span>{{el[titleKey]}}</span>
                              <van-icon name="arrow" v-if="i < item.treeList.length - 1" />
                            </span>
                          </div>
                        </div>
                        <div v-else class="flex">
                          <van-checkbox :name="item.id" ref="checkboxes" shape class="pr5" :disabled="item.disabled || (isLastSelect && !!item.children.length)" />
                          <span>{{item.title}}</span>
                        </div>
                      </template>
                      <!-- <template #right-icon>
                        <van-checkbox :name="item.id" ref="checkboxes" shape />
                      </template> -->
                    </van-cell>
                    <div v-if="isOriginSchoolSearch">
                      <van-button type="info" size="small" :loading="originLoading" :disabled="breadList.length >= 3" class="nextBtn" native-type="button" @click="handleOriginSchoolNext(item)">下级</van-button>
                    </div>
                    <div v-else>
                      <van-button v-if="isCascader && !searchValue" :disabled="!item.children.length" type="info" size="small" class="nextBtn" @click="handleNext(item)">下级</van-button>
                    </div>
                  </div>
                  <van-cell is-link arrow-direction="none" @click="handleMorePage" v-if="!isCascader && isUseLimitPage && showLimitList.length != showList.length">
                    <div class="more-btn">加载更多...</div>
                  </van-cell>
                </van-cell-group>
              </van-checkbox-group>
              <van-radio-group v-model="selectValue" v-else>
                <van-cell-group>
                  <div v-for="item in showLimitList" :key="item.id" class="flex flex-c-center">
                    <van-cell clickable @click="handleRadio(item.id, item)">
                      <template #title>
                        <div v-if="searchValue && isCascader" class="flex flex-c-center">
                          <van-radio :name="item.id" ref="radioboxes" class="pr5" :disabled="item.disabled || (isLastSelect && !!item.children.length)" />
                          <div>
                            <span v-for="(el, i) in item.treeList" :key="el.id">
                              <span>{{el[titleKey]}}</span>
                              <van-icon name="arrow" v-if="i < item.treeList.length - 1" />
                            </span>
                          </div>
                        </div>
                        <div v-else class="flex">
                          <van-radio :name="item.id" ref="radioboxes" class="pr5" :disabled="item.disabled || (isLastSelect && !!item.children.length)" />
                          <span>{{item.title}}</span>
                        </div>
                      </template>
                      <!-- <template #right-icon>
                        <van-radio :name="item.id" ref="radioboxes" />
                      </template> -->
                    </van-cell>
                    <div v-if="isOriginSchoolSearch">
                      <van-button type="info" size="small" :loading="originLoading" :disabled="breadList.length >= 3" class="nextBtn" native-type="button" @click="handleOriginSchoolNext(item)">下级</van-button>
                    </div>
                    <div v-else>
                      <van-button v-if="isCascader && !searchValue" :disabled="!item.children.length" type="info" size="small" class="nextBtn" @click="handleNext(item)">下级</van-button>
                    </div>
                    <van-cell is-link arrow-direction="none" @click="handleMorePage" v-if="!isCascader && isUseLimitPage && showLimitList.length != showList.length">
                      <div class="more-btn">加载更多...</div>
                    </van-cell>
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
// 远程列表学校搜索
import { schoolListApi, schoolNextListApi } from '@/api/potentialGuest/consultation'

// 活动模块远程学校搜索
import { getActivitySchoolBoxApi } from '@/api/potentialGuest/activity'

import { debounceFun } from '@/utils'

// 远程选择学校属性、学校、专业
import { searchschoolApi, searchcollegelApi } from '@/api/common'
/**
  * @param {Boolean} isUseSlot 是否使用插槽
  * @param {Boolean} isCell 是否使用自带cell
  * @param {Array} list 选项
  * @param {String} title 弹窗的标题
  * @param {String} label 框的左边label值
  * @param {String} titleKey 数据结构 title
  * @param {String} idKey 数据结构 id
  * @param {String} childrenKey 数据结构 childrenKey
  * @param {String} placeholder 提示语
  * @param {Boolean} isValueHidden 是否隐藏值 - 单行显示，超出...
  * @param {Boolean} clearable 是否清除
  * @param {Boolean} multiple 是否多选
  * @param {Boolean} isShowSearch 是否可搜索
  * @param {Boolean} isLastSelect 是否只可选择到最后一级
  * 
  * @param {Boolean} isCascader 是否级联
  * @param {Boolean} isCascaderAllLevelName 是否级联回显所有title名
  * @param {Boolean} isCascaderAllLevelNameSymnol 是否级联回显所有title名的拼接符号
  * 
  * @param {Boolean} disabled 是否禁用
  * @param {Boolean} isRequrie 是否cell必填 注意：必填的校验要和name搭配使用
  * @param {Boolean} name cellName
  * @param {Array} rulesList 规则
  * 
  * @param {Boolean} isOriginSchoolSearch 是否列表远程学校
  * 表单选择的属性、学校、专业
  * @param {Boolean} isOriginSchool 是否远程学校
  * @param {Boolean} originSchoolType 远程学校类型 1学校 2专业
  * @param {Boolean} originSchoolAttr 远程父级值
  * 
  * 
  * @param {String, Number, Array} value v-model
  * @param {Boolean} isOriginActivitySchoolSearch 是否活动远程学校
  * @param {String} emptyToastTitle 无数据提示语
  * @param {Number} isUseLimitPage 是否启用加载更多
  * @param {Number} limitPageSize 页码大小
*/
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    isUseSlot: Boolean,
    isCell: Boolean,
    list: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    },
    label: {
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
    childrenKey: {
      type: String,
      default: 'children'
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    isCascaderAllLevelNameSymnol: {
      type: String,
      default: '-'
    },
    isValueHidden: Boolean,
    clearable: Boolean,
    multiple: Boolean,
    isShowSearch: Boolean,
    isCascader: Boolean,
    isRequrie: Boolean,
    isOriginSchoolSearch: Boolean,
    isCascaderAllLevelName: Boolean,
    isLastSelect: Boolean,
    // ----
    isOriginSchool: Boolean,
    originSchoolType: [String, Number],
    originSchoolAttr: [String, Number],
    // ----
    disabled: Boolean,
    value: [String, Number, Array],
    name: String,
    closeIsShow: {
      type: Boolean,
      default: true
    },
    placeholderIShow: {
      type: Boolean,
      default: true
    },
    rulesList: {
      type: Array,
      default: () => []
    },
    isOriginActivitySchoolSearch: Boolean,
    emptyToastTitle: {
      type: String,
      default: '无可选数据'
    },
    limitPageSize: {
      type: Number,
      default: 20
    },
    isUseLimitPage: Boolean
  },
  data() {
    return {
      originLoading: false,
      // 当前的列
      currentList: [],
      isPopupShow: false,
      originSchoolSearchValue: '', // 列表的远程
      formOriginSearchVale: '', // 表单的远程
      searchValue: '',
      breadList: [{ id: -1, title: '首页', children: [] }],
      // 选中的值
      selectValue: null,
      // 多选
      multipleValue: [],
      searchList: [],
      // 远程搜索后，是否需要当前搜索
      isOriginAndCurrent: false,
      originCurrentSchoolSearchValue: '',
      limitPageNum: 1,
      limitShow: this.isUseLimitPage
      // 初始化
      // isFirstInitList: true
    }
  },
  computed: {
    allList() {
      return this.handleData(this.list, [])
    },
    showList() {
      let info = []
      if (this.isCascader) {
        if (this.searchValue) {
          this.handleSearchCascaderFind(this.allList, this.searchValue, info)
        } else if (this.originCurrentSchoolSearchValue) {
          // this.handleSearchCascaderFind(this.currentList, this.originCurrentSchoolSearchValue, info)
          info = this.currentList.filter(item => item[this.titleKey].indexOf(this.originCurrentSchoolSearchValue) > -1)
        } else {
          info = this.currentList
        }
      } else {
        info = this.searchValue ? this.currentList.filter(item => item.title.indexOf(this.searchValue) > -1) : this.currentList
      }
      return info
    },
    showLimitList() {
      if (this.searchValue || this.originCurrentSchoolSearchValue) return this.showList
      if (!this.isCascader && this.isUseLimitPage) {
        return this.showList.slice(0, this.limitPageNum * this.limitPageSize)
      } else {
        return this.showList
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
        if (this.isCascaderAllLevelName && info.treeList) {
          info.title = info.treeList.map(item => item[this.titleKey]).join(this.isCascaderAllLevelNameSymnol)
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
      if (this.value && this.value.length) {
        if (this.isCascader) {
          this.handleCascaderFind(this.allList, this.value, info)
        } else {
          info = this.value.map(item => this.allList.find(el => el.id === item) || item)
        }
        if (this.isCascaderAllLevelName) {
          info.forEach(element => {
            if (element.treeList) {
              element.title = element.treeList.map(item => item[this.titleKey]).join(this.isCascaderAllLevelNameSymnol)
            }
          })
        }
      }
      if (this.isUseSlot) {
        this.$emit('change', this.value)
        this.$emit('changeAll', info)
      }
      return info
    },
    isDisabled() {
      if (this.isOriginSchool) {
        if (this.originSchoolType == 2 && this.originSchoolAttr === -1) {
          return true
        }
        return !this.originSchoolAttr
      }
      return this.disabled
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
  watch: {
    list() {
      if (this.isOriginSchool || this.isOriginSchoolSearch) return
      this.handleDataInit()
    },
    originLoading(val) {
      this.$loading(val, 'originLoading')
    }
  },
  created() {
    this.handleDataInit()
  },
  methods: {
    titleFilterFun(arr) {
      return arr.map(item => item.title || item).join('、')
    },
    handleDataInit(list) {
      this.currentList = this.handleData(list ? list : this.list, [])
    },
    handleData(list, arr = []) {
      return list.map(item => {
        const treeList = arr.concat([item])
        return {
          ...item,
          id: item[this.idKey],
          treeList: treeList,
          title: item[this.titleKey],
          children: item[this.childrenKey] ? this.handleData(item[this.childrenKey], treeList) : []
        }
      })
    },
    handleShow(val) {
      if (this.isDisabled) return
      if (val) {
        if (!this.list.length && !this.isOriginSchool && !this.isOriginSchoolSearch && !this.isOriginActivitySchoolSearch) {
          this.$fm(`${this.emptyToastTitle}`)
          return
        }
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
    handleSearchClear(isClearCurrentList) {
      this.searchValue = ''
      if (isClearCurrentList) this.currentList = []
      this.originSchoolSearchValue = ''
      this.formOriginSearchVale = ''
    },
    handleLevel(item, index) {
      if (item.id === -1) {
        this.currentList = this.handleData((this.isOriginSchoolSearch || this.isOriginActivitySchoolSearch) ? this.searchList : this.list)
        this.breadList.splice(1, this.breadList.length - 1)
        this.isOriginAndCurrent = false
        this.originCurrentSchoolSearchValue = ''
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
      if (this.isOriginSchool || this.isOriginSchoolSearch) {
        if (this.multiple) {
          let info = []
          this.handleCascaderFind(this.searchList, this.multipleValue, info)
          if (!info.length) {
            this.$fm('您选择的数据有误，请重新选择')
            return
          }
        } else {
          let info = null
          info = this.handleCascaderFind(this.searchList, this.selectValue) || info
          if (!info) {
            this.$fm('您选择的数据有误，请重新选择')
            return
          }
        }
        this.$emit('update:list', this.searchList)
      }
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

    toggle(val, item) {
      if (item.disabled || this.isLastSelect && !!item.children.length) return
      this.$refs.checkboxes.find(item => item.name === val).toggle()
    },

    handleRadio(val, item) {
      if (item.disabled || this.isLastSelect && !!item.children.length) return
      this.selectValue = val
    },

    // 远程搜索
    handleOriginInput: debounceFun(function (e) {
      if (!e) return
      this.originLoading = true
      const query = {
        id: null,
        keyword: e,
        word: e
      }

      if (this.isOriginActivitySchoolSearch) {
        if (e) {
          getActivitySchoolBoxApi(query).then(res => {
            let arr = res.data || []
            this.searchList = arr.map(item => {
              return {
                id: item.id,
                title: item.title,
                children: []
              }
            })
            this.$nextTick(() => {
              this.breadList = [{ id: -1, title: '首页', children: [] }]
              this.currentList = []
              // this.handleClear()
              this.handleDataInit(this.searchList)
            })
          }).finally(() => {
            this.originLoading = false
          })
        } else {
          this.originLoading = false
        }

      } else {
        schoolListApi(query).then(res => {
          this.searchList = (res.data || []).map(item => {
            return {
              id: item.value,
              title: item.text,
              children: []
            }
          })
          this.$nextTick(() => {
            this.breadList = [{ id: -1, title: '首页', children: [] }]
            this.currentList = []
            // this.handleClear()
            this.handleDataInit(this.searchList)
          })
        }).finally(() => {
          this.originLoading = false
        })
      }
    }, 1000, false),

    // 远程下级
    handleOriginSchoolNext(e) {
      this.originLoading = true
      this.isOriginAndCurrent = true
      this.originCurrentSchoolSearchValue = ''
      schoolNextListApi(e.id).then(res => {
        let arr = (res.data || []).map(item => {
          return {
            ...item,
            id: item.value,
            title: item.text,
            children: []
          }
        })
        this.handleDeepOrigin(e.id, arr, this.searchList)
        // this.$emit('update:list', this.allList)
        this.$nextTick(() => {
          this.currentList = arr
          this.breadList.push({ ...e, children: arr })
        })
      }).finally(() => {
        this.originLoading = false
      })
    },
    handleDeepOrigin(id, list, currentList) {
      for (let index = 0; index < currentList.length; index++) {
        const element = currentList[index];
        if (element.id === id) {
          element.children = list
        } else if (element.children && element.children.length) {
          this.handleDeepOrigin(id, list, element.children)
        }
      }
    },

    handleFormOriginInput: debounceFun(function (e) {
      if (!e) return
      if (this.originSchoolType == 1) {
        const query = {
          code: '',
          keyword: e,
          type: this.originSchoolAttr
        }
        this.originLoading = true
        searchschoolApi(query).then(res => {
          let arr = res.data || []
          // arr.unshift({ value: -1, text: '未知' })
          this.searchList = arr.map(item => {
            return {
              id: item.value,
              title: item.text
            }
          })
          this.$nextTick(() => {
            this.handleDataInit(this.searchList)
            // this.$emit('update:list', this.searchList)
          })
        }).finally(() => {
          this.originLoading = false
        })
      } else if (this.originSchoolType == 2) {
        const query = {
          keyword: e,
          id: this.originSchoolAttr
        }
        this.originLoading = true
        searchcollegelApi(query).then(res => {
          let arr = res.data || []
          arr.unshift({ value: -1, text: '未知' })
          this.searchList = arr.map(item => {
            return {
              id: item.value,
              title: item.text
            }
          })
          // this.$emit('update:list', arr.map(item => {
          //   return {
          //     id: item.value,
          //     title: item.text
          //   }
          // }))
          this.$nextTick(() => {
            this.handleDataInit(this.searchList)
            // this.$emit('update:list', this.searchList)
          })
        }).finally(() => {
          this.originLoading = false
        })
      }
    }, 1000, false),

    handleMorePage() {
      this.limitPageNum += 1
    }

  }
}
</script>
<style lang="scss">
@import '../ReCommon.scss';
</style>
