<template>
  <div class="print-page">
    <div class="print-controls">
      <h2>抽奖券打印页面</h2>
      <div class="control-buttons">
        <button @click="switchMode('normal')" :class="{ active: currentMode === 'normal' }">
          600名普通号码
        </button>
        <button @click="switchMode('no4')" :class="{ active: currentMode === 'no4' }">
          600名不含数字4的号码
        </button>
        <button @click="printPage" class="print-btn">打印抽奖券</button>
      </div>
      
      <!-- 添加抽奖券名称自定义输入框 -->
      <div class="ticket-name-control" style="margin-top: 15px;">
        <label for="ticketNameInput">自定义名称：</label>
        <input 
          id="ticketNameInput" 
          v-model="customTicketName" 
          type="text" 
          placeholder="请输入抽奖券名称"
          style="padding: 5px 10px; border-radius: 4px; border: 1px solid #ddd;"
        >
      </div>
    </div>
    
    <div class="a4-container" id="print-area">
      <div v-for="(ticket, index) in tickets" :key="index" class="lottery-ticket">
        <div class="ticket-content">
          <!-- 增强的装饰元素 -->
          <div class="ticket-decoration top-left"></div>
          <div class="ticket-decoration top-right"></div>
          <div class="ticket-decoration bottom-left"></div>
          <div class="ticket-decoration bottom-right"></div>
          
          <!-- 抽奖券标题 -->
          <div class="ticket-title">幸运抽奖券</div>
          
          <!-- 放大的编号 -->
          <div class="ticket-number">{{ ticket.id }}</div>
          
          <!-- 名称信息 -->
          <div class="ticket-name">{{ ticket.name }}</div>
          
          <!-- 底部装饰线条 -->
          <div class="ticket-bottom-line"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import lotteryConfigUsersRawJson from './lottery-config-users-raw.json';

// 动态过滤不含数字4的号码
const filterNo4Numbers = (users) => {
  return users.filter(user => !user.id.includes('4'));
};

// 确保生成足够数量的不含4号码
const ensureNo4NumbersCount = (users, targetCount, customName) => {
  // 先过滤出所有不含4的号码
  const no4Users = filterNo4Numbers(users);
  
  // 如果数量不足，我们需要生成额外的号码
  if (no4Users.length < targetCount) {
    const additionalUsers = [];
    let currentNumber = users.length + 1;
    
    // 继续生成不含4的号码直到达到目标数量
    while (additionalUsers.length + no4Users.length < targetCount) {
      if (!currentNumber.toString().includes('4')) {
        additionalUsers.push({
          id: currentNumber.toString().padStart(3, '0'),
          name: customName // 使用自定义名称
        });
      }
      currentNumber++;
    }
    
    return [...no4Users, ...additionalUsers];
  }
  
  // 数量足够时，返回前targetCount个并确保使用自定义名称
  return no4Users.slice(0, targetCount).map(user => ({
    ...user,
    name: customName // 使用自定义名称
  }));
};

@Component
export default class LotteryPrint extends Vue {
  private currentMode: 'normal' | 'no4' = 'normal';
  private targetCount: number = 600;
  private customTicketName: string = 'XX活动抽奖专用 2026年1月1日'; // 添加自定义名称属性

  // 使用getter替代@Computed装饰器
  private get tickets() {
    if (this.currentMode === 'no4') {
      // 获取不含数字4的600个号码，并使用自定义名称
      return ensureNo4NumbersCount(lotteryConfigUsersRawJson, this.targetCount, this.customTicketName);
    } else {
      // 获取普通的600个号码，并统一使用自定义名称
      return lotteryConfigUsersRawJson.slice(0, this.targetCount).map(user => ({
        ...user,
        id: user.id ? user.id : '',
        name: this.customTicketName // 使用自定义名称
      }));
    }
  }

  private switchMode(mode: 'normal' | 'no4') {
    this.currentMode = mode;
  }

  private printPage() {
    // 调用浏览器打印功能
    window.print();
  }
}
</script>

<style lang="scss" scoped>
.print-page {
  padding: 20px;
  font-family: 'Microsoft YaHei', Arial, sans-serif;
}

.print-controls {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  text-align: center;
}

.control-buttons {
  margin-top: 15px;
}

button {
  margin: 0 10px;
  padding: 8px 16px;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

button:hover {
  background-color: #f0f0f0;
}

button.active {
  background-color: #42b983;
  color: white;
  border-color: #42b983;
}

.print-btn {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
  font-weight: bold;
}

.print-btn:hover {
  background-color: #0056b3;
}

/* A4纸容器样式 */
.a4-container {
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 5mm;
  background-color: white;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  display: grid;
  grid-template-columns: repeat(auto-fit, 64mm);
  gap: 1mm;
  justify-content: center;
}

/* 抽奖券样式 - 增强设计 */
.lottery-ticket {
  width: 64mm;
  height: 45mm;
  border: 2px solid #333;
  border-radius: 6px;
  padding: 4mm;
  box-sizing: border-box;
  background: linear-gradient(135deg, #fff 0%, #f9f9f9 100%);
  position: relative;
  overflow: hidden;
}

/* 装饰角元素 */
.ticket-decoration {
  position: absolute;
  width: 15mm;
  height: 15mm;
}

.ticket-decoration.top-left {
  top: 0;
  left: 0;
  border-top: 3px solid #ff6b6b;
  border-left: 3px solid #ff6b6b;
}

.ticket-decoration.top-right {
  top: 0;
  right: 0;
  border-top: 3px solid #ff6b6b;
  border-right: 3px solid #ff6b6b;
}

.ticket-decoration.bottom-left {
  bottom: 0;
  left: 0;
  border-bottom: 3px solid #ff6b6b;
  border-left: 3px solid #ff6b6b;
}

.ticket-decoration.bottom-right {
  bottom: 0;
  right: 0;
  border-bottom: 3px solid #ff6b6b;
  border-right: 3px solid #ff6b6b;
}

.ticket-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* 抽奖券标题 */
.ticket-title {
  font-size: 24px;
  font-weight: bold;
  color: #000000;
  margin: 4mm;
  text-align: center;
  letter-spacing: 1px;
}

/* 放大的编号 - 主要变化点 */
.ticket-number {
  font-size: 86px;
  font-weight: bold;
  color: #000000;
  text-align: center;
  margin: 4mm 0;
  font-family: 'Arial Black', 'Microsoft YaHei', sans-serif;
}

.ticket-name[data-v-ad9b288e] {
  font-size: 12px;
  color: #161616;
  text-align: center;
  margin-top: 4mm;
  line-height: 1.5; /* 添加这一行来控制行距 */
}

/* 底部装饰线 */
.ticket-bottom-line {
  width: 80%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #ff6b6b, transparent);
  margin-top: 3mm;
}

/* 打印样式 */
@media print {
  body {
    margin: 0;
    padding: 0;
    background-color: white;
  }
  
  .print-controls {
    display: none;
  }
  
  .a4-container {
    width: 210mm;
    height: 297mm;
    padding: 0;
    box-shadow: none;
    margin: 0;
  }
  
  .lottery-ticket {
    break-inside: avoid;
    box-shadow: none;
  }
}
</style>