import request from '@/plugin/axios'

export function security(data) {
  return request({
    url: ['development', 'test', 'sim'].includes(process.env.NODE_ENV) ? '/api/loginauth/security' : '/loginauth/security',
    method: 'post',
    data
  })
}

export function loginIn(username, password, state) {
  return request({
    url: ['development', 'test', 'sim'].includes(process.env.NODE_ENV) ? '/api/loginauth/login' : '/loginauth/login',
    method: 'post',
    headers: {phone: username, username, password, state}
  })
}

// 获取维护信息
export function getSafing() {
  let url = ['development', 'test', 'sim'].includes(process.env.NODE_ENV) ? '/api/common/maintain' : '/common/maintain'
  return request({
    url: url,
    method: 'get',
    safingPass: true
  })
}

// 获取个人信息
export function getUserInfo() {
  return request({
    url: '/system/userCommon/info',
    method: 'get'
  })
}

export function getUserBtnsList() {
  return request({
    url: '/system/userCommon/perms',
    method: 'get'
  })
}
