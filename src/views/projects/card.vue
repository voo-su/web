<script lang="ts" setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import ProjectCardBoard from '@/components/project/card/Board.vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const { params } = route
const projectId = Number(params.id)

const goBack = () => router.push({ name: 'ProjectView' })
</script>

<template>
  <default-layout :index="2">
    <el-alert
      title="Раздел находится в разработке"
      type="warning"
      :closable="false"
    />
    <div class="project_card-layout">
      <el-row
        class="row-bg"
        justify="center"
      >
        <el-col :span="21">
          <el-page-header
            title="Назад"
            content="Проект"
            @back="goBack"
          />
          <project-card-board :project-id="projectId" />
        </el-col>
      </el-row>
    </div>
  </default-layout>
</template>

<style lang="scss">
.el-container {
  height: 100%;
}

.project_card-layout {
  margin-top: 40px;

  .el-page-header {
    margin-bottom: 20px;
  }
}
</style>
