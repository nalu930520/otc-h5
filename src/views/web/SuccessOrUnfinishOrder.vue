<template>
  <div class="orderStatusWraper">
    <div class="content">
      <WebHeadTop/>
      <div class="orderStatusContent">
        <div class="top">
          <img :src="type === '0' ? unTransferIcon : successIcon" alt="" class="statusIcon">
          <div class="title">
            {{ type === '0' ? $t('lang.payment_tx_pending_label_unfinished_order') : $t('lang.payment_transfer_label_successful') }}
          </div>
          <div class="content" v-if="type === '1'">{{transferAmount | formatAmount}} USDT</div>
          <div class="unfinishContent" v-if="type !== '1'" >{{$t('lang.payment_tx_pending_text_unfinished_order')}}</div>
        </div>
        <div class="bottom">
         <comButton type="primary" size="large" @click="clickFinsh">
           {{ type === '0' ? $t('lang.payment_tx_pending_button_check_order') : $t('lang.payment_transfer_button_complete') }}
         </comButton>
         <p v-if="type === '1'" class="viewDetail" @click="toTxDetail">{{$t('lang.payment_transfer_link_detail')}} ></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import WebHeadTop from '@/components/header/webHead.vue';
  import comButton from '@/components/common/button.vue';
  import successIcon from '@/assets/transferSuccess.png';
  import unTransferIcon from '@/assets/unTransfer.png';
  import { getStore } from '@/utils/sessionStorage';

  @Component({
    components: {
     WebHeadTop,
     comButton,
    },
  })
  export default class UnTransferOr extends Vue {
    private successIcon: string = successIcon;
    private unTransferIcon: string = unTransferIcon;
    private type: string = '1';
    private orderID!: string;
    private transferAmount!: string;
    private SN!: string;
    private created() {
      // 0: unfinish 1: finish>
      const query: any = this.$route.query;
      const type = this.$route.params.type;
      this.type = type;
      if (type === '0') {
        this.orderID = query.orderID;
      }
      if (type === '1') {
        this.transferAmount = query.transferAmount;
        this.SN = query.SN;
      }
    }
    private clickFinsh() {
      if (this.type === '0') {
        this.$router.push(`/web/orderStatus/${this.orderID}`);
      } else {
        window.location.href = this.$store.state.transferInfo.back_url || getStore('transferInfo').back_url;
      }
    }
    private toTxDetail() {
      this.$router.push(`/web/txDetail/${this.SN}`);
    }
  }
</script>
<style lang="scss">
  @import '@/style/mixin.scss';
  .web{
    .orderStatusWraper {
      height: 100%;
      display: flex;
      justify-content: center;
      padding-top: 80px;
      .content{
        margin: auto;
      }
    }
    .orderStatusContent {
      background: #FFFFFF;
      box-shadow: 0 0 4px 0 rgba(0,0,0,0.15);
      border-radius: 2px;
      width: 500px;
      // height: 400px;
      margin: 0 auto;
      padding: 50px 15px 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .top {
        .statusIcon {
          width: 50px;
        }
        .title {
          @include sc(20px, #333333);
          margin-top: 20px;
          font-weight: bold;
        }
        .content {
          margin-top: 10px;
          margin-bottom: 30px;
        }
        .unfinishContent {
          @include sc(16px, #999);
          margin-top: 15px;
          margin-bottom: 40px;
          width: 250px;
          margin-left: auto;
          margin-right: auto;
        }
      }
      .bottom {
        .viewDetail {
          text-align: center;
          @include sc(14px, #000);
          margin-top: 20px;
        }
      }
    }
  }
</style>
