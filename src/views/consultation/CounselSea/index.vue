<template>
  <div>
    <UserList listType="7" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
// εΎει
export default {
  name: 'CounselSea',
  components: {
    UserList: () => import('../components/UserList')
  },
  created() {
    this.handleInit()
  },
  methods: {
    ...mapActions('consultation', ['queryListAct']),
    handleInit() {
      this.queryListAct(7)
    }
  }
}
</script>
