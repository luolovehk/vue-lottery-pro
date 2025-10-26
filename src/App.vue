<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    // 动态引入Font Awesome图标库
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(link);
  }
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family:  "Microsoft YaHei", 微软雅黑, "MicrosoftJhengHei", -apple-system-font, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei UI", Arial, sans-serif;
}
body {
  font-family: "Microsoft YaHei", 微软雅黑, "MicrosoftJhengHei", Arial, sans-serif !important;
}
html, body {
  height: 100%;
  width: 100%;
}
#app {
  color: #2c3e50;
  background-image: url('/10108647.jpg');
  background-size: 100% 100%;
  height: 100%;
  width: 100%;
}
ul, li {
  padding: 0;
  margin: 0;
  list-style: none;
}
</style>