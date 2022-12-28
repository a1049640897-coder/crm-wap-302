<template>
  <div>
    <UserList listType="2" />
  </div>
</template>

<script>
// 移交业绩
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
