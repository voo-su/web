<script lang="ts" setup>
import AppLayout from '@/components/app/AppLayout.vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()

const goBack = () => router.push('/')

interface IMenu {
  link: string
  name: string
}

const menus: IMenu[] = [
  {
    link: '/dev',
    name: 'Bot API',
  }
]

const activeMenuIndex = computed(() => {
  const foundMenu = menus.find(menu => menu.link === route.fullPath)
  return foundMenu ? menus.indexOf(foundMenu) : -1
})

const onClickMenu = (menu: any) => {
  router.push(menu.link)
}
</script>

<template>
  <app-layout>
    <template #header>
      <el-page-header
        @back="goBack"
        :content="t('developers')"
      />
    </template>
    <template #content>
      <el-row :gutter="20">
        <el-col :span="5">
          <el-menu
            :default-active="String(activeMenuIndex)"
            default-active="0"
            mode="vertical"
          >
            <el-menu-item
              v-for="(menu, index) in menus"
              :index="String(index)"
              @click="onClickMenu(menu)"
            >
              <span>{{ menu.name }}</span>
            </el-menu-item>
          </el-menu>
        </el-col>
        <el-col
          :span="18"
          class="content"
        >
          <router-view />
        </el-col>
      </el-row>
    </template>
  </app-layout>
</template>

<style lang="scss" scoped>
.el-page-header {
  border-bottom: none;
}

.el-menu {
  border-right: none;
  padding: 10px;
  border-radius: 16px;

  .el-menu-item {
    border-radius: 10px;
    padding-left: 10px !important;
    margin-bottom: 2px;

    &.is-active {
      background-color: #f0f2f5;
      color: #000000;
      font-weight: 700;
    }
  }
}

.content {
  margin-left: 15px;
  background: #FFFFFF;
  border-radius: 16px;
}
</style>
