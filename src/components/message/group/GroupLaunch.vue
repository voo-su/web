<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { Close as CloseIcon, Delete, Search } from '@element-plus/icons-vue'
import { defAvatar } from '@/constants/default.js'
import { createGroupApi, getInviteFriendsApi, inviteGroupApi } from '@/api/group-chat'
import { ElMessage } from 'element-plus'

const props = defineProps({
  gid: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['close', 'on-submit', 'on-invite'])

const items = ref<any>([])
const model = reactive({
  keywords: '',
  name: ''
})

const isShowBox = ref<boolean>(true)

const searchFilter: any = computed(() => {
  if (model.keywords) {
    return items.value.filter((item: any) => {
      return item.username.match(model.keywords) != null
    })
  }
  return items.value
})

const checkedFilter: any = computed(() => {
  return items.value.filter((item: any) => item.checked)
})

const isCanSubmit = computed(() => {
  if (props.gid > 0) {
    return !checkedFilter.value.length
  }
  return !(model.name.trim() && checkedFilter.value.length)
})

const onReset = () => {
  model.name = ''
  items.value.forEach((item: any) => {
    item.checked = false
  })
}

const onLoad = () => {
  getInviteFriendsApi({
    group_id: props.gid
  })
    .then((res: any) => {
      if (res.code == 200 && res.data) {
        let list = res.data || []
        items.value = list.map((item: any) => {
          return Object.assign(item, {
            username: /*item.friend_remark ? item.friend_remark :*/ item.username,
            checked: false
          })
        })
      }
    })
}

const onCloseClick = () => {
  emit('close')
}

const onTriggerContact = (item: any) => {
  let data: any = items.value.find((val: any) => {
    return val.id === item.id
  })
  data && (data.checked = !data.checked)
}

const onCreateSubmit = (ids: number[]) => {
  createGroupApi({
    avatar: '',
    name: model.name,
    description: '',
    ids: ids.join(',')
  }).then((res: any) => {
    if (res.code == 200) {
      onReset()
      emit('on-submit', res.data)
      emit('close')
      isShowBox.value = false
    }
  })
}

const onInviteSubmit = (ids: number[]) => {
  inviteGroupApi({
    group_id: props.gid,
    ids: ids.join(',')
  }).then((res: any) => {
    if (res.code == 200) {
      emit('on-invite')
      emit('close')
      ElMessage.success('Приглашение успешно отправлено')
      isShowBox.value = false
    }
  })
}

const onSubmit = () => {
  let ids = checkedFilter.value.map((item: any) => item.id)
  if (props.gid == 0) {
    onCreateSubmit(ids)
  } else {
    onInviteSubmit(ids)
  }
}
</script>

<template>
  <el-dialog
    v-model="isShowBox"
    :before-close="onCloseClick"
    width="762px"
    :show-close="false"
    @open="onLoad"
  >
    <template #header="{ close, titleId, titleClass }">
      <h4
        :id="titleId"
        :class="titleClass"
      >
        {{ gid == 0 ? 'Создать группу' : 'Выберите друзей, которых нужно пригласить' }}
      </h4>
      <div class="module__after">
        <el-button
          type="info"
          class="close"
          link
          :icon="CloseIcon"
          @click="close"
        />
      </div>
    </template>
    <el-container class="launch-box">
      <el-aside>
        <el-header>
          <el-input
            v-model="model.keywords"
            :prefix-icon="Search"
            placeholder="Поиск"
          />
        </el-header>
        <el-main class="hidden">
          <el-scrollbar>
            <div class="friend-items">
              <div
                v-for="item in searchFilter"
                class="friend-item"
                @click="onTriggerContact(item)"
              >
                <div class="avatar">
                  <el-avatar
                    :size="25"
                    :src="item.avatar || defAvatar"
                  />
                </div>
                <div class="content">
                  <span class="text-ellipsis">{{ item.username }}</span>
                </div>
                <div class="checkbox">
                  <el-checkbox
                    v-model="item.checked"
                    size="large"
                    @change="item.checked = !item.checked"
                  />
                </div>
              </div>
            </div>
          </el-scrollbar>
        </el-main>
      </el-aside>
      <el-main class="container">
        <el-header v-if="props.gid === 0">
          <el-input
            v-model="model.name"
            maxlength="20"
            placeholder="Название группы"
            show-count
          />
          <el-divider>
            Пригласить участников ({{ checkedFilter.length }})
          </el-divider>
        </el-header>
        <el-main>
          <el-scrollbar>
            <div class="friend-items">
              <div
                v-for="item in checkedFilter"
                class="friend-item"
                @click="onTriggerContact(item)"
              >
                <div class="avatar">
                  <el-avatar
                    :size="25"
                    :src="item.avatar || defAvatar"
                  />
                </div>
                <div class="content">
                  <span class="text-ellipsis">{{ item.username }}</span>
                </div>
                <div class="checkbox">
                  <el-icon>
                    <delete />
                  </el-icon>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </el-main>
      </el-main>
    </el-container>
    <template #footer>
      <div class="footer">
        <el-button @click="onCloseClick">
          Отмена
        </el-button>
        <el-button
          :disabled="isCanSubmit"
          class="ml-15"
          type="primary"
          @click="onSubmit"
        >
          {{ gid == 0 ? 'Создать группу' : 'Пригласить' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.launch-box {
  height: 500px;
  width: 100%;
  overflow: hidden;

  .el-aside {
    width: 280px;
    border-right: 1px solid var(--el-border-color);

    .el-header {
      padding: 15px 10px 10px 10px;

    }
  }

  .container {
    .el-header {
      height: 100px;
      padding: 15px 10px 10px 10px
    }

    .el-main {
      height: 340px;
    }
  }

  .friend-items {
    height: 100%;
    overflow-y: auto;
    padding: 0 10px;

    .friend-item {
      height: 40px;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      margin: 5px 0;
      cursor: pointer;

      > div {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .avatar {
        width: 30px;
        justify-content: flex-start;
        margin-left: 10px;
      }

      .content {
        flex: 1 auto;
        padding-left: 8px;
        overflow: hidden;
        font-size: 14px;
        font-weight: 400;
        justify-content: flex-start;

        &:hover {
          color: #409eff;
        }
      }

      .checkbox {
        flex-shrink: 0;
        justify-content: flex-end;
        padding: 20px;
      }
    }
  }
}

.footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 15px;
  border-top: 1px solid var(--el-border-color);

  .el-button {
    width: 180px;
    padding: 10px;
    height: 35px;
  }
}
</style>
