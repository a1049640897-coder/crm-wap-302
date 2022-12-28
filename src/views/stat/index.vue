<template>
  <div>
    <iframe :src="srcUrl" frameBorder="0" width="100%" :height="height"/>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'home-stata',
  components: {
  },
  data() {
    return {
      height: (document.documentElement.clientHeight - 50) + 'px'
    }
  },
  computed: {
    ...mapGetters(['authorization']),
    ...mapState({
      currentSystemId: state => state.common.systems.currentSystem.id
    }),
    srcUrl() {
      const hostName = process.env.NODE_ENV === 'development' ? 'http://59.61.85.58:8029' : window.location.origin
      return `${hostName}/inside/#/statistics?token=${this.authorization}&systemId=${this.currentSystemId}`
    }
  }
}
</script>
