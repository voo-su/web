<script lang="ts" setup>
import type { PropType } from 'vue'
import AvatarBox from '@/components/base/BaseAvatarBox.vue'
import type { IMemberItem } from '@/components/project/types'

const props = defineProps({
  members: {
    type: Object as PropType<IMemberItem[]>,
    default: {}
  }
})
</script>

<template>
  <div class="members scrollbar">
    <div
      v-for="(item, index) in members"
      :key="index"
      class="member-item"
    >
      <div class="left-item">
        <avatar-box
          :avatar="item.avatar"
          :username="item.username"
          :name="item.name"
          :surname="item.surname"
        />
      </div>
      <div class="content">
        <span class="name text-ellipsis">{{ item.name + ' ' + item.surname }}</span>
        <span class="username text-ellipsis">{{ '@' + item.username }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.members {
  width: 100%;

  .member-item {
    height: 50px;
    display: flex;
    align-items: center;
    margin: 5px;

    .left-item {
      position: relative;
    }

    .content {
      height: 34px;
      display: flex;
      flex-direction: column;
      margin-left: 10px;

        .name {
          color: #1f2329;
          font-size: 14px;
          //line-height: 20px;
          //font-weight: 600;
        }

        .username {
          color: #1f2329;
          font-size: 14px;
          //line-height: 20px;
          //font-weight: 600;
        }
    }
  }
}
</style>
