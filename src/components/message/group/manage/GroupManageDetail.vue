<script lang="ts" setup>
// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import { onMounted, reactive, ref } from 'vue'
import AvatarCropper from '@/components/base/BaseAvatarCropper.vue'
import { editGroupApi, groupDetailApi } from '@/api/group-chat'
import { defGroup } from '@/constants/default'
import AvatarBox from '@/components/base/BaseAvatarBox.vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['close'])
const props = defineProps({
  id: {
    type: Number,
    default: 0
  }
})

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
      message: 'Поле «Имя» должно быть заполнено',
      trigger: 'blur'
    }
  ],
  description: [
    {
      max: 255,
      message: 'Описание не должно превышать 255 символов',
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
    .then((res: any) => {
      if (res.code == 200) {
        form.name = res.data.group_name
        form.avatar = res.data.avatar
        form.description = res.data.description
      }
    })
}

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async valid => {
    if (valid) {
      if (form.name.trim() == '') {
        return ElMessage.info('Имя группы не может быть пустым')
      }

      editGroupApi({
        group_id: props.id,
        group_name: form.name,
        avatar: form.avatar,
        description: form.description
      }).then((res: any) => {
        if (res.code == 200) {
          ElMessage.success('Информация о группе успешно обновлена')
          emit('close')
        } else {
          ElMessage.error(res.message)
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
    <p>Основная информация</p>
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
        Загрузить фотографию
      </el-button>
    </div>
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
    >
      <el-form-item
        label="Название группы"
        prop="name"
        required
      >
        <el-input
          v-model="form.name"
          placeholder="Название группы"
        />
      </el-form-item>
      <el-form-item
        label="Описание группы"
        prop="description"
      >
        <el-input
          v-model="form.description"
          placeholder="Описание группы"
          type="textarea"
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
