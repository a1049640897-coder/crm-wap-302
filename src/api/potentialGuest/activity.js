import request from '@/plugin/axios'

// 获取讲座登记 - 列表
export function lectureListApi(data) {
  return request({
    url: 'market/lecture',
    method: 'post',
    data
  })
}

// 获取讲座登记 - 统计
export function lectureCountApi(data) {
  return request({
    url: '/market/lecture/count',
    method: 'post',
    data
  })
}

// 获取讲座登记 - 详情
export function getLectureInfoApi(id) {
  return request({
    url: '/market/lecture/' + id,
    method: 'get'
  })
}

// 获取营销活动 - 列表
export function lectureBookListApi(data) {
  return request({
    url: 'market/lecture/book',
    method: 'post',
    data
  })
}

// 获取营销活动 - 统计
export function lectureBookCountApi(data) {
  return request({
    url: '/market/lecture/book/count',
    method: 'post',
    data
  })
}

// 获取对手讲座 - 列表
export function lectureRivalListApi(data) {
  return request({
    url: 'market/lecture/rival',
    method: 'post',
    data
  })
}

// 讲座筛选条件
export function getLecConditonApi() {
  return request({
    url: '/market/lecture/lecture/condition',
    method: 'get'
  })
}

// 营销筛选条件
export function getLecbookConditonApi() {
  return request({
    url: '/market/lecture/book/condition',
    method: 'get'
  })
}

// 对手筛选条件
export function getLecRivalConditonApi() {
  return request({
    url: '/market/lecture/rival/condition',
    method: 'get'
  })
}

// 参与人员列表
export function postPartStudentListApi(data) {
  return request({
    url: '/market/activity/student',
    method: 'post',
    data
  })
}

// 参与人员统计
export function postPartStudentCountApi(data) {
  return request({
    url: '/market/activity/student/count',
    method: 'post',
    data
  })
}

// 参与人员列表筛选条件
export function postPartStudentConditonApi(data) {
  return request({
    url: '/market/activity/student/condition',
    method: 'post',
    data
  })
}

// 获取咨询结果分类列表
export function getGenerousListApi(callIndex) {
  return request({
    url: '/order/common/cascade/' + callIndex,
    method: 'get'
  })
}

// 移交列表
export function activityhandoverListApi(data) {
  return request({
    url: `/market/activity/handoverList`,
    method: 'post',
    data
  })
}

// 活动-移交列表-表头统计
export function activityheaderStatisticalApi(data) {
  return request({
    url: `/market/activity/headerStatistical`,
    method: 'post',
    data
  })
}

// 活动-详情-成本管理-列表q
export function activityDetailCostApi(data) {
  return request({
    url: `/market/cost/list`,
    method: 'post',
    data
  })
}

// 活动-详情-成本管理-成本明细获取
export function activityDetailCostDetailApi(id, branchId) {
  return request({
    url: branchId ? `/market/cost/costAgent/${id}/${branchId}` : `/market/cost/costAgent/${id}`,
    method: 'get',
  })
}

// 活动-详情-成本管理-成本详情获取
export function activityDetailGetApi(id, type) {
  return request({
    url: `/market/cost/costInfo/${id}/${type}`,
    method: 'get',
  })
}

// 活动-详情-成本管理-成本删除
export function activityDetailDelApi(data) {
  return request({
    url: `/market/cost`,
    method: 'DELETE',
    data
  })
}


// 活动-详情-成本管理-成本添加
export function activityDetailAddApi(data) {
  return request({
    url: `/market/cost`,
    method: 'PUT',
    data
  })
}

// 活动-详情-成本管理-成本编辑
export function activityDetailEditApi(data) {
  return request({
    url: `/market/cost`,
    method: 'PATCH',
    data
  })
}

// 活动-详情-问卷信息-问卷列表
export function activityQuesListApi(data) {
  return request({
    url: `/market/activity/participant`,
    method: 'POST',
    data
  })
}


// 活动-详情-问卷信息-详情
export function activityQuesDetailApi(id) {
  return request({
    url: '/market/lecture/' + id,
    method: 'get'
  })
}

// 活动-详情-问卷信息-头部信息 /问卷id/活动id
export function activityQuesHeaderApi(id, activityId) {
  return request({
    url: `/market/question/newDetail/${id}/${activityId}`,
    method: 'get',
  })
}

// 活动-详情-问卷信息-答题详情
export function activityQuesAnswerDetailApi(id) {
  return request({
    url: `/market/question/answerDetailForId/${id}`,
    method: 'get',
  })
}

// 活动-详情-问卷信息-关联问卷
export function getActivityShellOptionApi(id) {
  return request({
    url: `/market/activity/activityShell/${id}`,
    method: 'get'
  })
}

// 所属部门
export function getActivityDepartmentApi(branchId) {
  return request({
    url: `system/user/shellForBranch/${branchId}`,
    method: 'get'
  })
}

//  活动-详情-问卷信息-关联问卷-问卷栏目
export function getActiveNomalCascaderListApi() {
  return request({
    url: '/market/questionnaireCategory/cascade',
    method: 'get'
  })
}

// 活动-详情-问卷信息-关联问卷-问卷标题
export function getActiveQuesTitleListApi(params) {
  return request({
    url: '/market/question/list',
    method: 'get',
    params
  })
}

// 活动-详情-问卷信息-关联问卷-问卷添加/编辑
export function patchActiveQuestionRelateApi(data) {
  return request({
    url: '/market/lecture/questionnaire',
    method: 'patch',
    data
  })
}
// 活动-详情-问卷信息-重新关联问卷-详情
export function patchActiveQuestionDetailApi(id) {
  return request({
    url: `/market/lecture/questionnaire/${id}`,
    method: 'get',
  })
}

