<script lang="ts" setup>
// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import { reactive, ref, h } from 'vue'
import { ElMessageBox, ElMessage, ElInput, ElForm, ElFormItem } from 'element-plus'
import type { FormInstance, FormRules, Column } from 'element-plus'
import { createBot } from '@/api/bot'
import AppPageHeader from '@/components/app/AppPageHeader.vue'
import BaseTable from '@/components/base/BaseTable.vue'
import { getBots } from '@/api/bot'

interface FormType {
  username: string
}

const formRef = ref<FormInstance>()

const form = reactive<FormType>({
  username: ''
})

const rules = reactive<FormRules>({
  username: [
    {
      required: true,
      message: 'Поле «Имя пользователя» должно быть заполнено',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        if (!value.endsWith('_bot') && !value.endsWith('bot')) {
          callback(new Error('Имя пользователя должно заканчиваться на "_bot" или "bot"'))
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ]
})

interface IItem {
  id: number
  username: string
  token: string
}

const loading = ref<boolean>(false)
const items = ref<IItem[]>([])

interface IColumn {
  key: string
  dataKey: string
  title: string
  width: number
}

const columns: Column<IColumn>[] = [
  {
    key: "username",
    dataKey: "username",
    title: "Имя пользователя",
    width: 150
  },
  {
    key: "token",
    dataKey: "token",
    title: "Токен",
    width: 800
  },
]

const load = async () => {
  loading.value = true
  getBots().then(async (res: any) => {
    const { code, data } = res
    if (code == 200 && data.items) {
      items.value = data.items
    }
  }).finally(() => {
    loading.value = false
  })
}

const handleRowClick = (e: any) => {
  //console.log(e)
}

const rowEventHandlers = {
  onClick: handleRowClick
}


const validateForm = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (formRef.value) {
      formRef.value.validate((valid: boolean) => {
        if (valid) {
          resolve(true)
        } else {
          reject(false)
        }
      })
    } else {
      reject(false)
    }
  })
}

const onCreate = () => ElMessageBox({
  title: "Создание бота",
  showCancelButton: true,
  confirmButtonText: 'Сохранить',
  message: () => h(ElForm, {
    ref: formRef,
    model: form,
    rules,
    labelPosition: 'top'
  }, {
    default: () => [
      h(ElFormItem, {
        prop: 'username'
      }, {
        default: () => [
          h(ElInput, {
            modelValue: form.username,
            'onUpdate:modelValue': (value: string) => form.username = value,
            placeholder: 'Имя пользователя',
            onKeydown: (event: KeyboardEvent) => {
              if (event.key === 'Enter') {
                event.preventDefault(); // отменяем действие по умолчанию
              }
            }
          })
        ]
      })
    ]
  }),
  beforeClose: (action, instance, done) => {
    if (action === 'confirm') {
      validateForm().then(() => {
        createBot({
          username: form.username,
        })
          .then(({ code, data, message }: any) => {
            if (code == 200) {
              ElMessage.success('Успешно')
              done()
              load()
            } else {
              ElMessage.warning(message)
            }
          })
          .catch(() => {
            ElMessage.warning('Не удалось')
          })
          .finally(() => {

          })
      }).catch(() => { })
    } else {
      done()
    }
  },
}).catch(() => { })

load()
</script>

<template>
  <app-page-header>
    <template #left>
      <h3 class="title">Менеджер ботов</h3>
    </template>
    <template #extra>
      <el-button
        type="primary"
        @click="onCreate"
        size="small"
      >
        Новый бот
      </el-button>
    </template>
  </app-page-header>
  <el-main>
    <div style="height: 670px">
      <base-table
        v-loading="loading"
        :columns="columns"
        :items="items"
        @load="load"
        :row-event-handlers="rowEventHandlers"
      />
    </div>
  </el-main>
</template>

<style lang="scss" scoped>
.el-page-header {
  padding: 10px;

  h3.title {
    border-bottom: none;
  }
}
</style>
