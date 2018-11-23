<template>
  <div class="orderStatus" v-if="loaded">
    <div class="content">
      <WebHeadTop />
      <div class="contentWraper">
        <div class="top" :class="{borderBottom: orderDetail.status !== 1 && orderDetail.status !== 4 }">
          <template v-if="orderDetail.status === 1" >
            <div class="successTip">
              <img src="@/assets/transferSuccess.png" alt="">
              {{$t('lang.payment_otc_text_order_placed')}}
            </div>
          </template>
          <div class="statusIcon">
            <img :src="statusIcon" alt="">
          </div>
          <div class="title">{{$t(statusTitle)}}</div>
          <p class="content">
            <template v-if="orderDetail.status === 1" >
              <div class="lastTime">{{$t('lang.payment_otc_label_pending_payment_time')}}{{remainString}}</div>
              <div class="amount">{{$t('lang.payment_otc_label_pending_payment_amount')}} {{orderDetail.fiat_amount}} CNY</div>
            </template>
            <template v-else >
              <div class="commonContent">{{$t(statusContent)}}</div>
            </template>
          </p>
        </div>
        <div class="middle">
          <template v-if="orderDetail.status === 1 || orderDetail.status === 4">
            <div class="mobi-tab">
              <div>
                <div class="title">{{$t('lang.payment_otc_label_pending_receiving_info')}}</div>
                <div class="receiveInfo">
                  <ul>
                    <li>
                      <span>{{$t('lang.payment_otc_label_pending_receiving_name')}}</span>
                      <span>
                        {{paymentInfo.receive_name}}
                        <!-- <span class="copyText" @click="copyText(paymentInfo.receive_name, '复制收款人姓名成功')">{{$t('lang.payment_otc_label_copy')}}</span> -->
                      </span>
                    </li>
                    <li>
                      <span>{{$t('lang.payment_otc_label_pending_receiving_bank')}}</span>
                      <span>
                        {{paymentInfo.receive_bank}}
                        <!-- <span class="copyText" @click="copyText(paymentInfo.receive_bank, '复制收款银行成功')" >{{$t('lang.payment_otc_label_copy')}}</span> -->
                      </span>
                    </li>
                    <li>
                      <span>{{$t('lang.payment_otc_label_pending_receiving_bank_number')}}</span>
                      <span>
                        {{paymentInfo.receive_account}}
                        <!-- <span class="copyText" @click="copyText(paymentInfo.receive_account, '复制收款账号成功')" >{{$t('lang.payment_otc_label_copy')}}</span> -->
                      </span>
                    </li>
                    <li>
                      <span>{{$t('lang.payment_otc_label_pending_receiving_ref')}}</span>
                      <span>
                        {{orderDetail.ref_id}}
                        <!-- <span class="copyText" @click="copyText(orderDetail.ref_id, '复制附言成功')">{{$t('lang.payment_otc_label_copy')}}</span> -->
                      </span>
                    </li>
                  </ul>
                </div>
                <div class="paytip">({{$t('lang.payment_otc_text_pending_receiving_ref_description')}})</div>
              </div>
              <div>
                <div class="title">{{$t('lang.payment_otc_label_pending_order_info')}}</div>
                <orderDetail :orderDetail="orderDetail"/>
              </div>
            </div>
          </template>
          <div v-else>
            <div class="title">{{$t('lang.payment_otc_label_pending_order_info')}}</div>
            <orderDetail :orderDetail="orderDetail"/>
          </div>
        </div>
        <template v-if="orderDetail.status === 1 || orderDetail.status === 4">
          <div class="bottom">
            <comButton size="large" @click="cancelOrder">{{$t('lang.payment_otc_button_pending_cancel')}}</comButton>
            <template v-if="orderDetail.status === 1">
              <comButton size="large" type="primary" @click="showPasswordPopup = true">{{$t('lang.payment_otc_button_pending_pay')}}</comButton>
            </template>
            <template v-else >
              <a @click="showEmailPopup = true">
                <comButton size="large">{{$t('lang.payment_otc_button_paid_contact_cs')}}</comButton>
              </a>
              <van-popup v-model="showEmailPopup" class="emailPopup">
                <div class="popupTitle">请发邮件联系我们</div>
                <div class="close" @click="showEmailPopup = false"></div>
                <div class="popupContent">support@mobi.me</div>
                <div class="buttonWraper">
                  <comButton type="primary" @click="copyText('support@mobi.me', '复制成功')">复制邮箱</comButton>
                </div>
              </van-popup>
            </template>
          </div>
        </template>
      </div>
      <PasswordPopup
        :show="showPasswordPopup"
        @close="showPasswordPopup = false"
        @confirmCallback="confirmCallback"
        :orderID="orderDetail.id"
      />
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator';
  import WebHeadTop from '@/components/header/webHead.vue';
  import comButton from '@/components/common/button.vue';
  import orderDetail from '@/components/orderDetail.vue';
  import PasswordPopup from '@/components/web/passwordPopup.vue';
  import cancelIcon from '@/assets/cancelIcon.png';
  import timeoutIcon from '@/assets/timeoutIcon.png';
  import paidIcon from '@/assets/paidIcon.png';
  import successIcon from '@/assets/transferSuccess.png';
  import { fetchOrderDetail, cancelOrPayOrder } from '@/api/transfer';
  import { Tab, Tabs, Toast, Dialog } from 'vant';
  import VueClipboard from 'vue-clipboard2';
  VueClipboard.config.autoSetContainer = true;

  Vue.use(VueClipboard);
  Vue.use(Tab);
  Vue.use(Tabs);
  Vue.use(Dialog);
  const iconConfig: any = {
    1: '',
    2: cancelIcon,
    3: timeoutIcon,
    4: paidIcon,
    5: successIcon,
  };

  const titleConfig: any = {
    1: 'lang.payment_otc_label_pending',
    2: 'lang.payment_otc_label_cancelled',
    3: 'lang.payment_otc_label_overtime',
    4: 'lang.payment_otc_label_paid',
    5: 'lang.payment_otc_label_complete',
  };

  const contentConfig: any = {
    2: 'lang.payment_otc_label_cancelled_description',
    3: 'lang.payment_otc_label_overtime_description',
    4: 'lang.payment_otc_text_paid_description',
    5: 'lang.payment_otc_label_complete_description',
  };

  @Component({
    components: {
      WebHeadTop,
      comButton,
      orderDetail,
      PasswordPopup,
    },
  })
  export default class OrderStatus extends Vue {
    private active: number = 0;
    private loaded: boolean = false;
    private showPasswordPopup: boolean = false;
    private showEmailPopup: boolean = false;
    private remainTime: number = 0;
    private countdownid: any = 0;
    private fetchDataid: any = 0;
    private orderDetail: any = {
      id: 0,
      status: 1,
      ref_id: 0,
    };
    private paymentInfo: any = {
      receive_name: '',
      receive_bank: '',
      receive_account: '',
    };
    @Watch('remainTime')
    private onChangeRemainTime(val: number, oldVal: number) {
      if (val <= 0) {
        if (this.orderDetail.status === 1) {
          window.clearInterval(this.countdownid);
          this.orderDetail.status = 3;
        }
      }
    }
    @Watch('orderDetail.status')
    private onChangeStatus(val: number, oldVal: number) {
      if (val === 4) {
        this.fetchDataid = setInterval(() => {
          this.fetchData();
        }, 15 * 1000);
      } else {
        window.clearInterval(this.fetchDataid);
      }
    }
    get statusIcon() {
      return iconConfig[this.orderDetail.status];
    }

    get statusTitle() {
      return titleConfig[this.orderDetail.status];
    }

    get statusContent() {
      return contentConfig[this.orderDetail.status];
    }
    get remainString() {
      const formate = (value: any) => {

        if (value < 10) {
          return `0${value}`;
        }
        return value;
      };
      if (this.remainTime <= 0) {
        return '00:00';
      }
      const mins = Math.floor(this.remainTime / 60);
      const seconds = this.remainTime % 60;
      return `${formate(mins)}:${formate(seconds)}`;
    }
    private async created() {
      // 1(待付款)
      // 2(取消)
      // 3(过期
      // 4(已支付法币，待放币)
      // 5(完成)
      // 6(申诉中)
      this.fetchData();
    }
    private async fetchData() {
      const resOrderDetail: any = await fetchOrderDetail(this.$route.params.orderID);
      this.orderDetail = resOrderDetail.data.order;
      this.paymentInfo = JSON.parse(resOrderDetail.data.advertisement_history.payment_info);
      this.remainTime = Math.floor(resOrderDetail.data.order.payment_expired_at - (new Date().valueOf() / 1000));
      if (this.orderDetail.status === 1) {
        if (!this.countdownid) {
          const countdown = setInterval(() => {
            this.remainTime --;
          }, 1000);
          this.countdownid = countdown;
        }
      }
      this.loaded = true;
    }
    private async cancelOrder() {
      const resCancelOrder: any = await cancelOrPayOrder({
        order_id: this.orderDetail.id,
        op: 'cancel',
      });
      if (resCancelOrder.ret === 'ok') {
        this.orderDetail = resCancelOrder.data.order;
      }
    }
    private async confirmCallback(value: any, type: any, resetInput: any) {
      const reqData: any = {
        order_id: this.orderDetail.id,
        op: 'pay',
      };
      if (type === 1) {
        reqData.pin = value;
      } else {
        reqData.vcode = value;
      }
      try {
        const resCancleOrPayOrder: any = await cancelOrPayOrder(reqData);
        this.orderDetail = resCancleOrPayOrder.data.order;
        this.showPasswordPopup = false;
      } catch (error) {
        resetInput(true, error);
      }
    }
    private copyText(value: string, toastText: string) {
      const self: any = this;
      self.$copyText(value)
        .then((e: any) => {
          Toast(toastText);
        });
    }
    // private showEmailAlert() {
    //   Dialog.alert({
    //     title: '请发邮件联系我们',
    //     message: '<div class="alertContent" >support@mobi.me</div>',
    //     confirmButtonText: '复制',
    //     closeOnClickOverlay: true,
    //   }).then(() => {
    //     this.copyText('support@mobi.me', '复制成功');
    //   });
    // }
  }
