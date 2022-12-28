<template>
  <div>
    <UserList listType="4" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
// 未咨询
export default {
  name: 'NoCounsel',
  components: {
    UserList: () => import('../components/UserList')
  },
  created() {
    this.handleInit()
  },
  methods: {
    ...mapActions('consultation', ['queryListAct']),
    handleInit() {
      this.queryListAct(4)
    }
  }
}
</script>
