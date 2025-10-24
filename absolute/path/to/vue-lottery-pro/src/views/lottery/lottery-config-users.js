import lotteryConfigUsersRawJson from './lottery-config-users-raw.json';
import _ from 'lodash'

// 从 sessionStorage 获取用户设置的人数，如果没有则使用全部
function getUserListWithCustomCount() {
  const rawUserList = JSON.parse(JSON.stringify(lotteryConfigUsersRawJson));
  const customCount = sessionStorage.getItem('customUserCount');
  
  if (customCount && !isNaN(Number(customCount))) {
    const count = Math.min(Number(customCount), rawUserList.length);
    return rawUserList.slice(0, count);
  }
  
  return rawUserList;
}

const cardUserList = _.shuffle(getUserListWithCustomCount());
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
// 导出原始用户总数，用于界面显示
export const totalUserCount = lotteryConfigUsersRawJson.length;