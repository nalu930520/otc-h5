<template>
  <div class="home">
    <head-top :headTitle="$t('lang.payment_transfer_title_mobi')" />
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
    <template v-if="showPasswordKey">
      <passwordKey
        :show="showPasswordKey"
        @close="showPasswordKey = false"
        @confirmCallback="confirmCallback"
        @sendVcode="sendVcode"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import headTop from '@/components/header/head.vue';
import comButton from '@/components/common/button.vue';
import passwordKey from '@/components/passwordKey.vue';
import { fetchWallet, fetchOrderCount, createOrder, transferConfirm } from '@/api/transfer';
import { BigNumber } from 'bignumber.js';
import { Popup } from 'vant';
import localstorge from 'store';
Vue.use(Popup);

@Component({
  components: {
    headTop,
    comButton,
    passwordKey,
  },
})
export default class Home extends Vue {
  private showPopup: boolean = false;
  private transferAmount: string = '';
  private mobiBalance: string = '';
  private historyOrder!: any[];
  private showPasswordKey: boolean = false;
  private buyAmount: any = '';
  private async created() {
    this.transferAmount = this.$store.state.transferInfo.amount;
    const resWallet = await fetchWallet();
    this.mobiBalance = new BigNumber(resWallet.data.balance).dividedBy(10 ** 8).toString();
    const resOrderCount = await fetchOrderCount();
    this.historyOrder = resOrderCount.data.orders;
  }
  get getPlatformName() {
    return this.$store.state.transferInfo.platform_name || localstorge.get('params').platform_name;
  }
  private submitTransfer() {
    this.buyAmount = new BigNumber(this.transferAmount).minus(this.mobiBalance);
    if (this.buyAmount.toNumber() > 0 ) {
      this.showPopup = true;
    } else {
      // 钱够
      this.showPasswordKey = true;
    }
  }

  private async createTransfer() {
    if (this.historyOrder.length !== 0) {
      // 有订单要跳未完成订单页
      const orderID = this.historyOrder[0].order.id;
      this.$router.push(`/successOrUnfinishOrder/0?orderID=${orderID}`);
    } else {
      // 资金不够创建订单
      const resCreateOrder = await createOrder({
        tx_id: this.$store.state.txid,
        amount: this.buyAmount.multipliedBy(10 ** 8).toString(),
      });
      this.$router.push(`/orderStatus/${resCreateOrder.data.order.id}`);
    }
  }
  private async confirmCallback(value: any, type: any, resetInput: any) {
    const reqData: any = {
      tx_id: this.$store.state.txid,
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
        this.$router.push(`/successOrUnfinishOrder/1?transferAmount=${amount}&SN=${SN}`);
      }
    } catch (error) {
      resetInput(true);
    }
  }
}
</script>
<style lang="scss">
  @import '@/style/mixin.scss';
  .home {
    padding-top: 44px;
    .noBalancePopup {
      border-radius: 2px;
      padding: 14px;
      width: 344px;
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
        justify-content: space-between;
        button {
          width: 150px;
        }
      }
    }
  }
  .homeTop {
    height: 146px;
    padding-left: 15px;
    padding-top: 30px;
    text-align: left;
    .title {
      @include sc(12px, rgba(255, 255, 255, .6));
    }
    .amount {
      @include sc(28px, #fff);
      margin-top: 6px;
      .currencyCode {
        @include sc(14px, #fff);
      }
    }
  }
  .homeBottom {
    background-color: #fff;
    height: calc(100vh - 44px - 146px);
    .bottomWraper {
      background: #FFFFFF;
      box-shadow: 0 0 6px 0 rgba(0,0,0,0.15);
      border-radius: 2px;
      width: 345px;
      margin: 0 auto;
      position: relative;
      top: -24px;
      .top {
        padding: 30px 0;
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
</style>

