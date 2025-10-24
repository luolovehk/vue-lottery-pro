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

// 获取总人数
const totalUserCount = lotteryConfigUsersRawJson.length;
// 获取用户设置的人数
const customUserCount = getCustomUserCount();

// 根据设置的人数过滤数据
// 使用原始顺序，不打乱
let cardUserList = lotteryConfigUsersRawJson;
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
} else if (displayedUserCount > 200) {
  colCount = 30; // 200人以上保持30列
} else {
  colCount = 20; // 100-200人每行25列
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