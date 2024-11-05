<script lang="ts" setup>
import { ChatRound } from '@element-plus/icons-vue'
</script>

<template>
  <div class="greeting flex-center">
    <div class="content">
      <el-icon :size="50">
        <chat-round />
      </el-icon>
      <p>Выберите чат слева или создайте новую беседу.</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.greeting {
  height: 100%;
  width: 100%;

  .content {
    text-align: center;
    color: #ccc;
    font-size: 18px;
    font-weight: 300;
  }
}
</style>
