<template>
  <div>
    <UserList listType="3" />
  </div>
</template>

<script>
// 我接收的
export default {
  name: 'TransferKpi',
  components: {
    UserList: () => import('../components/UserList')
  },
  data() {
    return {

    }
  },
  created() {
  },
  methods: {

  }
}
</script>
