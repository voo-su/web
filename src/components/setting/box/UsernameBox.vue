<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useUserStore } from '@/store'
import type { FormInstance, FormRules } from 'element-plus'
import { updateUsernameApi } from '@/api/account'
import { getErrorForField } from '@/plugins'
import IconUser from '@/components/icons/IconUser.vue'
import { ElMessage } from 'element-plus'

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
      message: 'Пожалуйста, введите имя пользователя',
      trigger: 'blur'
    },
    {
      min: 3,
      message: 'Должно содержать не менее 3 символов',
      trigger: 'blur'
    },
    {
      max: 20,
      message: 'Не должно превышать 20 символов',
      trigger: 'blur'
    },
    {
      pattern: /^[a-zA-Z0-9_-]+$/,
      message: 'Содержит недопустимые символы',
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
          ElMessage.success('Имя пользователя успешно изменен')
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
    title="Безопасность"
    content="Имя пользователя "
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
            placeholder="Имя пользователя"
          />
        </el-form-item>
        <el-button
          :loading="form.loading"
          type="primary"
          @click="onSubmit(formRef)"
        >
          Изменить
        </el-button>
      </el-form>
      <div class="box-description">
        * Пожалуйста, используйте только латинские буквы, цифры, дефисы и подчеркивания в имени пользователя.
        <br>
        Избегайте специальных символов для удобства использования и совместимости.
      </div>
    </div>
  </div>
</template>

<style scoped></style>
