<template>
  <div>
    <UserList listType="yuYueZiXun" />
  </div>
</template>

<script>
// εΎει
export default {
  name: 'WaitCounsel',
  components: {
    UserList: () => import('@/views/consultation/components/UserList.vue')
  },
}
</script>
