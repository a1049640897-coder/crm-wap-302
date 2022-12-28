import request from '@/plugin/axios'

// 学员档案 -- 咨询记录
export function consultRecordHistoryApi(studentId) {
  return request({
    url: `/market/consultRecord/history/${studentId}`,
    method: 'get'
  })
}

// 学员档案 -- 活动记录
export function activeRecordListApi(data) {
  return request({
    url: `/market/activity`,
    method: 'post',
    data
  })
}

// 学员档案 -- 图书订单
export function bookRecordListApi(id) {
  return request({
    url: `/order/orderBooks/student/` + id,
    method: 'get'
  })
}
