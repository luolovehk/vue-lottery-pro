// 在 script 部分的 data() 方法中添加相关数据
import { totalUserCount } from './lottery-config-users.js';

// 在 class 中添加以下属性和方法
export default class LotteryMusic extends Vue {
  showUserCountPanel = false;
  tempUserCount = '';
  totalUserCount = totalUserCount;
  
  // 获取当前设置的人数
  get currentUserCount() {
    const count = sessionStorage.getItem('customUserCount');
    return count && !isNaN(Number(count)) ? Number(count) : this.totalUserCount;
  }
  
  // 确认设置人数
  confirmUserCount() {
    if (this.tempUserCount && !isNaN(Number(this.tempUserCount))) {
      const count = Math.max(1, Math.min(Number(this.tempUserCount), this.totalUserCount));
      sessionStorage.setItem('customUserCount', count.toString());
      alert(`已设置参与人数为 ${count} 人，请刷新页面使设置生效`);
      this.showUserCountPanel = false;
      this.tempUserCount = '';
    } else {
      alert('请输入有效的人数');
    }
  }
  
  // 恢复默认人数
  resetUserCount() {
    sessionStorage.removeItem('customUserCount');
    alert('已恢复默认人数设置，请刷新页面使设置生效');
    this.showUserCountPanel = false;
    this.tempUserCount = '';
  }
}
// 在 template 部分的 dropdown-content 中添加设置人数的按钮
<li>
  <button id="setUserCount" @click="showUserCountPanel = true" style="background-color:#3d3d34;color:#fff;border-bottom: 1px solid #fff;">设置人数</button>
</li>

// 在 template 部分的末尾（show-all-win-user 之后）添加设置人数的弹窗
// 在 style 部分添加用户设置面板的样式
.user-count-panel {
  position: fixed;
  width: 400px;
  height: 300px;
  left: calc(50% - 200px);
  top: calc(50% - 150px);
  border-radius: 10px;
  background-color: #fff;
  z-index: 1000;
  padding: 20px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  .close-btn {
    position: absolute;
    right: 15px;
    top: 15px;
    font-size: 24px;
    cursor: pointer;
    color: #666;
  }
  .panel-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 20px;
    text-align: center;
    color: #333;
  }
  .panel-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    .count-info {
      margin-bottom: 20px;
      text-align: center;
      span {
        display: block;
        margin: 5px 0;
        color: #666;
      }
    }
    input {
      width: 200px;
      height: 40px;
      padding: 0 15px;
      border: 1px solid #ddd;
      border-radius: 5px;
      margin-bottom: 20px;
      font-size: 16px;
    }
    .panel-buttons {
      display: flex;
      gap: 20px;
      button {
        padding: 8px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
        &:first-child {
          background-color: #4CAF50;
          color: white;
        }
        &:last-child {
          background-color: #f44336;
          color: white;
        }
      }
    }
  }
}
<div class="user-count-panel" v-if="showUserCountPanel">
  <span class="close-btn" @click="showUserCountPanel = false">✖</span>
  <div class="panel-title">设置参与抽奖人数</div>
  <div class="panel-content">
    <div class="count-info">
      <span>当前设置: {{ currentUserCount }} 人</span>
      <span>最大人数: {{ totalUserCount }} 人</span>
    </div>
    <input 
      type="number" 
      v-model="tempUserCount" 
      min="1" 
      :max="totalUserCount"
      placeholder="请输入参与人数"
    >
    <div class="panel-buttons">
      <button @click="confirmUserCount">确认</button>
      <button @click="resetUserCount">恢复默认</button>
    </div>
  </div>
</div>