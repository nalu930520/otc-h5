<template>
  <div class="box-verify">
    <WebHeadTop/>
    <template v-if="show">
      <p class="remind-msg">{{$t('lang.payment_sms_label_verify')}}</p>
      <p class="verify-mobile">+{{mobileCode}} {{mobile}}</p>
      <van-cell-group class="cell-group" :style="codeVa ? styleBor : ''">
        <van-field maxlength="6" @focus="codeVa = false" v-model="code" :placeholder="$t('lang.payment_login_text_enter_sms_code')"/>
      </van-cell-group>
      <p class="send-msg" v-show="verifyCodeTime !=0">{{verifyCodeTime}}s {{$t('lang.payment_sms_button_resend')}}</p>
      <p class="send-msg" v-show="verifyCodeTime ===0" @click="sendVerifyCode">{{$t('lang.payment_sms_label_resend')}}{{$t('lang.payment_sms_button_resend')}}</p>
      <van-row type="flex">
        <van-col span="24">
          <van-button type="primary" size="large" @click="next">{{$t('lang.payment_otc_label_confirm')}}</van-button>
        </van-col>
      </van-row>
      <a class="opacity-btn" href="javascript:;" @click="changeAccount">{{$t('lang.payment_sms_button_switch_account')}}</a>
    </template>
    <div v-else>
      <h3>登陆Mobi</h3>
      <div class="verify-container">
        <van-cell-group>
          <van-row class="form-item container-box" :style="mobileVa ? styleBor : ''">
            <van-col span="8">
              <van-row type="flex" justify="center">
                <van-col span="10" style="padding-left:7px">
                  <img :src="defaultImg" alt="" class="default-img">
                </van-col>
                <van-col span="14">
                  <div class="mobile-header" @click="countrymet">+{{mobileCodeNew}} <van-icon name="arrow" class="more-mobile-header" :style="styleCon ? styleObject : ''"/></div>
                </van-col>
              </van-row>
            </van-col>
            <van-col span="16">
              <van-field
                v-model="mobileVal"
                @focus="mobileVa = false"
                :placeholder="$t('lang.payment_login_text_enter_phone')"
              />
            </van-col>
            <div class="list-container wrapper" v-show="styleCon">
              <div class="content">
                <div v-for="(item, index) in countriesV" :key='index' @click="chooseMobileCode(item)">
                  <van-row class="form-item">
                    <van-col span="4">
                      <img :src="item.image_url" class="cuntry-img">
                    </van-col>
                    <van-col span="16">
                      <p class="cuntry-name">{{$i18n.locale === 'cn' ? item.name :item.name_en}}</p>
                    </van-col>
                    <van-col span="4">
                      <p class="cuntry-code">+{{item.mobile_code}}</p>
                    </van-col>
                  </van-row>
                </div>
              </div>
            </div>
          </van-row>
          <van-row class="form-item" :style="smsVa ? styleBor : ''">
            <van-col span="18">
              <van-field
                v-model="sms"
                maxlength="6"
                @focus="smsVa = false"
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
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator';
  import { VueUse } from '@/utils/index';
  import comButton from '@/components/common/button.vue';
  import { sendVerifyCode, verifyCode } from '@/api/verify';
  import { queryCountry } from '@/api/gobal';
  import { State } from 'vuex-class';
  import WebHeadTop from '@/components/header/webHead.vue';
  import Message from 'vue-m-message';
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
      WebHeadTop,
    },
  })
  export default class Verify extends Vue {
    @State('verifyCodeTime') public verifyCodeTime!: any;
    @State('mobileCode') public mobileCode!: string;
    // @State('mobileCodeNew') public mobileCodeNew!: string;
    @State('countries') public countries!: any[];
    public code: string = '';
    public showKeyboard: boolean = true;
    public show: boolean = true;
    public mobile: string = '';
    public mobileVal: string = '';
    public isToast: boolean = false;
    public toastTitle: string = '';
    public codeVa: boolean = false;
    public mobileVa: boolean = false;
    public smsVa: boolean = false;
    public styleBor: object = {border: '1px solid #FF0000'};
    public mobileCountryCode: string = '';
    public appId: string = '';
    public sms: string = '';
    public limitTime: number = 0;
    public countryList: any[] = [];
    public iso2: string = '';
    public styleCon: boolean = false;
    public styleObject: object = {transform: 'rotate(-90deg)'};
    public sending: boolean = false;
    public defaultImg: string = require('@/assets/nationalFlagchina.png');
    public countriesV: any[] = [];
    public mobileCodeNew: number = 86;
    public countryCode: string = 'CN';
    @Watch('verifyCodeTime')
    private onChildChanged(val: string, oldVal: string) {
      if (Number(val) === 0) {
        this.sending = false;
      }
    }
    private countrymet() {
      if (this.styleCon) {
        this.styleCon = false;
      } else {
        this.styleCon = true;
      }
    }
    private chooseMobileCode(item: any) {
      this.defaultImg = item.image_url;
      this.mobileCodeNew = item.mobile_code;
      this.countryCode = item.iso2;
      this.styleCon = false;
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
      queryCountry().then((res) => {
        const resInfo: any = res;
        this.countriesV = resInfo.countries;
      });
    }
    private changeAccount() {
      this.show = !this.show;
      this.sending = false;
    }
    private sendVerifyCode(flg: boolean) {
      if (!flg) {
        if (!this.mobileVal.trim() || isNaN(Number(this.mobileVal))) {
          const toastInfo: any = this.$i18n.messages[this.$i18n.locale].lang;
          Message.error({message: toastInfo.payment_login_text_enter_phone, zIndex: 10000, showClose: false});
          return false;
        }
      }
      this.sending = true;
      let sendVerifyParams;
      if (this.show) {
        sendVerifyParams = {
          mobile: this.mobile,
          mobile_country_code: this.countryCode.toUpperCase(),
        };
      } else {
        sendVerifyParams = {
          mobile: this.mobileVal,
          mobile_country_code: this.countryCode.toUpperCase(),
        };
      }
      this.$store.commit('reduceVerifyCodeTime');
      sendVerifyCode(sendVerifyParams).then((response) => {
        const responseInfo: any = response;
        const lang: any = this.$i18n.messages[this.$i18n.locale].lang;
        if (responseInfo.ret === 'ok') {
          Toast(lang.payment_sms_tip_resend_successful);
        }
      }, (error: any) => {
        this.sending = false;
      });
    }
    private validateForm() {
      const langInfo: any = this.$i18n.messages[this.$i18n.locale].lang;
      if (this.show) {
        if (!this.code.trim()) {
          Message.error({message: langInfo.payment_login_text_enter_sms_code, zIndex: 10000, showClose: false});
          return false;
        }
      } else {
        if (!this.mobileVal.trim() || isNaN(Number(this.mobileVal))) {
           Message.error({message: langInfo.payment_login_text_enter_phone, zIndex: 10000, showClose: false});
          return false;
        }
        if (!this.sms.trim()) {
           Message.error({message: langInfo.payment_login_text_enter_sms_code, zIndex: 10000, showClose: false});
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
          mobile_country_code: this.countryCode.toUpperCase(),
          verify_code: this.sms,
        };
      }
      verifyCode(verifyParams).then((response) => {
        const res: any = response;
        if (res.ret === 'ok') {
          this.$router.push({
            path: `/web/login?mobile=${verifyParams.mobile}&mobile_country_code=${verifyParams.mobile_country_code}`,
          });
        }
      }).catch((error: any) => {
        // Message.error({message: error, zIndex: 10000, showClose: false});
      });
    }
  }
