<template>
  <div class="lottery-wrap">
    <!-- 注释掉星空背景组件 -->
    <!-- <lotteryStarfield/> -->
    <LotteryMusic/>
    <header class="lottery-header">
     <!-- <img src="/favicon.ico" style="width: 40px;height: 40px;margin-right: 12px;" /> -->
      <span>{{ headerTitle }}</span>
    </header>
    <div class="lottery-content">
      <Prize/>
      <Lottery3d/>
    </div>
    <!-- 移除打印页面链接 -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Lottery3d from './lottery-3d.vue';
import Prize from './lottery-prize.vue';
import LotteryMusic from './lottery-music.vue';
// 注释掉星空背景组件的导入
// import lotteryStarfield from './lottery-starfield.vue';
import lotteryConfig from './lottery-config.js';

@Component({
  components: {
    Lottery3d, Prize, LotteryMusic
    // 注释掉星空背景组件的注册
    // lotteryStarfield
  }
})
export default class Lottery extends Vue {
  headerTitle = lotteryConfig.headerTitle;
}
</script>

<style lang="scss" scoped>
.lottery-wrap {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}
.lottery-header {
  flex: none;
  height: 50px;
  width: 100%;
 // background-color: hsla(0,0%,100%,.3);
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgb(249, 191, 69);
  font-size: 26px;
  font-weight: 800;
  //position: fixed;
}
.lottery-content {
  display: flex;
}
</style>