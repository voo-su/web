<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import BoardColumn from './BoardColumn.vue'
import { getProjectTasksApi } from '@/api/project'
import CardTask from './CardTask.vue'
import { useProjectStore } from '@/store'

const props = defineProps({
  projectId: {
    type: String,
    default: null
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

const items = computed<IItem[]>(() => useProjectStore().getItems)
const cardTask = ref<boolean>(false)
const taskId = ref<string | null>(null)

const load = () => {
  getProjectTasksApi({
    project_id: props.projectId
  }).then(({ code, data }: { code?: number; data: { categories: IItem[] } }) => {
    if (code == 200 && data) {
      const { categories } = data
      useProjectStore().addItems(categories)
    }
  })
}

const onOpenTask = (id: string) => {
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
