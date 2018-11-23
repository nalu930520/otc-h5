<template>
  <div class="orderDetail">
    <ul>
      <li>
        <span>订单号</span>
        <span>{{orderDetail.id}}</span>
      </li>
      <li>
        <span>创建时间</span>
        <span>{{orderDetail.created_at | formatTime}}</span>
      </li>
      <li>
        <span>交易金额</span>
        <span>{{orderDetail.fiat_amount}} {{orderDetail.fiat_currency_code.toUpperCase()}}</span>
      </li>
      <li>
        <span>交易价格</span>
        <span>{{orderDetail.fiat_price}} CNY / USDT</span>
      </li>
      <li>
        <span>交易数量</span>
        <span>{{orderDetail.crypto_amount / Math.pow(10, 8)  | formatAmount}} {{orderDetail.crypto_currency_code.toUpperCase()}}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator';
  @Component
  export default class OrderDetail extends Vue {
    @Prop(Object) private orderDetail!: object;

  }
</script>

<style rel="stylesheet/scss" lang="scss">
  @import '@/style/mixin.scss';
  .orderDetail {
    padding: 20px 40px;
    @include liList();
  }
  .web{
    .orderDetail {
      padding: 20px 40px;
      @include liList();
    }
  }
</style>
