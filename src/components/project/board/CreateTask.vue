<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { Close as CloseIcon } from '@element-plus/icons-vue'
import { createTaskProjectApi } from '@/api/project'
import { useProjectStore } from '@/store'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  projectId: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['close'])

const isShow = ref(true)
const formRef = ref<FormInstance>()

interface IForm {
  loading: boolean
  title: string
  description: string
  typeId: number | null
}

const form = reactive<IForm>({
  loading: false,
  title: '',
  description: '',
  typeId: null
})

const rules = reactive<FormRules>({
  title: [
    {
      required: true,
      message: t('enterName'),
      trigger: 'blur'
    },
    {
      min: 2,
      message: t('minLength', { length: 2 }),
      trigger: 'blur'
    },
    {
      max: 255,
      message: t('maxLength', { length: 255 }),
      trigger: 'blur'
    }
  ],
  description: [],
  typeId: [
    {
      required: true,
      message: t('statusFieldRequired'),
      trigger: 'blur'
    }
  ]
})

interface IType {
  id: number
  title: string
}

const types = computed<IType[]>(() => useProjectStore().getTypes)

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async valid => {
    if (valid) {
      createTaskProjectApi({
        project_id: props.projectId,
        type_id: form.typeId,
        title: form.title,
        description: form.description
      }).then(({ code, data }: { code?: number; data: { id: number } }) => {
        if (code == 200) {
          emit('close')
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
        {{ t('newTask') }}
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
        label-position="top"
      >
        <el-form-item prop="title">
          <el-input
            v-model="form.title"
            :placeholder="t('enterTaskName')"
          />
        </el-form-item>
        <el-form-item prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
          />
        </el-form-item>
        <el-form-item
          prop="typeId"
          class="status"
          label="Статус"
        >
          <el-select v-model="form.typeId">
            <el-option
              v-for="(item, index) in types"
              :key="index"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
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

    .status {
      width: 200px;
    }
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
