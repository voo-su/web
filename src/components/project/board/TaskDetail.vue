<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { PropType } from 'vue'
import Xtime from '@/components/base/BaseXtime.vue'
import { getTaskCoexecutorsApi, getTaskWatchersApi } from '@/api/project'
import TaskMember from '@/components/project/TaskMember.vue'
import type { ITask, IMemberItem } from '@/components/project/types'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  taskId: {
    type: Number,
    default: 0
  },
  task: {
    type: Object as PropType<ITask>,
    default: {}
  }
})

const { t } = useI18n()

const coexecutors = ref<IMemberItem[]>([])
const watchers = ref<IMemberItem[]>([])

const load = () => {
  getTaskCoexecutorsApi({
    task_id: props.taskId
  }).then(({ code, data }: { code?: number; data: { items: IMemberItem[] } }) => {
    if (code == 200) {
      coexecutors.value = data.items || []
    }
  })

  getTaskWatchersApi({
    task_id: props.taskId
  }).then(({ code, data }: { code?: number; data: { items: IMemberItem[] } }) => {
    if (code == 200) {
      watchers.value = data.items || []
    }
  })
}
const formatMember = (member: IMemberItem): IMemberItem => ({
  id: member.id || 0,
  avatar: member.avatar || '',
  username: member.username || '',
  name: member.name || '',
  surname: member.surname || ''
});

onMounted(() => {
  load()
})
</script>

<template>
  <div class="detail">
    <div class="item">
      <span>Поставлена: <xtime :time="props.task.created_at" /></span>
    </div>
    <div class="item">
      <span>Постановщик</span>
      <task-member :members="props.task.assigner ? [formatMember(props.task.assigner)] : []"/>
    </div>
    <div class="item">
      <span>Исполнитель</span>
      <task-member :members="props.task.executor ? [formatMember(props.task.executor)] : []"/>
    </div>
    <div class="item">
      <span>Соисполнители</span>
      <task-member :members="coexecutors"/>
    </div>
    <div class="item">
      <span>Наблюдатели</span>
      <task-member :members="watchers"/>
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
