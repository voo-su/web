<script lang="ts" setup>
import { Plus as PlusIcon } from '@element-plus/icons-vue'
import { VueDraggableNext } from 'vue-draggable-next'

const props = defineProps<{
  title: String,
  items: any[],
}>()

</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span>{{ props.title }}</span>
        <el-button
          type="primary"
          :icon="PlusIcon"
          link
          @click=""
        >
          Создать
        </el-button>
      </div>
    </template>
    <vue-draggable-next
      :list="items"
      group="people"
    >
      <div
        v-for="(item, index) in items"
        :key="index"
      >
        <el-card shadow="never">
          {{ item.title }}
        </el-card>
      </div>
    </vue-draggable-next>
  </el-card>
</template>

<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
