<template>
  <div id="app" class="web">
    <div class="background">
      <div class="triangle1"></div>
      <div class="triangle2"></div>
    </div>
    <transition name="router-fade" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<style lang="scss">
@import './style/common';
img {
  content: normal !important;
}
.m-message{
  border-radius: 2px!important;
  margin-top: 50px!important;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  button{
    cursor: pointer;
  }
  .background {
    background-color: #103c8e;
    position: fixed;
    overflow: hidden;
    width: 100%;
    height: 100%;
    z-index: -1;
    &:before {
      content: '';
      z-index: 2;
      position: absolute;
      right: 0;
      top: 10vh;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0 0 20vh 100vw;
      border-color: transparent transparent #103c8e transparent;
    }
    &:after {
      content: '';
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 15vh 0 0 100vw;
      border-color: transparent transparent transparent #07307c;
      position: absolute;
      bottom: 0;
      left: 0;
    }
    .triangle1 {
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0 25vw 25vh 0;
      border-color: transparent #0a3483 transparent transparent;
      position: absolute;
      top: 0;
      right: 0;
    }
    .triangle2 {
      height: 30vh;
      width: 100vw;
      background-color: #214EA2;
    }
  }
}

#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
