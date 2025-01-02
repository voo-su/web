<script lang="ts" setup>
// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE
</script>

<template>
  <div class="el-page-header el-page-header--has-extra">
    <div class="el-page-header__header">
      <div
        v-if="$slots.content || $slots.left"
        class="el-page-header__left"
      >
        <slot name="left" />
        <div
          v-if="$slots.content"
          class="el-page-header__content"
        >
          <slot name="content" />
        </div>
      </div>
      <div
        v-if="$slots.center"
        class="el-page-header__center"
      >
        <slot name="center" />
      </div>
      <div
        v-if="$slots.extra"
        class="el-page-header__extra"
      >
        <slot name="extra" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@forward 'element-plus/theme-chalk/src/base.scss';
@forward 'element-plus/theme-chalk/src/page-header.scss';

.el-page-header__header {
  height: 40px;
}

.el-page-header__center {
  width: 100%;
}
</style>
