<script lang="ts" setup>
import { computed, inject, nextTick, onMounted, reactive, ref } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
import { useMessageStore } from '@/store/message'
import { useChatStore } from '@/store'
import { ElInput, ElMessageBox } from 'element-plus'
import {
  Bell,
  CirclePlus,
  Delete as IconDelete,
  Operation as IconOperation,
  Message,
  MuteNotification,
  Postcard,
  Search,
} from '@element-plus/icons-vue'
import ChatItem from './ChatItem.vue'
import { clearUnreadChatApi, topChatApi } from '@/api/chat'
import {
  findChat,
  findChatIndex,
  getCacheIndexName,
  onChatDelete,
  onChatRemove,
  onSetDisturb
} from '@/utils/chat'
import ContextMenu from '@/components/base/BaseContextMenu.vue'
import { renderIcon } from '@/utils/functions'
import GroupLaunch from '@/components/chat/GroupLaunch.vue'
import IconPin from '@/components/icons/IconPin.vue'
import IconUnpin from '@/components/icons/IconUnpin.vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { secedeGroupApi } from '@/api/group-chat'

const { t } = useI18n()
const user: any = inject('$user')
const messageStore = useMessageStore()
const chatStore = useChatStore()

const isShowCreateGroupBox = ref<boolean>(false)
const searchKeyword = ref<string>('')

const state = reactive<any>({
  dropdown: {
    options: [],
    show: false,
    dropdownX: 0,
    dropdownY: 0,
    item: {}
  }
})

const topItems = computed(() => chatStore.getTopItems)
const unreadNum = computed(() => chatStore.getUnreadNum)
const loadStatus = computed(() => chatStore.loadStatus)
const indexName = computed(() => messageStore.index_name)

const items: any = computed(() => {
  if (searchKeyword.value.length === 0) {
    return chatStore.getItems
  }

  return chatStore.getItems.filter((item: any) => {
    let keyword = item.username + ' ' + item.name + ' ' + item.surname
    return (
      keyword.toLowerCase().indexOf(searchKeyword.value.toLowerCase()) != -1
    )
  })
})

const onTabChat = (data: any, follow: boolean = false) => {
  if (data.index_name === indexName.value) {
    return
  }

  searchKeyword.value = ''
  messageStore.setMessage(data)
  if (data.unread_num > 0) {
    clearUnreadChatApi({
      chat_type: data.chat_type,
      receiver_id: data.receiver_id
    }).then(() => {
      chatStore.updateItem({
        index_name: data.index_name,
        unread_num: 0
      })
    })
  }

  if (follow) {
    setTimeout(() => {
      let el = document.getElementById('chat-session-list')
      if (el) {
        let index = findChatIndex(data.index_name)
        el.scrollTo({
          top: index * 66 + index * 5,
          behavior: 'smooth'
        })
      }
    }, 100)
  }
}

const onUserInfo = (data: any) => {
  user(data.receiver_id)
}

const onToChatTop = (data: any) => {
  if (data.is_top == 0 && topItems.value.length >= 4) {
    return ElMessage.info(t('maxChatsSelected'))
  }
  topChatApi({
    list_id: data.id,
    type: data.is_top == 0 ? 1 : 2
  }).then(({ code, message }: any) => {
    if (code == 200) {
      chatStore.updateItem({
        index_name: data.index_name,
        is_top: data.is_top == 0 ? 1 : 0
      })
    } else {
      ElMessage.error(message)
    }
  })
}

const onSignOutGroup = (data: any) => {
  ElMessageBox.confirm(
    t('confirmLeaveGroup'),
    t('leaveGroup'),
    {
      confirmButtonText: t('logout'),
      cancelButtonText: t('cancelAction'),
      type: 'warning'
    }
  )
    .then(() => {
      secedeGroupApi({
        group_id: data.receiver_id
      }).then(({ code, message }: any) => {
        if (code == 200) {
          ElMessage.success(t('groupLeftSuccess'))
          onChatDelete(data.index_name)
        } else {
          ElMessage.error(message)
        }
      })
    })
    .catch(() => {})
}

