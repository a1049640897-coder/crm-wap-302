<template>
  <div>
    <HeaderFilter :listType="listType" @onListQuery="handleListQuery" ref="headerFilter" :paramProp="listQuery.lecture" :moreActLecture="moreActLecture" />
    <LectureCount :listType="listType" :countLoading.sync="countLoading" :countData="countData" v-if="listType!=='4'" />
    <RMList :moreLoading.sync="moreLoading" :refreshing.sync="refreshing" :finished.sync="finished" @onLoad="handleLoad" @onRefresh="handleRefresh" isMore :tableList="tableList">
      <div>
        <LectureCard :counselTab="counselTab" v-for="(item, index) in tableList" :listType="listType" :key="item.id" :sId="item.id" :studentData="item" @onUpdataInfo="handleUpdataInfo($event, item, index)" />
      </div>
    </RMList>
    <div class="common-bottom-btns" v-permission="checkPermissionStatus(listType)">
      <div class="common-bottom-btn" @click="handleCommonAdd">
        <img src="@/assets/images/icons/add.png" alt="">
        <span>{{(listType == 1 || listType== 3 ) ? '添加讲座' : '添加活动'}}</span>
      </div>
    </div>
    <ShareCode :isOpen="shareCodeIsOpen" :counselTab="quesConnectObj.counselTab" ref="shareCode" :sId="quesConnectObj.id" :sysShellId="quesConnectObj.sysShellId" @close="handleClose" />
  </div>
</template>

<script>
// 咨询用户
import { getScrollTop } from '@/utils'
import { lectureListApi, lectureBookListApi, lectureRivalListApi, lectureCountApi, lectureBookCountApi, getNowActivityApi } from '@/api/potentialGuest/activity'
import { mapState, mapMutations } from 'vuex'
import { getActiveListDetail } from '@/api/common'

