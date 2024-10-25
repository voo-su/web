<script lang="ts" setup>
import { computed, inject, nextTick, reactive, ref } from 'vue'
import {
  Lock as LockIcon,
  Plus,
  Postcard,
  Remove as RemoveIcon,
  Search,
  Unlock as UnlockIcon
} from '@element-plus/icons-vue'
import GroupLaunch from '../GroupLaunch.vue'
import { useUserStore } from '@/store/user'
import AvatarBox from '@/components/base/BaseAvatarBox.vue'
import ContextMenu from '@/components/base/BaseContextMenu.vue'
import { ElMessageBox } from 'element-plus'
import { ElDialog } from 'element-plus'
import { ElMessage } from 'element-plus'

import {
  getGroupMembersApi,
  groupAssignAdminApi,
  groupHandoverApi,
  groupNoSpeakApi,
  removeMembersGroupApi
} from '@/api/group-chat'
import { renderIcon } from '@/utils/functions'

const props = defineProps({
  id: {
    type: Number,
    default: 0
  }
})
const emit = defineEmits(['close'])

const user: any = inject('$user')

const userStore = useUserStore()
const isGroupLaunch = ref<boolean>(false)
const keywords = ref<string>('')
const batchDelete = ref<boolean>(false)
const items = ref<any>([])

const filterCheck = computed(() => {
  return items.value.filter((item: any) => item.is_delete)
})

const filterSearch: any = computed(() => {
  if (!keywords.value.length) {
    return items.value
  }
  return items.value.filter((item: any) => {
    return (
      item.username.match(keywords.value) != null /*||
      item.user_card.match(keywords.value) != null*/
    )
  })
})

const isAdmin = computed(() => {
  return items.value.some((item: any) => {
    return item.user_id == userStore.uid && item.leader == 2
  })
})

const dropdown = reactive<any>({
  options: [],
  show: false,
  dropdownX: 0,
  dropdownY: 0,
  item: {}
})

const onLoadData = () => {
  getGroupMembersApi({ group_id: props.id })
    .then((res: any) => {
      if (res.code == 200) {
        let data = res.data.items || []
        data.forEach((item: any) => {
          item.is_delete = false
        })
        items.value = data
      }
    })
}

const onDelete = (item: any) => {
  removeMembersGroupApi({
    group_id: props.id,
    members_ids: `${item.user_id}`
  }).then((res: any) => {
    if (res.code == 200) {
      onLoadData()
      ElMessage.success('Успешно удален')
    }
  })
}

const onBatchDelete = () => {
  if (!filterCheck.value.length) {
    return
  }

  removeMembersGroupApi({
    group_id: props.id,
    members_ids: filterCheck.value.map((item: any) => item.user_id).join(',')
  }).then((res: any) => {
    if (res.code == 200) {
      batchDelete.value = false
      onLoadData()
      ElMessage.success('Успешно удален')
    }
  })
}

const onRowClick = (item: any) => {
  if (batchDelete.value == true) {
    if (item.leader < 2) {
      item.is_delete = !item.is_delete
    }
  } else {
    user(item.user_id)

  }
}

const onCancelDelete = () => {
  items.value.forEach((item: any) => {
    item.is_delete = false
  })
  batchDelete.value = false
}

const onUserInfo = (item: any) => user(item.user_id)

const onAssignAdmin = (item: any) => {
  let title = item.leader == 0
    ? `Вы уверены, что хотите назначить ${item.username} администратором ?`
    : `Вы уверены, что хотите снять администраторские права с ${item.username} ?`
  ElMessageBox.confirm(title, '', {
    confirmButtonText: 'Назначить',
    cancelButtonText: 'Отмена',
    type: 'warning'
  })
    .then(() => {
      groupAssignAdminApi({
        mode: item.leader == 0 ? 1 : 2,
        group_id: props.id,
        user_id: parseInt(item.user_id)
      })
        .then((res: any) => {
          const { code, message } = res
          if (code == 200) {
            ElMessage.success('Успешно')
            onLoadData()
          } else {
            ElMessage.error(message)
          }
        })
    }).catch(() => {})
}

