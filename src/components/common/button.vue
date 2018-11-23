<template>
  <van-button class="common" :type="type" :size="size" @click="clickHandle">
    <slot></slot>
  </van-button>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator';
  import { Button } from 'vant';
  Vue.use(Button);
  @Component({
    components: {
      Button,
    },
  })
  export default class CommonButton extends Vue {
    @Prop(String) public type!: string;
    @Prop(String) public size!: string;
    public clickHandle() {
      this.$emit('click');
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .common {
    &.van-button {
      border-radius: 0;
      font-weight: bold;
    }
    &.van-button--default {
      border-color: #DDDDDD;
      color: #333333;
    }
    &.van-button--primary {
      background-color: #15C37E;
      border-color: #15C37E;
    }
  }
</style>
