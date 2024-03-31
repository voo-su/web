<script lang="ts" setup>
import { computed, inject, reactive, ref, watch } from 'vue'
import { useUserStore } from '@/store/user'
import GroupManage from './manage/index.vue'
import { Close as CloseIcon, Plus, Search as SearchIcon } from '@element-plus/icons-vue'
import { getGroupMembersApi, groupDetailApi, secedeGroupApi } from '@/api/group-chat'
import { ElMessageBox } from 'element-plus'
import AvatarBox from '@/components/base/BaseAvatarBox.vue'
import GroupLaunch from './GroupLaunch.vue'

const userStore = useUserStore()

const emit = defineEmits(['close', 'to-dialog'])
const props = defineProps({
  gid: {
    type: Number,
    default: 0
  }
})

const user: any = inject('$user')

watch(props, () => {
  loadDetail()
  loadMembers()
})

const activeName = ref('info')

const isShow = ref(true)

const editCardPopover = ref(false)
const isShowGroup = ref(false)
const isShowManage = ref(false)
const state = reactive({
  keywords: '',
  detail: {
    avatar: '',
    name: '',
    description: ''
    // visit_card: ''
  },
  members: []
  // remark: ''
})

const search = computed(() => {
  if (state.keywords) {
    return state.members.filter((item: any) => {
      return (
        item.username.match(state.keywords) != null /*||
        item.user_card.match(state.keywords) != null*/
      )
    })
  }
  return state.members
})

const isLeader = computed(() => {
  return state.members.some((item: any) => {
    return item.user_id == userStore.uid && item.leader >= 1
  })
})

const isAdmin = computed(() => {
  return state.members.some((item: any) => {
    return item.user_id == userStore.uid && item.leader == 2
  })
})

const onGroupCallBack = () => {
}

const onToInfo = item => user(item.user_id)

const onClose = () => {
  emit('close')
}

const loadDetail = () => {
  groupDetailApi({ group_id: props.gid }).then(res => {
    if (res.code == 200) {
      let result = res.data
      state.detail.avatar = result.avatar
      state.detail.name = result.group_name
      state.detail.description = result.description
      // state.detail.visit_card = result.visit_card
      // state.remark = result.visit_card
      if (result.notice) {
        state.detail.group_notice = result.notice
      }
    }
  })
}

const loadMembers = () => {
  getGroupMembersApi({ group_id: props.gid }).then(res => {
    if (res.code == 200) {
      state.members = res.data.items || []
    }
  })
}

const onSignOut = () => {
  ElMessageBox.confirm(
    'Вы уверены, что хотите выйти из группы?',
    'Выйти из группы',
    {
      confirmButtonText: 'Выйти',
      cancelButtonText: 'Отмена',
      type: 'warning'
    }
  )
    .then(() => {
      secedeGroupApi({ group_id: props.gid }).then(res => {
        if (res.code == 200) {
          window['$message'].success('Вы успешно покинули группу')
          onClose()
        } else {
          window['$message'].error(res.message)
        }
      })
    })
    .catch(() => {

    })
}

loadDetail()
loadMembers()
</script>

