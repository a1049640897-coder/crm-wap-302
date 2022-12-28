import layoutHome from '../../layout/index.vue'

const meta = {
  requiresAuth: true
}

export default {
  path: '/workOrder',
  name: 'WorkOrder',
  meta,
  redirect: {
    name: 'WorkOrder'
  },
  component: layoutHome,
  children: (pre => [{
      path: 'supportWorkOrder',
      name: `${pre}supportworkOrder`,
      component: () => import('@/views/workOrder/SupportWorkOrder'),
      meta: {
        meta,
        cache: true,
        title: '提工单'
      }
    },
    {
      path: 'myworkorder',
      name: `${pre}myworkorder`,
      component: () => import('@/views/workOrder/MyWorkorder'),
      meta: {
        meta,
        isTab: false,
        cache: true,
        title: '我的工单'
      }
    },
    {
      path: 'helpCenter',
      name: `${pre}helpCenter`,
      component: () => import('@/views/workOrder/HelpCenter'),
      meta: {
        meta,
        isTab: false,
        cache: true,
        title: '帮助中心'
      }
    },
    {
      path: 'workDetail',
      name: `${pre}workDetail`,
      component: () => import('@/views/workOrder/MyWorkorder/components/WorkDetail.vue'),
      meta: {
        meta,
        isTab: false,
        cache: true,
        title: '工单详情'
      }
    }

  ])('workOrder-')
}