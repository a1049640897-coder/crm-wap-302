import request from '@/plugin/axios'

// 获取所有系统列表
export function getUserSystem() {
  return request({
    url: '/system/userCommon/sys',
    method: 'get'
  })
}

// 获取当前人的权限系统列表
export function getAllSys() {
  return request({
    url: `/report/userCommon/sysForCrm`,
    method: 'get'
  })
}

// 获取当前人的权限级联部门可选项
export function authDepartListApi() {
  return request({
    url: `/system/shell/authorityTreeForSystem`,
    method: 'get'
  })
}

// 获取当前人的权限级联市场区域可选项
export function authAreaListApi() {
  return request({
    url: `/market/marketArea/box`,
    method: 'get'
  })
}

// 获取所有省市县
export function getAllRegion() {
  return request({
    url: '/system/ProvincesInfo/allRegion',
    method: 'get'
  })
}

// 新通用选项3.0
export function commonCascadeApi(callIndex) {
  return request({
    url: `/order/common/cascade/${callIndex}`,
    method: 'get'
  })
}

// 新通用选项2.0
export function getDemandType(callIndex) {
  return request({
    url: `/system/go/useList/${callIndex}`,
    method: 'get'
  })
}

// 获取当前系统设置模块的配置信息（年份是否必填和是否区分在校生等）
export function configIsRequire() {
  return request({
    url: `/market/potentialStudentReal/config`,
    method: 'get'
  })
}

// 获取院校属性
export function searchoptionApi() {
  return request({
    url: '/system/university/search/option',
    method: 'GET'
  })
}

// 院校属性 查找学校
export function searchschoolApi(data) {
  return request({
    url: '/system/university/search/school',
    method: 'POST',
    data
  })
}

// 院校属性 查找学校 院系专业
export function searchcollegelApi(data) {
  return request({
    url: '/system/university/search/college',
    method: 'POST',
    data
  })
}

// 获取默认设置
export function infoSetApi(alias) {
  return request({
    url: '/market/config/' + alias,
    method: 'get'
  })
}

// 分校或事业部底下的全部用户
export function commonShellAllUserApi(shellId) {
  return request({
    url: `/market/lecture/allUser/${shellId}`,
    method: 'get'
  })
}

// 来源级联
export function sourceCascadeApi(type) {
  return request({
    url: `/market/sourceChannel/sourceCascade/${type}`,
    method: 'get'
  })
}

// 考试年份可选项
export function examYearListApi() {
  return request({
    url: '/market/handover/examYearList',
    method: 'get'
  })
}
// 获取所属部门下列列表 feature-245新增
export function getShellNullParamsApi() {
  return request({
    url: `/system/user/department`,
    method: 'GET'
  })
}

// 活动- 添加/编辑活动-获取活动类型/针对对象
export function getDemandTypeApi(callIndex) {
  return request({
    url: `/system/go/useList/${callIndex}`,
    method: 'get'
  })
}

export function getSourceCascadeApi(type) { // 来源级联
  return request({
    url: `/market/sourceChannel/sourceCascade/${type}`,
    method: 'get'
  })
}

// 子课程查询
export function getChidlrenLessonApi(type, params) {
  return request({
    url: '/education/course/courseDrop/' + type,
    method: 'get',
    params
  })
}

// 获取今日活动统计/待跟进/预演咨询的头部统计数据
export function getCommonHeaderTotal(branchId) {
  return request({
    url: branchId ? `/market/potentialStudentReal/workbench/statistics/${branchId}` : `/market/potentialStudentReal/workbench/statistics`,
    method: 'get',
  })
}

// 获取级联的部门可选项
export function authorityTreeApi() {
  return request({
    url: `/system/shell/authorityTree`,
    method: 'get'
  })
}

// 获取BaiduCode
export function getBaiduCodeApi() {
  return request({
    url: `/system/info/getBaiduCode`,
    method: 'get'
  })
}

// 获取活动列表对应的详情 type:1 高校讲座 2 对手讲座 3 营销活动
export function getActiveListDetail(id, type) {
  return request({
    url: `/market/lecture/newDetail/${id}/${type} `,
    method: 'get'
  })
}