<template>
  <el-dialog
    v-model="isShow"
    :before-close="onClose"
    :show-close="false"
    width="390px"
  >
    <template #header="{ close, titleId, titleClass }">
      <h4
        :id="titleId"
        :class="titleClass"
      >
        Информация о группе
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
    <el-tabs v-model="activeName">
      <el-tab-pane
        label="Информация о группе"
        name="info"
      >
        <el-header>
          <avatar-box
            :avatar="state.detail.avatar"
            :username="state.detail.name"
            :size="100"
            viewer
          />
        </el-header>
        <div class="info-box">
          <!--            <div class="item-card">-->
          <!--              <div class="block">-->
          <!--                <el-button-->
          <!--                  :icon="Comment"-->
          <!--                  @click="emit('to-dialog')"-->
          <!--                />-->
          <!--              </div>-->
          <!--            </div>-->
          <div class="item-card">
            <div class="block">
              <div class="title">
                Название группы
              </div>
            </div>
            <div class="description">
              {{ state.detail.name }}
            </div>
          </div>
          <!--            <div class="item-card">-->
          <!--              <div class="block">-->
          <!--                <div class="title">-->
          <!--                  Карточка группы：-->
          <!--                </div>-->
          <!--                <div class="text">-->
          <!--                  <el-popover-->
          <!--                    ref="editCardPopover"-->
          <!--                    placement="left"-->
          <!--                    trigger="click"-->
          <!--                  >-->
          <!--                    <template #reference>-->
          <!--                      <el-button-->
          <!--                        type="info"-->
          <!--                      >-->
          <!--                        Установить-->
          <!--                      </el-button>-->
          <!--                    </template>-->
          <!--                    <div style="display: flex">-->
          <!--                      <el-input-->
          <!--                        v-model="state.remark"-->
          <!--                        :autofocus="true"-->
          <!--                        maxlength="10"-->
          <!--                        placeholder="Установить мою карточку группы"-->
          <!--                       -->
          <!--                        @keydown.enter.native="onChangeRemark"-->
          <!--                      />-->
          <!--                      <el-button-->
          <!--                        type="primary"-->
          <!--                        @click="onChangeRemark"-->
          <!--                      >-->
          <!--                        Да-->
          <!--                      </el-button>-->
          <!--                    </div>-->
          <!--                  </el-popover>-->
          <!--                </div>-->
          <!--              </div>-->
          <!--              <div class="description">-->
          <!--                {{ state.detail.visit_card || 'Не установлено' }}-->
          <!--              </div>-->
          <!--            </div>-->
          <!--            <div class="item-card">-->
          <!--              <div class="block">-->
          <!--                <div class="title">-->
          <!--                  Участники группы:-->
          <!--                </div>-->
          <!--                <div class="text">-->
          <!--                  {{ state.members.length }} человек-->
          <!--                </div>-->
          <!--              </div>-->
          <!--              <div class="description">-->
          <!--                Владелец группы включил функцию "Новые участники могут просматривать всю историю сообщений"-->
          <!--              </div>-->
          <!--            </div>-->
          <div
            v-if="state.detail.description.length >= 1"
            class="item-card"
          >
            <div class="block">
              <div class="title">
                Описание группы
              </div>
            </div>
            <div class="description">
              {{ state.detail.description }}
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="Участники"
        name="member"
      >
        <div class="flex">
          <el-input
            v-model="state.keywords"
            :prefix-icon="SearchIcon"
            placeholder="Поиск"
          />
          <el-button
            :icon="Plus"
            class="ml-15"
            @click="isShowGroup = true"
          />
        </div>
        <div
          v-if="search.length == 0"
          class="mt-20 pt-20"
        >
          <div class="empty">
            Ничего не найдено.
          </div>
        </div>
        <div
          v-else
          class="member-box"
        >
          <div
            v-for="item in search"
            :key="item.id"
            class="item-card"
            @click="onToInfo(item)"
          >
            <div class="left-item">
              <avatar-box
                :avatar="item.avatar"
                :username="item.username"
                :name="item.name"
                :surname="item.surname"
                class="avatar"
                :size="25"
              />
            </div>
            <div class="right-item">
              <div class="item-title">
                <span class="username text-ellipsis">{{ item.username ? item.username : '-' }}</span>
                <span
                  v-if="item.leader === 2"
                  class="member-type"
                >Владелец</span>
                <span
                  v-if="item.leader === 1"
                  class="member-type"
                >Админ</span>
                <!--div class="card text-ellipsis grey">
                  {{ item.user_card ? item.user_card : '-' }}
                </div--->
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-footer class="footer">
      <el-button
        v-if="!isAdmin"
        type="danger"
        link
        @click="onSignOut"
      >
        Выйти
      </el-button>
      <el-button
        v-if="isLeader"
        link
        type="primary"
        @click="isShowManage = true"
      >
        Управление группой
      </el-button>
    </el-footer>
  </el-dialog>
  <group-launch
    v-model="isShowGroup"
    :gid="gid"
    @close="isShowGroup = false"
    @on-submit="onGroupCallBack"
  />
  <group-manage
    v-if="isShowManage"
    :gid="gid"
    @close="isShowManage = false"
  />
</template>

<style lang="scss" scoped>
.el-main {
  padding: 0 15px;

  .el-header {
    width: 100%;
    height: 100px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    .avatar-box {
      height: 100px;
      width: 100px;
      font-size: 30px;
    }
  }

  .info-box {
    .item-card {
      display: flex;
      align-items: center;
      min-height: 30px;
      margin: 12px 0;
      flex-direction: column;
      cursor: pointer;

      &:first-child {
        margin-top: 0;
      }

      .block {
        width: 100%;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .title {
          height: 100%;
          line-height: 30px;
          flex: auto;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .text {
          height: 100%;
          line-height: 30px;
          width: 30%;
          text-align: right;
        }
      }

      .description {
        width: 100%;
        min-height: 24px;
        line-height: 24px;
        font-size: 13px;
        color: #b1b1b1;
        font-weight: 300;
        overflow: hidden;
        word-break: break-word;
      }
    }
  }

  .member-box {
    padding-top: 10px;
    width: 360px;

    .item-card {
      display: flex;
      width: 100%;
      min-height: 10px;
      box-sizing: border-box;

      &:hover {
        color: #ececec;
      }

      .left-item {
        flex-shrink: 0;

        .avatar-box {
          height: 24px;
          width: 24px;
          margin-top: 3px;
        }
      }

      .right-item {
        margin-left: 6px;
        width: 100%;

        .item-title {
          height: 28px;
          width: inherit;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: 400;
          cursor: pointer;
        }
      }
    }
  }
}

.footer {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 50px;
  padding: 15px;
  border-top: 1px solid var(--el-border-color);
}
</style>
