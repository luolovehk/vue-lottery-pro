import Vue from 'vue';
// 删除未使用的RouteConfig导入
import VueRouter from 'vue-router';
import Lottery from '../views/lottery/lottery.vue';
import LotteryPrint from '../views/lottery/lottery-print.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Lottery
  },
  {
    path: '/vue-lottery-pro',
    name: 'Lottery',
    component: Lottery
  },
  {
    path: '/print',
    name: 'LotteryPrint',
    component: LotteryPrint
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
export { router };