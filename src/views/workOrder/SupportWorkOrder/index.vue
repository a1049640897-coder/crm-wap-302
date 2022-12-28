<template>
  <div class="supportWorkOrder">
    <van-form @submit="onSubmit">
      <div class="flex flex-c-center">
        <span class="requestspan">*</span>
        <van-field class="requestfield" disabled readonly clickable label="所属系统" input-align='right' :value="systemName" :is-link="!systemName" placeholder="请选择" :rules="[{ required: true, }]">
        </van-field>
      </div>
      <div class="flex flex-c-center">
        <span class="requestspan">*</span>
        <van-field class="requestfield" v-model="sysWorkOrderTypeName" input-align='right' :is-link="!sysWorkOrderTypeName" @click="hadelRePick" readonly label="所属模块" placeholder="请选择" :rules="[{ required: true, }]">
        </van-field>
      </div>
      <div class="flex flex-c-center">
        <span class="requestspan">*</span>
        <van-field class="requestfield" readonly clickable label="工单类型" :is-link="!sysMenuName" @click="showsysMenuId = true" input-align='right' :value="sysMenuName" placeholder="请选择" :rules="[{ required: true, }]">
        </van-field>
      </div>
      <div class="flex flex-c-center">
        <span class="requestspan" v-show="requiredData.includes('contactInformationType')">*</span>
        <van-field class="requestfield" readonly clickable label="学员联系方式" @click="informationTypeshow = true" :is-link="!informationTypeName" input-align='right' :value="informationTypeName" placeholder="请选择" :rules="[{ required: requiredData.includes('contactInformationType'), }]">
        </van-field>
      </div>
      <van-cell-group>
        <van-field input-align='right' v-model="tableData.studentInfo" label="" placeholder="请输入" :rules="[{message: '格式错误', validator:validator,required: requiredData.includes('contactInformationType'), }]" />
      </van-cell-group>
      <!-- 问题描述 -->
      <van-cell-group>
        <div class="flex flex-c-center">
          <span class="requestspan">*</span>
          <van-field class="requestfield" readonly clickable label="问题描述" />
        </div>
        <van-field v-model="tableData.note" type="textarea" autosize label="" :rules="[{ required: requiredData.includes('contactInformationType'), }]" placeholder="请输入" />
      </van-cell-group>
      <!--图片  -->
      <van-cell-group>
        <div class="flex flex-c-center">
          <span class="requestspan" v-show="requiredData.includes('picturefile')">*</span>
          <van-field class="requestfield" readonly clickable label="图片" />
        </div>
        <van-uploader v-model="tableData.picturefile" :after-read="afterRead" multiple :max-count="9" />
      </van-cell-group>
      <!--文件  -->
      <van-cell-group>
        <div class="flex flex-c-center">
          <span class="requestspan" v-show="requiredData.includes('fileList')">*</span>
          <van-field class="requestfield" readonly clickable label="文件" />
          <van-uploader max-count='1' :after-read="fileListafterRead" accept=".xlsx, .xls ,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document">
            <div style="width:310px" v-if="this.tableData.fileList && this.tableData.fileList.length">{{this.tableData.fileList[0].file.name}}</div>
            <span class="fileListspan" v-else>上传文件</span>
          </van-uploader>
        </div>
      </van-cell-group>

      <!-- 所属模块 -->
      <RePick ref="RePick" v-model="tableData.sysMenuId" isCascader :list="sysWorkOrderTypeoptions" titleKey="text" @changeAll="handleDevUser" isUseSlot clearable>
      </RePick>
      <!-- 工单-->
      <van-popup v-model="showsysMenuId" round position="bottom">
        <van-picker show-toolbar :columns="MenuIdcolumns" value-key="title" @cancel="showsysMenuId = false" @confirm="onConfirm($event, 'sysMenuName', 'sysWorkOrderTypeId', 'showsysMenuId')" />
      </van-popup>
      <!-- 学员联系方式 -->
      <van-popup v-model="informationTypeshow" round position="bottom">
        <van-picker show-toolbar :columns="informationTypecolumns" value-key="title" @cancel="informationTypeshow = false" @confirm="onConfirm($event, 'informationTypeName', 'contactInformationType', 'informationTypeshow')" />
      </van-popup>
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit" :loading='loading'>提交</van-button>
      </div>
    </van-form>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { getUserSystem } from '@/api/common'
