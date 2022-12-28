import layoutHome from '../../layout/index.vue'

const meta = { requiresAuth: true }

export default {
  path: '/handover',
  name: 'home-handover',
  meta,
  component: layoutHome,
  children: (pre => [
    { path: '/userProfile/:type/:id/:handoverId/:handoverState', name: `${pre}UserProfile`, component: () => import('@/views/handover/UserProfile'), meta: { meta, cache: true, title: '用户档案' } },
    { path: '/handoverRecord/:id/:handoverId', name: `${pre}HandoverRecord`, component: () => import('@/views/handover/HandoverRecord'), meta: { meta, cache: false, title: '编辑移交记录', isCloseWorkOrder: true } }
  ])('handover-')
}
