<script lang="ts" setup>
// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

defineProps({
  title: {
    type: String,
    default: 'Неопределенный заголовок'
  },
  menus: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <el-container class="is-vertical section">
    <el-container class="hidden">
      <el-aside>
        <router-link
          v-for="(menu, key) in menus"
          :key="key"
          :to="menu.path"
        >
          <div
            v-if="menu.show !== false"
            :class="{
              selectd: $route.path == menu.path,
            }"
            class="menu"
          >
            <div class="icon">
              <el-icon :size="menu.size || 15">
                <component :is="menu.icon" />
              </el-icon>
            </div>
            <div class="name">
              {{ menu.name || '' }}
            </div>
            <div
              v-if="menu.tips"
              class="tips"
            >
              <span class="badge">{{ menu.tips }}</span>
            </div>
          </div>
        </router-link>
      </el-aside>
      <el-main class="router-view">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.section {
  height: 100%;

  .el-aside {
    width: 220px;
    padding: 3px 8px 8px;
    border-right: 1px solid var(--el-border-color);

    a {
      text-decoration: none;
      color: rgba(0, 0, 0, 0.65);
    }

    .menu {
      height: 35px;
      padding: 0 5px;
      font-size: 14px;
      border-radius: 5px;
      margin: 8px 2px;
      display: flex;
      align-items: center;
      color: rgb(38, 38, 38);
      cursor: pointer;

      > div {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .icon {
        width: 30px;
      }

      .name {
        flex: auto;
        justify-content: flex-start;
        padding-left: 5px;
      }

      .tips {
        width: 30px;
      }

      &:hover,
      &.selectd {
        background-color: #ececec;
        color: #1f2329;
        font-weight: 400;
      }
    }
  }
}
</style>
