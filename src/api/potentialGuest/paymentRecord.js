import request from '@/plugin/axios'

// 我移交的/我接收的 - 表头统计
export function headerStatisticalApi(data) {
  return request({
    url: `/market/handover/headerStatistical`,
    method: 'post',
    data
  })
}

// 我移交的/我接收的 - 列表
export function handoverListApi(data) {
  return request({
    url: `/market/handover/handoverList`,
    method: 'post',
    data
  })
}

// 移交业绩 - 表头统计
export function sumPaymentRecordsApi(data) {
  return request({
    url: `/market/handover/sumPaymentRecords`,
    method: 'post',
    data
  })
}

// 移交业绩 - 列表
export function paymentRecordsListApi(data) {
  return request({
    url: `/market/handover/paymentRecordsList`,
    method: 'post',
    data
  })
}

// 获取学生档案 返回：对方档案-oppositeSide 己方档案-oneSelf
export function studentDetailsApi(type, id) {
  return request({
    url: `/market/handover/studentDetails/${type}/${id}`,
    method: 'get'
  })
}

// 学员订单列表
export function studentOrderListApi(id) {
  return request({
    url: `/order/student/order/${id}`,
    method: 'post'
  })
}

// 移交人下拉框（列表数据）
export function handoverUserByListApi() {
  return request({
    url: `/market/handover/handoverUserByList`,
    method: 'get'
  })
}

// 承接系统下拉框
export function targetSysBoxApi(handoverType) {
  return request({
    url: `/market/handover/targetSysBox/${handoverType}`,
    method: 'get'
  })
}

export function targetUserBoxApi(shellId) { // 承接人下拉框
  return request({
    url: `/market/handover/targetUserBox/${shellId}`,
    method: 'get'
  })
}

// 根据手机号查找潜在学员信息
export function getUserInfoByTelApi(data) {
  return request({
    url: `/market/handover/mobileInfo`,
    method: 'post',
    data
  })
}

// 更换学生
export function putStudyInfoByTelApi(data) {
  return request({
    url: `/market/handover/student`,
    method: 'patch',
    data
  })
}

// 获取移交列表-编辑详情
export function getHandoverInfoApi(id) {
  return request({
    url: `/market/handover/handoverInfo/${id}`,
    method: 'get'
  })
}

// 保存移交信息编辑内容
export function saveHandoverInfoApi(data) {
  return request({
    url: `/market/handover/handoverInfo`,
    method: 'patch',
    data
  })
}

// 删除移交信息
export function deleteHandoverInfoApi(data) {
  return request({
    url: `/market/handover`,
    method: 'DELETE',
    data
  })
}

// 添加移交人
export function handoverUserAddApi(data) {
  return request({
    url: `/market/handover/handoverUser`,
    method: 'put',
    data
  })
}
// 潜在用户所属分校底下除原移交人以外的全部系统用户
export function getHandoverOtherUserListApi(handoverId) {
  return request({
    url: `/market/handover/handoverOtherUser/${handoverId}`,
    method: 'get'
  })
}

// 关联收据校验查询
export function receiptCheckApi(data) {
  return request({
    url: `/market/handover/receiptCheck`,
    method: 'POST',
    data
  })
}

// 关联收据
export function relevanceReceiptApi(data) {
  return request({
    url: `/market/handover/receipt`,
    method: 'put',
    data
  })
}

// 取消关联收据
export function cancelRelevanceReceiptApi(data) {
  return request({
    url: `/market/handover/receipt`,
    method: 'delete',
    data
  })
}

// 取消关联下拉框可选项
export function cancelRelevanceOptionsApi(id) {
  return request({
    url: `/market/handover/receiptBox/${id}`,
    method: 'get'
  })
}

// 查找潜在用户所属分校移交人岗位所在部门
export function getBranchInHandoverApi(studentId, handoverUserId) {
  return request({
    url: `/market/handover/branchInHandover/${studentId}/${handoverUserId}`,
    method: 'get'
  })
}

// 确定移交
export function confirmHandoverApi(handoverId) {
  return request({
    url: `/market/handover/determineHandover/${handoverId}`,
    method: 'get'
  })
}

// 获取所属人
export function getBelongNameApi(id) {
  return request({
    url: `/market/handover/newBelongPeople/${id}`,
    method: 'get'
  })
}

// 分配给自己
export function allotOneselfApi(id) {
  return request({
    url: `/market/handover/allotOneself/${id}`,
    method: 'get'
  })
}

// 拒绝学员
export function rejectedStudentApi(data) {
  return request({
    url: `/market/handover/rejected`,
    method: 'patch',
    data
  })
}

// 上传移交拒绝凭证
export function uploadHandoverFileApi(id, data) {
  return request({
    url: `/market/file/handover/${id}`,
    method: 'post',
    data
  })
}