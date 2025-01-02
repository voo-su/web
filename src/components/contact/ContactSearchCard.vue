<script lang="ts" setup>
// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import { inject } from 'vue'
import AvatarBox from '@/components/base/BaseAvatarBox.vue'

const user: any = inject('$user')

defineProps({
  id: {
    type: Number,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  username: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  surname: {
    type: String,
    default: ''
  }
})

const onUserCardModal = (id: number) => user(id)
</script>

<template>
  <div class="item-card">
    <div class="left-item">
      <avatar-box
        :avatar="avatar"
        :username="username"
        :name="name"
        :surname="surname"
      />
    </div>
    <div
      class="content"
      @click="onUserCardModal(id)"
    >
      <div class="username">
        <span>{{ username }}</span>
      </div>
      <div class="name">
        {{ name }} {{ surname }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.item-card {
  display: flex;
  width: 100%;
  min-height: 50px;
  border-bottom: 1px solid var(--el-border-color);
  padding: 10px;
  box-sizing: border-box;

  .left-item {
    width: 50px;
    flex-shrink: 0;
  }

  .content {
    height: inherit;
    width: 100%;
    cursor: pointer;

    .username {
      height: 25px;
      line-height: 25px;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .name {
      height: 25px;
      line-height: 25px;
      font-size: 12px;
      color: #9a9292;
      overflow: hidden;
      width: inherit;
    }
  }
}
</style>
