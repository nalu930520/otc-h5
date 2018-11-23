import Vue from 'vue';
import Vuex from 'vuex';
import { queryCountry } from './api/gobal';
import { customerInfo } from './api/verify';
import { verifySign } from './api/transfer';
import { join } from 'path';
import { setStore, getStore } from '@/utils/sessionStorage';
Vue.use(Vuex);

let interval: any;
export default new Vuex.Store({
  state: {
    verifyCodeTime: 59,
    countries: [],
    mobileCode: '',
    mobileCodeNew: '',
    customerInfo: {},
    transferInfo: {},
    txid: '',
  },
  mutations: {
    reduceVerifyCodeTime( state ) {
      state.verifyCodeTime = 59;
      if (interval !== undefined) {
        clearInterval(interval);
      }
      interval = setInterval(() => {
        if (state.verifyCodeTime === 0) {
          clearInterval(interval);
        } else {
          state.verifyCodeTime--;
        }
      }, 1000);
    },
    setCountry( state , payload) {
      state.countries = payload.list;
      setStore('countries', payload.list);
    },
    setMobileCode( state , payload) {
      const counObj: any = state.countries.find((item: any) => item.iso2 === payload.mobileCountryCode.toUpperCase());
      if (counObj && counObj.mobile_code) {
        state.mobileCode = counObj.mobile_code;
        state.mobileCodeNew = counObj.mobile_code;
        setStore('mobileCode', counObj.mobile_code);
        setStore('mobileCodeNew', counObj.mobile_code);
      }
    },
    setMobileCodeNum( state , payload) {
      state.mobileCodeNew = payload.mobile_code;
      setStore('mobileCodeNew', payload.mobile_code);
    },
    SET_CUSTOMERINFO: (state, payload) => {
      state.customerInfo = payload;
      setStore('customerInfo', payload);
    },
    SET_TRANSFERINFO: (state, payload) => {
      state.transferInfo = payload;
      setStore('transferInfo', payload);
    },
    UPDATE_TOKEN: (state, payload) => {
      state.customerInfo = {
        ...getStore('customerInfo'),
        token: payload,
      };
      const obj: any = { ...getStore('customerInfo'),
        token: payload,
      };
      setStore('customerInfo', obj);
    },
    SET_TXID: (state, payload) => {
      state.txid = payload;
      setStore('txid', payload);
    },
  },
  actions: {
    fetchCountry({ commit }, params) {
      queryCountry().then((response) => {
        const data: any = response;
        if (data.ret === 1) {
          commit({
            type: 'setCountry',
            list: data.countries,
          });
          if (params.mobileCountryCode) {
            commit({
              type: 'setMobileCode',
              mobileCountryCode: params.mobileCountryCode,
            });
          }
        }
      });
    },
    async fetchCustomerInfo({ commit }, params) {
      const resCustomerInfo = await customerInfo(params);
      commit('SET_CUSTOMERINFO', resCustomerInfo.data);
      return resCustomerInfo.data;
    },
    async createOrderAndSign({ commit }, params) {
      const resVerifySign = await verifySign(params);
      commit('SET_TXID', resVerifySign.data.tx_id);
      return resVerifySign;
    },
  },
});
