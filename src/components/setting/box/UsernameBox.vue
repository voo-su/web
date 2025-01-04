<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useUserStore } from '@/store'
import type { FormInstance, FormRules } from 'element-plus'
import { updateUsernameApi } from '@/api/account'
import { getErrorForField } from '@/utils/functions'
import IconUser from '@/components/icons/IconUser.vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const userStore = useUserStore()
const emit = defineEmits(['onClick'])

const formRef = ref<FormInstance>()
const errors = ref<any>([])

const form = reactive({
  username: '',
  loading: false
})

const rules = reactive<FormRules>({
  username: [
    {
      required: true,
      message: t('enterUsername'),
      trigger: 'blur'
    },
    {
      min: 3,
      message: t('usernameMinLength'),
      trigger: 'blur'
    },
    {
      max: 20,
      message: t('usernameMaxLength'),
      trigger: 'blur'
    },
    {
      pattern: /^[a-zA-Z0-9_-]+$/,
      message: t('usernameInvalidChars'),
      trigger: 'blur'
    }
  ]
})

form.username = userStore.username

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async valid => {
    if (valid) {
      form.loading = true
      errors.value = []
      updateUsernameApi({
        username: form.username
      }).then((res: any) => {
        const {
          code,
          message
        } = res
        if (code == 200) {
          ElMessage.success(t('usernameChangedSuccess'))
          userStore.username = form.username
          emit('onClick', 'security')
        } else {
          errors.value.push({
            path: ['username'],
            message: message
          })
        }
      }).finally(() => {
        form.loading = false
      })
    }
  })
}
</script>

<template>
  <el-page-header
    :title="t('security')"
    :content="t('username')"
    @back="emit('onClick', 'security')"
  />
  <div class="flex-center form-center">
    <div class="icon">
      <icon-user />
    </div>
    <div class="form-child">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        @submit.prevent="onSubmit(formRef)"
      >
        <el-form-item
          :error="getErrorForField('username', errors)"
          prop="username"
        >
          <el-input
            v-model="form.username"
            :placeholder="t('username')"
          />
        </el-form-item>
        <el-button
          :loading="form.loading"
          type="primary"
          @click="onSubmit(formRef)"
        >
          {{ t('edit') }}
        </el-button>
      </el-form>
      <div class="box-description">
        {{ t('usernameGuidelines') }}
        <br>
        {{ t('usernameCompatibilityNote') }}
      </div>
    </div>
  </div>
</template>

<style scoped></style>
