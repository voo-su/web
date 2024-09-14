<script lang="ts" setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import ProjectBoard from '@/components/project/board/Board.vue'
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'
import { Plus as PlusIcon } from '@element-plus/icons-vue'
import CreateBoard from '@/components/project/board/CreateBoard.vue'

const router = useRouter()
const route = useRoute()

const { params } = route
const projectId = Number(params.id)

const goBack = () => router.push({ name: 'ProjectsView' })

const creation = ref(false)

</script>

<template>
  <default-layout :index="2">
    <div class="project-layout h-100">
      <el-page-header
        content="Проект"
        title="Назад"
        @back="goBack"
      >
        <template #extra>
          <el-button
            type="primary"
            :icon="PlusIcon"
            link
            @click="creation = true"
          >
            Создать задачу
          </el-button>
        </template>
      </el-page-header>
      <div class="board-list">
        <project-board :project-id="projectId" />
      </div>
    </div>
  </default-layout>
  <create-board
    v-if="creation"
    :project-id="projectId"
    @close="creation = false"
    @success=""
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
