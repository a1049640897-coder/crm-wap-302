<template>
  <div>
    <UserList listType="4" ref="userList" :counselTab="counselTab" />
  </div>
</template>

<script>
// 今日活动
export default {
  name: 'WaitNowActivity',
  props: {
    counselTab: String
  },
  components: {
    UserList: () => import('@/views/activities/components/UserList.vue')
  },
}
</script>
