<template>
  <div class="txDetailWraper" v-if="loaded">
    <WebHeadTop />
    <div class="txDetailContent">
      <div class="topWraper">
        <div class="sendWraper">
          <img src="@/assets/tx-mobi.png" alt="">
          Mobi: {{txDetailData.payer_mobile}}
        </div>
        <div class="arrowWraper"><img src="@/assets/icon_arrow.png" alt=""></div>
        <div class="receiveWraper">
          <img src="@/assets/paibi.png" alt="">
          {{getPlatformName}}
        </div>
      </div>
      <div class="amountWraper">
        <div class="title">{{$t('lang.payment_tx_label_amount')}}</div>
        <div class="amount">+ {{txDetailData.amount / Math.pow(10, 8) | formatAmount}} {{txDetailData.currency_code.toUpperCase()}}</div>
        <div class="status">{{$t('lang.payment_tx_label_status_complete')}}</div>
      </div>
      <div class="bottomWraper">
        <ul>
          <li>
            <span>{{$t('lang.payment_tx_label_create_time')}}</span>
            <span>{{txDetailData.created_at | formatTime}}</span>
          </li>
          <li>
            <span>{{$t('lang.payment_tx_label_tx_id')}}</span>
            <span>{{txDetailData.SN}}</span>
          </li>
          <li>
            <span>{{$t('lang.payment_tx_label_balance_after_tx')}}</span>
            <span>{{txDetailData.balance / Math.pow(10, 8) | formatAmount}} {{txDetailData.currency_code.toUpperCase()}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import WebHeadTop from '@/components/header/webHead.vue';
  import { fetchTransaction } from '@/api/transfer';
  import { getStore } from '@/utils/sessionStorage';

  @Component({
    components: {
      WebHeadTop,
    },
  })
  export default class TxDetail extends Vue {
    private loaded: boolean = false;
    private txDetailData: any = {
      payer_mobile: 0,
      amount: '',
      created_at: '',
      currency_code: '',
    };
    get getPlatformName() {
      return this.$store.state.transferInfo.platform_name || getStore('transferInfo').platform_name;
    }
    private async created() {
      const resTransactionDetail = await fetchTransaction(this.$route.params.sn);
      this.txDetailData = resTransactionDetail.data;
      this.loaded = true;
    }
  }
</script>

<style lang="scss">
  @import '@/style/mixin.scss';
  .web{
    .txDetailWraper {
      height: 100%;
      display: flex;
      justify-content: center;
      .txDetailContent {
        margin: auto;
        padding-top: 45px;
        width: 800px;
        .topWraper {
          padding: 20px;
          border-bottom: 1px solid #F3F3F3;
          background-color: #fff;
          text-align: left;
          .sendWraper {
            img {
              width: 40px;
              margin-right: 16px;
            }
            display: flex;
            align-items: center;
          }
          .arrowWraper {
            width: 40px;
            text-align: center;
            margin-top: 5px;
            margin-bottom: 5px;
            img {
              width: 8px;
            }
          }
          .receiveWraper {
            @extend .sendWraper
          }
        }
        .amountWraper {
          background-color: #fff;
          padding: 20px;
          text-align: left;
          .title {
            @include sc(14px, #999);
          }
          .amount {
            @include sc(20px, #333);
            font-weight: bold;
            margin-top: 10px;
            margin-bottom: 10px;
          }
          .status {
            @include sc(14px, #15C37E);
          }
        }
        .bottomWraper {
          border-top: 1px solid #F3F3F3;
          background-color: #fff;
          padding: 20px;
          @include liList();
        }
      }
    }
  }

</style>
