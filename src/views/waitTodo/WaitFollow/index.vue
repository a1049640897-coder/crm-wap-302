<template>
  <div>
    <UserList listType="8" />
  </div>
</template>

<script>
// 待分配
export default {
  name: 'WaitFollow',
  components: {
    UserList: () => import('@/views/consultation/components/UserList.vue')
  },
}
</script>
