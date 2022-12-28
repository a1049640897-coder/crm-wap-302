<template>
  <div>
    <UserList listType="1" />
  </div>
</template>

<script>
// 未咨询
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
