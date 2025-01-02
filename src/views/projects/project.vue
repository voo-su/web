<script lang="ts" setup>
// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import DefaultLayout from '@/layouts/DefaultLayout.vue'
import ProjectBoard from '@/components/project/board/Board.vue'
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'
import { Plus as PlusIcon } from '@element-plus/icons-vue'
import CreateTask from '@/components/project/board/CreateTask.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()

const { params } = route
const projectId = Number(params.id)

const goBack = () => router.push({ name: 'ProjectsView' })

const creation = ref(false)

</script>

<template>
  <default-layout :index="3">
    <div class="project-layout h-100">
      <el-page-header
        :content="t('project')"
        :title="t('back')"
        @back="goBack"
      >
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
