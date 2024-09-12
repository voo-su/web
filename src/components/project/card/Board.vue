<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import BoardColumn from './BoardColumn.vue'
import { getProjectTaskListApi } from '@/api/project'

const props = defineProps({
  projectId: {
    type: Number,
    default: 0
  }
})

interface Item {
  id: number;
  title: string;
}

interface Column {
  title: string;
  items: Item[]
}

const items = ref<Column[]>([])

const load = async typeId => {
  getProjectTaskListApi({
    project_id: props.projectId,
    task_type: typeId
  }).then((res: any) => {
    if (res.code == 200 && res.data) {
      const {data} = res
      items.value.push({
        title: typeId,
        items: data.items || []
      })
    }
  })
}

onMounted(() => {
  load(1)
  load(2)
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
        :items="item.items"
        :title="item.title"
      />
    </el-col>
  </el-row>
</template>

<style scoped>

</style>
