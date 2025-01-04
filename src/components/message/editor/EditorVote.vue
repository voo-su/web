<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { Close as CloseIcon, Delete as IconDelete, Plus as IconPlus } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['close', 'submit'])

const { t } = useI18n()
const isShow = ref<boolean>(true)
const formRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  title: [
    {
      required: true,
      message: t('fieldRequired'),
      trigger: 'blur',
      min: 1
    },
    {
      max: 255,
      message: t('descriptionMaxLength'),
      trigger: 'blur'
    }
  ]
})

const form = reactive({
  mode: false,
  anonymous: false,
  title: '',
  options: [
    {
      value: '',
      del: false
    },
    {
      value: '',
      del: false
    }
  ]
})

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async valid => {
    if (valid) {
      emit('submit', {
        title: form.title,
        mode: (form.mode) ? 1 : 0,
        anonymous: (form.anonymous) ? 1 : 0,
        options: form.options.map(item => item.value)
      })
    }
  })
}

const addOption = () => form.options.push({
  value: '',
  del: true
})

const delOption = (index: number) => form.options.length > 2 && form.options.splice(index, 1)

const isCanSubmit = computed(() => {
  return (
    form.title.trim().length == 0 ||
    form.options.some(item => item.value.trim().length === 0)
  )
})

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
    width="450px"
  >
    <template #header="{ close, titleId, titleClass }">
      <h4
        :id="titleId"
        :class="titleClass"
      >
        {{ t('newPoll') }}
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
        <el-form-item
          class="item-label"
          :label="t('question')"
          prop="title"
        >
          <el-input
            v-model="form.title"
            :placeholder="t('askQuestion')"
          />
        </el-form-item>
        <el-form-item
          class="item-label"
          :label="t('answerOptions')"
        >
          <div class="options">
            <div
              v-for="(item, i) in form.options"
              class="option"
            >
              <el-input
                v-model="item.value"
                :placeholder="t('addAnswer')"
              >
                <template #prefix>
                  <span>{{ i + 1 }}.</span>
                </template>
              </el-input>
              <el-button
                v-if="item.del"
                :icon="IconDelete"
                class="btn"
                link
                @click="delOption(i)"
              />
            </div>
            <el-button
              v-if="form.options.length < 10"
              :icon="IconPlus"
              class="btn plus"
              link
              @click="addOption"
            >
              {{ t('more') }}
            </el-button>
          </div>
        </el-form-item>
        <el-form-item
          class="item-label"
          :label="t('settings')"
        >
          <el-checkbox
            v-model="form.anonymous"
            :label="t('anonymousSurvey')"
          />
          <el-checkbox
            v-model="form.mode"
            :label="t('multipleChoice')"
          />
        </el-form-item>
        <el-form-item>
          <div class="footer">
            <el-button @click="onCloseClick">
              {{ t('cancelAction') }}
            </el-button>
            <el-button
              :disabled="isCanSubmit"
              class="ml-15"
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

  .item-label {
    font-weight: 600;
    border-bottom: 1px solid var(--el-border-color);
    padding-bottom: 10px;
    margin-bottom: 10px;
  }

  .options {
    width: 100%;

    .btn {
      &.plus {
        margin-left: auto;
        display: flex;
      }
    }

    .option {
      margin: 8px 0;
      display: flex;
      align-items: center;

      .btn {
        width: 30px;
        height: 30px;
        margin-left: 3px;
        cursor: pointer;
      }
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
