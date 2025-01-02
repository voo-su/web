<script lang="ts" setup>
// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

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
  },
  {
    link: '/dev/bots',
    name: 'Менеджер ботов',
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
  <div class="container">
    <div class="header-container">
      <div class="navbar-default navbar-fixed-top">
        <div class="header-fixed">
          <el-page-header
            @back="goBack"
            :content="t('developers')"
          />
        </div>
      </div>
    </div>
    <div class="content-container">
      <div class="main-fixed">
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
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: row;
  flex: 1;
  flex-basis: auto;
  box-sizing: border-box;
  min-width: 0;
  background-color: #f0f2f5;

  .navbar-default {
    border-bottom: 1px solid var(--el-border-color);
    background-color: #ffffff;

    .header-fixed{
      max-width: 1280px;
      margin: 0 auto;
      padding: 0;

      .el-page-header {
        border-bottom: none;
      }
    }
  }

  .content-container {
    margin-top: 63px;
    display: block;
    flex: 1;
    flex-basis: auto;
    overflow: auto;

    .main-fixed {
      max-width: 1280px;
      margin: 0 auto;
      height: calc(100vh - 105px);
      padding: 0 0 40px;

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
    }
  }
}
</style>