// 活动-详情-问卷信息-关联问卷-问卷 删除
export function patchActiveQuestionDelApi(id) {
  return request({
    url: `/market/lecture/questionnaire/${id}`,
    method: 'patch',
  })
}

// 活动-详情-问卷信息-获取二维码和签到码
export function getCodeActiveListApi(id, shellId) {
  return request({
    url: `/market/lecture/code/${id}/${shellId}`,
    method: 'get'
  })
}
// 活动-详情-问卷信息-市场区域二维码和签到码
export function getCodeActiveMarketListApi(id, marketAreaId) {
  return request({
    url: `/market/lecture/marketArea/code/${id}/${marketAreaId}`,
    method: 'get'
  })
}

// 活动-详情-问卷信息-获取市场区域
export function marketAreaBranchSchoolApi(shellId) {
  return request({
    url: `/market/marketArea/branchSchool/${shellId}`,
    method: 'get'
  })
}

// 活动- 添加/编辑活动-搜索院校专业（本科）
export function getActivitySchoolBoxApi(data) {
  return request({
    url: '/market/university/schoolBox',
    method: 'post',
    data
  })
}

// 活动- 添加/编辑活动-资料清单
export function getActivityMaterialListApi() {
  return request({
    url: '/market/materialList/allMaterial',
    method: 'get'
  })
}

// 活动- 添加/编辑活动(外部)-讲师姓名
export function getActivityOutTeacherListApi() {
  return request({
    url: '/market/common/outUserListUse',
    method: 'get'
  })
}


//  活动-添加/编辑活动(内部)-讲师姓名 -集团全部人员
export function getActivityInsideTeacherListApi() {
  return request({
    url: '/market/lecture/teacher',
    method: 'get'
  })
}

// 活动- 添加/编辑活动-负责人
export function getActivityChargeListApi(shellId) {
  return request({
    url: `/market/lecture/book/newChargePersonList/${shellId}`,
    method: 'get'
  })
}


// 活动- 添加/编辑活动-参与人
export function getActivityParticipantsListApi(shellId) {
  return request({
    url: `/market/lecture/participantsList/${shellId}`,
    method: 'get'
  })
}

// 活动- 添加/编辑活动-添加外部用户
export function addOutLectureApi(data) {
  return request({
    url: `market/activity/lecturer`,
    method: 'put',
    data
  })
}


// 活动- 添加/编辑活动-对手名称列表
export function getActivitytListApi(params) {
  return request({
    url: '/market/lecture/rival/opponent',
    method: 'get',
    params
  })
}


// 活动-讲座登记-添加
export function addActivityLectRegisterApi(data) {
  return request({
    url: '/market/lecture',
    method: 'put',
    data,
    responseType: 'blob',
    config: {
      count: true
    },
    timeout: 30000
  })
}

// 活动-讲座登记-编辑
export function editActivityLectRegisterApi(data) {
  return request({
    url: '/market/lecture',
    method: 'patch',
    data,
    responseType: 'blob',
    config: {
      count: true
    },
    timeout: 30000
  })
}

// 活动-对手讲座-添加
export function addActivityCptLectApi(data) {
  return request({
    url: '/market/lecture/rival',
    method: 'put',
    data
  })
}

// 活动-对手讲座-编辑
export function editActivityCptLectApi(data) {
  return request({
    url: '/market/lecture/rival',
    method: 'patch',
    data
  })
}

// 活动-营销活动-添加
export function addActivityMarketApi(data) {
  return request({
    url: '/market/lecture/book',
    method: 'put',
    data,
    responseType: 'blob',
    config: {
      count: true
    },
    timeout: 30000
  })
}

// 活动-营销活动-编辑
export function editActivityMarketApi(data) {
  return request({
    url: '/market/lecture/book',
    method: 'patch',
    data,
    responseType: 'blob',
    config: {
      count: true
    },
    timeout: 30000
  })
}

// 活动-讲座登记-详情
export function getActivityLectRegisterDetailApi(id) {
  return request({
    url: '/market/lecture/' + id,
    method: 'get'
  })
}

// 活动-对手讲座-详情
export function getActivityCptLectDetailApi(id) {
  return request({
    url: '/market/lecture/rival/' + id,
    method: 'get'
  })
}

// 活动-营销活动-详情
export function getActivityMarketDetailApi(id) {
  return request({
    url: '/market/lecture/book/' + id,
    method: 'get'
  })
}

// 活动-讲座登记/对手讲座/营销活动-详情-删除
export function activityDelApi(id) {
  return request({
    url: '/market/lecture/' + id,
    method: 'DELETE'
  })
}

// 活动-今日活动
export function getNowActivityApi(data) {
  return request({
    url: '/market/lecture/today',
    method: 'post',
    data
  })
}

// 活动-添加/编辑-负责人、参与人获取
export function getActivityPartCharApi(shellId) {
  return request({
    url: `/market/lecture/book/newChargePersonList/${shellId}`,
    method: 'GET',
  })
}


// 活动-参与人编辑/部门下的移交人接收人
export function getHandoverUserApi(shellId) {
  return request({
    url: `/market/handover/handoverUser/${shellId}`,
    method: 'GET',
  })
}


// / 承接系统下拉框
export function targetSysBoxactivityIdApi(handoverType, activityId) {
  return request({
    url: `/market/handover/targetSysBox/${handoverType}/${activityId}`,
    method: 'get'
  })
}

// 承接部门下拉框
export function targetShellBoxApi(sysId) {
  return request({
    url: `/market/handover/targetShellBox/${sysId}`,
    method: 'get'
  })
}

//参与人员添加潜在用户
export function addPartPoUser(data, id) {
  return request({
    url: `market/activity/student/${id}`,
    method: 'put',
    data
  })
}





