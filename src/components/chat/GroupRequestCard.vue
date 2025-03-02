<script lang="ts" setup>
import { AVATAR_ICON } from '@/constants/default'
import { Plus, Share } from '@element-plus/icons-vue'

defineProps({
  avatar: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  about: {
    type: String,
    default: ''
  },
  isMember: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['chat', 'join'])
</script>

<template>
  <div class="items-box">
    <div class="left-item">
      <div
        v-if="avatar"
        class="avatar flex-center"
      >
        <el-avatar
          :size="40"
          :src="avatar || AVATAR_ICON"
        />
      </div>
      <div
        v-else
        class="avatar flex-center"
      >
        {{ name.substring(0, 1) }}
      </div>
    </div>
    <div class="right-item">
      <div class="name">
        <span class="text-ellipsis">
          {{ name || '-' }}
        </span>
      </div>
      <!--      <div class="flags text-ellipsis">-->
      <!--        {{ about }}-->
      <!--      </div>-->
      <div class="helper">
        <div class="tool">
          <el-icon @click.stop="emit(isMember ? 'chat' : 'join')">
            <component :is="isMember ? Share : Plus" />
          </el-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.items-box {
  display: flex;
  min-width: 220px;
  min-height: 100px;
  border: 1px solid var(--el-border-color);
  padding: 10px;
  box-sizing: border-box;
  border-radius: 10px;

  .left-item {
    width: 50px;
    flex-shrink: 0;

    .avatar {
      width: 40px;
      height: 40px;
      font-size: 16px;
      color: #ffffff;
      background-color: #2F80ED;
      border-radius: 50%;
    }
  }

  .right-item {
    width: 100%;
    min-height: 40px;
    overflow: hidden;

    .name {
      width: 100%;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      overflow: hidden;
    }

    .flags {
      width: 100%;
      height: 20px;
      font-size: 12px;
      color: #8f959e;
    }

    .tool {
      padding-top: 3px;

      &.disable {
        color: #d6d6d6;
        cursor: not-allowed;
      }
    }
  }
}
</style>
