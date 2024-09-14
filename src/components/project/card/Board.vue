<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import BoardColumn from './BoardColumn.vue'
import { getProjectTasksApi } from '@/api/project'

const props = defineProps({
  projectId: {
    type: Number,
    default: 0
  }
})

interface Tasks {
  id: number
  title: string
}

interface Item {
  id: number
  title: string
  tasks: Tasks[]
}

const items = ref<Item[]>([])

const load = () => {
  getProjectTasksApi({
    project_id: props.projectId
  }).then((res: any) => {
    if (res.code == 200 && res.data) {
      const { data } = res
      items.value = data.categories || []
    }
  })
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
        :project-id="props.projectId"
        :items="item.tasks"
      />
    </el-col>
  </el-row>
</template>

<style scoped>

</style>
