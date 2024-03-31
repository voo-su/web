<script lang="ts" setup>
import { markRaw, ref } from 'vue'
import DetailTab from '../../components/setting/tab/DetailTab.vue'
import SecurityTab from '../../components/setting/tab/SecurityTab.vue'
import NotificationTab from '../../components/setting/tab/NotificationTab.vue'
import { Bell, Setting, User } from '@element-plus/icons-vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AppPageHeader from '@/components/app/AppPageHeader.vue'

const menus = [
  {
    name: 'Личные данные',
    icon: markRaw(User),
    component: DetailTab
  },
  {
    name: 'Безопасность',
    icon: markRaw(Setting),
    component: SecurityTab
  },
  {
    name: 'Уведомления',
    icon: markRaw(Bell),
    component: NotificationTab
  }
]

const tabIndex = ref(0)
</script>

<template>
  <default-layout :index="null">
    <el-row
      :gutter="20"
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
      <el-col :span="18">
        <component :is="menus[tabIndex].component" />
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

.el-col-18 {
  margin-left: 15px;
  background: #FFFFFF;
  border-radius: 16px;
}

.el-menu {
  border-right: none;

  .el-menu-item {
    border-radius: 10px;
    padding-left: 10px!important;

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
   &.is-active{
     .el-icon {
       background-color: #2F80ED;
       color: #ffffff;
     }
   }

  }
}
</style>
