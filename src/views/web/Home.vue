<template>
  <div class="home">
    <div class="content">
      <WebHeadTop/>
      <div class="homeTop">
        <div class="title">{{$t('lang.payment_transfer_label_available_balance')}}</div>
        <div class="amount">{{mobiBalance | formatAmount}} <span class="currencyCode">USDT</span></div>
      </div>
      <div class="homeBottom">
        <div class="bottomWraper">
          <div class="top">
            <div class="amountGreen">{{transferAmount | formatAmount}}<span class="currencyCode"> USDT</span></div>
            <span class="amountTitle">{{$t('lang.payment_transfer_label_amount')}}</span>
          </div>
          <div class="bottom">
            <ul>
              <li>
                <span>{{$t('lang.payment_transfer_label_currency')}}</span>
                <span>USDT</span>
              </li>
              <li>
                <span>{{$t('lang.payment_transfer_label_receiver')}}</span>
                <span>{{getPlatformName}}</span>
              </li>
            </ul>
            <comButton type="primary" size="large" @click="submitTransfer" >{{$t('lang.payment_transfer_button_confirm')}}</comButton>
          </div>
        </div>
      </div>
      <van-popup v-model="showPopup" class="noBalancePopup">
        <div class="popupTitle">{{$t('lang.payment_tx_popup_label_insufficient_balance')}}</div>
        <div class="popupContent">{{$t('lang.payment_tx_popup_text_insufficient_balance', { 0: $options.filters.formatAmount(buyAmount), 1: 'USDT'})}}</div>
        <div class="buttonWraper">
          <comButton @click="showPopup = false">{{$t('lang.payment_tx_popup_button_cancel')}}</comButton>
          <comButton type="primary" @click="createTransfer">{{$t('lang.payment_tx_popup_button_create')}}</comButton>
        </div>
      </van-popup>
      <template>
        <PasswordPopup
        :show="showPasswordPopup"
        @close="showPasswordPopup = false"
        @confirmCallback="confirmCallback"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import WebHeadTop from '@/components/header/webHead.vue';
import comButton from '@/components/common/button.vue';
import PasswordPopup from '@/components/web/passwordPopup.vue';
import { getStore } from '@/utils/sessionStorage';
import { fetchWallet, fetchOrderCount, createOrder, transferConfirm } from '@/api/transfer';
import { BigNumber } from 'bignumber.js';
import { Popup } from 'vant';
Vue.use(Popup);

@Component({
  components: {
    WebHeadTop,
    comButton,
    PasswordPopup,
  },
})
export default class Home extends Vue {
  private showPopup: boolean = false;
  private transferAmount: string = '';
  private mobiBalance: string = '';
  private historyOrder!: any[];
  private showPasswordPopup: boolean = false;
  private buyAmount: any = '';
  private async created() {
    this.transferAmount = this.$store.state.transferInfo.amount || getStore('transferInfo').amount;
    const resWallet = await fetchWallet();
    this.mobiBalance = new BigNumber(resWallet.data.balance).dividedBy(10 ** 8).toString();
    const resOrderCount = await fetchOrderCount();
    this.historyOrder = resOrderCount.data.orders;
  }
  get getPlatformName() {
    return this.$store.state.transferInfo.platform_name || getStore('transferInfo').platform_name;
  }
  private submitTransfer() {
    this.buyAmount = new BigNumber(this.transferAmount).minus(this.mobiBalance);
    if (this.buyAmount.toNumber() > 0 ) {
      this.showPopup = true;
    } else {
      // 钱够
      this.showPasswordPopup = true;
    }
  }

  private async createTransfer() {
    if (this.historyOrder.length !== 0) {
      // 有订单要跳未完成订单页
      const orderID = this.historyOrder[0].order.id;
      this.$router.push(`/web/successOrUnfinishOrder/0?orderID=${orderID}`);
    } else {
      // 资金不够创建订单
      const resCreateOrder = await createOrder({
        tx_id: getStore('txid'),
        amount: this.buyAmount.multipliedBy(10 ** 8).toString(),
      });
      this.$router.push(`/web/orderStatus/${resCreateOrder.data.order.id}`);
    }
  }
  private async confirmCallback(value: any, type: any, resetInput: any) {
    const reqData: any = {
      tx_id: getStore('txid'),
    };
    if (type === 1) {
      reqData.pin = value;
    } else {
      reqData.vcode = value;
    }

    try {
      const resTransferConfirm: any = await transferConfirm(reqData);
      if (resTransferConfirm.ret === 'ok') {
        const amount = resTransferConfirm.data.amount / 10 ** 8;
        const SN = resTransferConfirm.data.SN;
        this.$router.push(`/web/successOrUnfinishOrder/1?transferAmount=${amount}&SN=${SN}`);
      }
    } catch (error) {
      resetInput(true, error);
    }
  }
}
</script>
<style lang="scss">
  @import '@/style/mixin.scss';
  .web{
    .home {
      height: 100%;
      display: flex;
      padding-top: 80px;
      justify-content: center;
      .homeTop {
        text-align: left;
        width: 500px;
        margin: 0 auto;
        .title {
          @include sc(16px, rgba(255, 255, 255, .6));
        }
        .amount {
          @include sc(28px, #fff);
          margin-top: 20px;
          margin-bottom: 20px;
          background-color: rgba(0, 0, 0, 0.2);
          padding: 5px 10px;
          border-radius: 2px;
          line-height: 40px;
          .currencyCode {
            @include sc(18px, #fff);
            float: right;
            line-height: 40px;
          }
        }
      }
      .homeBottom {
        .bottomWraper {
          background: #FFFFFF;
          box-shadow: 0 0 6px 0 rgba(0,0,0,0.15);
          border-radius: 2px;
          width: 500px;
          margin: 0 auto;
          position: relative;
          top: 0;
          max-width: 100%;
          .top {
            padding: 10px 0;
            border-bottom: 1px solid #f0f0f0;
            .amountGreen {
              margin-bottom: 6px;
              @include sc(28px, #15C37E);
              .currencyCode {
                @include sc(16px, #333);
              }
            }
            .amountTitle {
              @include sc(14px, #999);
            }
          }
          .bottom {
            padding: 20px 15px;
            ul {
              margin-bottom: 30px;
              li {
                margin-bottom: 15px;
                display: flex;
                justify-content: space-between;
                span:first-child {
                  color: #999;
                }
              }
            }
          }
        }
      }
      .content{
        margin: auto;
      }
      .noBalancePopup {
        border-radius: 2px;
        padding: 14px;
        width: 450px;
        .popupTitle {
          @include sc(16px, #333333);
          font-weight: bold;
          margin-top: 19px;
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
          justify-content: space-around;
          button {
            width: 150px;
          }
        }
      }
    }
  }
</style>
