<script lang="ts" setup>
// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import { markRaw, ref } from 'vue'
import SettingDetail from '@/components/setting/SettingDetail.vue'
import SettingSecurity from '@/components/setting/SettingSecurity.vue'
import SettingNotification from '@/components/setting/SettingNotification.vue'
import { Bell, Setting, User, Cpu } from '@element-plus/icons-vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

interface IMenu {
  name: string
  icon: any
  component: any
}

const menus: IMenu[] = [
  {
    name: 'Личные данные',
    icon: markRaw(User),
    component: SettingDetail
  },
  {
    name: 'Безопасность',
    icon: markRaw(Setting),
    component: SettingSecurity
  },
  {
    name: 'Уведомления',
    icon: markRaw(Bell),
    component: SettingNotification
  }
]

const tabIndex = ref<number>(0)
</script>

<template>
  <default-layout :index="null">
    <el-row
      :gutter="19"
      class="h-100"
    >
      <el-col :span="5">
        <el-menu
          default-active="0"
          mode="vertical"
        >
          <el-menu-item
            v-for="(menu, index) in menus"
            :index="String(index)"
            @click="tabIndex = index"
          >
            <el-icon :size="20">
              <component :is="menu.icon" />
            </el-icon>
            <span>{{ menu.name }}</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="19">
        <div class="component h-100">
          <component :is="menus[tabIndex].component" />
        </div>
      </el-col>
    </el-row>
  </default-layout>
</template>

<style lang="scss" scoped>
.el-col-5 {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 10px;
}

.component {
 // margin-left: 15px;
  background: #FFFFFF;
  border-radius: 16px;
}

.el-menu {
  border-right: none;

  .el-menu-item {
    border-radius: 10px;
    padding-left: 10px !important;

    .el-icon {
      position: relative;
      height: 31px;
      width: 31px;
      margin-right: 10px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      vertical-align: middle;
      background: #ececec;
      border-radius: 5px;
    }

    &.is-active {
      .el-icon {
        background-color: #2F80ED;
        color: #ffffff;
      }
    }

  }
}
</style>
