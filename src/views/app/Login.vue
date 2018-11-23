<template>
  <div>
    <comHead :goBack="true"/>
    <p class="remind-msg-pass">{{$t('lang.payment_login_enter_pin')}}</p>
    <van-password-input
      :value="password"
      @focus="showKeyboard = true"
    />
    <p class="forget-pass" @click="forgetPassword">{{$t('lang.payment_login_link_forget_pin')}}</p>
    <van-number-keyboard
      :show="showKeyboard"
      @input="onInput"
      @delete="onDelete"
      @blur="showKeyboard = false"
    />
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { verifyPin } from '@/api/verify';
  import comHead from '@/components/header/head.vue';
  import localStorage from 'store';
  import {
    PasswordInput,
    NumberKeyboard,
    Toast,
  } from 'vant';
  Vue.use(PasswordInput);
  Vue.use(NumberKeyboard);
  Vue.use(Toast);
  @Component({
    components: {
      comHead,
    },
  })
  export default class Login extends Vue {
    public password: string = '';
    public showKeyboard: boolean = true;
    public loginInfo: any;
    private created() {
      this.loginInfo = this.$route.query;
    }
    private onInput(key: any) {
      this.password = (this.password + key).slice(0, 6);
      if (this.password.length === 6) {
        const params = {
          mobile: this.loginInfo.mobile,
          mobile_country_code: this.loginInfo.mobile_country_code,
          pin: this.password,
        };
        verifyPin(params).then((response) => {
          const responseInfo: any = response;
          if (responseInfo.ret === 'ok') {
            localStorage.set('mobi_token', responseInfo.data.token);
            this.$store.commit('UPDATE_TOKEN', responseInfo.data.token);
            this.$router.push('/home');
          }
        }, (error) => {
          this.password = '';
        });
      }
    }
    private onDelete() {
      this.password = this.password.slice(0, this.password.length - 1);
    }
    private forgetPassword() {
      this.$router.push({
        path: '/forget',
      });
    }
  }
</script>

<style  lang="less">
  .remind-msg-pass {
    padding: 126px 0 50px 0;
    font-size: 20px;
    color: rgb(255, 255, 255)
  }
  .forget-pass {
    padding-top: 40px;    
    font-size: 16px;
    color: rgb(255, 255, 255)
  }
</style>
