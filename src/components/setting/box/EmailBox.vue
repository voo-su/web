<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useUserStore } from '@/store'
import type { FormInstance, FormRules } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
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
    :title="t('security')"
    :content="t('email')"
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
            :placeholder="t('email')"
            disabled
          />
        </el-form-item>
        <!--        <el-button-->
        <!--          :loading="loading"-->
        <!--          type="primary"-->
        <!--          @click="onSubmit(formRef)"-->
        <!--        >-->
        <!--          {{ t('edit') }}-->
        <!--        </el-button>-->
      </el-form>
    </div>
  </div>
</template>

<style scoped></style>