const onContextMenu = (e: any, item: any) => {
  state.dropdown.show = false
  state.dropdown.item = Object.assign({}, item)
  state.dropdown.options = []
  if (item.chat_type == 1) {
    state.dropdown.options.push({
      icon: renderIcon(Postcard),
      label: t('info'),
      key: 'info'
    })
  }
  state.dropdown.options.push({
    icon: renderIcon(item.is_disturb ? Bell : MuteNotification),
    label: item.is_disturb ? t('enableNotifications') : t('disableNotifications'),
    key: 'disturb'
  })
  // TODO
  // state.dropdown.options.push({
  //   icon: renderIcon(item.is_top ? IconUnpin : IconPin),
  //   label: item.is_top ? t('unpin') : t('pin'),
  //   key: 'top'
  // })
  state.dropdown.options.push({
    icon: renderIcon(IconDelete),
    label: t('deleteChat'),
    key: 'remove'
  })

  if (item.chat_type != 1) {
    state.dropdown.options.push({
      icon: renderIcon(IconOperation),
      label: t('leaveGroup'),
      key: 'signout_group'
    })
  }

  nextTick(() => {
    state.dropdown.show = true
    state.dropdown.dropdownX = e.clientX
    state.dropdown.dropdownY = e.clientY
  })

  e.preventDefault()
}

const onContextMenuHandle = (key: string) => {
  const events: any = {
    info: onUserInfo,
    disturb: onSetDisturb,
    remove: onChatRemove,
    top: onToChatTop,
    signout_group: onSignOutGroup
  }
  state.dropdown.show = false
  events[key] && events[key](state.dropdown.item)
}

const onReload = () => chatStore.loadList()

const onGroupCallBack = (data: any) => {
  onReload()
}

const onInitialize = () => {
  let index_name = getCacheIndexName()
  index_name && onTabChat(findChat(index_name), true)
}

const onClickCreateGroup = () => {
  isShowCreateGroupBox.value = true
}

onBeforeRouteUpdate(onInitialize)
onMounted(() => {
  onInitialize()
})
</script>

<template>
  <el-container class="is-vertical h-100 chat-sider">
    <el-header class="header">
      <el-input
        v-model.trim="searchKeyword"
        :placeholder="t('search')"
        :prefix-icon="Search"
      />
      <div class="menu">
        <div
          class="item"
          @click="onClickCreateGroup()"
        >
          <el-icon :size="24">
            <circle-plus />
          </el-icon>
        </div>
      </div>
    </el-header>
    <el-main
      id="chat-session-list"
      class="scrollbar"
    >
      <template v-if="loadStatus === 2">
        <div
          v-for="i in 10"
          :key="i"
          class="skeleton flex-center"
        >
          <el-skeleton />
        </div>
      </template>
      <template v-if="loadStatus === 3">
        <chat-item
          v-for="item in items"
          :key="item.index_name"
          :active="item.index_name === indexName"
          :data="item"
          @tab-chat="onTabChat"
          @contextmenu.prevent="onContextMenu($event, item)"
        />
        <div
          v-show="items.length === 0"
          class="empty-list"
        >
          <p>{{ t('noChats') }}</p>
        </div>
      </template>
      <el-empty
        v-if="loadStatus === 4"
        :description="t('dataLoadingError')"
      >
        <template #image>
          <div class="empty-image">
            <message />
          </div>
        </template>
        <el-button
          type="primary"
          text
          bg
          @click="onReload"
        >
          {{ t('refresh') }}
        </el-button>
      </el-empty>
      <context-menu
        v-if="state.dropdown.show"
        :x="state.dropdown.dropdownX - 300"
        :y="state.dropdown.dropdownY - 50"
        :options="state.dropdown.options"
        @select="onContextMenuHandle"
        @click-outside="() => {
          state.dropdown.show = false
          state.dropdown.item = {}
        }"
      />
    </el-main>
  </el-container>
  <group-launch
    v-model="isShowCreateGroupBox"
    @close="isShowCreateGroupBox = false"
    @on-submit="onGroupCallBack"
  />
</template>

<style lang="scss" scoped>
.scrollbar {
  &::-webkit-scrollbar {
    background-color: unset;
  }
}

.empty-image {
  height: 5em;
}

.chat-sider {
  background: #FFFFFF;
  border-radius: 16px;
}

.header {
  display: flex;
  height: 60px;
  padding: 12px;
  border-bottom: 1px solid var(--el-border-color);

  .el-input {
    height: 36px;
  }

  .menu {
    margin-left: 8px;
    padding-top: 6px;

    .item {
      cursor: pointer;
      height: 24px;
      width: 24px;
      color: #8f959e;
      opacity: 0.5;
      -webkit-transition: opacity 0.3s;
      transition: opacity 0.3s;

      &:hover {
        opacity: 1;
      }
    }

  }

}

.notify-header {
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 10px;

  &.shadow {
    box-shadow: 0 2px 6px 0 rgb(31 35 41 / 5%);
  }

}

.skeleton {
  padding: 5px 10px;
  margin: 8px 0;

  .avatar {
    width: 50px;
  }

  .content {
    flex: auto;
  }
}

.empty-list {
  margin-top: 30%;
  width: 100%;
  text-align: center;

  p {
    color: #ccc;
    font-size: 14px;
    font-weight: 300;
  }
}
</style>
