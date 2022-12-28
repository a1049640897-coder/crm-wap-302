import layoutHome from '../layout/index.vue'
import activities from './modules/activities'
import workOrder from './modules/workOrder'
import student from './modules/student'
import waitTodo from './modules/waitTodo'
import handover from './modules/handover'

export const frameInRoutes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/home',
    component: layoutHome,
    children: (pre => [
      { path: '/consultation', name: `${pre}consultation`, component: () => import('@/views/consultation/index'), meta: { isTab: true, cache: true, title: '咨询'} },
      { path: '/handover', name: `${pre}handover`, component: () => import('@/views/handover/index'), meta: { isTab: true, cache: true, title: '移交'} },
      // { path: '/activities', name: `${pre}activities`, component: () => import('@/views/activities/index'), meta: { isTab: true, cache: true, title: '移交', icon: 'shop' } },
      { path: '/home', name: `${pre}index`, component: () => import('@/views/home/index'), meta: { isTab: true, cache: true, default: true, title: '聚创工作台'} },
      { path: '/orderManage', name: `${pre}orderManage`, component: () => import('@/views/orderManage/index'), meta: { isTab: true, cache: true, title: '订单'} },
      { path: '/stat', name: `${pre}stat`, component: () => import('@/views/stat/index'), meta: { isTab: true, cache: true, title: '统计'} }
    ])('home-')
  },
  {
    path: '/searchStudent',
    name: 'SearchStudent',
    component: layoutHome,
    children: (pre => [
      {
        path: '/searchStudent',
        name: `${pre}student`,
        component: () => import('@/views/searchStudent/index'),
        meta: { cache: true, title: '全局搜索'}
      }
    ])('allSearch-')
  },
  activities,
  workOrder,
  student,
  waitTodo,
  handover
]

export const frameOutRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index'),
    meta: { title: '登录' }
  },
  {
    path: '*',
    name: 'Error404',
    component: () => import('@/views/errorPage/404'),
    meta: { title: '404' }
  },
  {
    path: '/503',
    name: 'Error503',
    component: () => import('@/views/errorPage/503'),
    meta: { title: '503' }
  },
]