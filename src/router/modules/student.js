import layoutHome from '../../layout/index.vue'
const meta = { requiresAuth: true }

export default {
  path: '/student',
  name: 'Student',
  redirect: '/studentinfo',
  component: layoutHome,
  children: (pre => [
    { path: '/studentinfo/:sid/:listtype', name: `${pre}info`, component: () => import('@/views/student/info'), meta: { meta, cache: true, title: '潜在用户档案' } },
    { path: '/counselrecord/:sid/:eid', name: `${pre}CounselRecord`, component: () => import('@/views/student/CounselRecord'), meta: { meta, cache: false, title: '咨询记录', isCloseWorkOrder: true } },
    { path: '/studentinfoedit/:sid', name: `${pre}StudentInfoEdit`, component: () => import('@/views/student/StudentInfoEdit'), meta: { meta, cache: false, title: '学员档案', isCloseWorkOrder: true } }
  ])('student-')
}