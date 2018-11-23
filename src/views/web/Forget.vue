<template>
  <div>
    <WebHeadTop />
    <div class="headCon"></div>
    <div class="container-top wrapper">
      <div>
        <img src="@/assets/icon_mobi_logo.png" alt="">
        <p class="msg-s20">{{$t('lang.payment_download_label_forget_pin')}}</p>
        <p class="msg-s12 mb-40">{{$t('lang.payment_download_text_forget_pin')}}</p>
        <p class="msg-s12 mb-10">{{$t('lang.payment_download_text_corporate_web')}}</p>
        <p class="msg-href mb-180">{{$t('lang.payment_download_link_website')}}</p>
        <div class="teach-list">
          <p class="guide">
            <span class="installation">
              安装引导教程
            </span>
          </p>
          <van-row type="flex">
            <van-col span="12">
              <div>
                <p>{{$t('lang.payment_download_text_guide_1')}}</p>
                <img  src="@/assets/image_steps_01.png" alt="">
              </div>
            </van-col>
            <van-col span="12">
              <div>
                <p>{{$t('lang.payment_download_text_guide_2')}}</p>
                <img  src="@/assets/image_steps_02.png" alt="">
              </div>
            </van-col>
          </van-row>
          <van-row type="flex">
            <van-col span="12">
              <div>
                <p>{{$t('lang.payment_download_text_guide_3')}}</p>
                <img  src="@/assets/image_steps_03.png" alt="">
              </div>
            </van-col>
            <van-col span="12">
              <div>
                <p>{{$t('lang.payment_download_text_guide_4')}}</p>
                <img src="@/assets/image_steps_04.png" alt="">
              </div>
            </van-col>
          </van-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import WebHeadTop from '@/components/header/webHead.vue';
  import {
    Icon,
    Toast,
    Row,
    Col,
  } from 'vant';
  Vue.use(Icon);
  Vue.use(Toast);
  Vue.use(Row);
  Vue.use(Col);
  @Component({
    components: {
      WebHeadTop,
    },
  })
  export default class Forget extends Vue {}
</script>

<style lang="less">
  .web{
    .headCon {
      height: 44px;
    }
    .container-top {
      background: #fff;
      margin: 0 auto;
      padding-top: 70px;
      position: relative;
      width: 800px;
      z-index: 99;
      top: 120px;
      .guide {
        padding: 45px 20px 20px 35px !important;
      }
      .installation{
        border-left: 5px solid #3ec278;
        padding:  0 10px 0 !important;
        text-indent: 10px;
        margin-top: 40px;
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 40px;
      }
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
        margin-bottom: 55px;
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
  }

</style>
