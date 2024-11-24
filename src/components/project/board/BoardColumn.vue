<script lang="ts" setup>
import { VueDraggableNext } from 'vue-draggable-next'
import { setProjectTaskMoveApi } from '@/api/project'
import type { PropType } from 'vue'
import { defineProps } from 'vue'

interface IItem {
  id: number
  title: string
}

const props = defineProps({
  title: {
    type: String,
    default: 'Неизвестно'
  },
  typeId: {
    type: Number,
    default: null
  },
  projectId: {
    type: Number,
    default: null
  },
  items: {
    type: Array as PropType<IItem[]>,
    default: () => []
  }
})

const emit = defineEmits(['openTask'])

const onChange = (event: any) => {
  // console.log(event)
  // if (event.added != undefined) {
  //   const element = event.added.element
  //   const newIndex = event.added.newIndex
  //   console.log({
  //     board_id: element.id,
  //   })
  // }
}

interface IMove {
  item: { _underlying_vm_: { id: number } }
  from: { dataset: { section: string } }
  to: { dataset: { section: string } }
}

interface IRes {
  code?: number
  data: {}
}

const onMove = (event: IMove) => {
  setProjectTaskMoveApi({
    project_id: props.projectId,
    task_id: event.item._underlying_vm_.id,
    from_id: Number(event.from.dataset.section),
    to_id: Number(event.to.dataset.section)
  }).then((res: IRes) => {
    console.log(res)
  })
}

const onOpenTask = (id: number) => {
  emit('openTask', id)
}
</script>

<template>
  <div class="board-column">
    <div class="header">
      <span class="title">{{ props.title }}</span>
    </div>
    <vue-draggable-next
      :list="props.items"
      group="people"
      :sort="false"
      :data-section="props.typeId"
      class="body h-100"
      @change="onChange"
      @end="onMove"
    >
      <div
        v-for="(item, index) in props.items"
        :key="index"
      >
        <el-card
          class="board"
          shadow="never"
          @click="onOpenTask(item.id)"
        >
          {{ item.title }}
        </el-card>
      </div>
    </vue-draggable-next>
  </div>
</template>

<style lang="scss" scoped>
.board-column {
  //background-color: #f4f5f7;
  background-color: #e9ecef;
  padding: 5px;
  border-radius: 8px;

  .header {
    margin: 8px 8px 10px 8px;

    .title {
      font-size: 17px;
      color: #5e6c84;
    }
  }

  .body {
    padding: 0 5px;
    min-height: 400px;

    .board {
      cursor: pointer;
      border: none;
      box-shadow: #091e4240 0 1px 2px;
      margin-bottom: 5px;

      &:hover {
        background-color: #ececec;
      }
    }
  }
}
</style>
