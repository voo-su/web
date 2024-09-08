<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { getProjectListApi } from '@/api/project'

const router = useRouter()

interface Item {
  id: number
  title: string
}

const items = ref<Item[]>([])

const load = () => {
  getProjectListApi().then((res: any) => {
    if (res.code == 200 && res.data) {
      const data = res.data
      items.value = data.items || []
    }
  })
}

</script>

<template>
  <default-layout :index="3">
    <el-alert
      title="Раздел находится в разработке"
      type="warning"
      :closable="false"
    />
    <div class="project-layout">
      <el-row class="row-bg" justify="center">
        <el-col :span="21">
          <div class="el-page-header">
            <div class="el-page-header__header">
              <div class="el-page-header__left">
                <div class="el-page-header__content">
                  <h4>Проекты</h4>
                </div>
              </div>
            </div>
          </div>
          <div v-infinite-scroll="load" class="project-list">
            <el-card
              v-for="(item, index) in items"
              :key="index"
              shadow="never"
              class="project-list_item"
            >
              {{ item.title }}
            </el-card>
          </div>
        </el-col>
      </el-row>
    </div>
  </default-layout>
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
