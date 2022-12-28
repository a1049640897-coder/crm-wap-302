import request from '@/plugin/axios'

// 获取事业部及分校集合(树形)
export function branchUnitTree() {
  return request({
    url: `/system/user/branchUnitTree`,
    method: 'get'
  })
}

// 根据当前用户角色获取市场区域列表(非市场表示需要传所属分校)
export function getRoleMarketAreaApi(branchId) {
  return request({
    url: branchId ? `/market/marketArea/userRole?branchId=${branchId}` : '/market/marketArea/userRole',
    method: 'GET'
  })
}

// 获取学校所在的市场区域
export function getSchoolMarketAreaApi(schoolId, branchId) {
  const url = branchId ? `/market/marketArea/school/${schoolId}?branchId=${branchId}` : `/market/marketArea/school/${schoolId}`
  return request({
    url,
    method: 'GET'
  })
}

// 来源级联
export function sourceCascadeApi(type) {
  return request({
    url: `/market/sourceChannel/sourceCascade/${type}`,
    method: 'get'
  })
}

// 根据赠书活动ID查找赠书活动清单
export function getAcitveMaterialList(id) {
  return request({
    url: '/market/activity/material/' + id,
    method: 'get'
  })
}

// 根据赠书活动ID查找赠书课程清单
export function getAcitveCourseList(id) {
  return request({
    url: '/market/activity/course/' + id,
    method: 'get'
  })
}

// 报考科目下拉列表
export function getEnrollSubjectDrop(data) {
  return request({
    url: `/education/enrollSubject/enrollSubjectDrop`,
    method: 'get',
    data
  })
}

// 添加潜在客户
export function addClient(data) {
  return request({
    url: `/market/potentialStudentReal`,
    method: 'put',
    data
  })
}
// 修改潜在客户
export function editClientApi(data) {
  return request({
    url: `/market/potentialStudentReal`,
    method: 'patch',
    data
  })
}

// 根据毕业年份得出在校生属性
export function getStudentAttrApi(year) {
  return request({
    url: `/market/potentialStudentReal/fresh/${year}`,
    method: 'GET'
  })
}