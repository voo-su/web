<script lang="ts" setup>
// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import AvatarBox from '@/components/base/BaseAvatarBox.vue'

defineProps({
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
  gender: {
    type: Number,
    default: 0
  },
  about: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['to-chat'])
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
    <div class="right-item">
      <div class="username">
        <span class="text-ellipsis">
          {{ username }}
        </span>
        <!--        <div v-if="gender > 0">-->
        <!--          <el-icon v-if="gender == 2">-->
        <!--            <female />-->
        <!--          </el-icon>-->
        <!--          <el-icon v-else>-->
        <!--            <male />-->
        <!--          </el-icon>-->
        <!--        </div>-->
      </div>
      <div
        v-if="name || surname"
        class="flags text-ellipsis"
      >
        {{ name + ' ' + surname }}
      </div>
      <!--      <div class="helper">-->
      <!--        <div class="tool">-->
      <!--          <el-icon @click.stop="emit('to-chat')">-->
      <!--            <share />-->
      <!--          </el-icon>-->
      <!--        </div>-->
      <!--      </div>-->
    </div>
  </div>
</template>

<style lang="scss" scoped>
.item-card {
  display: flex;
  width: 100%;
  min-height: 50px;
  padding: 10px;
  box-sizing: border-box;
  cursor: pointer;
  border-radius: 10px;

  .left-item {
    width: 50px;
    flex-shrink: 0;
  }

  .right-item {
    width: 100%;
    min-height: 40px;
    overflow: hidden;

    .username {
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

    //.helper {
    //  height: 30px;
    //  display: flex;
    //  align-items: center;
    //  justify-content: space-between;
    //  margin-top: 5px;
    //
    //  .tool {
    //    &.disable {
    //      color: #d6d6d6;
    //      cursor: not-allowed;
    //    }
    //
    //    padding-top: 3px;
    //  }
    //}
  }

  &:hover {
    background-color: #ececec;
  }

}
</style>
