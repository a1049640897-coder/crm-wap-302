<template>
  <!-- <div class="ifr"> -->
  <iframe :src="srcUrl" frameBorder="0" width="100%" id="iframe"></iframe>
  <!-- :height="iframeHeight"  height="100%" -->
  <!-- </div> -->
</template>

<script>
export default {
  name: "help-center",
  data() {
    return {
      srcUrl: "http://mhelp.joineast.com",
      // srcUrl:'http://192.168.50.251:8028/help/index',
      w: 0,
      h: 0,
    };
  },
  methods: {
    iframeLoad() {
      // 在iframe渲染之前将高度设置0
      document.querySelector("#iframe").style.height = 0;
      const iframe = document.querySelector("#iframe");
      // 监听iframe渲染dom的节点
      iframe.onload = function () {
        // 在内嵌页面渲染完成后，通过定时器再设置页面高度，注意：定时器必须加，毫秒单位不能为0
        setTimeout(() => {
          iframe.style.height = window.screen.height + 'px';
          // iframe.style.height = "800px";
        }, 500);
      };
    },
  },
  mounted() {
    this.iframeLoad();
  },
};
</script>
<style lang="scss" scoped>

</style>
