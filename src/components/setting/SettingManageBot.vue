<script lang="ts" setup>
import { reactive, ref, h } from 'vue'
import { ElMessageBox, ElMessage, ElInput, ElForm, ElFormItem } from 'element-plus'
import type { FormInstance, FormRules, Column } from 'element-plus'
import { createBot } from '@/api/bot'
import BaseTable from '@/components/base/BaseTable.vue'
import { getBots } from '@/api/bot'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface IFormType {
  username: string
}

const formRef = ref<FormInstance>()

const form = reactive<IFormType>({
  username: ''
})

const rules = reactive<FormRules>({
  username: [
    {
      required: true,
      message: t('usernameRequired'),
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        if (!value.endsWith('_bot') && !value.endsWith('bot')) {
          callback(new Error(t('usernameSuffixBot')))
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
    key: 'username',
    dataKey: 'username',
    title: t('username'),
    width: 150
  },
  {
    key: 'token',
    dataKey: 'token',
    title: t('token'),
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
  title: t('createBot'),
  showCancelButton: true,
  confirmButtonText: t('save'),
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
            placeholder: t('username'),
            onKeydown: (event: KeyboardEvent) => {
              if (event.key === 'Enter') {
                event.preventDefault()
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
              ElMessage.success(t('success'))
              done()
              load()
            } else {
              ElMessage.warning(message)
            }
          })
          .catch(() => {
            ElMessage.warning(t('failed'))
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
  <section>
    <h3 class="title">
      {{ t('botManager') }}
    </h3>
    <div class="view-box">
      <el-button
        type="primary"
        @click="onCreate"
        size="small"
      >
        {{ t('newBot') }}
      </el-button>

      <base-table
        v-loading="loading"
        :columns="columns"
        :items="items"
        @load="load"
        :row-event-handlers="rowEventHandlers"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped>
.el-page-header {
  padding: 10px;

  h3.title {
    border-bottom: none;
  }
}
</style>
