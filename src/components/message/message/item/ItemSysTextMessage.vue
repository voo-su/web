<script lang="ts" setup>
// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

defineProps({
  extra: Object,
  data: Object
})
</script>

<template>
  <div class="system-text-message">
    <div class="content">
      {{ data.content }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.system-text-message {
  display: flex;
  justify-content: center;

  .content {
    margin: 10px auto;
    background-color: var(--el-border-color);
    font-size: 11px;
    line-height: 30px;
    padding: 0 8px;
    word-break: break-all;
    word-wrap: break-word;
    color: #979191;
    user-select: none;
    font-weight: 300;
    display: inline-block;
    border-radius: 3px;
  }
}
</style>
