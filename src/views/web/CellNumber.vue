<template>
  <div>
    <!-- <comHead :headTitle="$t('lang.payment_country_code_title_select')" :goBack="true" :goBackUrl="bankUrl" /> -->
    <!-- <div class="headCon"></div> -->
    <div class="container">
      <!-- <van-search
        v-model="search"
        :placeholder="$t('lang.payment_country_code_text_search')"
        @search="onSearch"
      /> -->

    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator';
  import { State } from 'vuex-class';
  import BScroll from 'better-scroll';
  import { queryCountry } from '../../api/gobal';
  import comHead from '@/components/header/head.vue';
  import {
    Search,
    Row,
    Col,
  } from 'vant';
  Vue.use(Search);
  Vue.use(Row);
  Vue.use(Col);
  @Component({
    components: {
      comHead,
    },
  })
  export default class Login extends Vue {
    public search: string = '';
    public showKeyboard: boolean = true;
    public scroll: any;
    public countries: any[] = [];
    public initCountries: any[] = [];
    public bankUrl: string = '';
    @Watch('search')
    private onChildChanged(val: string, oldVal: string) {
      if (val === '') {
        this.countries = this.initCountries;
      }
    }
    private onSearch(key: any) {
      if (key === '') {
        this.countries = this.initCountries;
        return;
      }
      this.search = key;
      const cList = this.countries;
      if (this.$i18n.locale === 'en') {
        this.countries = cList.filter((item) => item.name_en.indexOf(this.search) > -1 );
      } else {
        this.countries = cList.filter((item) => item.name.indexOf(this.search) > -1 );
      }
    }
    private chooseMobileCode(item: any) {
      this.$router.push({
        path: `/verify?mobile_code=${item.mobile_code}&iso2=${item.iso2}&show=false`,
      });
    }
    private created() {
      this.bankUrl = `verify?mobile_code=${this.$route.query.mobile_code}&iso2=${this.$route.query.iso2}&show=false`;
      queryCountry().then((res) => {
        const resInfo: any = res;
        this.countries = resInfo.countries;
        this.initCountries = resInfo.countries;
        // this.$nextTick(() => {
        //   const wrap: any = this.$refs.wrapper;
        //   const scroll = new BScroll(wrap, {
        //       scrollY: true,
        //       click: true,
        //   });
        // });
      });
    }
  }
</script>

<style rel="stylesheet/scss" lang="less">
.web{
  .headCon {
    height: 44px;
  }
  .container {
    background-color: rgb(255, 255, 255);
    height: ~"calc(100vh - 44px)";
    .van-search {
      padding: 6px 10px;
      background: #fff !important;
      .van-field {
        height: 30px;
        background-color: rgb(242, 242, 242);
      }
    }
    .list-container {
      padding: 15px;
      padding-top: 0;
      height: ~"calc(100vh - 86px)";
      width: 375px;
      top: 86px;
      left: 0;
      position: fixed;
      overflow: hidden;
      .form-item {
        height: 50px;
        padding: 15px 0;
        border-bottom: 1px solid rgb(229, 229, 229);
        .cuntry-img {
          width: 30px;
          height: 20px;
        }
        .cuntry-name {
          text-align: left;
        }
        .cuntry-code {
          text-align: right;
          padding-right: 10px;
        }
      }
    }
  }
}
</style>