export default {
  props: {
    listType: String,
    counselTab: String
  },
  components: {
    LectureCount: () => import('./LectureCount'),
    HeaderFilter: () => import('./HeaderFilter'),
    RMList: () => import('@/components/ReComponents/RMList'),
    LectureCard: () => import('@/components/LectureCard'),
    ShareCode: () => import('@/components/ShareCode')
  },
  data() {
    return {
      height: 0,
      countLoading: false,
      moreLoading: false,
      refreshing: false,
      finished: false,
      tableList: [],
      countData: {},
      listQuery: {
        pageinfo: { pageNum: 1, pageSize: 20, sort: [{ column: 'addTime', type: 1 }], count: false },
        lecture: {
          /** * 1、咨询用户（至少有一条咨询记录）
           * 2、有效线索（除公海外所有线索）
           * 3、已报高端（状态=已报高端）
           * 4、未咨询（有绑定所属人但还没有咨询记录）
           * 5、待分配（没有所属人但【是否分配咨询师=是】的潜在用户）
           * 6、全部潜在用户包括公海
           * 7、公海（currentState必须为空
           * */
          shellIds: [], // 部门
          shellIdsLocal: null, // 部门 -- 本地使用(更多)
          collegeInfoId: [], //  院校名称
          collegeInfoIdLocal: null,  // 院校名称 -- 本地使用(更多)
          startDate: null, // 开始时间
          endDate: null, // 结束时间
          keyword: null, // 关键词
          type: null,
          method: null,
          targets: null,
          usePersonId: null,
          teacherIds: null,
          chargePersonIds: null,
          distributeType: null, // 今日活动类型筛选
          nowActivityshellId: null,// 今日活动部门筛选
          sendBookType: null, //讲课/活动类型
          demo: 1
        }
      },
      isClearCache: false,
      shareCodeIsOpen: false,
      moreActLecture: {}
    }
  },
  computed: {
    ...mapState({
      pageSize: state => state.common.setting.pageSize,
      quesConnectObj: state => state.activity.quesConnectObj,
      quesConnectObjIsUpdate: state => state.activity.quesConnectObjIsUpdate,
      activityId: state => state.common.global.activityId,
      nowAuthDepartList: state => state.common.user.nowAuthDepartList,
    })
  },
  activated() {
    this.handleScrollInit()
  },
  deactivated() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  // created() {
  //   // this.handleInit()
  //   // this.handleScrollInit()
  //   // if(Array.isArray(this.nowAuthDepartList) && this.nowAuthDepartList.length){
  //   //   this.listQuery.lecture.nowActivityshellId = this.nowAuthDepartList[0].value
  //   // }
  // },
  mounted() {
    this.handleSetNoWDept()
    this.handleInit()
    this.handleScrollInit()
  },
  methods: {
    handleSetNoWDept() {
      if (this.nowAuthDepartList && this.nowAuthDepartList.length) {
        this.$set(this.listQuery.lecture, 'nowActivityshellId', this.nowAuthDepartList[0].value)
        this.$nextTick(() => {
          setTimeout(() => {
            this.$refs.headerFilter.handleSetNoWDept(this.nowAuthDepartList[0].value, this.nowAuthDepartList[0].text)
          })
        })
      }
    },
    resetSingleList() {
      getActiveListDetail(this.activityId, this.listType == 4 ? 4 : this.counselTab == 'LectureReg' ? 1 : this.counselTab == 'MarketAct' ? 3 : 2).then(res => {
        if (this.tableList.find(v => v.id == res.data.id)) {
          let index = this.tableList.findIndex(v => v.id == res.data.id)
          this.$set(this.tableList, index, res.data)
        }
      })
    },
    checkPermissionStatus(listType) {
      if (listType == 1) {
        // 讲座登记
        return 'MARKET:SCHOOL:HOME_ADD'
      } else if (listType == 3) {
        // 对手讲座
        return 'MARKET:OPPONENT:ADD'
      } else {
        // 营销活动  
        return 'MARKET:BOOK:ADD'
      }

    },
    ...mapMutations('activity/', ['SET_QUESOBJ']),
    hanleShowCode() {
      // this.$loading(true)
      this.$nextTick(() => {
        this.$refs.shareCode.checkCodeIsShow().then(() => {
          this.$loading(false)
          this.shareCodeIsOpen = true
          this.getTableList('newRefresh')
        }).catch(() => {
          this['SET_QUESOBJ']({ quesConnectObjIsUpdate: false })
          this.$loading(false)
        })
      })
    },
    handleClose() {
      this.shareCodeIsOpen = false
    },
    handleCommonAdd() {
      let type = this.listType == 3 ? 2 : this.listType == 2 ? 3 : this.listType
      this.isClearCache = false
      this.$router.push({
        path: `/ActiveAddEdit/${null}/${type}/${this.counselTab}`
      })
    },
    handleScrollInit() {
      window.addEventListener('scroll', this.handleScroll)
      window.scrollTo(0, this.height)
      // this.handleInit()
    },

    handleScrollToTop() {
      window.scrollTo(0, 0)
      this.height = 0
    },

    handleInit() {
      this.getTableList('init')
    },


    getTableList(val) {
      const { shellIdsLocal, collegeInfoIdLocal, startDate, endDate, keyword, type, method, targets, usePersonId, teacherIds, chargePersonIds } = this.listQuery.lecture
      const query = {
        pageinfo: {
          ...this.listQuery.pageinfo,
          pageSize: this.pageSize
        },
        lecture: {
          ...this.listQuery.lecture,
          shellIds: shellIdsLocal ? [shellIdsLocal] : [], // 部门
          collegeInfoId: collegeInfoIdLocal ? [collegeInfoIdLocal] : [], // 就读学校
          startDate: startDate, // 开始时间
          endDate: endDate, // 结束时间
          keyword: keyword, // 关键词
          type: type,
          method: method,
          targets: targets,
          usePersonId: usePersonId,
          teacherIds: teacherIds ? [teacherIds] : [],
          chargePersonIds: chargePersonIds ? [chargePersonIds] : [],
        }
      }
      this.moreActLecture = query.lecture
      let nowQuery = {
        type: query.lecture.distributeType,
        branchId: query.lecture.nowActivityshellId
      }
      const api = this.listType == 1 ? lectureListApi : this.listType == 2 ? lectureBookListApi : this.listType == 3 ? lectureRivalListApi : this.listType == 4 ? getNowActivityApi : null
      if (!api) return
      if (val !== 'newRefresh') {
        this.moreLoading = true
        this.$loading(true, `cTableLoading_${this.listType}`)
      }
      api(this.listType == 4 ? nowQuery : query).then(res => {
        if (['init', 'refresh', 'newRefresh'].includes(val)) {
          this.tableList = res.data || []
        } else {
          this.tableList = this.tableList.concat(res.data || [])
        }
        if (res.data.length < this.pageSize) {
          this.finished = true
        }
      }).finally(() => {
        this.$nextTick(() => {
          this.moreLoading = false
          this.refreshing = false
        })
        this.$loading(false, `cTableLoading_${this.listType}`)
      })

      if (['init', 'refresh'].includes(val)) {
        // this.countLoading = true
        const countApi = this.listType == 1 ? lectureCountApi : this.listType == 2 ? lectureBookCountApi : null
        if (!countApi) return
        countApi(query.lecture).then(res => {
          this.countData = res.data || {}
        }).finally(() => {
          this.$nextTick(() => {
            this.countLoading = false
          })
        })
      }
    },
    handleScroll() {
      getScrollTop().then(height => {
        this.height = height
      })
    },

    handleListQuery(paramProp) {
      this.listQuery.pageinfo.sort = paramProp.sortRule ? [{ ...paramProp.sortRule }] : [{ column: 'addTime', type: 1 }]
      this.listQuery.lecture = {
        ...paramProp,
        sendBookType: paramProp.sendBookType == 5 ? null : paramProp.sendBookType, //讲座类型
        type: paramProp.type == 5 ? null : paramProp.type,
        method: paramProp.method == 5 ? null : paramProp.method, // 授课类型
        targets: paramProp.targets == 5 ? null : paramProp.targets, // 针对对象
        // shellIds: [...this.paramProp.shellIds],
        // targets: [...this.paramProp.targets],
        // usePersonId: [...this.paramProp.usePersonId],
        // teacherIds: [...this.paramProp.teacherIds],
        // chargePersonIds: [...this.paramProp.chargePersonIds] 
      }
      this.finished = false
      this.handleRefresh()
    },

    handleLoad() {
      this.listQuery.pageinfo.pageNum += 1
      this.getTableList('more')
    },
    handleRefresh() {
      this.listQuery.pageinfo.pageNum = 1
      this.finished = false
      this.getTableList('refresh')
      this.handleScrollToTop()
    },
    handleStudent() {
      if (this.refreshing || this.moreLoading) return
      // getScrollTop().then(height => {
      //   this.height = height
      // })
      this.$router.push('/studentinfo')
    },
    handleUpdataInfo(obj, item, index) {
      this.tableList.splice(index, 1, obj)
    }
  }
}
</script>
