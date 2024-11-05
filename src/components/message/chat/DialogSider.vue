<script lang="ts" setup>
import { computed, inject, nextTick, onMounted, reactive, ref } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
import { useDialogueStore } from '@/store/dialogue'
import { useDialogStore } from '@/store'
import { ElInput } from 'element-plus'
import {
  Bell,
  CirclePlus,
  Delete as IconDelete,
  Message,
  MuteNotification,
  Postcard,
  Search,
} from '@element-plus/icons-vue'
import DialogItem from './DialogItem.vue'
import { clearUnreadChatApi, topChatApi } from '@/api/chat'
import { findDialog, findDialogIndex, getCacheIndexName, onRemoveDialog, onSetDisturb } from '@/utils/chat'
import ContextMenu from '@/components/base/BaseContextMenu.vue'
import { renderIcon } from '@/utils/functions'
import GroupLaunch from '@/components/message/group/GroupLaunch.vue'
import IconPin from '@/components/icons/IconPin.vue'
import IconUnpin from '@/components/icons/IconUnpin.vue'
import { ElMessage, ElDialog } from 'element-plus'

const user: any = inject('$user')
const dialogueStore = useDialogueStore()
const dialogStore = useDialogStore()

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

const topItems = computed(() => dialogStore.topItems)
const unreadNum = computed(() => dialogStore.dialogUnreadNum)
const loadStatus = computed(() => dialogStore.loadStatus)
const indexName = computed(() => dialogueStore.index_name)

