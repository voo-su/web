<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import BoardColumn from './BoardColumn.vue'
import { getProjectTasksApi } from '@/api/project'
import CardTask from './CardTask.vue'
import { useProjectStore } from '@/store'

const props = defineProps({
  projectId: {
    type: Number,
    default: 0
  }
})

interface ITasks {
  id: number
  title: string
}

interface IItem {
  id: number
  title: string
  tasks: ITasks[]
}

interface IRes {
  code?: number
  data: {
    categories: IItem[]
  }
}

const items = computed<IItem[]>(() => useProjectStore().getItems)
const cardTask = ref<boolean>(false)
const taskId = ref<number | null>(null)

const load = () => {
  getProjectTasksApi({
    project_id: props.projectId
  }).then((res: IRes) => {
    if (res.code == 200 && res.data) {
      const { data } = res
      const { categories } = data
      useProjectStore().addItems(categories)
    }
  })
}

const onOpenTask = (id: number) => {
  taskId.value = id
  cardTask.value = true
}

onMounted(() => {
  load()
})
</script>

<template>
  <el-row :gutter="20">
    <el-col
      v-for="(item, index) in items"
      :key="index"
      :span="6"
    >
      <board-column
        :title="item.title"
        :type-id="item.id"
        :project-id="props.projectId"
        :items="item.tasks"
        @open-task="onOpenTask"
      />
    </el-col>
  </el-row>
  <card-task
    v-if="cardTask"
    :task-id="taskId"
    @close="cardTask = false"
  />
</template>

<style scoped>

</style>
