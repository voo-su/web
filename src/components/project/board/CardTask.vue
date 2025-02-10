<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { Close as CloseIcon } from '@element-plus/icons-vue'
import { getProjectTaskDetailApi } from '@/api/project'
import TaskComment from './TaskComment.vue'
import TaskDetail from './TaskDetail.vue'
import type { ITask, IMemberItem } from '@/components/project/types'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  taskId: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['close'])

const { t } = useI18n()
const isShow = ref<boolean>(true)

const onCloseClick = () => {
  emit('close')
  isShow.value = false
}

const task = ref<ITask>({
  id: 0,
  title: '',
  description: '',
  created_at: '',
  assigner: {
    id: 0,
    avatar: '',
    username: '',
    name: '',
    surname: '',
  },
  executor: {
    id: 0,
    avatar: '',
    username: '',
    name: '',
    surname: '',
  }
})

const load = () => {
  getProjectTaskDetailApi({
    task_id: props.taskId
  }).then(({ code, data }: { code?: number; data: ITask }) => {
    if (code == 200 && data) {
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
        <task-detail
          :task-id="props.taskId"
          :task="task"
        />
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
