<script lang="ts" setup>
import { computed, ref } from 'vue'
import { Delete, Search } from '@element-plus/icons-vue'
import { defAvatar } from '@/constants/default.js'
import { getContactListApi } from '@/api/contact'

const emit = defineEmits(['update:modelValue', 'close', 'on-submit'])

const isShowBox = ref<boolean>(true)
const items = ref<any>([])
const keywords = ref<string>('')

const searchFilter: any = computed(() => {
  return items.value.filter((item: any) => {
    return item.username.match(keywords.value) != null
  })
})

const checkedFilter: any = computed(() => {
  return items.value.filter((item: any) => item.checked)
})

const isCanSubmit = computed(() => {
  return !checkedFilter.value.length
})

const onLoad = () => {
  getContactListApi().then((res: any) => {
    if (res.code == 200 && res.data) {
      let list = res.data.items || []

      items.value = list.map((item: any) => {
        return Object.assign(item, {
          id: item.id,
          type: 1,
          index_name: `1_${item.id}`,
          username: /*item.friend_remark ||*/ item.username,
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
  let data: any = items.value.find((val: any) => val.id === item.id)
  if (data) {
    data.checked = !data.checked
  }
}

const onSubmit = () => {
  let data = checkedFilter.value.map((item: any) => {
    return {
      id: item.id,
      type: item.type
    }
  })
  emit('on-submit', data)
}

onLoad()
</script>

<template>
  <el-dialog
    v-model="isShowBox"
    :before-close="onCloseClick"
    title="Выберите контакт"
    width="50%"
  >
    <el-container class="launch-box">
      <el-aside
        style="width: 280px; border-right: 1px solid var(--el-border-color);"
      >
        <el-container class="is-vertical h-100">
          <el-header class="sub-header">
            <el-input
              v-model="keywords"
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
                    <span class="text-ellipsis">
                      <!--                      {{ item.remark || item.username }}-->
                      {{ item.username }}
                    </span>
                  </div>
                  <div class="checkbox">
                    <el-checkbox
                      :checked="item.checked"
                      size="small"
                    />
                  </div>
                </div>
              </div>
            </el-scrollbar>
          </el-main>
        </el-container>
      </el-aside>
      <el-main>
        <el-container class="is-vertical h-100">
          <el-header
            class=""
            style="height: 50px"
          >
            <el-divider>
              Выбрано ({{ checkedFilter.length }})
            </el-divider>
          </el-header>
          <el-main class="hidden">
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
                      :src="item.avatar"
                    />
                  </div>
                  <div class="content">
                    <span class="text-ellipsis">{{ item.username }}</span>
                  </div>
                  <div class="checkbox">
                    <el-icon :size="16">
                      <delete />
                    </el-icon>
                  </div>
                </div>
              </div>
            </el-scrollbar>
          </el-main>
        </el-container>
      </el-main>
    </el-container>
    <template #footer>
      <div class="footer">
        <el-button
          @click="isShowBox = false"
        >
          Отмена
        </el-button>
        <el-button
          :disabled="isCanSubmit"
          class="ml-15"
          type="primary"
          @click="onSubmit"
        >
          Ок
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
:deep(.el-divider__title) {
  font-weight: unset;
}

.launch-box {
  height: 410px;
  width: 100%;
  overflow: hidden;

  .sub-header {
    height: 50px;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
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
        width: 30px;
        justify-content: flex-end;
      }
    }
  }
}

.footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
