<script lang="ts" setup>
import { ref } from 'vue'
import { getMembersApi } from '@/api/project'
import type { IMemberItem } from '@/components/project/types'
import { Close as CloseIcon } from '@element-plus/icons-vue'
import TaskMember from '@/components/project/TaskMember.vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  projectId: {
    type: Number,
    default: 0
  }
})

const modelValue = defineModel()

const { t } = useI18n()

const items = ref<IMemberItem[]>([])

const load = () => {
  getMembersApi({
    project_id: props.projectId
  }).then(({ code, data }: { code?: number; data: { items: IMemberItem[] } }) => {
    if (code == 200) {
      items.value = data.items || []
    }
  })
}
</script>

<template>
  <el-dialog
    v-model="modelValue"
    :show-close="false"
    width="600px"
    @open="load"
  >
    <template #header="{ close, titleId, titleClass }">
      <h4
        :id="titleId"
        :class="titleClass"
      >
        {{ t('groupParticipants') }}
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
    <div class="project-members">
      <task-member :members="items"/>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
.project-members {
  margin: 0 10px;
}
</style>
