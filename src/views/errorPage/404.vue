<template>
  <div class="error-page" style="margin-top: 0; background: #ffffff; positon: absolute; width: 100vw; height: 100vh; overflow: hidden;">
    <img src="@/assets/images/404.gif" style="width: 240%;" alt="" @click="handleBack">
  </div>
</template>

<script>

export default {
  methods: {
    handleBack() {
      this.$router.replace('/')
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>