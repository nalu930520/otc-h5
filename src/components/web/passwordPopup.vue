<template>
  <div class="web">
    <div class="popupWraper">
      <van-popup v-model="show" class="passwordPopup" @click-overlay="$emit('close')">
        <div class="popupTitle">{{sendType === 1 ? $t('lang.payment_login_enter_pin') : $t('lang.payment_pin_label_enter_sms_code')}}</div>
        <div class="close" @click="$emit('close')"></div>
        <template v-if="!alreadySetPin">
          <div class="warning">
            您的账户目前暂未设置密码，为了您的资产安全，请尽快设置。请使用手机浏览器访问www.mobi.me下载Mobi钱包
          </div>
        </template>
        <div class="content">
          <div :class="{errorMessage: 'error'}" class="form-item" >
            <van-field
              v-model="inputValue"
              :type="sendType === 1 ? 'password' : 'text'"
              :placeholder="sendType === 1 ? $t('lang.payment_login_enter_pin') : $t('lang.payment_pin_label_enter_sms_code')"
              maxlength="6"
            />
          </div>
          <div class="forgetPassword" v-if="sendType === 1" @click="forgetPassword">忘记密码？</div>
          <div class="passwordInfo" v-if="sendType === 2">
            <div v-if="seconds !== 0" class="disabled">
              {{seconds}}s 后重新发送
            </div>
            <div v-else @click="startCountDown" >
              重新发送
            </div>
          </div>
          <div class="buttonWraper">
            <comButton type="primary" @click="transferSubmit(sendType, inputValue, resetInput())">{{$t('lang.payment_transfer_button_confirm')}}</comButton>
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script lang="ts">
  import { Popup, PasswordInput, Field, Icon} from 'vant';
  import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
  import { transferConfirm, cancelOrPayOrder, requestSendVcode } from '@/api/transfer';
  import { Toast } from 'vant';
  import { VueUse } from '@/utils';
  import comButton from '@/components/common/button.vue';
  import { getStore } from '@/utils/sessionStorage';

  VueUse([Popup, PasswordInput, Field, Icon]);
  @Component({
    components: {
      comButton,
    },
  })

  export default class PasswordPopup extends Vue {
    @Prop(Boolean) private show!: boolean;
    @Prop(String) private orderID!: string;
    private countdownid: any = 0;
    private seconds: number = 59;
    private alreadySetPin: boolean = false;
    // 1: 输密码 2: 验证码
    private sendType: number = 1;
    private inputValue: string = '';
    private errorMessage: string = '';

    // @Watch('inputValue')
    // private onInputValueChange(val: string, oldVal: string) {
    //   if (val.length === 6) {
    //     this.transferSubmit(this.sendType, val, this.resetInput);
    //   }
    // }
    @Watch('seconds')
    private onSecondsChange(val: number, oldVal: number) {
      if (val === 0) {
        window.clearInterval(this.countdownid);
      }
    }
    @Watch('sendType')
    private onSendTypeChange(val: number, oldVal: number) {
      if (val === 2) {
        this.startCountDown();
      }
    }
    private created() {
      this.alreadySetPin = this.$store.state.customerInfo.already_set_pin || getStore('customerInfo').already_set_pin;
      if (this.alreadySetPin) {
        this.sendType = 1;
      } else {
        this.sendType = 2;
      }
    }
    private async transferSubmit(type: any, value: any, resetInput: any) {
      const resConfirmCallback = await this.$emit('confirmCallback', value, type, resetInput);
    }
    private resetInput(isReset: boolean, error: string) {
      if (isReset) {
        this.inputValue = '';
      }
      if (error) {
        this.errorMessage = error;
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      }
    }
    private forgetPassword() {
      this.$router.push({
        path: '/web/forget',
      });
    }
    private onInput(key: any) {
      this.inputValue = (this.inputValue + key).slice(0, 6);
    }
    private onDelete(key: any) {
      this.inputValue = this.inputValue.slice(0, this.inputValue.length - 1);
    }

    private async sendVcode() {
        const reqData: any = {};
        if (this.orderID) {
          reqData.order_id = this.orderID;
        } else {
          reqData.tx_id = getStore('txid');
        }
        const resRequestSendVcode = await requestSendVcode(reqData);
        return resRequestSendVcode;
    }
    private async startCountDown() {
      const resSendVcode: any = await this.sendVcode();
      if (resSendVcode.ret === 'ok') {
        this.seconds = 59;
        const countdown = setInterval(() => {
          this.seconds --;
        }, 1000);
        this.countdownid = countdown;
      } else {
        Toast(resSendVcode.ret);
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  @import '@/style/mixin.scss';
  .web{
    .passwordPopup {
      border-radius: 2px;
      width: 450px;
      .close{
        position: absolute;
        top: 18px;
        right: 18px;
        height: 20px;
        width: 20px;
        cursor: pointer;
        &::before, &::after {
          content: '';
          position: absolute;
          height: 2px;
          width: 100%;
          top: 50%;
          left: 0;
          margin-top: -1px;
          background: #666;
        }
        &::before {
          transform: rotate(45deg);
        }
        &::after {
          transform: rotate(-45deg);
        }
      }
      .content{
        padding: 20px 50px 50px 50px;
      }
      .warning {
        height: 50px;
        @include sc(12px, #FF9D0F);
        background: rgba(255, 165, 35, .15);
        padding: 8px 15px;
        text-align: left;
      }
      .forgetPassword, .passwordInfo{
        padding-top: 15px;
        padding-bottom: 20px;
        text-align: right;
        color:#214EA2;
        cursor: pointer;
        .disabled{
          color:#999;
        }
      }
      .form-item {
        border: 1px solid rgb(221, 221, 221);
        margin-top: 10px;
        .error{
          border: 1px solid #FF0000;
        }
        .van-field__control{
          letter-spacing: 8px;
          &::placeholder{
            letter-spacing: normal;
          }
        }
      }
      .error-box{
        border: 1px solid #FF0000;
        display: inline-block;
        width: auto;
        margin-top: 10px;
        padding: 5px 10px;
        font-size: 12px;
        color: #FF0000;
        i, span{
          display: inline-block;
          vertical-align: middle;
        }
        i{
          font-size: 12px!important;
          margin-right: 5px;
        }
        span{
          position: relative;
          top: -1px;
        }
      }
      .popupTitle {
        @include sc(16px, #333333);
        font-weight: bold;
        margin-bottom: 15px;
        margin-top: 50px;
      }
      .popupContent {
        @include sc(14px, #999);
        margin-left: auto;
        margin-right: auto;
        margin-top: 10px;
        margin-bottom: 24px;
      }
      .buttonWraper {
        display: flex;
        justify-content: space-between;
        button {
          width: 100%;
        }
      }
    }
  }
</style>