const onTransfer = (item: any) => {
  ElDialog.create({
    title: 'Подсказка',
    content: `Вы уверены, что хотите передать права группы пользователю ${item.username} ?`,
    positiveText: 'Ок',
    negativeText: 'Отмена',
    onPositiveClick: () => {
      groupHandoverApi({
        group_id: props.id,
        user_id: parseInt(item.user_id)
      }).then((res: any) => {
        if (res.code == 200) {
          ElMessage.success('Операция выполнена успешно')
          onLoadData()
        } else {
          ElMessage.error(res.message)
        }
      })
    }
  })
}

const onForbidden = (item: any) => {
  let content = `Вы уверены, что хотите запретить говорить пользователю ${item.username} ?`
  if (item.is_mute === 1) {
    content = `Вы уверены, что хотите снять запрет на говорение у пользователя ${item.username} ?`
  }
  ElDialog.create({
    title: 'Советы',
    content: content,
    positiveText: 'Ок',
    negativeText: 'Отмена',
    onPositiveClick: () => {
      groupNoSpeakApi({
        mode: item.is_mute == 0 ? 1 : 2,
        group_id: props.id,
        user_id: parseInt(item.user_id)
      }).then((res: any) => {
        if (res.code == 200) {
          ElMessage.success('Операция выполнена успешно')
          onLoadData()
        } else {
          ElMessage.error(res.message)
        }
      })
    }
  })
}

const onContextMenu = (e: any, item: any) => {
  if (batchDelete.value == true || item.leader == 2) {
    return
  }
  dropdown.show = false
  dropdown.item = Object.assign({}, item)
  dropdown.options = [
    {
      label: 'Информация',
      icon: renderIcon(Postcard),
      key: 'info'
    }

    // {
    //   label: item.is_mute ? 'Разрешить говорить' : 'Запретить говорить',
    //   key: 'forbidden'
    // },
    // {
    //   label: 'Удалить',
    //   key: 'batch_delete'
    // }
  ]

  if (isAdmin.value) {
    if (item.leader == 1) {
      dropdown.options.push({
        label: 'Снять права админа',
        icon: renderIcon(UnlockIcon),
        key: 'assignment'
      })
    } else if (item.leader == 0) {
      dropdown.options.push({
        label: 'Назначить права админа',
        icon: renderIcon(LockIcon),
        key: 'assignment'
      })
    }

    //   dropdown.options.push({
    //     label: 'Передать права группы',
    //     key: 'transfer'
    //   })

    dropdown.options.push({
      label: 'Удалить из группы',
      icon: renderIcon(RemoveIcon),
      key: 'delete'
    })
  }

  nextTick(() => {
    dropdown.show = true
    dropdown.dropdownX = e.clientX
    dropdown.dropdownY = e.clientY
  })

  e.preventDefault()
}

const onContextMenuHandle = (key: string) => {
  const events: any = {
    info: onUserInfo,
    delete: onDelete,
    assignment: onAssignAdmin
    // transfer: onTransfer,
    // forbidden: onForbidden,
    // batch_delete: (data: any) => {
    //   batchDelete.value = true
    // }
  }
  dropdown.show = false
  events[key] && events[key](dropdown.item)
}

onLoadData()
</script>

