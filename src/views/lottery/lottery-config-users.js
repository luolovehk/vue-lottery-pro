import lotteryConfigUsersRawJson from './lottery-config-users-raw.json';

// 获取用户设置的人数，默认为全部
const getCustomUserCount = () => {
  try {
    const count = sessionStorage.getItem('customUserCount');
    return count ? parseInt(count, 10) : null;
  } catch (e) {
    console.error('读取用户设置失败:', e);
    return null;
  }
};

// 获取是否使用无4号码的设置
const getUseNo4Numbers = () => {
  try {
    const useNo4 = sessionStorage.getItem('useNo4Numbers');
    return useNo4 === 'true';
  } catch (e) {
    console.error('读取无4号码设置失败:', e);
    return false;
  }
};

// 动态过滤不含数字4的号码
const filterNo4Numbers = (users) => {
  return users.filter(user => !user.id.includes('4'));
};

// 确保生成足够数量的不含4号码
const ensureNo4NumbersCount = (users, targetCount) => {
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
          id: currentNumber.toString(),
          name: `用户${currentNumber}`
        });
      }
      currentNumber++;
    }
    
    return [...no4Users, ...additionalUsers];
  }
  
  // 数量足够时，直接返回前targetCount个
  return no4Users.slice(0, targetCount);
};

// 目标人数设置为600
const TARGET_USER_COUNT = 600;

// 根据设置选择使用哪个号码数据源，并确保总人数为600
let cardUserList;
if (getUseNo4Numbers()) {
  // 使用不含4的号码，并确保总数为600
  cardUserList = ensureNo4NumbersCount(lotteryConfigUsersRawJson, TARGET_USER_COUNT);
} else {
  // 使用原始号码，但也限制为600个
  cardUserList = lotteryConfigUsersRawJson.slice(0, TARGET_USER_COUNT);
}

// 获取总人数（现在固定为600）
const totalUserCount = TARGET_USER_COUNT;

// 忽略用户设置的customUserCount，始终使用600人
// 获取用户设置的人数
const customUserCount = getCustomUserCount();

// 根据设置的人数过滤数据
if (customUserCount && customUserCount > 0 && customUserCount < totalUserCount) {
  cardUserList = cardUserList.slice(0, customUserCount);
}

// table模式下行列数
let row = 1;
let col = 1;
// 动态计算列数，根据实际显示的用户数量调整
// 人数少时减少列数，人数多时保持合理的最大列数
let colCount = 30; // 默认为30
const displayedUserCount = cardUserList.length;

// 根据实际显示人数调整列数
if (displayedUserCount < 100) {
  // 人数较少时，计算更适合的列数
  if (displayedUserCount <= 10) {
    colCount = 5; // 10人以下每行5列
  } else if (displayedUserCount <= 20) {
    colCount = 5; // 11-20人每行10列
  } else if (displayedUserCount <= 50) {
    colCount = 10; // 21-50人每行15列
  } else {
    colCount = 15; // 51-99人每行20列
  }
} else if (displayedUserCount <= 500) {
  colCount = 30; // 200人以上保持30列
} else {
  colCount = 40; // 100-200人每行25列
}

cardUserList.forEach((item, i) => {
  // 每行结束 另起一行
  item.index = i;
  if (col > colCount) {
    col = 1;
    row++;
  }
  item.row = row;
  item.col = col;
  col++;
});

export { colCount };
export const rowCount = row;
export const cardList = cardUserList;
export const totalUsersCount = totalUserCount;