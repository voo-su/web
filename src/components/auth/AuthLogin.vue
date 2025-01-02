<script lang="ts" setup>
// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { loginApi } from '@/api/auth'
import { cookie } from '@/utils/storage/cookie-storage'
import { authSessionKey } from '@/constants/default'
import { getErrorForField } from '@/utils/functions'
import type { IFormLoginType } from './types'
import IconLogo from '@/components/icons/IconLogo.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  time: Number,
  timerExpired: Boolean
})

const emit = defineEmits(['onVerify', 'onLogin', 'onSuccess'])

const formRef = ref<FormInstance>()
const errors = ref<any>([])

const rules = reactive<FormRules>({
  email: [
    {
      required: true,
      message: t('emailFieldRequired'),
      trigger: 'blur'
    },
    {
      type: 'email',
      message: t('invalidEmail'),
      trigger: ['blur', 'change']
    }
  ]
})

const form = reactive<IFormLoginType>({
  email: '',
  loading: false
})

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async valid => {
    if (valid) {
      form.loading = true
      errors.value = []
      loginApi({
        email: form.email,
        platform: 'web'
      }).then(async (res: any) => {
        const {
          code,
          message,
          data
        } = res
        form.loading = false
        if (code == 200) {
          const {
            token,
            expiresIn
          } = data
          await cookie.set(authSessionKey, token, expiresIn)
          emit('onVerify')
        } else {
          errors.value.push({
            path: ['email'],
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
  <el-header>
    <div class="logo">
      <icon-logo />
    </div>
    <h1>{{ t('welcomeBack') }}</h1>
    <h6>{{ t('loginOrRegister') }}</h6>
  </el-header>
  <el-main>
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      @submit.prevent="onSubmit(formRef)"
    >
      <el-form-item
        :error="getErrorForField('email', errors)"
        prop="email"
      >
        <el-input
          v-model="form.email"
          placeholder="Email"
        />
      </el-form-item>
      <el-button
        type="primary"
        :loading="form.loading"
        class="block"
        @click="onSubmit(formRef)"
      >
        {{ t('login') }}
      </el-button>
    </el-form>
    <div class="agreement">
      {{ t('loginAgreement') }}
      <a
        href="/terms"
        target="_blank"
      >{{ t('termsOfUse') }}</a>
    </div>
  </el-main>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/login.scss';
</style>