</script>

<style lang="less">
.web{
  .box-verify{
    width: 500px;
    height: 370px;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    background: #FFF;
    padding: 40px;
  }
  .cell-group {
      background-color: #fff;
      border: 1px solid #eee;
  }
  .van-button--primary{
    background-color: #15C37E;
    border: 1px solid #15C37E;
  }
  .van-field__control{
   letter-spacing: 3px
  }
  .default-img{
    width: 36px;
    height: 22px;
    margin-top: 11px;
  }
  .container-box{
    position: relative;
  }
  .remind-msg {
    padding: 0 0 10px 0;
    color: #000;
    font-size: 16px;
  }
  .verify-mobile {
    color: #000;
    font-size: 16px;
    margin-bottom: 30px;
  }
  .send-msg {
    text-align: right;
    font-size: 16px;
    color: #000;
    padding: 20px 0;
  }
  .opacity-btn {
    // background-color: #214EA2;
    border-radius: 0px;
    font-size: 14px;
    color: #214EA2;
    margin-top: 20px;
    display: inline-block;
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
        border-right: 1px solid #ddd;
        font-size: 14px;
        height: 44px;
        line-height: 44px;
      }
      .more-mobile-header {
        transition: all .3s;
        transform:rotate(90deg);
        font-size: 12px;
      }
    }
  }
  .verify-note {
    font-size: 12px;
    padding-top: 30px;
    text-align: center;
    color: #000;
  }
  .get-msm {
    background-color: transparent;
    border: 0;
    color: #214ea2;
    font-size: 14px;
    height: 44px;
    padding: 8px;
  }
  .list-container {
    background: #fff;
    height: 160px;
    position: absolute;
    top: 47px;
    left:0;
    z-index: 999;
    margin-top: 2px;
    width: 260px;
    overflow: auto;
    padding: 0 10px;
    box-shadow: 0px 0px 7px #ddd;
    .form-item {
      height: 50px;
      padding: 15px 0;
      border: none;
      margin: 0;
      .cuntry-img {
        width: 30px;
        height: 20px;
      }
      .cuntry-name {
        text-align: left;
      }
      .cuntry-code {
        text-align: right;
        padding-right: 10px;
      }
    }
  }
}

</style>
