<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import ProjectBoard from '@/components/project/board/Board.vue'
import { Plus as PlusIcon } from '@element-plus/icons-vue'
import CreateTask from '@/components/project/board/CreateTask.vue'
import ProjectMembers from '@/components/project/ProjectMembers.vue'
import { useI18n } from 'vue-i18n'
import { getDetailApi } from '@/api/project'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()

const { params } = route
const projectId = Number(params.id)

const goBack = () => router.push({ name: 'ProjectsView' })

interface IItem {
  id: number
  name: string
}

const detail = ref<IItem>({
  id: 0,
  name: '',
})

const creation = ref(false)
const showMembers = ref(false)

const load = () => {
  getDetailApi({
    id: projectId
  }).then(({ code, data }: { code?: number; data: IItem }) => {
    if (code == 200 && data) {
      detail.value = data
    }
  })
}

onMounted(() => {
  load()
})
</script>

<template>
  <default-layout :index="3">
    <div class="project-layout h-100">
      <el-page-header
        :title="t('back')"
        @back="goBack"
      >
        <template #content>
          {{  detail.name }}
          <el-button
            type="primary"
            link
            @click="showMembers = true"
          >
            {{ t('groupParticipants') }}
          </el-button>
        </template>
        <template #extra>
          <el-button
            type="primary"
            :icon="PlusIcon"
            link
            @click="creation = true"
          >
            {{ t('createTask') }}
          </el-button>
        </template>
      </el-page-header>
      <div class="board-list">
        <project-board :project-id="projectId" />
      </div>
    </div>
  </default-layout>
  <create-task
    v-if="creation"
    :project-id="projectId"
    @close="creation = false"
  />
  <project-members
    v-model="showMembers"
    :project-id="projectId"
    @close="showMembers = false"
  />
</template>

<style lang="scss" scoped>
.project-layout {
  background: #FFFFFF;
  border-radius: 16px;

  .el-page-header {
    border-bottom: 1px solid var(--el-border-color);
  }

  .el-page-header {
    margin-bottom: 20px;
  }

  .board-list {
    margin: 20px;
  }
}
</style>
