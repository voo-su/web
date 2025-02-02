<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import AvatarCropper from '@/components/base/BaseAvatarCropper.vue'
import { editGroupApi, groupDetailApi } from '@/api/group-chat'
import { defGroup } from '@/constants/default'
import AvatarBox from '@/components/base/BaseAvatarBox.vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  id: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['close'])

const { t } = useI18n()
const cropper = ref<boolean>(false)
const formRef = ref<FormInstance>()

interface FormType {
  avatar: string
  name: string
  description: string
}

const form = reactive<FormType>({
  avatar: '',
  name: '',
  description: ''
})

const rules = reactive<FormRules>({
  name: [
    {
      required: true,
      message: t('firstNameRequired'),
      trigger: 'blur'
    }
  ],
  description: [
    {
      max: 255,
      message: t('descriptionMaxLength'),
      trigger: 'blur'
    }
  ]
})

const onUploadAvatar = (avatar: any) => {
  cropper.value = false
  form.avatar = avatar
}

const onLoadData = () => {
  groupDetailApi({ group_id: props.id })
    .then(({ code, data }: any) => {
      if (code == 200) {
        form.name = data.group_name
        form.avatar = data.avatar
        form.description = data.description
      }
    })
}

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async valid => {
    if (valid) {
      if (form.name.trim() == '') {
         ElMessage.info(t('groupNameRequired'))
        return
      }

      editGroupApi({
        group_id: props.id,
        group_name: form.name,
        avatar: form.avatar,
        description: form.description
      }).then(({ code, message }: any) => {
        if (code == 200) {
          ElMessage.success(t('groupInfoUpdatedSuccess'))
          emit('close')
        } else {
          ElMessage.error(message)
        }
      })
    }
  })
}

onMounted(() => {
  onLoadData()
})
</script>

<template>
  <el-header class="header">
    <p>{{ t('basicInfo') }}</p>
  </el-header>
  <el-main>
    <div class="t-center">
      <avatar-box
        :avatar="form.avatar || defGroup"
        :username="form.name"
        :size="150"
      />
      <el-button
        type="primary"
        link
        @click="cropper = true"
      >
        {{ t('uploadPhoto') }}
      </el-button>
    </div>
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
    >
      <el-form-item
        :label="t('groupName')"
        prop="name"
        required
      >
        <el-input
          v-model="form.name"
          :placeholder="t('groupNameField')"
        />
      </el-form-item>
      <el-form-item
        :label="t('groupDescription')"
        prop="description"
      >
        <el-input
          v-model="form.description"
          :placeholder="t('groupDescription')"
          type="textarea"
        />
      </el-form-item>
      <div class="t-center">
        <el-button
          type="primary"
          @click="onSubmit(formRef)"
        >
          {{ t('save') }}
        </el-button>
      </div>
    </el-form>
  </el-main>
  <avatar-cropper
    v-if="cropper"
    @close="cropper = false"
    @success="onUploadAvatar"
  />
</template>

<style lang="scss" scoped>
.header {
  height: 60px;
  line-height: 60px;
  padding-left: 15px;
  color: rgba(0, 0, 0, 0.85);
  font-size: 20px;
  font-weight: 500;
  border-bottom: 1px solid var(--el-border-color)6;
}

.el-main {
  height: auto;
  padding: 20px;

  .avatar-box {
    height: 150px;
    width: 150px;
    margin: 15px auto;
  }

  .el-form-item {
    margin-bottom: 20px;
  }
}
</style>
