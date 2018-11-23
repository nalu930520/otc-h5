<template>
  <div>
    <comHead />
    <template v-if="show">
      <p class="remind-msg">{{$t('lang.payment_sms_label_verify')}}</p>
      <p class="verify-mobile">+{{mobileCode}} {{mobile}}</p>
      <van-password-input
        :value="code"
        @focus="showKeyboard = true"
      />
      <p class="send-msg" v-show="verifyCodeTime !=0">{{verifyCodeTime}}s {{$t('lang.payment_sms_button_resend')}}</p>
      <p class="send-msg" v-show="verifyCodeTime ===0" @click="sendVerifyCode">{{$t('lang.payment_sms_label_resend')}}{{$t('lang.payment_sms_button_resend')}}</p>
      <van-button class="opacity-btn" @click="changeAccount">{{$t('lang.payment_sms_button_switch_account')}}</van-button>
    </template>
    <div v-if="!show">
      <div class="logo-mobi">
        <img src="@/assets/logo_white.png" alt="">
      </div>
      <div class="verify-container">
        <van-cell-group>
          <van-row class="form-item">
            <van-col span="6">
              <div class="mobile-header" @click="changeCunMobile">+{{mobileCodeNew}} <van-icon name="arrow" class="more-mobile-header"/></div>
            </van-col>
            <van-col span="18">
              <van-field
                v-model="mobileVal"
                :placeholder="$t('lang.payment_login_text_enter_phone')"
              />
            </van-col>
          </van-row>
          <van-row class="form-item">
            <van-col span="18">
              <van-field
                v-model="sms"
                :placeholder="$t('lang.payment_login_text_enter_sms_code')"
              />
            </van-col>
            <van-col span="6">
              <van-button size="small" class="get-msm" @click="sendVerifyCode(false)"><span v-if="!sending">{{$t('lang.payment_login_button_send')}}</span><span v-if="sending">{{verifyCodeTime}}s</span></van-button>
            </van-col>
          </van-row>
          <van-row>
            <com-button type="primary" :size="'large'" @click="next">{{$t('lang.payment_login_button_next')}}</com-button>
          </van-row>
        </van-cell-group>
      </div>
      <p class="send-msg verify-note">{{$t('lang.payment_login_text_agree_tos')}}</p>
    </div>
    <template v-if="show">
      <van-number-keyboard
        :show="showKeyboard"
        @input="onInput"
        @delete="onDelete"
        @blur="showKeyboard = false"
      />
    </template>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator';
  import { VueUse } from '@/utils/index';
  import comButton from '@/components/common/button.vue';
  import { sendVerifyCode, verifyCode } from '@/api/verify';
  import { queryCountry } from '@/api/gobal';
  import { State } from 'vuex-class';
  import comHead from '@/components/header/head.vue';
  import {
    Icon,
    PasswordInput,
    NumberKeyboard,
    Field,
    Row,
    Col,
    CellGroup,
Toast,
  } from 'vant';
  VueUse([
    Icon,
    PasswordInput,
    NumberKeyboard,
    Field,
    Row,
    Col,
    CellGroup,
  ]);
  @Component({
    components: {
      comButton,
      comHead,
    },
  })
  export default class Verify extends Vue {
    @State('verifyCodeTime') public verifyCodeTime!: any;
    @State('mobileCode') public mobileCode!: string;
    @State('mobileCodeNew') public mobileCodeNew!: string;
    @State('countries') public countries!: any[];
    public code: string = '';
    public showKeyboard: boolean = true;
    public show: boolean = true;
    public mobile: string = '';
    public mobileVal: string = '';
    public mobileCountryCode: string = '';
    public appId: string = '';
    public sms: string = '';
    public verifyCode: string = '';
    public limitTime: number = 0;
    public countryList: any[] = [];
    public iso2: string = '';
    public sending: boolean = false;
    @Watch('verifyCodeTime')
    private onChildChanged(val: string, oldVal: string) {
      if (Number(val) === 0) {
        this.sending = false;
      }
    }
    private onInput(key: any) {
      this.code = (this.code + key).slice(0, 6);
      if (this.code.length === 6) {
        this.next();
      }
    }
    private onDelete() {
      this.code = this.code.slice(0, this.code.length - 1);
    }
    private created() {
      const langInfo: any = this.$i18n.messages[this.$i18n.locale].lang;
      this.show = this.$route.query && this.$route.query.show === 'false' ? false : true;
      if (this.show) {
        this.mobile = this.$route.query.mobile;
        this.mobileCountryCode = this.$route.query.mobile_country_code;
        this.iso2 = this.$route.query.mobile_country_code;
        this.sendVerifyCode(true);
      } else {
        this.$store.commit('setMobileCodeNum', {mobile_code: this.$route.query.mobile_code});
        this.iso2 = this.$route.query.iso2;
      }
      if (this.countries && this.countries.length === 0) {
        this.$store.dispatch('fetchCountry', { mobileCountryCode: this.mobileCountryCode });
      } else {
        this.$store.commit('setMobileCode', {mobileCountryCode: this.mobileCountryCode});
      }
    }
    private changeAccount() {
      this.show = !this.show;
      this.sending = false;
    }
    private sendVerifyCode(flg: boolean) {
      if (!flg) {
        if (!this.mobileVal.trim() || isNaN(Number(this.mobileVal))) {
          const toastInfo: any = this.$i18n.messages[this.$i18n.locale].lang;
          Toast(toastInfo.payment_login_text_enter_phone);
          return false;
        }
      }
      this.sending = true;
      let sendVerifyParams;
      if (this.show) {
        sendVerifyParams = {
          mobile: this.mobile,
          mobile_country_code: this.mobileCountryCode.toUpperCase(),
        };
      } else {
        sendVerifyParams = {
          mobile: this.mobileVal,
          mobile_country_code: this.iso2.toUpperCase(),
        };
      }
      this.$store.commit('reduceVerifyCodeTime');
      sendVerifyCode(sendVerifyParams).then((response) => {
        const responseInfo: any = response;
        const lang: any = this.$i18n.messages[this.$i18n.locale].lang;
        if (responseInfo.ret === 'ok') {
          Toast(lang.payment_sms_tip_resend_successful);
        }
      }, (error) => {
        this.sending = false;
      });
    }
    private validateForm() {
      const langInfo: any = this.$i18n.messages[this.$i18n.locale].lang;
      if (this.show) {
        if (!this.code.trim()) {
          Toast(langInfo.payment_login_text_enter_sms_code);
          return false;
        }
      } else {
        if (!this.mobileVal.trim() || isNaN(Number(this.mobileVal))) {
          Toast(langInfo.payment_login_text_enter_phone);
          return false;
        }
        if (!this.sms.trim()) {
          Toast(langInfo.payment_login_text_enter_sms_code);
          return false;
        }
      }
      return true;
    }
    private next() {
      if (!this.validateForm()) {
        return;
      }
      let verifyParams: any;
      if (this.show) {
        verifyParams = {
          mobile: this.mobile,
          mobile_country_code: this.mobileCountryCode.toUpperCase(),
          verify_code: this.code,
        };
      } else {
        verifyParams = {
          mobile: this.mobileVal,
          mobile_country_code: this.iso2.toUpperCase(),
          verify_code: this.sms,
        };
      }
      verifyCode(verifyParams).then((response) => {
        const res: any = response;
        if (res.ret === 'ok') {
          this.$router.push({
            path: `/login?mobile=${verifyParams.mobile}&mobile_country_code=${verifyParams.mobile_country_code}`,
          });
        } else {
          Toast(res.ret);
        }
      });
    }
    private changeCunMobile() {
      this.$router.replace({
        path: `/search?mobile_code=${this.mobileCode}&iso2=${this.mobileCountryCode}`,
      });
    }
  }
