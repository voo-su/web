<script lang="ts" setup>
// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

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

    Постановщик
    Исполнитель
    Соисполнители
    Наблюдатели
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
