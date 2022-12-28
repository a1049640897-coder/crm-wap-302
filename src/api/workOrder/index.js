import request from '@/plugin/axios'
// 获取列表
export function menuList(params) {
  return request({
    url: '/system/menu/listPlus',
    method: 'get',
    params
  })
}
// 获取菜单列表
export function userCommonmenuListApi() {
  return request({
    url: '/system/userCommon/menu',
    method: 'get',
  })
}
// 获取菜单列表
export async function userSysCommonmenuListApi(systemId = null) {
  return request('/system/userCommon/menu', {
    method: 'get',
    headers: systemId ? { 'reqCurrentSysId': systemId } : null
  })
}

export function workOrdertypepageApi() {
  return request({
    url: `/system/workOrder/type/box`,
    method: 'get',
  })
}
export function longworkOrderApi(data,systemId) {
  return request({
    url: `/system/workOrder`,
    method: 'PUT',
    data,
    headers: systemId ? { 'reqCurrentSysId': systemId } : null
  })
}
// 解决办法
export function articlenews(data) {
  return request({
    url: `/system/workOrder/article/news`,
    method: 'POSt',
    data
  })
}
// 常见问题
export function problemews(data) {
  return request({
    url: `/system/workOrder/article`,
    method: 'POSt',
    data
  })
}
// 我的工单
export function myworkOrderApi(data) {
  return request({
    url: `/system/workOrder/my/page`,
    method: 'POSt',
    data
  })
}
// 新通用选项3.0
export function commonCascade(callIndex) {
  return request({
    url: `/order/common/cascade/${callIndex}`,
    method: 'get'
  })
}

// 修改状态
export function workOrderState(data) {
  return request({
    url: `/system/workOrder/state`,
    method: 'patch',
    data
  })
}
// 修改工单类型
export function workOrderType(data) {
  return request({
    url: `/system/workOrder/type`,
    method: 'patch',
    data
  })
}
// 获取工单详情
export function workOrderTypedetailApi(id) {
  return request({
    url: `/system/workOrder/detail/`+id,
    method: 'GET',
  })
}
// 工单催促
export function workOrderTypeurgeApi(id) {
  return request({
    url: `/system/workOrder/urge/`+id,
    method: 'patch',
  })
}
// 工单撤销
export function workOrderTyperevokeApi(id) {
  return request({
    url: `/system/workOrder/revoke/`+id,
    method: 'patch',
  })
}

// 获取一级栏目集
export function getPrograma(callIndex) {
  return request({
    url: `/system/workOrder/extFirstLevels/${callIndex}`,
    method: 'get',
  })
}
// 授权码登录
export function codeLogin(code) {
  return request({
    url: `/loginauth/workOrder`,
    method: 'patch',
    headers: {code: code}
  })
}
//列表系统下拉
export function systemboxApi() {
  return request({
    url: `/system/workOrder/system/box`,
    method: 'get',
  })
}

// 获取系统数据 树列表
export function getSystemList() {
  return request({
    url: '/system/info/sysInfo',
    method: 'get'
  })
}

// 获取系统数据 树列表
export function getSystemListLimits() {
  return request({
    url: '/system/userCommon/sys',
    method: 'get'
  })
}
