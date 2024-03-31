<script lang="ts" setup>
import AppHeader from '../components/app/AppHeader.vue'
import AppFooter from '../components/app/AppFooter.vue'

defineProps({
  index: {
    type: Number,
    default: 0
  }
})
</script>

<template>
  <div class="container">
    <div class="header-container">
      <app-header :index="index" />
    </div>
    <div class="content-container">
      <div class="main-fixed">
        <div class="container-fluid">
          <slot />
        </div>
        <app-footer />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: row;
  flex: 1;
  flex-basis: auto;
  box-sizing: border-box;
  min-width: 0;
  background-color: #f0f2f5;

  .header-container {
    padding: 0;
    box-sizing: border-box;
    flex-shrink: 0;
    height: 60px;
  }

  .content-container {
    margin-top: 63px;
    display: block;
    flex: 1;
    flex-basis: auto;
    overflow: auto;

    .main-fixed {
      max-width: 1280px;
      margin: 0 auto;
      height: calc(100vh - 105px);
      padding: 0 0 40px;

      & > .container-fluid {
        height: 100% !important;
        //border: 1px solid var(--el-border-color);
        //background-color: white;
        //border-radius: 0 0 8px 8px;
      }
    }
  }
}

//@media (min-width: 1350px) {
//  .container .content-container .main-fixed {
//    max-width: 1280px;
//  }
//}
</style>
