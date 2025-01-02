<script lang="ts" setup>
// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import { reactive, ref } from 'vue'
import { getAccountApi, updateUserDetailApi } from '@/api/account'
import { defAvatar, genderOptions } from '@/constants/default'
import AvatarCropper from '@/components/base/BaseAvatarCropper.vue'
import { useUserStore } from '@/store/user'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const cropper = ref<boolean>(false)
const formRef = ref<FormInstance>()

const rules = reactive<FormRules>({
  avatar: [],
  name: [
    {
      required: true,
      message: 'Поле «Имя» должно быть заполнено',
      trigger: 'blur'
    }
  ],
  surname: [
    {
      required: true,
      message: 'Поле «Фамилия» должно быть заполнено',
      trigger: 'blur'
    }
  ],
  // email: [],
  gender: [],
  about: [],
  birthday: []
})

interface FormType {
  avatar: string
  name: string
  surname: string
  email: string
  gender: string
  about: string
  birthday: any
  loading: boolean
}

const form = reactive<FormType>({
  avatar: '',
  email: '',
  name: '',
  surname: '',
  gender: '0',
  about: '0',
  birthday: ref(),
  loading: false
})

getAccountApi()
  .then((res: any) => {
    const { data } = res
    form.avatar = data.avatar
    form.email = data.email.toString()
    form.name = data.name.toString()
    form.surname = data.surname.toString()
    form.gender = data.gender.toString()
    if (data.birthday) {
      form.birthday = ref(data.birthday)
    }
    form.about = data.about.toString()
  })

const onUploadAvatar = (avatar: any) => {
  cropper.value = false
  form.avatar = avatar
  onSubmit(formRef.value)
}

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async valid => {
    if (valid) {
      form.loading = true
      updateUserDetailApi({
        avatar: form.avatar,
        name: form.name,
        surname: form.surname,
        gender: parseInt(form.gender),
        birthday: form.birthday,
        about: form.about
      })
        .then(() => {
          ElMessage.success('Информация успешно сохранена')
          userStore.loadSetting()
        })
        .catch(() => {
          ElMessage.warning('Не удалось сохранить информацию')
        })
        .finally(() => {
          form.loading = false
        })
    }
  })
}
</script>

<template>
  <h3 class="title">
    Личные данные
  </h3>
  <el-container>
    <el-aside class="el-aside-left">
      <el-avatar
        :size="200"
        :src="form.avatar || defAvatar"
        class="avatar-box"
        @click="cropper = true"
      />
      <el-button
        type="primary"
        link
        @click="cropper = true"
      >
        Изменить аватар
      </el-button>
    </el-aside>
    <el-main style="padding-right: 20px">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-placement="left"
        style="margin-top: 10px"
        label-position="top"
      >
        <el-form-item
          label="Имя"
          prop="name"
        >
          <el-input
            v-model="form.name"
            placeholder="Имя"
          />
        </el-form-item>
        <el-form-item
          label="Фамилия"
          prop="surname"
        >
          <el-input
            v-model="form.surname"
            placeholder="Фамилия"
          />
        </el-form-item>
        <div class="flex w-100">
          <el-form-item
            label="Пол"
            class="w-50"
            placeholder="Укажите свой пол"
            prop="gender"
          >
            <el-segmented
              v-model="form.gender"
              :options="genderOptions"
            />
          </el-form-item>
          <el-form-item
            label="День рождения"
            prop="birthday"
            class="w-50"
          >
            <el-date-picker
              v-model="form.birthday"
              placeholder="День рождения"
              format="DD-MM-YYYY"
              value-format="YYYY-MM-DD"
              :clearable="false"
            />
          </el-form-item>
        </div>
        <el-form-item
          label="О себе"
          prop="about"
        >
          <el-input
            v-model="form.about"
            :autosize="{ minRows: 3, maxRows: 5}"
            maxlength="500"
            placeholder="О себе"
            type="textarea"
          />
        </el-form-item>
        <div class="t-center">
          <el-button
            :loading="form.loading"
            type="primary"
            @click="onSubmit(formRef)"
          >
            Сохранить
          </el-button>
        </div>
      </el-form>
    </el-main>
  </el-container>
  <avatar-cropper
    v-if="cropper"
    @close="cropper = false"
    @success="onUploadAvatar"
  />
</template>

<style lang="scss" scoped>
.el-container {
  height: auto;

  .el-aside-left {
    width: 250px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 30px;
  }

  .avatar-box {
    margin-bottom: 20px;
    cursor: pointer;
  }

  .el-form-item {
    margin-bottom: 20px;
  }

  .el-segmented {
    width: 100%;
    margin-right: 10px;
    box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
  }
}
</style>
