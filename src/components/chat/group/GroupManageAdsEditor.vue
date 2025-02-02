<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { editGroupAdsApi } from '@/api/group-chat'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  id: {
    type: Number,
    default: 0
  },
  gid: {
    type: Number,
    default: 0
  },
  title: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close', 'success'])

const { t } = useI18n()
const titleModal = ref<string>(props.id == 0 ? t('publishGroupAnnouncement') : t('editGroupAnnouncement'))
const isShow = ref<boolean>(true)
const loading = ref<boolean>(false)
const formRef = ref<FormInstance>()

const rules = reactive<FormRules>({
  title: {
    required: true,
    message: t('titleFieldRequired')
  },
  content: {
    required: true,
    message: t('contentFieldRequired')
  }
})

interface IForm {
  title: string
  content: string
}

const form = reactive<IForm>({
  title: props.title,
  content: props.content
})

const onCloseClick = () => {
  emit('close')
}

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async valid => {
    if (valid) {
      loading.value = true
      editGroupAdsApi({
        ads_id: props.id,
        group_id: props.gid,
        title: form.title,
        content: form.content,
        is_top: 0,
        is_confirm: 0
      })
        .then(({ code }: any) => {
          if (code == 200) {
            ElMessage.success(t('success'))
            emit('success')
          } else {
            ElMessage.warning(res.message)
          }
        })
        .finally(() => {
          loading.value = false
        })
    }
  })
}
</script>

<template>
  <el-dialog
    v-model="isShow"
    :before-close="onCloseClick"
    :title="titleModal"
  >
    <el-main>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
      >
        <el-form-item
          :label="t('title')"
          prop="title"
        >
          <el-input
            v-model="form.title"
            :placeholder="t('enterTitle')"
          />
        </el-form-item>
        <el-form-item
          :label="t('content')"
          prop="content"
        >
          <el-input
            v-model="form.content"
            :autosize="{ minRows: 5, maxRows: 10 }"
            :placeholder="t('enterContent')"
            type="textarea"
          />
        </el-form-item>
      </el-form>
    </el-main>
    <template #footer>
      <div class="footer">
        <el-button @click="onCloseClick">
          {{ t('cancelAction') }}
        </el-button>
        <el-button
          :loading="loading"
          class="ml-15"
          type="primary"
          @click="onSubmit(formRef)"
        >
          {{ t('save') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.el-main {
  height: auto;
  padding: 20px 20px 0;

  .el-form-item {
    margin-bottom: 20px;
  }
}

.footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 15px;
  border-top: 1px solid var(--el-border-color);
}
</style>
