<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { Close as CloseIcon } from '@element-plus/icons-vue'
import { getProjectTaskDetailApi } from '@/api/project'
import TaskComment from './TaskComment.vue'
import TaskDetail from './TaskDetail.vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  taskId: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['close'])

const { t } = useI18n()
const isShow = ref<boolean>(true)

const onCloseClick = () => {
  emit('close')
  isShow.value = false
}

interface ITask {
  title: string
  description: string
  created_at: string
}

interface IRes {
  code?: number
  data: ITask
}

const task = ref<ITask>({
  title: '',
  description: '',
  created_at: ''
})

const load = () => {
  getProjectTaskDetailApi({
    task_id: props.taskId
  }).then((res: IRes) => {
    if (res.code == 200 && res.data) {
      const { data } = res
      task.value = data
    }
  })
}

onMounted(() => {
  load()
})
</script>

<template>
  <el-dialog
    v-model="isShow"
    :before-close="onCloseClick"
    :show-close="false"
    top="5vh"
  >
    <template #header="{ close, titleId, titleClass }">
      <h4
        :id="titleId"
        :class="titleClass"
      >
        {{ t('task') }}
      </h4>
      <div class="module__after">
        <el-button
          :icon="CloseIcon"
          class="close"
          link
          type="info"
          @click="close"
        />
      </div>
    </template>
    <el-row>
      <el-col :span="16">
        <div class="card">
          <div class="card-title">
            {{ task.title }}
          </div>
          <div class="card-desc">
            {{ task.description }}
          </div>
        </div>
        <task-comment :task-id="props.taskId" />
      </el-col>
      <el-col :span="8">
        <task-detail :task="task" />
      </el-col>
    </el-row>
  </el-dialog>
</template>

<style lang="scss" scoped>
.card {
  margin: 10px 20px;
  min-height: 100px;

  .card-title {
    padding: 7px 0;
    line-height: 1.28;
    font-weight: 600;
  }

  .card-desc {
    padding: 7px 7px 8px;
  }
}
</style>
