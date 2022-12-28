<template>
  <div>
    <!-- 讲座登记 -->
    <UserList listType="1" ref="userList" :counselTab="counselTab" />
  </div>
</template>

<script>
export default {
  name: 'LectureReg',
  props: {
    counselTab: String
  },
  components: {
    UserList: () => import('../components/UserList')
  }
}
</script>
