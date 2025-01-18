<script lang="ts" setup></script>

<template>
  <div class="container">
    <div class="header-container">
      <div class="navbar-default navbar-fixed-top">
        <div class="header-fixed">
          <slot name="header" />
        </div>
      </div>
    </div>
    <div class="content-container">
      <div class="main-fixed">
        <slot name="content" />
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

  .navbar-default {
    border-bottom: 1px solid var(--el-border-color);
    background-color: #ffffff;

    .header-fixed{
      max-width: 1280px;
      margin: 0 auto;
      padding: 0;

    }
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
    }
  }
}
</style>
