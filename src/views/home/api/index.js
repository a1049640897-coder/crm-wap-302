import request from '@/plugin/axios'

// 添加日历
export function addCalendarApi(data) {
  return request({
    url: '/market/schedule/custom',
    method: 'put',
    data
  })
}

// 查找列表
export function calendarListApi(data) {
  return request({
    url: '/market/schedule/table',
    method: 'post',
    data
  })
}
