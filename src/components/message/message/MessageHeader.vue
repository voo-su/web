<script lang="ts" setup>
// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import { inject, nextTick, reactive } from 'vue'
import AvatarBox from '@/components/base/BaseAvatarBox.vue'
import {
  Bell as IconBell,
  Delete as IconDelete,
  MoreFilled,
  MuteNotification as IconMuteNotification,
  Postcard
} from '@element-plus/icons-vue'
import ContextMenu from '@/components/base/BaseContextMenu.vue'
import { renderIcon } from '@/utils/functions'
import { getName } from '@/utils/util'

const props = defineProps({
  data: Object
})
const emit = defineEmits(['event'])

const user: any = inject('$user')

const onInfo = (id: number) => {
  if (id !== 0) {
    if (props.data.type == 1) {
      user(id)
    }
    if (props.data.type != 1) {
      emit('event', 'group')
    }
  }
}

const state = reactive<any>({
  dropdown: {
    options: [],
    show: false,
    dropdownX: 0,
    dropdownY: 0,
    item: {}
  }
})

const onContextMenuMessage = (e: any) => {
  state.dropdown.show = false
  state.dropdown.options = []
  if (props.data.type == 1) {
    state.dropdown.options.push({
      icon: renderIcon(Postcard),
      label: 'Информация',
      key: 'info'
    })
  }
  if (props.data.type != 1) {
    state.dropdown.options.push({
      icon: renderIcon(Postcard),
      label: 'Информация о группе',
      key: 'group'
    })
    // menu.options.push({
    //   icon: renderIcon(Postcard),
    //   label: 'Объявление о группе',
    //   key: 'ads'
    // })
  }
  state.dropdown.options.push({
    icon: renderIcon((props.data.is_disturb == 0) ? IconBell : IconMuteNotification),
    label: (props.data.is_disturb == 0) ? 'Включить уведомления' : 'Выключить уведомления',
    key: 'disturb'
  })
  state.dropdown.options.push({
    icon: renderIcon(IconDelete),
    label: 'Удалить чат',
    key: 'remove'
  })

  nextTick(() => {
    state.dropdown.show = true
    state.dropdown.dropdownX = e.clientX
    state.dropdown.dropdownY = e.clientY
  })

  e.preventDefault()
}

const onEvent = (key: String) => {
  emit('event', key)
  state.dropdown.show = false
}
</script>

<template>
  <el-header class="box-header">
    <div
      class="module left-module"
      @click="onInfo(props.data.receiver_id)"
    >
      <avatar-box
        :avatar="props.data.avatar"
        :username="props.data.username"
        :name="props.data.name"
        :surname="props.data.surname"
      />
      <div
        v-if="props.data.is_bot === 1"
        class="content-box bot"
      >
        <span class="header-name">{{ props.data.name }} </span>
      </div>
      <div
        v-else
        class="content-box"
      >
        <div class="header">
          <span class="name">
            {{ getName({
              username: props.data.username ?? null,
              name: props.data.name ?? null,
              surname: props.data.surname ?? null
            }) }}
          </span>
        </div>
        <div class="content">
          <div class="text">
            <p
              v-show="props.data.keyboard"
              class="keyboard-status"
            >
              печатает...
            </p>
            <template v-if="props.data.type === 1 && !props.data.keyboard">
              <span
                v-if="props.data.online"
                class="online"
              >онлайн</span>
              <span v-else>был(а) недавно</span>
            </template>
            <span
              v-show="props.data.type === 2 && props.data.num"
              class="num"
            >{{ props.data.num }} участники</span>
          </div>
        </div>
      </div>
    </div>
    <div class="module right-module">
      <el-button
        :icon="MoreFilled"
        link
        type="info"
        class="icon"
        @click="onContextMenuMessage"
      />
      <context-menu
        v-if="state.dropdown.show"
        :options="state.dropdown.options"
        :x="state.dropdown.dropdownX - 160"
        :y="state.dropdown.dropdownY + 20"
        @select="onEvent"
        @click-outside="() => {
          state.dropdown.show = false
          state.dropdown.item = {}
        }"
      />
    </div>
  </el-header>
</template>

<style lang="scss" scoped>
.box-header {
  height: 60px;
  padding: 0 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  border-bottom: 1px solid var(--el-border-color);

  .module {
    height: 100%;
    display: flex;
    align-items: center;
  }

  .left-module {
    padding-right: 5px;
    width: 350px;
    cursor: pointer;

    .content-box {
      height: 40px;
      display: flex;
      align-content: center;
      flex-direction: column;
      flex: 1 1;
      margin-left: 10px;
      overflow: hidden;
      margin-top: 10px;

      &.bot {
        .header-name {
          width: 100%;
          margin-top: 7px;
          font-size: 15px;
          line-height: 1em;
        }
      }

      .header {
        width: 100%;
        height: 20px;
        display: flex;
        align-items: center;

        .name {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }

      .content {
        width: 100%;
        height: 15px;
        display: flex;
        align-items: center;

        .online {
          color: #2F80ED;
        }

        .text {
          font-weight: 300;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 12px;
          color: #8f959e;
          flex: 1 auto;
        }
      }
    }
  }

  .right-module {
    width: 200px;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    p {
      cursor: pointer;
      margin: 0 8px;
      font-size: 20px;
      color: #828f95;

      &:active i {
        font-size: 26px;
        transform: scale(1.3);
        transition: ease 0.5s;
        color: red;
      }
    }

    .icon {

      margin: 0 8px;
      font-size: 20px;
    }
  }
}

@keyframes inputfade {
  from {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  to {
    opacity: 1;
  }
}

@-webkit-keyframes inputfade {
  from {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  to {
    opacity: 1;
  }
}

@-webkit-keyframes antStatusProcessing {
  0% {
    -webkit-transform: scale(0.8);
    transform: scale(0.8);
    opacity: 0.5;
  }

  to {
    -webkit-transform: scale(2.4);
    transform: scale(2.4);
    opacity: 0;
  }
}

@keyframes antStatusProcessing {
  0% {
    -webkit-transform: scale(0.8);
    transform: scale(0.8);
    opacity: 0.5;
  }

  to {
    -webkit-transform: scale(2.4);
    transform: scale(2.4);
    opacity: 0;
  }
}

</style>
