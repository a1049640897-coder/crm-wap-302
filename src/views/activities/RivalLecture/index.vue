<template>
  <div>
    <!-- 对手讲座 -->
    <UserList listType="3" ref="userList"/>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
// 对手讲座
export default {
  name: 'RivalLecture',
  components: {
    UserList: () => import('../components/UserList')
  },
  created() {
    this.handleInit()
  },
  methods: {
    ...mapActions('activity', ['queryRivalListAct']),
    handleInit() {
      this.queryRivalListAct()
    }
  }
}
</script>
