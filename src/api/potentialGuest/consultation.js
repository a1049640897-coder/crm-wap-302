import request from '@/plugin/axios'

// 获取咨询用户 - 列表 - 更新用户信息
export function consultationInfoApi(id, type) {
  return request({
    url: `/market/potentialStudentReal/newDetail/${id}/${type}`,
    method: 'get'
  })
}

// 获取咨询用户 - 列表 - 更新用户信息(预约咨询)
export function appointmentConsultationInfoApi(id) {
  return request({
    url: `/market/reserveConsult/newDetail/${id}`,
    method: 'get'
  })
}

// 获取筛选条件
export function stuFilterOptionsApi(id) {
  return request({
    url: `/market/potentialStudentReal/condition/${id}`,
    method: 'get'
  })
}

// 获取筛选条件 - 首级学校
export function schoolListApi(data) {
  return request({
    url: `/system/university/search/school`,
    method: 'post',
    data
  })
}

// 获取筛选条件 - 学校下级
export function schoolNextListApi(id) {
  return request({
    url: `/system//university/search/${id}`,
    method: 'get'
  })
}

// 预约咨询 - 批量预约效验
export function batchCounselCheckApi(data) {
  return request({
    url: '/market/reserveConsult/reserveCheck',
    method: 'post',
    data
  })
}

// 预约咨询 - 咨询师下拉框
export function consultantListApi(data) {
  return request({
    url: `/market/reserveConsult/consultant`,
    method: 'post',
    data
  })
}


// 预约咨询 - 批量预约
export function putBatchCounselApi(data) {
  return request({
    url: '/market/reserveConsult/batch',
    method: 'put',
    data
  })
}

// 预约咨询 - 添加单个预约
export function putSimpleCounselApi(data) {
  return request({
    url: '/market/reserveConsult/one',
    method: 'put',
    data
  })
}

// 预约咨询 - 获取单个预约信息
export function getSimpleCounselInfoApi(id) {
  return request({
    url: '/market/reserveConsult/reserveInfo/' + id,
    method: 'get'
  })
}

// 预约咨询 - 编辑单个预约
export function patchSimpleCounselApi(data) {
  return request({
    url: '/market/reserveConsult/reserveInfo',
    method: 'patch',
    data
  })
}

// 预约咨询 - 删除预约
export function deleteSimpleCounselApi(data) {
  return request({
    url: '/market/reserveConsult',
    method: 'delete',
    data
  })
}

// 分配咨询师 - 校验是否可分配咨询师
export function counseltDistributeCheckApi(data) {
  return request({
    url: `/market/potentialStudent/distribute/counsel/number`,
    method: 'post',
    data
  })
}

// 分配咨询师 - 咨询
export function getUserTypeApi(branch, role) { // 根据角色类型获取用户列表
  return request({
    url: `/market/potentialStudent/user/${role}/${branch}`,
    method: 'get'
  })
}

// 分配咨询师 - 活动
export function getUserTypeActApi(activity, branch, role) {
  return request({
    url: `/market/potentialStudent/user/${role}/${activity}/${branch}`,
    method: 'get'
  })
}

// 分配咨询师 - 所属部门可选项
export function jobShellListApi(branchId, userId) {
  return request({
    url: `/system/user/shellForBranchAndUser/${branchId}/${userId}`,
    method: 'get'
  })
}

// 分配咨询师 - 批量分配咨询师
export function batchDistributeCounselApi(data) {
  return request({
    url: `/market/potentialStudent/distribute/counsel/batch`,
    method: 'put',
    data
  })
}

// 移交学员 - 校验学员
export function checkTransferApi(data) {
  return request({
    url: `/market/handover/check`,
    method: 'post',
    data
  })
}

// 移交学员 - 获取系统列表
export function sysListApi(type = 1) { // 获取系统列表
  return request({
    url: `/market/handover/sysBox/${type}`,
    method: 'get'
  })
}

// 移交学员 - 获取移交部门
export function getDepsListApi(data) {
  return request({
    url: `/market/handover/branch`,
    method: 'post',
    data
  })
}

// 移交学员 - 根据系统id获取部门
export function shellBoxBySysApi(data) {
  return request({
    url: `/market/handover/shellBoxBySys`,
    method: 'post',
    data
  })
}

// 移交学员 - 获取承接对象
export function getUndertakingApi(shellId) {
  return request({
    url: `/market/handover/allRole/${shellId}`,
    method: 'get'
  })
}

// 移交学员 - 批量移交移交
export function postBatchTransferApi(data) {
  return request({
    url: `/market/handover/batchHandover`,
    method: 'post',
    data
  })
}

