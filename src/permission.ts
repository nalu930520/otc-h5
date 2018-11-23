import router from './router';
import localStorge from 'store';
import store from './store';
import { Toast } from 'vant';
import { isPc } from '@/utils/index';
router.beforeEach((to, from, next) => {
  const token = localStorge.get('mobi_token') || null;
  const queryObj: any = {
    ...to.query,
    mobile: to.query.mobile,
    platform_name: decodeURI(to.query.platform_name),
  };
  if (to.path === '/' && Object.keys(queryObj).length) {
    // 设置传过来的信息
    store.commit('SET_TRANSFERINFO', queryObj);
    localStorge.set('params', queryObj);
    store.dispatch('createOrderAndSign', queryObj)
    .then((res) => {
      store.dispatch('fetchCustomerInfo',
      { mobile: queryObj.mobile,
        mobile_country_code: queryObj.country_code.toUpperCase(),
      }).then((data) => {
        if (data.already_set_pin && !data.is_new_customer) {
          // 没有注册 or 没有设置 PIN 登录成功
          if (isPc) {
            next(`/web/verify?mobile=${queryObj.mobile}&mobile_country_code=${queryObj.country_code.toUpperCase()}`);
          } else {
            next(`/verify?mobile=${queryObj.mobile}&mobile_country_code=${queryObj.country_code.toUpperCase()}`);
          }
        } else {
          localStorge.set('mobi_token', data.token);
          if (isPc) {
            next(`/web/home?transferAmount=${queryObj.amount}`);
          } else {
            next(`/home?transferAmount=${queryObj.amount}`);
          }
        }
      });
     }).catch((error) => {
      Toast(error);
     });
  }
  if (token) {
    // 有 token 登录成功
    // TODO 考虑 token 过期
    next();
  } else {
    // verify 白名单
    switch (to.path) {
      case '/verify':
        next();
        break;
      case '/web/verify':
        next();
        break;
      case '/web/login':
        next();
        break;
      case '/login':
        next();
        break;
      case '/web/forget':
        next();
        break;
      case '/forget':
        next();
        break;
      case '/web/search':
        next();
        break;
      case '/search':
        next();
        break;
      default:
        break;
    }
    // if (!Object.keys(queryObj).length) {
    //
    //   return;
    // }
  }
});
