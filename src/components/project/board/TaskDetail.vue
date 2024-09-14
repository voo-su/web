<script lang="ts" setup>
import type { PropType } from 'vue'
import Xtime from '../../base/BaseXtime.vue'

interface ITask {
  title: string
  description: string
  created_at: string
}

const props = defineProps({
  task: {
    type: Object as PropType<ITask>,
    default: {}
  }
})
</script>

<template>
  <div class="detail">
    <div class="item">
      <span>Поставлена: <xtime :time="props.task.created_at" /></span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.detail {
  .item {
    margin-top: 20px;

    span {
      color: rgb(92, 95, 102);
      font-size: 14px;
      line-height: 1.55;
      text-decoration: none;
      font-weight: 700;
    }
  }
}
</style>
