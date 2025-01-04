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
import { useI18n } from 'vue-i18n'

const props = defineProps({
  id: {
    type: Number,
    default: 0
  }
})
const emit = defineEmits(['close'])

const { t } = useI18n()
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
      ElMessage.success(t('successfullyDeleted') )
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

const onUserInfo = (item: any) => user(item.user_id)

const onAssignAdmin = (item: any) => {
  ElMessageBox.confirm(
    item.leader == 0
      ? t('confirmAssignAdmin', { username:item.username })
      : t('confirmRemoveAdmin', { username:item.username }),
    '',
    {
    confirmButtonText: t('assignAdminRights'),
    cancelButtonText: t('cancelAction'),
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
            ElMessage.success(t('success'))
            onLoadData()
          } else {
            ElMessage.error(message)
          }
        })
    }).catch(() => {})
}

const onContextMenu = (e: any, item: any) => {
  if (batchDelete.value == true || item.leader == 2) {
    return
  }
  dropdown.show = false
  dropdown.item = Object.assign({}, item)
  dropdown.options = [
    {
      label: t('info'),
      icon: renderIcon(Postcard),
      key: 'info'
    }

  ]

  if (isAdmin.value) {
    if (item.leader == 1) {
      dropdown.options.push({
        label: t('removeAdminRights'),
        icon: renderIcon(UnlockIcon),
        key: 'assignment'
      })
    } else if (item.leader == 0) {
      dropdown.options.push({
        label: t('assignAdminRights'),
        icon: renderIcon(LockIcon),
        key: 'assignment'
      })
    }

    dropdown.options.push({
      label: t('leaveGroup'),
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
  }
  dropdown.show = false
  events[key] && events[key](dropdown.item)
}

onLoadData()
</script>

<template>
  <el-container class="section is-vertical h-100">
    <el-header class="header ">
      <p>{{ t('groupParticipants') }} ({{ filterSearch.length }})</p>
      <div>
        <el-space>
          <el-input
            v-model="keywords"
            :prefix-icon="Search"
            :placeholder="t('search')"
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
        {{ t('nothingFound') }}
      </div>
      <div
        v-else
        v-for="member in filterSearch"
        :key="member.user_id"
        class="item-card"
      >
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
              {{ t('owner') }}
            </span>
            <span
              v-show="member.leader == 1"
              class="member-type"
            >
              {{ t('admin') }}
            </span>
          </div>
        </div>
      </div>
    </el-main>
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