<template>
  <el-container class="section is-vertical h-100">
    <el-header class="header ">
      <p>Участники ({{ filterSearch.length }})</p>
      <div>
        <el-space>
          <el-input
            v-model="keywords"
            :prefix-icon="Search"
            placeholder="Поиск"
          />
          <el-button
            :icon="Plus"
            @click="isGroupLaunch = true"
          />
        </el-space>
      </div>
    </el-header>
    <el-main class="items scrollbar">
      <div
        v-if="filterSearch.length === 0"
        class="empty"
      >
        Ничего не найдено.
      </div>
      <div
        v-else
        v-for="member in filterSearch"
        :key="member.user_id"
        class="item-card"
      >
        <!--        <div-->
        <!--          v-show="batchDelete"-->
        <!--          class="flex-center"-->
        <!--        >-->
        <!--          <el-checkbox-->
        <!--            v-show="member.leader < 2"-->
        <!--            :checked="member.is_delete"-->
        <!--            size="small"-->
        <!--          />-->
        <!--        </div>-->
        <!--        <div-->
        <!--          class="avatar"-->
        <!--          @click="onUserInfo(member)"-->
        <!--        >-->
        <!--          <el-avatar-->
        <!--            :size="30"-->
        <!--            :src="member.avatar || defAvatar"-->
        <!--          />-->
        <!--        </div>-->
        <div class="left-item">
          <avatar-box
            :avatar="member.avatar"
            :username="member.username"
            :name="member.name"
            :surname="member.surname"
          />
        </div>
        <div
          class="right-item"
          @click="onRowClick(member)"
          @contextmenu.prevent="onContextMenu($event, member)"
        >
          <div class="item-title">
            <p class="username text-ellipsis">
              <span>{{ member.username }}</span>
              <!--<span v-show="member.user_card"> ({{ member.user_card }})</span>-->
            </p>
            <span
              v-if="member.leader === 2"
              class="member-type"
            >
              Владелец
            </span>
            <span
              v-show="member.leader == 1"
              class="member-type"
            >
              Админ
            </span>
            <!--              <span-->
            <!--                v-show="member.is_mute == 1"-->
            <!--                class="badge"-->
            <!--              >Запрещено говорить</span>-->
          </div>

          <!--          <div class="tool">-->
          <!--            <el-button-->
          <!--              :icon="MoreIcon"-->
          <!--              link-->
          <!--            />-->
          <!--          </div>-->
          <!--          <div class="item-text text-ellipsis">-->
          <!--            {{ member.about }}-->
          <!--          </div>-->
        </div>
      </div>
    </el-main>
    <!--    <el-footer-->
    <!--      v-show="batchDelete"-->
    <!--    >-->
    <!--      <div class="tips">-->
    <!--        Выбрано ({{ filterCheck.length }})-->
    <!--      </div>-->
    <!--      <div>-->
    <!--        <el-space>-->
    <!--          <el-button-->
    <!--            size="small"-->
    <!--            type="primary"-->
    <!--            @click="onCancelDelete"-->
    <!--          >-->
    <!--            Отмена-->
    <!--          </el-button>-->
    <!--          <el-button-->
    <!--            size="small"-->
    <!--            type="error"-->
    <!--            @click="onBatchDelete"-->
    <!--          >-->
    <!--            Массовое удаление-->
    <!--          </el-button>-->
    <!--        </el-space>-->
    <!--      </div>-->
    <!--    </el-footer>-->
  </el-container>
  <context-menu
    v-if="dropdown.show"
    :x="dropdown.dropdownX - 500"
    :y="dropdown.dropdownY - 50"
    :options="dropdown.options"
    @select="onContextMenuHandle"
    @click-outside="() => {
      dropdown.show = false
      dropdown.item = {}
    }"
  />
  <group-launch
    v-model="isGroupLaunch"
    :gid="id"
    @close="isGroupLaunch = false"
    @on-invite="onLoadData"
  />
</template>

<style lang="scss" scoped>
.header {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid var(--el-border-color);
}

.el-main {
  height: 406px;
}

.items {
  padding: 5px;

  .item-card {
    display: flex;
    width: 100%;
    min-height: 50px;
    padding: 10px;
    box-sizing: border-box;
    cursor: pointer;
    border-radius: 10px;

    &:hover {
      background-color: #ececec;
    }

    .left-item {
      flex-shrink: 0;
    }

    .right-item {
      display: flex;
      width: 100%;
      margin-left: 10px;

      .item-title {
        height: 28px;
        width: inherit;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-weight: 400;
      }

      .tool {
        margin: 0 0 0 10px;
        transform: rotate(90deg);
      }
    }
  }
}
</style>
