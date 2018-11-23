<template>
  <div>
    <comHead :goBack="true" :headTitle="$t('lang.payment_download_title_forget_pin')"/>
    <div class="headCon"></div> 
    <div class="container-top wrapper" ref="wrapper">
      <div>
        <img src="@/assets/icon_mobi_logo.png" alt="">
        <p class="msg-s20">{{$t('lang.payment_download_label_forget_pin')}}</p>
        <p class="msg-s12 mb-40">{{$t('lang.payment_download_text_forget_pin')}}</p>
        <p class="msg-s12 mb-10">{{$t('lang.payment_download_text_corporate_app')}}</p>
        <button type="button" class="msg-href mb-180"
          v-clipboard:copy="$t('lang.payment_download_link_website')"
          v-clipboard:success="copyUrl">{{$t('lang.payment_download_link_website')}}
        </button>
        <p class="msg-s14 mb-10">{{$t('lang.payment_download_label_guide')}}</p>
        <van-icon name="arrow" class="more-mobile-header msg-s14"/>
        <div class="teach-list">
          <p>{{$t('lang.payment_download_text_guide_1')}}</p>
          <img  src="@/assets/image_steps_01.png" alt="">
          <p>{{$t('lang.payment_download_text_guide_2')}}</p>
          <img  src="@/assets/image_steps_02.png" alt="">
          <p>{{$t('lang.payment_download_text_guide_3')}}</p>
          <img  src="@/assets/image_steps_03.png" alt="">
          <p>{{$t('lang.payment_download_text_guide_4')}}</p>
          <img  src="@/assets/image_steps_04.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import comHead from '@/components/header/head.vue';
  import BScroll from 'better-scroll';
  import VueClipboard from 'vue-clipboard2';
  VueClipboard.config.autoSetContainer = true;
  import {
    Icon,
    Toast,
  } from 'vant';
  Vue.use(Icon);
  Vue.use(Toast);
  Vue.use(VueClipboard);
  @Component({
    components: {
      comHead,
    },
  })
  export default class Forget extends Vue {
    public search: string = '123';
    public showKeyboard: boolean = true;
    public copyUrl() {
      Toast('信息复制成功');
    }
    private mounted() {
      this.$nextTick(() => {
        const wrap: any = this.$refs.wrapper;
        const scroll = new BScroll(wrap, {
            scrollY: true,
            click: true,
        });
      });
    }
  }
</script>

<style lang="less">
  .headCon {
    height: 44px;
  }
  .container-top {
    height: ~"calc(100vh - 44px)";
    width: 375px;
    padding-top: 150px;
    background: rgb(255, 255, 255);
    top: 44px;
    left: 0;
    position: fixed;
    overflow: hidden;
    img {
      width: 50px;
      margin-bottom: 20px;
    }
    .msg-s20 {
      font-size: 20px;
      color: rgb(51, 51, 51);
      margin-bottom: 10px;
    }
    .msg-s12 {
      font-size: 12px;
      color: rgb(51, 51, 51);
    }
    .mb-90{
      margin-bottom: 90px;
    }
    .mb-10{
      margin-bottom: 10px;
    }
    .mb-40{
      margin-bottom: 40px;
    }
    .mb-180{
      margin-bottom: 180px;
    }
    .msg-href {
      color: #15C37E;
      font-size: 18px;
    }
    .msg-s14 {
      font-size: 14px;
      color: rgb(51, 51, 51);
    }
    .more-mobile-header {
      transform:rotate(90deg);
        margin-bottom: 15px;
    }
    .teach-list {
      border-top: 2px dashed rgb(242, 242, 242);
      padding-bottom: 20px;
      p {
        font-size: 14px;
        color: rgb(51, 51, 51);
        padding: 20px;
        text-align: left;
        padding-left: 60px;
      }
      img {
        display: block;
        width: 345px;
        height: 235px;
      }
    }
  }
</style>
