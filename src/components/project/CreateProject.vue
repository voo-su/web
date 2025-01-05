<script lang="ts" setup>
import {computed, reactive, ref} from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { Close as CloseIcon, Delete, Search } from '@element-plus/icons-vue'
import { defAvatar } from '@/constants/default'
import { createProjectApi } from '@/api/project'
import { useI18n } from 'vue-i18n'
import type { IMemberItem } from '@/components/project/types'
import { getInviteFriendsApi } from '@/api/project'

const { t } = useI18n()
const emit = defineEmits(['close', 'success'])

const modelValue = defineModel()

interface IMemberItem {
  id: number
  username: string
}

const formRef = ref<FormInstance>()
const form = reactive({
  keywords: '',
  title: '',
  loading: false
})
const members = ref<IMemberItem[]>([])

const rules = reactive<FormRules>({
  title: [
    {
      required: true,
      message: t('enterName'),
      trigger: 'blur'
    },
    {
      min: 3,
      message: t('minLength', { length: 3 }),
      trigger: 'blur'
    },
    {
      max: 255,
      message: t('descriptionMaxLength'),
      trigger: 'blur'
    }
  ]
})

const onLoad = () => {
  getInviteFriendsApi({
    //project_id: 0
  }).then(({ code, data }: { code?: number; data: any }) => {
    if (code == 200 && data) {
      let list = data || []
      members.value = list.map((item: any) => {
        return Object.assign(item, {
          username: item.username,
          checked: false
        })
      })
    }
  })
}

const searchFilter: any = computed(() => {
  if (form.keywords) {
    return members.value.filter((item: any) => {
      return item.username.match(form.keywords) != null
    })
  }
  return members.value
})

const checkedFilter: any = computed(() => {
  return members.value.filter((item: any) => item.checked)
})

const onTriggerContact = (item: any) => {
  let data: any = members.value.find((val: any) => {
    return val.id === item.id
  })
  data && (data.checked = !data.checked)
}

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async valid => {
    if (valid) {
      let ids = checkedFilter.value.map((item: any) => item.id).join(',')
      createProjectApi({
        title: form.title,
        ids: ids
      }).then(({ code, data }: { code?: number; data: { id: number } }) => {
        if (code == 200) {
          emit('success', data.id)
        }
      }).finally(() => {
        form.loading = false
      })
    }
  })
}

const onCloseClick = () => {
  emit('close')
  modelValue.value = false
}
</script>

<template>
  <el-dialog
    v-model="modelValue"
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
        {{ t('newProject') }}
      </h4>
      <div class="module__after">
        <el-button
          :icon="CloseIcon"
          class="close"
          link
          type="info"
          @click="close"
        />
      </div>
    </template>
    <el-container class="launch-box">
      <el-aside>
        <el-header>
          <el-input
            v-model="form.keywords"
            :prefix-icon="Search"
            :placeholder="t('search')"
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
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
        >
          <el-header>
            <el-form-item prop="title">
              <el-input
                v-model="form.title"
                maxlength="255"
                :placeholder="t('nameProject')"
              />
            </el-form-item>

            <el-divider>
              {{ t('inviteParticipants', { length:checkedFilter.length }) }}
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
        </el-form>
      </el-main>
    </el-container>
    <template #footer>
      <div class="footer">
        <el-button @click="onCloseClick">
          {{ t('cancelAction') }}
        </el-button>
        <el-button
          :loading="form.loading"
          type="primary"
          @click="onSubmit(formRef)"
        >
          {{ t('create') }}
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
