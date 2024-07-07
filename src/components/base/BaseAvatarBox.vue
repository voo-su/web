<script lang="ts" setup>
import { defAvatar } from '@/constants/default'

const props = defineProps({
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
  },
  size: {
    type: Number,
    default: 40
  },
  viewer: {
    type: Boolean,
    default: false
  }
})

const substring = (value: any) => value.substring(0, 1).toLocaleUpperCase()
</script>

<template>
  <div
    v-if="avatar"
    class="avatar-box"
  >
    <el-image
      v-if="props.viewer"
      :src="avatar"
      :preview-src-list="[avatar]"
    />
    <el-avatar
      v-else
      :size="props.size"
      :src="avatar || defAvatar"
    />
  </div>
  <div
    v-else
    class="avatar-box avatar-empty"
  >
    <span>
      {{ props.name.length >= 1 ? substring(props.name) + substring(props.surname) : substring(props.username) }}
    </span>
  </div>
</template>

<style lang="scss" scoped>
.avatar-box {
  height: 34px;
  width: 34px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: white;
  user-select: none;
  transition: ease 1s;
  position: relative;
  overflow: hidden;

  &.avatar-empty {
    background-color: #2F80ED;
  }
}
</style>