// 获取系统关联事业部下所有市场、咨询用户
export function handoveruserApi(data) {
  return request({
    url: `/market/handover/user`,
    method: 'POST',
    data
  })
}

// 获取系统关联事业部下所有市场、咨询用户
export function handovershellApi(userId, sysInfoId, potentialStudentId) {
  return request({
    url: `/market/handover/shell/${userId}/${sysInfoId}/${potentialStudentId}`,
    method: 'GET'
  })
}

// 转交学员 - 单个转交
export function deliverApi(rawUserId, userId, studentId, shellId) {
  // rawUserId：所属人id, userId：转交人Id, studentId：潜在学员id, shellId: 所属部门
  return request({
    url: `/market/potentialStudent/deliver/${rawUserId}/${userId}/${studentId}/${shellId}`,
    method: 'patch'
  })
}

// 转交学员 - 转交前提示
export function deliverTipsApi(data) {
  return request({
    url: `/market/potentialStudent/deliver/batch/tips`,
    method: 'post',
    data
  })
}

// 转交学员 - 原所属人下拉框数据
export function getDeliverListApi(studentId) {
  return request({
    url: `/market/potentialStudent/belong/${studentId}`,
    method: 'get'
  })
}

// 转交学员 - 转交对象可选项
export function newOwnListApi(data) {
  return request({
    url: `/market/potentialStudent/user/own/student`,
    method: 'post',
    data
  })
}

// 转交学员 - 所属部门可选项
export function deliverShellApi(branchId, userId) {
  return request({
    url: `/system/user/shellForBranchAndUser/${branchId}/${userId}`,
    method: 'get'
  })
}

// 公海 - 放入公海校验
export function seaTipsApi(studentId) {
  return request({
    url: `/market/potentialStudent/sea/Tips/${studentId}`,
    method: 'get'
  })
}

// 公海 - 投放公海
export function puttingSeaApi(studentId) {
  return request({
    url: `/market/potentialStudent/sea/putting/${studentId}`,
    method: 'patch'
  })
}

// 公海 - 领取校验
export function getSeaTipsApi(studentId) {
  return request({
    url: `/market/potentialStudent/sea/getSeaTips/${studentId}`,
    method: 'get'
  })
}

// 公海 - 公海领取
export function gettingSeaApi(studentId, shellId) { // 公海领取
  return request({
    url: `/market/potentialStudent/sea/getting/${studentId}/${shellId}`,
    method: 'put'
  })
}

// 公海 - 领取所属部门(查询分校底下的部门)
export function departmentSeaApi(branchId) {
  return request({
    url: `/system/user/shellForBranch/${branchId}`,
    method: 'get'
  })
}

// 投放人
export function seaPutUserApi() {
  return request({
    url: `/market/potentialStudentReal/sea/userBox`,
    method: 'post'
  })
}

// 修改市场区域 - 获取所属分校下所有市场区域
export function marketAreaBranchSchoolApi(shellId) {
  return request({
    url: `/market/marketArea/branchSchool/${shellId}`,
    method: 'get'
  })
}

// 修改市场区域 - 批量修改市场区域(潜在)
export function batchMarketAreaApi(data) {
  // 分页获取待跟进用户
  return request({
    url: `/market/potentialStudent/marketArea/batch`,
    method: 'post',
    data
  })
}

// 咨询结果 - 修改咨询结果
export function updateReserveConsultResultApi(data) {
  return request({
    url: `/market/reserveConsult/reserveConsultResult`,
    method: 'patch',
    data
  })
}

// 无需跟进
export function unFollowApi(id) {
  return request({
    url: `/market/potentialStudentReal/unFollow/${id}`,
    method: 'get'
  })
}

// 预约咨询列表
export function yuYueZixunListApi(data) {
  return request({
    url: `/market/reserveConsult/list`,
    method: 'post',
    data
  })
}

// 预约咨询列表筛选 - 部门
export function yuYueZixunDepartApi() {
  return request({
    url: `/market/branch/currentSystem`,
    method: 'get'
  })
}
// 预约咨询列表筛选 - 活动
export function yuYueZixunActiveApi(data) {
  return request({
    url: `/market/reserveConsult/activity`,
    method: 'post',
    data
  })
}
// 预约咨询列表筛选 - 其他筛选条件
export function yuYueZixunFilterApi() {
  return request({
    url: `/market/reserveConsult/condition`,
    method: 'get'
  })
}

// 查所有学生
export function allStudentApi(data) {
  return request({
    url: `/market/potentialStudentReal/page`,
    method: 'post',
    data
  })
}