import Vue from 'vue';
import Router from 'vue-router';

const Home = () => import(/* webpackChunkName: "home" */ '@/views/app/Home.vue');
const App = () => import('@/App.vue');
const Verify = () => import(/* webpackChunkName: "verify" */ '@/views/app/Verify.vue');
const Login = () => import(/* webpackChunkName: "login" */ '@/views/app/Login.vue');
const CellNumber = () => import(/* webpackChunkName: "cellNumber" */ '@/views/app/CellNumber.vue');
const Forget = () => import(/* webpackChunkName: "forget" */ '@/views/app/Forget.vue');
const SuccessOrUnfinishOrder = () =>
  import(/* webpackChunkName: "successOrUnfinishOrder" */ '@/views/app/SuccessOrUnfinishOrder.vue');
const TxDetail = () => import(/* webpackChunkName: "txDetail" */ '@/views/app/TxDetail.vue');
const OrderStatus = () => import(/* webpackChunkName: "orderStatus" */ '@/views/app/OrderStatus.vue');

const webHome = () => import(/* webpackChunkName: "webHome" */ '@/views/web/Home.vue');
const webVerify = () => import(/* webpackChunkName: "webVerify" */ '@/views/web/Verify.vue');
const webLogin = () => import(/* webpackChunkName: "webLogin" */ '@/views/web/Login.vue');
const webCellNumber = () => import(/* webpackChunkName: "webCellNumber" */ '@/views/web/CellNumber.vue');
const webForget = () => import(/* webpackChunkName: "webForget" */ '@/views/web/Forget.vue');
const webSuccessOrUnfinishOrder = () =>
  import(/* webpackChunkName: "webSuccessOrUnfinishOrder" */ '@/views/web/SuccessOrUnfinishOrder.vue');
const webTxDetail = () => import(/* webpackChunkName: "webTxDetail" */ '@/views/web/TxDetail.vue');
const webOrderStatus = () => import(/* webpackChunkName: "webOrderStatus" */ '@/views/web/OrderStatus.vue');

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'App',
      component: App,
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
    },
    {
      path: '/web/home',
      name: 'webHome',
      component: webHome,
    },
    {
      path: '/verify',
      name: 'verify',
      component: Verify,
    },
    {
      path: '/web/verify',
      name: 'webVerify',
      component: webVerify,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/web/login',
      name: 'webLogin',
      component: webLogin,
    },
    {
      path: '/search',
      name: 'search',
      component: CellNumber,
    },
    {
      path: '/web/search',
      name: 'webSearch',
      component: webCellNumber,
    },
    {
      path: '/forget',
      name: 'forget',
      component: Forget,
    },
    {
      path: '/web/forget',
      name: 'webForget',
      component: webForget,
    },
    {
      path: '/successOrUnfinishOrder/:type',
      name: 'successOrUnfinishOrder',
      component: SuccessOrUnfinishOrder,
    },
    {
      path: '/web/successOrUnfinishOrder/:type',
      name: 'webSuccessOrUnfinishOrder',
      component: webSuccessOrUnfinishOrder,
    },
    {
      path: '/txDetail/:sn',
      name: 'txDetail',
      component: TxDetail,
    },
    {
      path: '/web/txDetail/:sn',
      name: 'webTxDetail',
      component: webTxDetail,
    },
    {
      path: '/orderStatus/:orderID',
      name: 'orderStatus',
      component: OrderStatus,
    },
    {
      path: '/web/orderStatus/:orderID',
      name: 'webOrderStatus',
      component: webOrderStatus,
    },
  ],
});