</script>

<style lang="scss">
  @import '@/style/mixin.scss';
  .web{
    .emailPopup {
      border-radius: 2px;
      padding: 40px 15px;
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
      .popupTitle {
        @include sc(16px, #333);
        font-weight: normal;
        margin-top: 19px;
      }
      .popupContent {
        @include sc(22px, #333);
        margin-left: auto;
        margin-right: auto;
        margin-top: 20px;
        margin-bottom: 24px;
      }
      .buttonWraper {
        display: flex;
        justify-content: center;
        button {
          width: 150px;
        }
      }
    }
    .orderStatus {
      height: 100%;
      display: flex;
      justify-content: center;
      padding-top: 80px;
      .content{
        margin: auto;
      }
      .contentWraper {
        background-color: #fff;
        min-width: 800px;
        .top {
          position: relative;
          padding: 35px 0;
          background-color: #fff;
          text-align: center;
          margin-bottom: 20px;
          &.borderBottom{
            border-bottom: 1px solid #f2f2f2;
          }
          .successTip {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 50px;
            @include sc(14px, #333);
            background-color: rgba(21,195,126,0.10);
            display: flex;
            justify-content: center;
            align-items: center;
            img {
              width: 26px;
              margin-right: 10px;
            }
          }
          .statusIcon {
            width: 44px;
            height: 44px;
            margin: 0 auto;
            img {
              width: 100%;
            }
          }
          .title {
            @include sc(20px, #333);
            font-weight: bold;
            margin-top: 15px;
            margin-bottom: 10px;
          }
          .content {
            @include sc(12px, #333);
            .lastTime {
              @include sc(14px, #999999);
            }
            .amount {
              @extend .lastTime;
              margin-top: 5px;
            }
            .commonContent {
              margin: 0 auto;
            }
          }
        }
        .middle {
          background-color: #fff;
          // padding: 20px 40px;
          .title{
            text-align: left;
            padding-left: 15px;
            margin-left: 40px;
            border-left: 4px solid #15C37E;
          }
          .mobi-tab {
            padding: 20px 0;
            display: flex;
            background-color: #F4F4F4;
            &>div{
              width: 50%;
            }
          }
          .paytip {
            padding: 15px 0;
            border-top: 1px solid #F3F3F3;
            text-align: center;
            @include sc(12px, #333);
          }
          .receiveInfo {
            padding: 15px 40px;
            @include liList();
            .copyText {
              color: #15C37E;
            }
          }
        }
        .bottom {
          width: 100%;
          padding: 40px 15px;
          background-color: #fff;
          display: flex;
          justify-content: center;
          bottom: 0;
          left: 0;
          button {
            margin: 0 10px;
            width: 165px;
          }
        }
      }
    }
  }
</style>