</script>

<style  lang="less">
  .remind-msg {
    padding: 120px 0 10px 0;
    color: #fff;
    font-size: 16px;
  }
  .verify-mobile {
    color: #fff;
    font-size: 16px;
    margin-bottom: 40px;
  }
  .send-msg {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.5);
    padding: 40px 0;
  }
  .opacity-btn {
    background-color: rgba(255, 255, 255, 0);
    color: #fff;
    border-radius: 0px;
    font-size: 14px
  }
  .logo-mobi {
    padding: 90px 0 40px 0;
  }
  .verify-container {
    width: 345px;
    height: 215px;
    background-color: rgb(255, 255, 255);
    margin: 0 auto;
    border-radius: 2px;
    padding: 20px 15px;
    .form-item {
      border: 1px solid rgb(221, 221, 221);
      margin-bottom: 20px;
      .mobile-header {
        height: 40px;
        line-height: 40px;
        border-right: 1px solid rgb(221, 221, 221);
        font-size: 14px;
      }
      .more-mobile-header {
        transform:rotate(90deg);
        font-size: 12px;
      }
    }
  }
  .verify-note {
    font-size: 12px;
    padding-top: 30px;
    color: rgb(242, 242, 242);
  }
  .get-msm {
    border: 0px;
    color:rgb(33, 78, 162);
    font-size: 14px;
    height: 34px;
    padding: 6px;
    background-color: transparent;
  }
</style>
