<template>
  <div>
    <UserList listType="1" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'CounselUser',
  components: {
    UserList: () => import('../components/UserList')
  },
  created() {
    this.handleInit()
  },
  methods: {
    ...mapActions('consultation', ['queryListAct']),
    handleInit() {
      this.queryListAct(1)
    }
  }
}
</script>
