<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { Close as CloseIcon } from '@element-plus/icons-vue'
import { createProjectApi } from '@/api/project'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const emit = defineEmits(['close', 'success'])

const isShow = ref(true)
const formRef = ref<FormInstance>()

const form = reactive({
  title: '',
  loading: false
})

const rules = reactive<FormRules>({
  title: [
    {
      required: true,
      message: t('enterName'),
      trigger: 'blur'
    },
    {
      min: 3,
      message: t('usernameMinLength'),
      trigger: 'blur'
    },
    {
      max: 255,
      message: t('descriptionMaxLength'),
      trigger: 'blur'
    }
  ]
})

interface IRes {
  code?: number
  data: {
    id: number
  }
}

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async valid => {
    if (valid) {
      createProjectApi({
        title: form.title
      }).then((res: IRes) => {
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
    width="500px"
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
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
      >
        <el-form-item prop="title">
          <el-input
            v-model="form.title"
            :placeholder="t('nameProject')"
          />
        </el-form-item>
        <el-form-item>
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
