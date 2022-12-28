import request from '@/plugin/axios'

// 旧 - 获取详情
export function detailClientApi(id) {
  return request({
    url: `/market/potentialStudentReal/detail/${id}`,
    method: 'get'
  })
}

// 部门
export function departmentApi(branchId) {
  return request({
    url: `system/user/shellForBranch/${branchId}`,
    method: 'get'
  })
}

// 获取意向类型根据系统
export function intentionTypeListApi() {
  return request({
    url: `/market/intentionType/listBySysId`,
    method: 'get'
  })
}

// 意向班型
export function shellCoursePacketListApi(data) {
  return request({
    url: `/market/consultRecord/shellCoursePacket`,
    method: 'post',
    data
  })
}

// 检查是否存在潜在客户
export function verifyUserApi(data) {
  return request({
    url: `/market/potentialStudentReal/verify`,
    method: 'put',
    data
  })
}

// 编辑潜在客户
export function editClient(data) {
  return request({
    url: `/market/potentialStudentReal`,
    method: 'patch',
    data
  })
}

// 添加咨询记录
export function addConsultRecord(data) {
  return request({
    url: `/market/consultRecord`,
    method: 'put',
    data
  })
}

// 编辑咨询记录
export function editConsultRecord(data) {
  return request({
    url: `/market/consultRecord`,
    method: 'patch',
    data
  })
}

export function getConsultRecordDetailApi(recordId) {
  return request({
    url: `/market/consultRecord/detail/${recordId}`,
    method: 'get'
  })
}

// 咨询记录图片及上传
export function uploadRecordFile(id, data) {
  return request({
    url: `/market/file/consultRecord/${id}`,
    method: 'post',
    data
  })
}

// 咨询记录文件删除
export function delRecordFile(id) {
  return request({
    url: `/market/file/consultRecord/${id}`,
    method: 'delete'
  })
}

// 删除咨询记录
export function deleteRecordApi(recordId) {
  return request({
    url: `/market/consultRecord/delete/${recordId}`,
    method: 'delete'
  })
}
