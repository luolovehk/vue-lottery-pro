import { cardList, colCount, rowCount } from './lottery-config-users.js';
import cookies from 'vue-cookies'
const lotteryConfig = {
	prizeList: [
		{
			count: 20,
			countRemain: 1,
			everyTimeGet: 1,
			name: '一等奖·示例',
			detail: 'Apple watch S9',
			id: '一等奖Apple',
			level: 8,
			cardListWin: [],
			round: 0,
			isShowTime: false,
		},
		{
			count: 10,
			countRemain: 1,
			everyTimeGet: 1,
			name: '二等奖·示例',
			detail: '大疆 便携摄像机Pocket2',
			id: '二等奖大疆',
			level: 7,
			cardListWin: [],
			round: 0,
			isShowTime: false,
		},
		{
			count: 3,
			countRemain: 3,
			everyTimeGet: 3,
			name: '三等奖·示例',
			detail: '机械键盘',
			id: '三等奖机械键盘',
			level: 6,
			cardListWin: [],
			round: 0,
			isShowTime: false,
		}
	], // 奖品列表
	headerTitle: '祝您中大奖！', // 抽奖标题
	currentPrize: null, // 当前抽奖的奖品
	colCount,
	rowCount, // table模式下行列数
	cardList, // 所有卡片的数据
	cardListWinAll: [], // 已经中奖的卡片
	cardListRemainAll: cardList, // 剩余未中奖的卡片
};
if (cookies.get('header_title')) {
  lotteryConfig.headerTitle = cookies.get('header_title')
}
// 如果缓存有奖项配置则直接读取缓存数据
if (cookies.get('prize_list')) {
  lotteryConfig.prizeList = cookies.get('prize_list')
}
lotteryConfig.getCurrentPrize = (prizeId = lotteryConfig.currentPrize) => {
  return lotteryConfig.prizeList.find(_ => {
    return _.id === prizeId;
  });
};
lotteryConfig.getUserById = (id) => {
  return cardList.find(_ => _.id === id);
}

let isInit = false;
const localStorageKey = '___lottery___';
lotteryConfig.setLocalStorage = () => {
  const _lotteryConfig = lotteryConfig;
  _lotteryConfig.headerTitle = lotteryConfig.headerTitle;
  _lotteryConfig.currentPrize = lotteryConfig.currentPrize;
  _lotteryConfig.prizeList = lotteryConfig.prizeList;
  _lotteryConfig.cardListWinAll = lotteryConfig.cardListWinAll;
  _lotteryConfig.cardListRemainAll = lotteryConfig.cardListRemainAll;
  localStorage.setItem(localStorageKey, JSON.stringify(_lotteryConfig));
}
lotteryConfig.getLocalStorage = () => {
  if (isInit !== false) {
    return void 0;
  }
  isInit = true;
  const _lotteryConfigString = localStorage.getItem(localStorageKey);
  if (!_lotteryConfigString) {
    return void 0;
  }
  let _lotteryConfig = null;
  try {
    // TODO 数据有效性判断
    _lotteryConfig = JSON.parse(_lotteryConfigString)
  } catch (e) {
    console.log(e);
  }
  lotteryConfig.headerTitle = _lotteryConfig.headerTitle && _lotteryConfig.headerTitle;
  lotteryConfig.currentPrize = _lotteryConfig.currentPrize && _lotteryConfig.currentPrize;
  lotteryConfig.prizeList = _lotteryConfig.prizeList && _lotteryConfig.prizeList;
  lotteryConfig.cardListWinAll = _lotteryConfig.cardListWinAll && _lotteryConfig.cardListWinAll;
  lotteryConfig.cardListRemainAll = _lotteryConfig.cardListRemainAll && _lotteryConfig.cardListRemainAll;
}
lotteryConfig.clearLocalStorage = () => {
  localStorage.removeItem(localStorageKey)
}
// 初始化奖项配置缓存
cookies.set('prize_list', JSON.stringify(lotteryConfig.prizeList))
cookies.set('header_title', lotteryConfig.headerTitle)
// 在文件末尾添加初始化调用
lotteryConfig.getLocalStorage();
console.log('lotteryConfig', lotteryConfig);

export default lotteryConfig;