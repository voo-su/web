<script lang="ts" setup>
import { useUserStore } from '@/store/user'

const emit = defineEmits(['onClick'])

const userStore = useUserStore()
</script>

<template>
  <section>
    <h3 class="title">
      Безопасность
    </h3>
    <div class="view-box">
      <div class="info-item">
        <div class="content">
          <div class="name">
            Имя пользователя
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
            Изменить
          </el-button>
        </div>
      </div>
      <div class="info-item">
        <div class="content">
          <div class="name">
            Почта
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
            Изменить
          </el-button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
