<template>
  <div>
    <!-- 营销活动 -->
    <UserList listType="2" ref="userList" :counselTab="counselTab" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
// 营销活动
export default {
  name: 'MarketAct',
  props: {
    counselTab: String
  },
  components: {
    UserList: () => import('../components/UserList')
  },
  created() {
    this.handleInit()
  },
  methods: {
    ...mapActions('activity', ['queryBookListAct']),
    handleInit() {
      this.queryBookListAct()
    }
  }
}
</script>
