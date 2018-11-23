<template>
  <div class="popupWraper">
    <van-popup
      v-model="show"
      position="bottom"
      :overlay="true"
      :lock-scroll="true"
      :close-on-click-overlay="false"
    >
      <div class="popupContent">
        <div class="header">
          <div class="close" @click="$emit('close')">
            <svg width="17px" height="17px" viewBox="0 0 17 17" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <!-- Generator: Sketch 50.2 (55047) - http://www.bohemiancoding.com/sketch -->
                <title>Group 4</title>
                <desc>Created with Sketch.</desc>
                <defs></defs>
                <g id="视觉" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="OTC订单详情-支付并划转-输入密码" transform="translate(-14.000000, -239.000000)" stroke="#666666" stroke-width="2">
                        <g id="Group-7" transform="translate(0.000000, 217.000000)">
                            <g id="Group-4" transform="translate(15.000000, 23.000000)">
                                <path d="M0.47263527,0.324161649 L14.6902987,14.9956371" id="Path-8"></path>
                                <path d="M0.47263527,0.324161649 L14.6902987,14.9956371" id="Path-8" transform="translate(7.581467, 7.659899) scale(-1, 1) translate(-7.581467, -7.659899) "></path>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
          </div>
          <div class="title">{{sendType === 1 ? '输入密码' : '输入短信验证码'}}</div>
        </div>
        <div class="content">
          <!-- 密码输入框 -->
          <template v-if="!alreadySetPin">
            <div class="warning">
              您的账户目前暂未设置密码，为了您的资产安全，请尽快设置。请使用手机浏览器访问www.mobi.me下载Mobi钱包
            </div>
          </template>
          <div class="passwordWraper">
            <van-password-input
              :value="inputValue"
              @focus="showKeyboard = true"
            />
            <div class="forgetPassword" v-if="sendType === 1" @click="forgetPassword">忘记密码？</div>
            <div class="passwordInfo" v-if="sendType === 2">
              <div v-if="seconds !== 0">
                {{seconds}}s 后重新发送
              </div>
              <div v-else @click="startCountDown" >
                重新发送
              </div>
            </div>
          </div>

          <!-- 数字键盘 -->
          <van-number-keyboard
            :show="true"
            @input="onInput"
            @delete="onDelete"
            @blur="showKeyboard = false"
          />
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script lang="ts">
  import { Popup, PasswordInput, NumberKeyboard } from 'vant';
  import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
  import { transferConfirm, cancelOrPayOrder, requestSendVcode } from '@/api/transfer';
  import { Toast } from 'vant';
  import { VueUse } from '@/utils';

  VueUse([Popup, PasswordInput, NumberKeyboard]);

  @Component
  export default class PasswordKey extends Vue {
    @Prop(Boolean) private show!: boolean;
    @Prop(String) private orderID!: string;
    private countdownid: any = 0;
    private seconds: number = 59;
    private alreadySetPin: boolean = false;
    // 1: 输密码 2: 验证码
    private sendType: number = 1;
    private inputValue: string = '';

    @Watch('inputValue')
    private onInputValueChange(val: string, oldVal: string) {
      if (val.length === 6) {
        this.transferSubmit(this.sendType, val, this.resetInput);
      }
    }
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
      this.alreadySetPin = this.$store.state.customerInfo.already_set_pin;
      if (this.alreadySetPin) {
        this.sendType = 1;
      } else {
        this.sendType = 2;
      }
    }
    private async transferSubmit(type: any, value: any, resetInput: any) {
      const resConfirmCallback = await this.$emit('confirmCallback', value, type, resetInput);
    }
    private resetInput(isReset: boolean) {
      if (isReset) {
        this.inputValue = '';
      }
    }
    private forgetPassword() {
      this.$router.push({
        path: '/forget',
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
          reqData.tx_id = this.$store.state.txid;
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
  .popupWraper {
    .popupContent {
      padding-bottom: 216px;
      .header {
        height: 60px;
        width: 100%;
        border-bottom: 1px solid #DDDDDD;
        text-align: center;
        position: relative;
        display: flex;
        align-items: center;
        .close {
          width: 17px;
          height: 17px;
          position: absolute;
          top: 50%;
          left: 15px;
          transform: translate(0, -50%);
        }
        .title {
          @include sc(16px, #000);
          margin: 0 auto;
        }
      }
      .content {
        .warning {
          height: 50px;
          @include sc(12px, #FF9D0F);
          background: rgba(255, 165, 35, .15);
          padding: 8px 15px;
          text-align: left;
        }
        .passwordWraper {
          padding-top: 30px;
          .forgetPassword{
            padding-top: 20px;
            padding-bottom: 15px;
            text-align: right;
            margin-right: 4vw;
          }
          .passwordInfo {
            margin-bottom: 20px;
            padding-top: 20px;
          }
        }
      }
    }
  }
</style>