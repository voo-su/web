<script lang="ts" setup>
// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import { useUserStore } from '@/store/user'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const emit = defineEmits(['onClick'])

const userStore = useUserStore()
</script>

<template>
  <section>
    <h3 class="title">
      {{ t('security') }}
    </h3>
    <div class="view-box">
      <div class="info-item">
        <div class="content">
          <div class="name">
            {{ t('username') }}
          </div>
          <div class="description">
            {{ userStore.username }}
          </div>
        </div>
        <div class="tools">
          <el-button
            link
            type="primary"
            @click="emit('onClick', 'username')"
          >
            {{ t('edit') }}
          </el-button>
        </div>
      </div>
      <div class="info-item">
        <div class="content">
          <div class="name">
            {{ t('email') }}
          </div>
          <div class="description">
            {{ userStore.email }}
          </div>
        </div>
        <div class="tools">
          <el-button
            link
            type="primary"
            @click="emit('onClick', 'email')"
          >
            {{ t('edit') }}
          </el-button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
