<script lang="ts" setup>
// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import { ref } from 'vue'
import { Close as CloseIcon } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  id: {
    type: Number,
    default: 0
  },
  title: {
    type: String,
    default: () => ''
  },
  menus: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close'])

const isShowBox = ref<boolean>(true)
const tabIndex = ref<number>(0)

const onClose = () => {
  emit('close')
}
</script>

<template>
  <el-dialog
    v-model="isShowBox"
    :before-close="onClose"
    :show-close="false"
  >
    <template #header="{ close, titleId, titleClass }">
      <h4
        :id="titleId"
        :class="titleClass"
      >
        {{ title }}
      </h4>
      <div class="module__after">
        <el-button
          type="info"
          class="close"
          link
          :icon="CloseIcon"
          @click="close"
        />
      </div>
    </template>
    <el-container>
      <el-aside>
        <el-menu
          default-active="0"
          mode="vertical"
        >
          <el-menu-item
            v-for="(menu, index) in menus"
            :index="String(index)"
            @click="tabIndex = index"
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
      </el-aside>
      <el-main>
        <component
          :is="menus[tabIndex].component"
          :id="id"
          @close="onClose"
        />
      </el-main>
    </el-container>
  </el-dialog>
</template>

<style lang="scss" scoped>
.el-aside {
  width: 250px;
  border-right: solid 1px var(--el-border-color);

  .el-menu {
    border-right: none;

    .left {
      margin-left: auto;
    }

    & > .el-menu-item.is-active {
      border-right: 2px solid #2196f3;
      background-color: rgb(0 0 0 / 4%);
    }
  }
}
</style>
