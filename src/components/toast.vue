<template>
  <div class="el-message el-message--error" style="z-index: 9990">
    <img src="@/assets/error.png" alt="">
    <p class="el-message__content">{{toastTitle}}</p>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
  @Component
  export default class Toast extends Vue {
    @Prop({ default: '系统错误' }) public toastTitle!: string;
  }
</script>

<style lang="less">
.web{
  .el-message {
      min-width: 380px;
      box-sizing: border-box;
      border-radius: 4px;
      border: 1px solid #ebeef5;
      position: fixed;
      left: 50%;
      top: 20px;
      transform: translateX(-50%);
      background-color: #edf2fc;
      transition: opacity .3s,transform .4s;
      overflow: hidden;
      padding: 15px 15px 15px 20px;
      display: flex;
      align-items: center;
      img {
        width:18px;
        height:18px;
        margin-right:15px;
      }
  }
}

</style>
