import layoutHome from '../../layout/index.vue'

const meta = { requiresAuth: true }

export default {
  path: '/waittodo',
  name: 'WaitTodo',
  meta,
  redirect: { name: 'home-WaitTodo' },
  component: layoutHome,
  children: (pre => [
    { path: 'waittodo', name: `${pre}WaitTodo`, component: () => import('@/views/waitTodo'), meta: { meta, cache: true, title: '待办事项' } }
  ])('home-')
}
