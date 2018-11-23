import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import i18n from './locales';
import moment from 'moment';
import Bg from 'bignumber.js';
import './registerServiceWorker';
import './permission';
import 'whatwg-fetch';
// import FastClick from 'fastclick';

// window.addEventListener('touchstart', (e) => {
//   console.log(e.targetTouches.length)
//   if (e.targetTouches.length === 2) {
//     e.preventDefault();
//   }
// }, { passive: false });

// if ('addEventListener' in document) {
//   document.addEventListener('DOMContentLoaded',
//     () => { (FastClick as any).attach(document.body); });
// }

Vue.filter('formatTime', (value: any) => {
  if (!value) {
    return '-';
  } else {
    return moment.unix(value).format('YYYY-MM-DD HH:mm:ss');
  }
});

Vue.filter('formatAmount', (value: any, currency: string) => {
  Bg.config({ ERRORS: false });
  if (!value) {
    return value;
  } else {
    const bigNumber = new Bg(value);

    if (currency === 'cny') {
      return bigNumber.dividedBy(10 ** 8).toFormat(2, 4);
    }
    if (bigNumber.dp() > 8) {
      return bigNumber.toFormat(8, 1);
    } else {
      return bigNumber.toFormat(bigNumber.dp(), 1);
    }
  }
});


document.body.addEventListener('touchmove', (e) => {
  e.preventDefault();
}, {passive: false});
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
