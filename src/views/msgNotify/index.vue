<template>
  <div>
    <RMList :refreshing.sync="refreshing" @onRefresh="handleRefresh" minHeight="85">
    </RMList>
  </div>
</template>

<script>
export default {
  components: {
    RMList: () => import('@/components/ReComponents/RMList'), 
  },
  data() {
    return {
      refreshing: false
    }
  },
  methods: {
    handleRefresh() {
      
    }
  }
}
</script>
