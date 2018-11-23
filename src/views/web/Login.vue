<template>
  <div class="web">
    <div class="box-login">
      <WebHeadTop />
      <p class="remind-msg-pass">{{$t('lang.payment_login_enter_pin')}}</p>
      <van-cell-group class="cell-group" :style="passwordVa ? styleBor : ''">
        <van-field type="password" maxlength="6" v-model="password" @focus="passwordVa = false" :placeholder="$t('lang.payment_login_text_enter_phone')" placeholder="请输入密码" />
      </van-cell-group>
      <p class="forget-pass">
        <a href="javascript:;" @click="forgetPassword">{{$t('lang.payment_login_link_forget_pin')}}</a>
      </p>
      <van-row type="flex">
        <van-col span="24">
          <van-button type="primary" size="large" @click="next">确认</van-button>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { verifyPin } from '@/api/verify';
  import WebHeadTop from '@/components/header/webHead.vue';
  import localStorage from 'store';
  import Message from 'vue-m-message';
  import {
    PasswordInput,
    NumberKeyboard,
    Toast,
    Cell,
    CellGroup,
    Field,
    Button,
    Row,
    Col,
  } from 'vant';
  Vue.use(PasswordInput);
  Vue.use(NumberKeyboard);
  Vue.use(Toast);
  Vue.use(Cell);
  Vue.use(CellGroup);
  Vue.use(Field);
  Vue.use(Button);
  Vue.use(Row);
  Vue.use(Col);
  @Component({
    components: {
      WebHeadTop,
    },
  })
  export default class Login extends Vue {
    public password: string = '';
    public showKeyboard: boolean = true;
    public loginInfo: any;
    public isToast: boolean = false;
    public toastTitle: string = '';
    public passwordVa: boolean = false;
    public styleBor: object = {border: '1px solid #FF0000'};
    
    private created() {
      this.loginInfo = this.$route.query;
    }
    private next(key: any) {
      if (!this.password) {
        const langInfo: any = this.$i18n.messages[this.$i18n.locale].lang;
        Message.error({message: langInfo.payment_login_enter_pin, zIndex: 10000, showClose: false});
        return;
      }
      const params = {
        mobile: this.loginInfo.mobile,
        mobile_country_code: this.loginInfo.mobile_country_code,
        pin: this.password,
      };
      verifyPin(params).then((response) => {
        const responseInfo: any = response;
        if (responseInfo.ret === 'ok') {
          localStorage.set('mobi_token', responseInfo.data.token);
          this.$store.commit('UPDATE_TOKEN', responseInfo.data.token);
          this.$router.push('/web/home');
        }
      }, (error: any) => {
        this.password = '';
      });
    }
    private forgetPassword() {
      this.$router.push({
        path: '/web/forget',
      });
    }
  }
</script>

<style lang="less">
.web{
  .van-button--primary{
    background-color: #15C37E;
    border: 1px solid #15C37E;
  }
  .cell-group {
    background-color: #fff;
    border: 1px solid #eee;
  }
  .box-login{
    width: 500px;
    height: 300px;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    background: #FFF;
    padding: 40px;
  }
  .remind-msg-pass {
    padding: 0 0 30px 0;
    font-size: 20px;
    color: #000;
  }
  .forget-pass {
    padding-top: 25px;
    padding-bottom: 25px;
    text-align: right;
    font-size: 16px;
    color: #000;
  }
  .van-field__control{
  letter-spacing: 5px
  }
}

</style>
