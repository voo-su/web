<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { Plus as PlusIcon } from '@element-plus/icons-vue'
import { getProjectListApi } from '@/api/project'
import CreateProject from '@/components/project/CreateProject.vue'

const router = useRouter()

interface Item {
  id: number
  title: string
}

const items = ref<Item[]>([])
const creation = ref(false)
const load = () => {
  getProjectListApi().then((res: any) => {
    if (res.code == 200 && res.data) {
      const { data } = res
      items.value = data.items || []
    }
  })
}

const goProject = (id: number) => router.push({
  name: 'CardProjectView',
  params: { id }
})

onMounted(() => {
  load()
})
</script>

<template>
  <default-layout :index="3">
    <el-alert
      title="Раздел находится в разработке"
      type="warning"
      :closable="false"
    />
    <div class="project-layout">
      <el-row
        class="row-bg"
        justify="center"
      >
        <el-col :span="21">
          <div class="el-page-header">
            <div class="el-page-header__header">
              <div class="el-page-header__left">
                <div class="el-page-header__content">
                  <h4>Проекты</h4>
                </div>
              </div>
              <div class="el-page-header__extra">
                <el-button
                  type="primary"
                  :icon="PlusIcon"
                  @click="creation = true"
                >
                  Создать проект
                </el-button>
              </div>
            </div>
          </div>
          <div class="project-list">
            <el-card
              v-for="(item, index) in items"
              :key="index"
              shadow="never"
              class="project-list_item"
              @click="goProject(item.id)"
            >
              {{ item.title }}
            </el-card>
          </div>
        </el-col>
      </el-row>
    </div>
  </default-layout>
  <create-project
    v-if="creation"
    @close="creation = false"
    @success="goProject"
  />
</template>

<style lang="scss">
.el-container {
  height: 100%;
}

.project-layout {
  margin-top: 40px;

  .el-page-header {
    border-bottom: 1px solid #f5f5f5;
    padding-bottom: 10px;

    &__content {
      h4 {
        font-size: 1.5rem;
        line-height: 2rem;
      }
    }

    &__extra {
      .el-button {
        height: 30px;
      }
    }
  }

  .project-list {
    margin-top: 20px;

    &_item {
      margin-bottom: 10px;
      cursor: pointer;
    }
  }
}
</style>
