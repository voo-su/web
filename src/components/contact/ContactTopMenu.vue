<script lang="ts" setup>
import { computed, markRaw } from 'vue'
import { CirclePlus, User } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const menus = [
  {
    link: '/contacts',
    name: 'Мои контакты',
    icon: markRaw(User)
  },
  {
    link: '/contacts/requests',
    name: 'Заявки',
    icon: markRaw(CirclePlus),
    hotspot: userStore.isContactApply
  }
  // {
  //   name: 'Мои группы',
  // },
  // {
  //   name: 'Открытые группы',
  // },
  // {
  //   name: 'Управление группами',
  // }
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
  <el-menu
    :default-active="String(activeMenuIndex)"
    mode="horizontal"
    :ellipsis="false"
    :unique-opened="true"
  >
    <el-menu-item
      v-for="(menu, index) in menus"
      :index="String(index)"
      @click="onClickMenu(menu)"
    >
      <el-icon
        v-if="menu.icon"
        :size="20"
      >
        <component :is="menu.icon" />
      </el-icon>
      <span>{{ menu.name }}</span>
      <span
        v-if="menu.hotspot"
        class="left"
      >++</span>
    </el-menu-item>
  </el-menu>
</template>

<style lang="scss" scoped>
.el-menu {
  height: 46px;
  padding: 5px 5px;

  .el-menu-item {
    border-radius: 10px;
    margin-left: 10px;
    padding: 0 15px;
  }
}

.el-menu--horizontal > .el-menu-item.is-active {
  border-bottom: none;
  background-color: var(--el-menu-hover-bg-color);
}
</style>
