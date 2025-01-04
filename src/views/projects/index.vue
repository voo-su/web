<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { Plus as PlusIcon } from '@element-plus/icons-vue'
import { getProjectsApi } from '@/api/project'
import CreateProject from '@/components/project/CreateProject.vue'
import AppPageHeader from '@/components/app/AppPageHeader.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()

interface Item {
  id: number
  title: string
}

const items = ref<Item[]>([])
const creation = ref(false)

const load = () => {
  getProjectsApi().then(({ code, data }: { code?: number; data: { items: Item[] } }) => {
    if (code == 200 && data) {
      items.value = data.items || []
    }
  })
}

const goProject = (id: number) => router.push({
  name: 'ProjectView',
  params: { id }
})

onMounted(() => {
  load()
})
</script>

<template>
  <default-layout :index="3">
    <div class="project-layout h-100">
      <app-page-header>
        <template #content>
          {{ t('projects') }}
        </template>
        <template #extra>
          <el-button
            :icon="PlusIcon"
            type="primary"
            link
            @click="creation = true"
          >
            {{ t('createProject') }}
          </el-button>
        </template>
      </app-page-header>
      <div class="items">
        <el-card
          v-for="(item, index) in items"
          :key="index"
          class="item-card"
          shadow="never"
          @click="goProject(item.id)"
        >
          {{ item.title }}
        </el-card>
      </div>
    </div>
  </default-layout>
  <create-project
    v-if="creation"
    @close="creation = false"
    @success="goProject"
  />
</template>

<style lang="scss" scoped>
.project-layout {
  background: #FFFFFF;
  border-radius: 16px;

  .items {
    margin: 10px;

    .item-card {
      margin-bottom: 10px;
      cursor: pointer;
      border-radius: 10px;
    }

    .item-card:hover {
      background-color: #ececec;
    }
  }
}
</style>
