<script lang="ts" setup>
// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import Xtime from '@/components/base/BaseXtime.vue'
import { MuteNotification } from '@element-plus/icons-vue'
import AvatarBox from '@/components/base/BaseAvatarBox.vue'
import { getName } from '@/utils/util'
import IconPin from '@/components/icons/IconPin.vue'

defineProps({
  data: {
    type: Object,
    default: () => {
    }
  },
  active: {
    type: Boolean,
    default: ''
  }
})

const emit = defineEmits(['tab-chat'])
</script>

<template>
  <div
    :class="{ actived: active }"
    class="dialog"
    @click="emit('tab-chat', data)"
  >
    <div class="left-module">
      <avatar-box
        :avatar="data.avatar"
        :username="data.username"
        :name="data.name"
        :surname="data.surname"
      />
      <span
        v-show="data.is_bot === 0 && data.dialog_type === 1 && data.is_online === 1"
        class="online"
        title="Онлайн"
      />
    </div>
    <div class="content-box">
      <div class="header">
        <div class="title">
          <span class="name">
            {{ getName({
              username: data.username ?? null,
              name: data.name ?? null,
              surname: data.surname ?? null
            }) }}
          </span>
          <span
            v-show="data.is_disturb"
            class="disturb"
          >
            <el-icon>
              <mute-notification />
            </el-icon>
          </span>
        </div>
        <div class="datetime">
          <xtime :time="data.updated_at" />
        </div>
      </div>
      <div class="content">
        <div class="text">
          <template v-if="!active && data.draft_text">
            <span class="draft">Черновик:</span>
            <span v-html="data.draft_text" />
          </template>
          <template v-else>
            <span v-html="data.msg_text" />
          </template>
        </div>
        <el-icon
          v-if="data.is_top === 1"
          class="pin"
        >
          <icon-pin />
        </el-icon>
        <div
          v-show="data.unread_num"
          class="unread-count"
        >
          {{ data.unread_num > 99 ? '+99' : data.unread_num }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dialog {
  padding: 4px 10px 4px 10px;
  height: 50px;
  display: flex;
  align-items: center;
  transition: 0.2s ease-in;
  cursor: pointer;
  border-radius: 10px;
  margin: 5px;

  .pin {
    margin-right: 5px;
  }

  .left-module {
    position: relative;

    .online {
      position: absolute;
      display: inline-block;
      width: 10px;
      height: 10px;
      right: 0;
      bottom: 2px;
      background: #ff1e1e;
      border-radius: 5px;
      animation: _notifymove 3s infinite;
      animation-direction: alternate;
      -webkit-animation: _notifymove 3s infinite;
    }
  }

  .content-box {
    height: 40px;
    display: flex;
    align-content: center;
    flex-direction: column;
    flex: 1 1;
    margin-left: 10px;
    overflow: hidden;

    .header {
      width: 100%;
      height: 20px;
      display: flex;
      align-items: center;

      .title {
        color: #1f2329;
        font-size: 14px;
        line-height: 20px;
        flex: 1 1;
        display: flex;
        overflow: hidden;

        .name {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-right: 3px;
        }
      }

      .datetime {
        color: #8f959e;
        font-size: 12px;
        margin-left: 10px;
        user-select: none;
      }
    }

    .content {
      width: 100%;
      height: 20px;
      display: flex;
      align-items: center;

      .text {
        font-weight: 300;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 12px;
        color: #8f959e;
        flex: 1 auto;

        .draft {
          color: red;
          padding-right: 3px;
        }
      }
    }
  }

  &:hover,
  &.actived {
    background-color: #ececec;
  }
}

.disturb {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
}
</style>
