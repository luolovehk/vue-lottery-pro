<template>
  <div>
    <div class="lottery-setting">
      <button>设置</button>
      <div class="dropdown-content">
        <ul>
          <li>
            <button id="resetAwards" @click="resetPrizeData">X 清空奖项</button>
          </li>
          <li>
            <button id="setUserCount" @click="showUserCountDialog = true">+ 设置人数</button>
          </li>
          <li>
            <button id="add" @click="changeShowDialog">+ 添加奖项</button>
          </li>
          <li>
            <button id="tableShow" @click="tableShow">● 展示全部</button>
          </li>
          <li>
            <button id="winShow" @click="showAllWinUserPanel = true">● 展示中奖</button>
          </li>
          <li>
            <button id="printTickets" @click="goToPrintPage">● 制作奖券</button>
          </li>
          <li>
            <button id="resetData" @click="resetData">X 重置数据</button>
          </li>
        </ul>
      </div>
    </div>
    
    <!-- 添加设置人数的对话框 -->
    <!-- 在 template 部分修改设置人数的对话框 -->
    <div>
      <div class="global-mask" v-show="showUserCountDialog"></div>
      <div class="global-dialog" v-show="showUserCountDialog">
        <div class="title">设置参与总人数</div>
        <div class="content">
          <div class="form">
            <div class="item">
              <span class="text">总人数上限：</span>
              <span style="color: #000000;">{{ totalUsersCount }} （如有更大需求，请联系。）</span>
            </div>
            <div class="item">
              <span class="text">设置人数：</span>
              <input v-model="customUserCount" placeholder="设置参与的总人数" type="number" min="1" :max="totalUsersCount">
            </div>
            <div class="item checkbox-item">
<span class="text">特殊设置：</span>
              <div class="checkbox-wrapper">
                <input type="checkbox" id="useNo4Numbers" v-model="useNo4Numbers" class="custom-checkbox">
                <label for="useNo4Numbers" class="checkbox-label">使用不含数字4的号码</label>
</div>
            </div>
          </div>
        </div>
        <div class="btn">
          <button class="left" @click="showUserCountDialog = false">取消</button>
          <button class="right" @click="confirmUserCount">确定</button>
        </div>
      </div>
    </div>
    
    <div class="lottery-music">
      <audio id="music" src="https://music.163.com/song/media/outer/url?id=4022088.mp3" class="music-item" loop></audio>
      <div id="musicBox" class="music-box" title="播放/暂停背景音乐">音乐</div>
    </div>
    <div>
      <div class="global-mask" v-show="isShowDialog"></div>
      <div class="global-dialog" v-show="isShowDialog">
        <div class="title">添加奖项</div>
        <div class="content">
          <div class="form">
            <div class="item">
              <span class="text">奖项名称：</span>
              <input v-model="prize.name" placeholder="设置奖项的名称，最长7个字符" maxlength="7">
            </div>
            <div class="item">
              <span class="text">奖品名称：</span>
              <input v-model="prize.detail" placeholder="设置奖品的名称，最长10个字符" maxlength="10">
            </div>
            <div class="item">
              <span class="text">奖品总数：</span>
              <input v-model="prize.count" placeholder="设置奖项总数量" type="number">
            </div>
            <div class="item">
              <span class="text">每次限抽：</span>
              <input v-model="prize.everyTimeGet" placeholder="设置每次抽奖的数量" type="number">
            </div>
            <!-- 移除图片URL字段 -->
          </div>
        </div>
        <div class="btn">
          <button class="left" @click="changeShowDialog">退出</button>
          <button class="right" @click="add">添加</button>
        </div>
      </div>
    </div>
    <div class="show-all-win-user" v-if="showAllWinUserPanel">
      <span class="close-btn" @click="showAllWinUserPanel = false">✖</span>
      <vue-scroll :ops='ops' :style="'width:100%;maxHeight:' + pageHeight + 'px;'">
        <div class="prize-win-item" v-for="(item, index) in prizeList" :key="index">
          <div style="display:flex;">
            <div class="prize-name">{{ item.name }}</div>
            <button @click="resetPrizeItem(item)" style=" height:24px;line-height:24px;font-size:13px;padding: 0px 6px;">清空</button>
          </div>
          <div class="prize-win-user">
            <!-- 每十个换行 -->
            <div class="prize-win-user-name-wrap" v-for="(arr, arrIndex) in getRenderArr(item.cardListWin)" :key="arrIndex">
              <span class="prize-win-user-name" v-for="(user, userIndex) in arr" :key="userIndex">
                {{ user.id }}
              </span>
              <br />
            </div>
          </div>
        </div>
      </vue-scroll>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.lottery-music {
  position: fixed;
  top: 0;
  right: 10px;
  z-index: 5;
  user-select: none;
}
.lottery-setting {
  position: fixed;
  top: 10px;
  right: 65px;
  z-index: 5;
  user-select: none;
  display: inline-block;
}

