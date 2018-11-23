<template>
  <header id='head_top'>
    <section class="head_goback" v-if="goBack" @click="leave">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" version="1.1">
          <polyline points="12,18 4,9 12,0" style="fill:none;stroke:rgb(255,255,255);stroke-width:2"/>
        </svg>
    </section>
    <section class="title_head ellipsis" v-if="headTitle">
        <span class="title_text">{{headTitle}}</span>
    </section>
    <div class="exitButton" @click="clickLeave">返回{{getPlatformName}}</div>
  </header>

</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator';
  import localstorge from 'store';
  @Component
  export default class HeadTop extends Vue {
    @Prop(Boolean) public goBack!: boolean;
    @Prop(String) public headTitle!: string;
    @Prop(String) public goBackUrl!: string;
    get getPlatformName() {
      return this.$store.state.transferInfo.platform_name || localstorge.get('params').platform_name;
    }
    public clickLeave() {
      const params = localstorge.get('params') || {};
      const backurl = params.back_url || null;
      if (this.$store.state.transferInfo.back_url || backurl) {
        window.location.href = this.$store.state.transferInfo.back_url || backurl;
      }
    }
    private leave() {
      if (this.goBackUrl) {
        this.$router.replace(this.goBackUrl);
      } else {
        this.$router.go(-1);
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  @import '@/style/mixin.scss';
  #head_top {
    background-color: transparent;
    position: fixed;
    z-index: 100;
    left: 0;
    top: 0;
    @include wh(100%, 44px);
  }
  .head_goback {
    @include wh(0.6rem, 1rem);
    line-height: 44px;
    margin-left: 15px;
  }
  .title_head {
    @include center;
    width: 50%;
    color: #fff;
    text-align: center;
    .title_text{
        @include sc(16px, #fff);
        text-align: center;
        font-weight: bold;
    }
  }
  .exitButton {
    @include ct;
    height: 23px;
    line-height: 20px;
    padding: 0 5px;
    border: 1px solid #fff;
    @include sc(12px, #fff);
    right: 15px;
  }
</style>
