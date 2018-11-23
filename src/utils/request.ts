import axios from 'axios';
import store from '@/store';
import localStorge from 'store';
import { Dialog, Toast } from 'vant';
import { isPc } from '@/utils/index';
import { Vue } from 'vue-property-decorator';
import Message from 'vue-m-message';

// import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_ROOT_API, // api的base_url
  timeout: 30 * 1000, // request timeout
});

// request interceptor
service.interceptors.request.use((config) => {
  // Do something before request is sent
  // if (store.getters.token) {
  config.headers.token = localStorge.get('mobi_token');
  // config.headers.token = '';
  // }
  // config.data = JSON.stringify(config.data)
  // config.body = config.data
  return config;
}, (error) => {
  // Do something with request error
  // console.log(error); // for debug
  Promise.reject(error);
});

// respone interceptor
service.interceptors.response.use(
  (response: any) => {
    if (response.data.ret !== 'ok') {
      if (!isPc) {
        Toast.fail(response.data.ret);
      } else {
        Message.error({message: response.data.ret, zIndex: 10000, showClose: false});
      }
      return Promise.reject(response.data.ret);
    }
    if (response.data.ret === -1444) {
      Dialog.alert({
        message: '你已被登出，可以取消继续留在该页面，或者重新登录',
      }).then(() => {
        store.dispatch('FedLogOut').then(() => {
          location.reload(); // 为了重新实例化vue-router对象 避免bug
        });
      });
    }
    return response.data;
  },
  (error) => {
    // console.log('err' + error); // for debug
    // Toast.fail(error.message);
    return Promise.reject(error);
  },
);

export default service;
