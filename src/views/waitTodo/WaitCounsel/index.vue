<template>
  <div>
    <UserList listType="yuYueZiXun" />
  </div>
</template>

<script>
// 待分配
export default {
  name: 'WaitCounsel',
  components: {
    UserList: () => import('@/views/consultation/components/UserList.vue')
  },
}
</script>
