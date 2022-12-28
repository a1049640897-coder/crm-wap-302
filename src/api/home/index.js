import request from '@/plugin/axios'

export function getVersionApi() {
  return request({
    url: '/system/userCommon/maxVersion',
    method: 'get'
  })
}