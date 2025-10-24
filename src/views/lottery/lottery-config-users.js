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
const colCount = 30;
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