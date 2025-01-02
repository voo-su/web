<script lang="ts" setup>
// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import { reactive, ref } from 'vue'
import { useUserStore } from '@/store'
import type { FormInstance, FormRules } from 'element-plus'

const userStore = useUserStore()

const emit = defineEmits(['onClick'])

const form = reactive({
  email: '',
  loading: false
})

const formRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  email: [
    {
      required: true,
      message: 'Поле «Email» должно быть заполнено',
      trigger: 'blur'
    },
    {
      type: 'email',
      message: 'Пожалуйста, введите правильный адрес почты',
      trigger: ['blur', 'change']
    }
  ]
})

form.email = userStore.email

const loading = ref(false)

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async valid => {
    if (valid) {
      console.log(1111123)
    }
  })
}
</script>

<template>
  <el-page-header
    title="Безопасность"
    content="Почта"
    @back="emit('onClick', 'security')"
  />
  <div class="flex-center form-center">
    <div class="form-child">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        @submit.prevent="onSubmit(formRef)"
      >
        <el-form-item prop="email">
          <el-input
            v-model="form.email"
            placeholder="Почта"
            disabled
          />
        </el-form-item>
        <!--        <el-button-->
        <!--          :loading="loading"-->
        <!--          type="primary"-->
        <!--          @click="onSubmit(formRef)"-->
        <!--        >-->
        <!--          Изменить-->
        <!--        </el-button>-->
      </el-form>
    </div>
  </div>
</template>

<style scoped></style>
