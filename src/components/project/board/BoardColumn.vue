<script lang="ts" setup>
import { VueDraggableNext } from 'vue-draggable-next'
import { setProjectTaskMoveApi } from '@/api/project'

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
    type: Array
  }
})

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

const onMove = (event: any) => {
  setProjectTaskMoveApi({
    project_id: props.projectId,
    task_id: event.item._underlying_vm_.id,
    from_id: Number(event.from.dataset.section),
    to_id: Number(event.to.dataset.section)
  }).then((res: any) => {
    console.log(res)
  })
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
        >
          {{ item.title }}
        </el-card>
      </div>
    </vue-draggable-next>
  </div>
</template>

<style lang="scss" scoped>
.board-column {
  background-color: #f4f5f7;
  padding: 5px;

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
