<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { Close as CloseIcon } from '@element-plus/icons-vue'
import { createTaskProjectApi } from '@/api/project'

const props = defineProps({
  projectId: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['close', 'success'])

const isShow = ref(true)
const formRef = ref<FormInstance>()

const form = reactive({
  loading: false,
  title: '',
  description: ''
})

const rules = reactive<FormRules>({
  title: [
    {
      required: true,
      message: 'Пожалуйста, введите наименование',
      trigger: 'blur'
    },
    {
      min: 2,
      message: 'Должно содержать не менее 2 символов',
      trigger: 'blur'
    },
    {
      max: 255,
      message: 'Не должно превышать 255 символов',
      trigger: 'blur'
    }
  ],
  description: []
})

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async valid => {
    if (valid) {
      createTaskProjectApi({
        project_id: props.projectId,
        title: form.title,
        description: form.description
      }).then((res: any) => {
        const {
          code,
          data
        } = res
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
  isShow.value = false
}
</script>

<template>
  <el-dialog
    v-model="isShow"
    :before-close="onCloseClick"
    :show-close="false"
  >
    <template #header="{ close, titleId, titleClass }">
      <h4
        :id="titleId"
        :class="titleClass"
      >
        Новая задача
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
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
      >
        <el-form-item prop="title">
          <el-input
            v-model="form.title"
            placeholder="Введите название задачи"
          />
        </el-form-item>
        <el-form-item prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
          />
        </el-form-item>
        <el-form-item>
          <div class="footer">
            <el-button @click="onCloseClick">
              Отмена
            </el-button>
            <el-button
              :loading="form.loading"
              type="primary"
              @click="onSubmit(formRef)"
            >
              Создать
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-container>
  </el-dialog>
</template>

<style lang="scss" scoped>
.launch-box {
  margin: 10px 20px 0 20px;

  .el-form {
    width: 100%;
  }

  .footer {
    width: 100%;
    text-align: right;

    .el-button {
      width: 120px;
      padding: 10px;
      height: 35px;
    }
  }
}
</style>
