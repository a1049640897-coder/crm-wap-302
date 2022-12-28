<template>
  <div>
    <UserList listType="4" />
  </div>
</template>

<script>
// 接收业绩
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
