<template>
  <div>
    <UserList listType="5" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
// εΎει
export default {
  name: 'CounselDistribute',
  components: {
    UserList: () => import('../components/UserList')
  },
  created() {
    this.handleInit()
  },
  methods: {
    ...mapActions('consultation', ['queryListAct']),
    handleInit() {
      this.queryListAct(5)
    }
  }
}
</script>
