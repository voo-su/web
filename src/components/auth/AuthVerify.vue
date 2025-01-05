<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { verifyApi } from '@/api/auth'
import { authSessionKey } from '@/constants/default'
import { cookie } from '@/utils/storage/cookie-storage'
import socket from '@/utils/socket'
import { setAccessToken } from '@/utils/auth'
import { useUserStore } from '@/store'
import { Close } from '@element-plus/icons-vue'
import type { IFormVerifyType } from './types'
import { getErrorForField } from '@/utils/functions'
import IconLogo from '@/components/icons/IconLogo.vue'
import { pushInit } from '@/utils/push'
import { useI18n } from 'vue-i18n'

const userStore = useUserStore()

const props = defineProps({
  time: Number,
  timerExpired: Boolean
})

const emit = defineEmits(['onLogin', 'onVerify', 'onSuccess', 'time', 'timerExpired'])

const { t } = useI18n()
const formRef = ref<FormInstance>()
const errors = ref<any>([])

const rules = reactive<FormRules>({
  code: [
    {
      required: true,
      trigger: 'blur',
      message: t('enterSixDigitCode')
    },
    {
      min: 6,
      trigger: 'blur',
      message: t('codeMinLength')
    }
  ]
})

const form = reactive<IFormVerifyType>({
  code: '',
  loading: false
})

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async valid => {
    if (valid) {
      form.loading = true
      errors.value = []
      const token = cookie.get(authSessionKey)
      if (token == null) return
      verifyApi({
        token: token,
        code: form.code
      }).then(({ code, message, data }: any) => {
        if (code == 200) {
          const { accessToken, expiresIn } = data
          cookie.remove(authSessionKey)
          setAccessToken(accessToken, expiresIn)
          socket.connect()
          userStore.loadSetting()
          pushInit()
          emit('onSuccess')
          form.loading = false
        } else {
          errors.value.push({
            path: ['code'],
            message: message
          })
        }
      }).finally(() => {
        form.loading = false
      })
    }
  })
}

const onLogin = () => {
  emit('onLogin')
}
</script>

<template>
  <el-header class="verify">
    <div class="logo">
      <icon-logo />
    </div>
    <h5>{{ t('enterCodeBelow') }}</h5>
  </el-header>
  <el-main>
    <el-form
      v-if="!props.timerExpired"
      ref="formRef"
      :model="form"
      :rules="rules"
      @submit.prevent="onSubmit(formRef)"
    >
      <el-form-item
        class="verify"
        :error="getErrorForField('code', errors)"
        prop="code"
      >
        <input
          v-model="form.code"
          :disabled="form.loading"
          :maxlength="6"
        >
        <template #error="item">
          <div class="el-form-item__error">
            {{ item.error }}
          </div>
        </template>
      </el-form-item>
      <el-button
        type="primary"
        :loading="form.loading"
        class="block"
        @click="onSubmit(formRef)"
      >
        Подтвердить
      </el-button>
      <div class="time">
        <p>{{ t('resendCodeIn', { time: props.time }) }}</p>
        <el-button
          :icon="Close"
          link
          type="info"
          @click="onLogin()"
        >
          {{ t('cancel') }}
        </el-button>
      </div>
    </el-form>
    <div
      v-else
      class="expired"
    >
      <p>{{ t('confirmationTimeout') }}</p>
      <el-button
        type="primary"
        text
        @click="onLogin()"
      >
        {{ t('retry') }}
      </el-button>
    </div>
  </el-main>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/login.scss';
</style>