.lottery-setting:hover .dropdown-content {
  display: block;
}

.dropdown-content {
  display: none;
  position: absolute;
  min-width: 100px;
  width: 90px; /* 固定宽度，确保统一 */
  z-index: 1;
  background-color: #3d3d34; /* 添加背景色 */
  border-radius: 5px;
  overflow: hidden;
}

.dropdown-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.dropdown-content li {
  margin: 0;
  padding: 0;
}

.dropdown-content button {
  width: 100%; /* 按钮宽度100%继承父元素 */
  padding: 8px 12px;
  background-color: #3d3d34;
  color: #fff;
  border: none;
  border-bottom: 1px solid #fff;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  margin-right: 0 !important; /* 移除所有按钮的右边距 */
  box-sizing: border-box;
}

.dropdown-content button:last-child {
  border-bottom: none; /* 最后一个按钮没有底边框 */
}

.dropdown-content button:hover {
  background-color: #555;
}

.music-item {
  display: block !important;
  opacity: 0;
}

.music-box {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  cursor: pointer;
  margin-top: 5px;
  background-color: rgb(249, 191, 69);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.global-mask {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 998;
  width: 100%;
  height: 100%;
  background: rgba($color: #000000, $alpha: 0.3);
}
.global-dialog {
  position: fixed;
  left: calc(50% - 320px);
  top: 10%;
  z-index: 999;
  width: 40rem;
  background: #FFFFFF;
  border-radius: 15px;
  overflow: hidden;
  font-size: 16px;
  .title {
    font-size: 2rem;
    font-weight: 600;
    text-align: center;
    line-height: 5rem;
  }
  .content {
    .text {
      font-size: 1rem;
      font-weight: 600;
      text-align: center;
    }
    .form {
      padding: 0 4rem;
      .item {
        display: flex;
        align-items: center;
        margin-bottom: 1rem;
        line-height: 40px;
        input {
          width: 300px; // 调整为更合适的宽度
          height: 40px;
          font-size: 16px;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          padding: 0 20px;
          box-sizing: border-box; // 确保padding不会增加总宽度
        }
        // 添加复选框对齐修复
        &.checkbox-item {
          .text {
            flex-shrink: 0;
            min-width: 80px;
          }
          .checkbox-wrapper {
            display: flex;
            align-items: center;
            flex-grow: 1;
          }
          .custom-checkbox {
            margin: 0;
            width: auto;
            height: auto;
            vertical-align: middle;
          }
          .checkbox-label {
            margin-left: 8px;
            vertical-align: middle;
            line-height: 1.2;
          }
        }
      }
    }
  }
  .btn {
    display: flex;
    float: right;
    margin-right:1rem;
    margin-bottom: 1rem;
    &> button {
      flex: 1;
      text-align: center;
      font-size: 20px;
      &.left {
        margin-right:16px;
      }
      &.right {
        color: #FFFFFF;
        background: rgba(0,92,175,1);
      }
    }
  }
}
.show-all-win-user {
position: fixed;
  width: calc(100vw - 60px);
  height: calc(100vh - 110px);
  left: 30px;
  top: calc(50px + 30px);
  border-radius: 10px;
  background-color: rgb(59, 59, 52);
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
border: 1px solid rgba(255,255,251, 0.6);
  color: #fff;
.close-btn {
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 99;
    font-size: 30px;
    cursor: pointer;
    display: block;
    color: rgba(255, 255, 255, .7);
  }
  .prize-win-item {
    //flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 50px;
    margin-top: 20px;
    .prize-name {
      font-size: 50px;
      font-weight: 800;
      margin-right: 12px;
      margin-bottom: 12px;
    }
    .prize-win-user {
margin: 26px 0px;
      .prize-win-user-name {
        font-size: 38px;
        color: #ffd000;
        font-weight: 600;
        width: 100px;
        display: inline-block;
        text-align: center;
        line-height: 1.2;
      }
    }
  }
}
</style>

<script lang="ts">
import STATUS from './3d-status.js';
import { v4 as uuidv4 } from 'uuid'
import { transform } from './3d-animate.js';
import lotteryConfig from './lottery-config.js';
import { Component, Vue } from "vue-property-decorator";
import { totalUsersCount } from './lottery-config-users.js'; // 导入总人数
// 添加Vue Router导入以便使用路由跳转
// 删除未使用的router导入

@Component({
  components: {}
})export default class LotteryMusic extends Vue {
  data() {
    return {
      pageHeight: window.innerHeight,
      ops: {
        vueScroll: {
          mode: 'native',
          sizeStrategy: 'percent',
          wheelScrollDuration: 1,
          detectResize: true,
          locking: true
        },
        scrollPanel: {
          initialScrollY: false,
          initialScrollX: false,
          scrollingX: false,
          scrollingY: true,
          speed: 300,
          easing: undefined,
          verticalNativeBarPos: 'right',
          maxHeight: window.innerHeight - 140
        },
        rail: {
          background: '#01a99a',
          opacity: 0,
          size: '3px',
          specifyBorderRadius: false,
          gutterOfEnds: null,
          gutterOfSide: '2px',
          keepShow: false
        },
        bar: {
          showDelay: 1000,
          onlyShowBarOnScroll: false,
          keepShow: false,
          background: '#c1c1c1',
          opacity: 1,
          hoverStyle: false,
          specifyBorderRadius: false,
          minSize: false,
          size: '6px',
          disable: false
        }
      }
    }
  }
  ops: any;
  pageHeight: Number;
  isShowDialog = false;
  resetPrize = false;
  showAllWinUserPanel = false;
  prizeList = lotteryConfig.prizeList;
  prize = {
    count: undefined,
    countRemain: undefined,
    everyTimeGet: undefined,
    name: "",
    detail: "",
    img: "",
    id: "",
    cardListWin: [],
    round: 0
  };
  // 添加我们需要的属性定义
  showUserCountDialog = false;
  customUserCount: number | null = null;
  totalUsersCount = totalUsersCount;
  useNo4Numbers = false;
  
  musicInit() {
    const music: any = document.querySelector("#music");

    let rotated = 0;
    let stopAnimate = false;
    const musicBox: any = document.querySelector("#musicBox");

    function animate() {
      requestAnimationFrame(function () {
        if (stopAnimate) {
          return;
        }
        rotated = rotated % 360;
        musicBox.style.transform = "rotate(" + rotated + "deg)";
        rotated += 1;
        animate();
      });
    }

    musicBox.addEventListener(
      "click",
      function () {
        if (music.paused) {
          music.play().then(
            () => {
              stopAnimate = false;
              animate();
            },
            () => {
              console.log('背景音乐自动播放失败，请给权限或手动播放！');
              // alert('背景音乐自动播放失败，请给权限或手动播放！')
            }
          );
        } else {
          music.pause();
          stopAnimate = true;
        }
      },
      false
    );

    setTimeout(function () {
      musicBox.click();
    }, 1000);
  }

  resetData () {
    if (confirm('是否要重置所有抽奖数据，此操作不可恢复！')) {
      lotteryConfig.clearLocalStorage();
      location.reload();
    }
  }

  resetPrizeData () {
    if (confirm('是否要重置所有奖项，此操作不可恢复！')) {
      this.$cookies.set('prize_list', JSON.stringify([]));
      this.prizeList = [];
      location.reload();
    }
  }

  changeShowDialog () {
    this.isShowDialog = !this.isShowDialog
    this.prize = {
      count: undefined,
      countRemain: undefined,
      everyTimeGet: undefined,
      name: "",
      detail: "",
      img: "",
      id: "",
      cardListWin: [],
      round: 0
    }
  }
  listenResize () {
    this.pageHeight = window.innerHeight
    this.ops.scrollPanel.maxHeight = window.innerHeight
  }
  // 假设这是原有的add方法
  add () {
    if (!this.prize.count || !this.prize.everyTimeGet || !this.prize.name || !this.prize.detail) {
      alert('除了配图URL，其他不能为空')
      return
    } else if (Number(this.prize.count) < Number(this.prize.everyTimeGet)) {
      alert('每次抽奖数量不能大于奖项总数量')
      return
    }
    
    // 添加检查：计算所有奖项总数之和是否超过参与总人数
    const totalPrizeCount = this.prizeList.reduce((sum, item) => sum + item.count, 0) + Number(this.prize.count)
    const totalUserCount = lotteryConfig.cardList.length
    
    if (totalPrizeCount > totalUserCount) {
      alert(`奖项总数不能超过参与总人数(${totalUserCount})，当前已设置${totalPrizeCount - Number(this.prize.count)}个奖项，还可添加${totalUserCount - (totalPrizeCount - Number(this.prize.count))}个奖项`)
      return
    }
    
    this.prize.count = Number(this.prize.count)
    this.prize.everyTimeGet = Number(this.prize.everyTimeGet)
    this.prize.countRemain = this.prize.count
    this.prize.id = uuidv4().substr(0, 10)
    this.prizeList.push(this.prize)
    this.$cookies.set('prize_list', JSON.stringify(this.prizeList))
    this.isShowDialog = false
  }

  async tableShow() {
    if (STATUS.getStatus() !== STATUS.RUNNING_LOTTERY) {
      STATUS.setStatusRun();
      await transform( 'table', 1000 ); // sphere
      STATUS.setStatusWait();
    } else {
      alert('抽奖正在运行中，请等待后再操作！')
    }
  }

  resetPrizeItem (prize) {
    const cardListWinAll = lotteryConfig.cardListWinAll;
    const cardListRemainAll = [];
    const priceClassList = Array.from(document.getElementsByClassName('prize'));
    const prizeList = lotteryConfig.prizeList;
    prize.cardListWin.forEach(item => {
      priceClassList.forEach(price => {
        if (price['dataset'].cardId === item.id) {
          price.classList.remove('prize');
        }
      })
      const index = cardListWinAll.findIndex(win=> win.id === item.id);
      if (index > -1) {
        cardListWinAll.splice(index, 1);
        cardListRemainAll.push(item);
      }
    })
    prize.isShowTime = false
    prize.round = 0
    prize.cardListWin = [];
    prize.countRemain = prize.count;
    const index = prizeList.findIndex(item => item.id === prize.id)
    prizeList[index] = prize
    // lotteryConfig.everyTimeGet = prize.everyTimeGet,
    // lotteryConfig.currentPrize = prize.id,
    lotteryConfig.prizeList = prizeList,
    lotteryConfig.cardListWinAll = cardListWinAll,
    lotteryConfig.cardListRemainAll = lotteryConfig.cardListRemainAll.concat(cardListRemainAll),
    lotteryConfig.cardList = cardListWinAll.concat(lotteryConfig.cardListRemainAll)
    lotteryConfig.setLocalStorage(); 
  }

  // 修复script标签结构，确保所有方法正确缩进并删除重复的闭合标签
  
    getRenderArr(arr) {
      const arrRes = [];
      const n = 15;
      const len = arr.length;
      const lineNum = len % n === 0 ? len / n : Math.floor( (len / n) + 1 );
      for (let i = 0; i < lineNum; i++) {
        const temp = arr.slice(i*n, i*n+n);
        arrRes.push(JSON.parse(JSON.stringify(temp)));
      }
      return arrRes;
    }
  
    // 添加跳转到打印页面的方法
    goToPrintPage() {
      window.open('/print', '_blank');
    }
  
    mounted () {
      this.musicInit();
    }
    
    confirmUserCount() {
      if (this.customUserCount && this.customUserCount > 0 && this.customUserCount <= this.totalUsersCount) {
        sessionStorage.setItem('customUserCount', this.customUserCount.toString());
        sessionStorage.setItem('useNo4Numbers', this.useNo4Numbers.toString());
        // 移除手动刷新提示，添加自动刷新
        location.reload();
        this.showUserCountDialog = false;
      } else {
        alert(`请输入1-${this.totalUsersCount}之间的数字`);
      }
    }
    
    // 重置人数设置
    resetUserCount() {
      if (confirm('是否要重置参与人数设置？')) {
        sessionStorage.removeItem('customUserCount');
        location.reload();
      }
    }
    
    created () {
      window.addEventListener('resize', this.listenResize)
      // 初始化自定义人数和无4号码设置
      const savedCount = sessionStorage.getItem('customUserCount');
      if (savedCount) {
        this.customUserCount = parseInt(savedCount, 10);
      }
      const useNo4 = sessionStorage.getItem('useNo4Numbers');
      if (useNo4) {
        this.useNo4Numbers = useNo4 === 'true';
      }
    }
  }
</script>