import layoutHome from '../../layout/index.vue'

const meta = { requiresAuth: true }

export default {
  path: '/activities',
  name: 'Activities',
  meta,
  redirect: { name: 'activities' },
  component: layoutHome,
  children: (pre => [
    { path: '/activities', name: `${pre}index`, component: () => import('@/views/activities/index'), meta: { cache: true, title: '讲座' } },
    // { path: 'lectureRegister', name: `${pre}lectureRegister`, component: () => import('@/views/activities/'), meta: { meta, cache: true, title: '讲座登记' } },
    { path: '/lectureDetails/:sid/:listType/:counselTab', name: `${pre}lectureDetails`, component: () => import('@/views/activities/LectureDetails'), meta: { meta, cache: true, title: '详情' } },
    { path: '/QuesConnect/:activitiId', name: `${pre}QuesConnect`, component: () => import('@/views/activities/QuesConnect'), meta: { meta, cache: true, title: '关联问卷', isCloseWorkOrder: true } },
    {
      path: '/ActiveAddEdit/:id/:type/:counselTab', name: `${pre}ActiveAddEdit`, component: () => import('@/views/activities/ActiveAddEdit'), meta: { meta, cache: false, title: '添加讲座', isCloseWorkOrder: true }, beforeEnter: (to, from, next) => {
        const { type, id } = to.params
        if (id !== 'null') {
          to.meta.title = type == 3 ? '编辑营销活动' : type == 1 ? '编辑讲座登记' : '编辑对手讲座'
        } else {
          to.meta.title = type == 3 ? '添加营销活动' : type == 1 ? '添加讲座登记' : '添加对手讲座'
        }
        next()
      },
    },
    { path: '/QuersionRead/:id/:activityId', name: `${pre}QuersionRead`, component: () => import('@/views/activities/LectureDetailsQuersionRead'), meta: { meta, cache: false, title: '问卷预览' } }
  ])('activities-')
}
