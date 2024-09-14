<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { Plus as PlusIcon } from '@element-plus/icons-vue'
import { getProjectsApi } from '@/api/project'
import CreateProject from '@/components/project/CreateProject.vue'
import AppPageHeader from '@/components/app/AppPageHeader.vue'

const router = useRouter()

interface Item {
  id: number
  title: string
}

const items = ref<Item[]>([])
const creation = ref(false)

const load = () => {
  getProjectsApi().then((res: any) => {
    if (res.code == 200 && res.data) {
      const { data } = res
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
    <app-page-header>
      <template #content>
        Проекты
      </template>
      <template #extra>
        <el-button
          :icon="PlusIcon"
          type="primary"
          @click="creation = true"
        >
          Создать проект
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
  </default-layout>
  <create-project
    v-if="creation"
    @close="creation = false"
    @success="goProject"
  />
</template>

<style lang="scss" scoped>
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
</style>
