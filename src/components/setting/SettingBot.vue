<script lang="ts" setup>
import {reactive, ref} from 'vue'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { createBot } from '@/api/bot'

interface FormType {
  name: string
}

const formRef = ref<FormInstance>()

const form = reactive<FormType>({
  name: ''
})

const rules = reactive<FormRules>({
  name: [
    {
      required: true,
      message: 'Поле «Имя» должно быть заполнено',
      trigger: 'blur'
    }
  ]
})

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async valid => {
    if (valid) {
      createBot({
        name: form.name,
      })
        .then(() => {
          ElMessage.success('Успешно')
        })
        .catch(() => {
          ElMessage.warning('Не удалось')
        })
        .finally(() => {

        })
    }
  })
}
</script>

<template>
  <h3 class="title">
    Бот
  </h3>
  <el-container>
    <el-main style="padding-right: 20px">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        style="margin-top: 10px"
      >
        <el-form-item prop="name">
          <el-input
            v-model="form.name"
            placeholder="Имя бота"
          />
        </el-form-item>
        <div class="t-center">
          <el-button
            type="primary"
            @click="onSubmit(formRef)"
          >
            Сохранить
          </el-button>
        </div>
      </el-form>
    </el-main>
  </el-container>
</template>

<style scoped>

</style>