import {userSysCommonmenuListApi, workOrdertypepageApi, longworkOrderApi, workOrderTypedetailApi } from '@/api/workOrder'
import { Toast } from 'vant';
export default ({
  name: 'SupportWorkOrder',
  components: {
    RePick: () => import('../components/RePick'),
  },
  computed: {
    ...mapState({
      currentSystemId: state => state.common.systems.currentSystem.id //当前系统id
    }),
    // 所属系统名
    // systemName() {
    //   let curid = this.sysInfoId ? this.sysInfoId : this.currentSystemId
    //   let systemName = this.systemcolumns.find(e => e.id === curid).title || null
    //   return systemName
    // }
    // systemName: {
    //   get() {
    //     let curid = this.sysInfoId ? this.sysInfoId : this.currentSystemId
    //     let systemName = this.systemcolumns.find(e => e.id === curid).title || null
    //     return systemName
    //   },
    //   set(val) {
    //     console.log(val,'val123');
    //     this.systemName = val
    //   }
    // }
  },
  data() {
    return {
      platformcolumns: [
        { title: 'PC', id: 1 },
        { title: 'WAP', id: 2 },
      ], // 平台数据
      systemcolumns: [
        { id: 1, title: "聚创管理系统" },
        { id: 3, title: "教招管理系统" },
        { id: 97, title: "学考管理系统" },
        { id: 98, title: "信息中心管理系统" },
        { id: 66, title: "资格证管理系统" },
        { id: 74, title: "辅导员管理系统" },
        { id: 76, title: "聚创专插本系统" },
        { id: 77, title: "中创专升本系统" },
        { id: 22, title: "优公管理系统" },
        { id: 47, title: "网校管理系统" },
        { id: 48, title: "在职管理系统" },
        { id: 49, title: "专升本管理系统" },
        { id: 62, title: "宏医管理系统" },
        { id: 93, title: "宏医医疗管理" },
        { id: 50, title: "学历管理系统" },
        { id: 68, title: "中创管理系统" },
        { id: 69, title: "考研总部管理系统" },
        { id: 70, title: "教招总部管理系统" }
      ], // 所属系统数据
      sysWorkOrderTypeoptions: [], // 所属模块下拉列表
      MenuIdcolumns: [], // 工单类型下拉列表
      informationTypecolumns: [
        { title: '手机号', id: 1 },
        { title: '微信号', id: 2 },
        { title: 'QQ号', id: 3 },
      ], // 工单类型数据
      cascadershow: false,
      showsysMenuId: false,
      informationTypeshow: false,
      // platformPicker: false,
      platformName: null, //所属平台
      sysMenuName: null, //工单类型名
      sysWorkOrderTypeName: null, // 所属模块名
      informationTypeName: null, // 工单类型名
      cascaderValue: '',
      fieldNames: {
        text: 'text',
        value: 'id',
        children: 'children',
      },
      requiredData: [],
      loading: false,
      tableData: {
        sysWorkOrderTypeId: null,
        sysMenuId: null,
        studentInfo: null,
        contactInformationType: null,
        note: null,
        fileList: [], // 文件
        picturefile: [], // 上传的图片数组
      },
      workId: null,//工单id
      sysInfoId: null, //工单详情对应系统id
      systemName: null
    }
  },
  created() {
    // this.getSystems()
    this.getworkOrdertypepage()
    // this.getuserCommonmenuList()
    if (this.$route.query.workId) {
      this.workId = this.$route.query.workId
      this.getDetail()
    } else {
      this.getSystems()
      this.getuserCommonmenuList()

    }
  },
  mounted() {
  },
  methods: {
    onSubmit() {
      if (this.requiredData.includes('fileList') && !this.tableData.fileList.length) {
        return Toast.fail('请上传文件');
      }
      if (this.requiredData.includes('picturefile') && !this.tableData.picturefile.length) {
        return Toast.fail('请上传图片');
      }
      this.loading = true
      let data = {
        id: this.workId ? this.workId : null,
        note: this.tableData.note,
        studentInfo: this.tableData.studentInfo,
        sysMenuId: this.tableData.sysMenuId,
        contactInformationType: this.tableData.contactInformationType,
        sysWorkOrderTypeId: this.tableData.sysWorkOrderTypeId,
        path: this.tableData.path,
        imageUrl: [],
        fileUrl: ''
      }
      let formData = new FormData()
      // this.tableData.fileList.forEach(file => {
      //   formData.append('file', file.file)
      // })
      if (this.tableData.fileList && this.tableData.fileList.length > 0) {
        // 有文件
        this.tableData.fileList.forEach(item => {
          if (item.file.size && item.file.size > 0) {
            formData.append('file', item.file)
          } else {
            data.fileUrl = item.file.url
          }
        })
      } else {
        data.fileUrl = ''
      }
      // this.tableData.picturefile.forEach(file => {
      //   formData.append('fileList', file.file)
      // })
      if (this.tableData.picturefile && this.tableData.picturefile.length > 0) {
        this.tableData.picturefile.forEach(item => {
          if (item.file) {
            formData.append('fileList', item.file)
          } else {
            data.imageUrl.push(item.url)
          }
        })
      } else {
        data.imageUrl = []
      }
      formData.append('param', new Blob([JSON.stringify(data)], { type: 'application/json' }))
      let curId = this.sysInfoId ? this.sysInfoId : this.currentSystemId
      longworkOrderApi(formData, curId).then(res => {
        if (res && res.status == 200) {
          Toast.success(this.workId ? "修改成功" : '添加成功');
        } else {
          Toast.fail(this.workId ? '业务逻辑异常：工单当前处理中/已完成，不可修改！' : '添加失败');
        }
      }).finally(() => {
        this.loading = false
        this.init()
        this.$router.go(-1)
      })
    },
    init() {
      this.tableData = {
        sysWorkOrderTypeId: null,
        sysMenuId: null,
        studentInfo: null,
        contactInformationType: null,
        note: null,
        fileList: [], // 文件
        picturefile: [], // 上传的图片数组
      }
      this.platformName = null //所属平台
      this.sysMenuName = null //工单类型名
      this.systemName = null // 所属系统名
      this.sysWorkOrderTypeName = null // 所属模块名
      this.informationTypeName = null // 工单类型名
    },
    validator(val) {
      return this.tableData.contactInformationType == 1 ? /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(val) : this.tableData.contactInformationType == 3 ? /^[1-9][0-9]{4,12}$/.test(val) : null

    },
    fileListafterRead(file, files) {
      // 此时可以自行将文件上传至服务器
      if (['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.file.type)) {
        if (file.file.size / 1024 > 5000) {
          Toast.fail(`文件【${file.name}】超过5Mb，请压缩后上传`);
          files.splice(files.length - 1, 1)
          return
        }
        this.tableData.fileList = [file]
      } else {
        files.splice(files.length - 1, 1)
      }
    },
    afterRead(file, files) {
      if (['image/png', 'image/jpeg'].includes(file.file.type)) {
        if (file.file.size / 1024 > 5000) {
          Toast.fail(`文件【${file.name}】超过5Mb，请压缩后上传`);
          this.tableData.picturefile.splice(files.length - 1, 1)
          return
        }
      } else {
        this.tableData.picturefile.splice(files.length - 1, 1)
      }
    },
    handleDevUser(val) {
      this.sysWorkOrderTypeName = val.title
    },
    onConfirm(value, name, nameId, show) {
      this[name] = value.title;
      this.tableData[nameId] = value.id;
      this[show] = false;
      if (nameId === 'sysWorkOrderTypeId') {
        let data = this.MenuIdcolumns.find(item => item.id === value.id)
        this.requiredData = []
        if (data) {
          if (data.filesRequired === 1) this.requiredData.push('fileList')
          if (data.studentContactInformationRequired === 1) this.requiredData.push('contactInformationType')
          if (data.imageRequired === 1) this.requiredData.push('picturefile')
        }
      }
    },
    getworkOrdertypepage() {
      workOrdertypepageApi().then(res => {
        this.MenuIdcolumns = res.data
      })
    },
    getuserCommonmenuList() {
      let curId = this.sysInfoId ? this.sysInfoId : this.currentSystemId
      userSysCommonmenuListApi(curId).then(res => {
        this.sysWorkOrderTypeoptions = res.data
      })
    },
    getSystems() {
      getUserSystem().then(res => {
        this.systemcolumns = res.data.map(item => item.list).flat() || []
        let curid = this.sysInfoId ? this.sysInfoId : this.currentSystemId
        this.systemName = this.systemcolumns.find(e => e.id === curid).title || null
      })
    },
    hadelRePick() {
      this.$refs.RePick.handleShow(true)
      this.$refs.RePick.handleDataInit()
    },
    async getDetail() {
      let result = await workOrderTypedetailApi(this.workId)
      this.sysInfoId = await result.data.sysInfoId
      this.getuserCommonmenuList()
      this.getSystems()
      let arr = []
      if (result.data.attachPath) {
        arr.push({
          file: {
            name: result.data.fileName ? result.data.fileName : null,
            url: result.data.attachPath ? result.data.attachPath : null
          }
        })
      }
      this.tableData = {
        sysWorkOrderTypeId: result.data.sysWorkOrderTypeId ? result.data.sysWorkOrderTypeId : null,
        sysMenuId: result.data.sysMenuId ? result.data.sysMenuId : null,
        studentInfo: result.data.studentInfo ? result.data.studentInfo : null,
        contactInformationType: result.data.contactInformationType ? result.data.contactInformationType : null,
        note: result.data.note ? result.data.note : null,
        fileList: arr, // 文件
        picturefile: result.data.imgList ? result.data.imgList.map(e => {
          return {
            url: e
          }
        }) : []
      }
      this.sysMenuName = this.MenuIdcolumns.find(e => e.id === result.data.sysWorkOrderTypeId).title || ''
      this.informationTypeName = this.informationTypecolumns.find(e => e.id === result.data.contactInformationType).title || ''
    }
  }
})
</script>
<style lang="scss" scoped>
.supportWorkOrder {
  width: 100%;
  background: #fff;
  padding-left: 0.8rem;
  .requestspan {
    padding-top: 0.3rem;
    margin: 0;
    color: #f00909;
    z-index: 99;
  }
  .requestfield {
    margin-left: -0.7rem;
  }
  .fileListspan {
    color: #0088fe;
    width: 80px;
    display: block;
  }
  ::v-deep .van-field__label {
    font-size: 1rem;
    font-family: Source Han Sans SC;
    font-weight: 400;
    color: #333333;
  }
}
</style>