const items: any = computed(() => {
  if (searchKeyword.value.length === 0) {
    return dialogStore.dialogItems
  }
  return dialogStore.dialogItems.filter((item: any) => {
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
  dialogueStore.setDialogue(data)
  if (data.unread_num > 0) {
    clearUnreadChatApi({
      dialog_type: data.dialog_type,
      receiver_id: data.receiver_id
    }).then(() => {
      dialogStore.updateItem({
        index_name: data.index_name,
        unread_num: 0
      })
    })
  }
  if (follow) {
    setTimeout(() => {
      let el = document.getElementById('chat-session-list')
      if (el) {
        let index = findDialogIndex(data.index_name)
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

const onToTopDialog = (data: any) => {
  if (data.is_top == 0 && topItems.value.length >= 4) {
    return ElMessage.info('Максимальное количество выбранных бесед не может превышать 4')
  }
  topChatApi({
    list_id: data.id,
    type: data.is_top == 0 ? 1 : 2
  }).then((res: any) => {
    const { code, message } = res

    if (code == 200) {
      dialogStore.updateItem({
        index_name: data.index_name,
        is_top: data.is_top == 0 ? 1 : 0
      })
    } else {
      ElMessage.error(message)
    }
  })
}

// const onSignOutGroup = (data: any) => {
//   ElDialog.create({
//     showIcon: false,
//     title: `Выйти из группового чата ${data.name} ?`,
//     content: 'После выхода вы больше не будете получать сообщения от этой группы.',
//     positiveText: 'Ок',
//     negativeText: 'Отмена',
//     onPositiveClick: () => {
//       secedeGroupApi({
//         group_id: data.receiver_id
//       }).then((res: any) => {
//         const { code, message } = res
//         if (code == 200) {
//           ElMessage.success('Вы успешно вышли из группы')
//           onDeleteDialog(data.index_name)
//         } else {
//           ElMessage.error(message)
//         }
//       })
//     }
//   })
// }

// const onChangeRemark = (data: any) => {
//   let remark = ''
//   ElDialog.create({
//     showIcon: false,
//     title: 'Изменить заметку',
//     content: () => {
//       return h(ElInput, {
//         defaultValue: data.remark_name,
//         placeholder: 'Введите заметку',
//         style: { marginTop: '20px' },
//         onInput: (value: any) => (remark = value),
//         autofocus: true
//       })
//     },
//     negativeText: 'Отмена',
//     positiveText: 'Изменить заметку',
//     onPositiveClick: () => {
//       editContactRemarkApi({
//         friend_id: data.receiver_id,
//         remark: remark
//       }).then((res: any) => {
//         const { code, message } = res
//         if (code == 200) {
//           ElMessage.success('Заметка успешно изменена')
//           dialogStore.updateItem({
//             index_name: data.index_name,
//             remark_name: remark
//           })
//         } else {
//           ElMessage.error(message)
//         }
//       })
//     }
//   })
// }

const onContextMenuDialog = (e: any, item: any) => {
  state.dropdown.show = false
  state.dropdown.item = Object.assign({}, item)
  state.dropdown.options = []
  if (item.dialog_type == 1) {
    state.dropdown.options.push({
      icon: renderIcon(Postcard),
      label: 'Информация',
      key: 'info'
    })
  }
  state.dropdown.options.push({
    icon: renderIcon(item.is_disturb ? Bell : MuteNotification),
    label: item.is_disturb ? 'Включить уведомления' : 'Выключить уведомления',
    key: 'disturb'
  })
  state.dropdown.options.push({
    icon: renderIcon(item.is_top ? IconUnpin : IconPin),
    label: item.is_top ? 'Открепить' : 'Закрепить',
    key: 'top'
  })
  state.dropdown.options.push({
    icon: renderIcon(IconDelete),
    label: 'Удалить чат',
    key: 'remove'
  })
  // if (item.dialog_type != 1) {
  //   state.dropdown.options.push({
  //     icon: renderIcon(Operation),
  //     label: 'Покинуть группу',
  //     key: 'signout_group'
  //   })
  // }
  nextTick(() => {
    state.dropdown.show = true
    state.dropdown.dropdownX = e.clientX
    state.dropdown.dropdownY = e.clientY
  })

  e.preventDefault()
}

const onContextMenuDialogHandle = (key: string) => {
  const events: any = {
    info: onUserInfo,
    disturb: onSetDisturb,
    remove: onRemoveDialog,
    top: onToTopDialog,
    // signout_group: onSignOutGroup,
    // remark: onChangeRemark
  }
  state.dropdown.show = false
  events[key] && events[key](state.dropdown.item)
}

const onReload = () => {
  dialogStore.loadDialogList()
}

const onGroupCallBack = (data: any) => {
  onReload()
}

const onInitialize = () => {
  let index_name = getCacheIndexName()
  index_name && onTabChat(findDialog(index_name), true)
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
  <el-container class="is-vertical h-100 dialog-sider">
    <el-header class="header">
      <el-input
        v-model.trim="searchKeyword"
        placeholder="Поиск"
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
    <!--    <el-header-->
    <!--      v-show="loadStatus === 3 && topItems.length > 0"-->
    <!--      class="tops-header"-->
    <!--    >-->
    <!--      <el-tooltip-->
    <!--        v-for="item in topItems"-->
    <!--        :key="item.index_name"-->
    <!--        placement="bottom"-->
    <!--        trigger="hover"-->
    <!--      >-->
    <!--        <template #content>-->
    <!--          <span> {{ item.remark_name || item.name }} </span>-->
    <!--        </template>-->
    <!--        <div-->
    <!--          :class="{-->
    <!--            active: item.index_name == indexName,-->
    <!--          }"-->
    <!--          class="top-item"-->
    <!--          @click="onTabChat(item, true)"-->
    <!--        >-->
    <!--          <el-avatar-->
    <!--            v-if="item.avatar"-->
    <!--            :src="item.avatar || defAvatar"-->
    <!--          />-->
    <!--          <el-avatar v-else>-->
    <!--            {{ item.name && (item.name.substr(0, 1) || '') }}-->
    <!--          </el-avatar>-->
    <!--          <span class="text">{{ item.remark_name || item.name }}</span>-->
    <!--        </div>-->
    <!--      </el-tooltip>-->
    <!--    </el-header>-->
    <!--    <header-->
    <!--      v-show="loadStatus == 3 && dialogStore.dialogItems.length > 0"-->
    <!--      class="el-header notify-header"-->
    <!--    >-->
    <!--      <p>Запись сеанса({{ dialogStore.dialogItems.length }})</p>-->
    <!--      <p>-->
    <!--        <span-->
    <!--          v-show="unreadNum"-->
    <!--          class="unread-count"-->
    <!--        >{{ unreadNum }} не прочитано</span>-->
    <!--      </p>-->
    <!--    </header>-->
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
        <dialog-item
          v-for="item in items"
          :key="item.index_name"
          :active="item.index_name === indexName"
          :data="item"
          @tab-chat="onTabChat"
          @contextmenu.prevent="onContextMenuDialog($event, item)"
        />
        <div
          v-show="items.length === 0"
          class="empty-list"
        >
          <p>Нет диалогов</p>
        </div>
      </template>
      <el-empty
        v-if="loadStatus === 4"
        description="Ошибка загрузки данных, пожалуйста, попробуйте снова..."
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
          Обновить
        </el-button>
      </el-empty>
      <context-menu
        v-if="state.dropdown.show"
        :x="state.dropdown.dropdownX - 300"
        :y="state.dropdown.dropdownY - 50"
        :options="state.dropdown.options"
        @select="onContextMenuDialogHandle"
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

.dialog-sider {
  //border-right: 1px solid var(--el-border-color);
  background: #FFFFFF;
  border-radius: 16px;
  //padding: 10px;
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

//.tops-header {
//  padding: 5px 8px;
//  -webkit-justify-content: space-between;
//  -ms-flex-pack: justify;
//  justify-content: space-between;
//  grid-gap: 0 14px;
//  grid-template-columns: repeat(auto-fill, 32px);
//  display: grid;
//  box-sizing: border-box;
//
//  .top-item {
//    flex-basis: 46px;
//    flex-shrink: 0;
//    margin: 3px 2px 3px 2px;
//    display: flex;
//    flex-direction: column;
//    justify-content: space-between;
//    align-items: center;
//    position: relative;
//
//    &.active {
//      .text {
//        color: rgb(80 138 254);
//      }
//    }
//
//    .text {
//      display: inline-block;
//      height: 20px;
//      font-size: 12px;
//      color: #8f959e;
//      transform: scale(0.84);
//      text-align: center;
//      line-height: 20px;
//      word-break: break-all;
//      overflow: hidden;
//    }
//  }
//}

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
