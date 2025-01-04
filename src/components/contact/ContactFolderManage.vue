<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { contactFoldersApi, contactFolderSaveApi } from '@/api/contact'
import { Delete as IconDelete, Plus as IconPlus } from '@element-plus/icons-vue'
import { ElDialog, ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['close', 'relaod'])

const isShowBox = ref<boolean>(true)
const { t } = useI18n()

interface IItem {
  id: number
  index: number
  name: string
  count: number
}

const options = reactive<IItem[]>([])

let index = 1

const onLoad = async () => {
  let { code, data } = await contactFoldersApi()
  if (code != 200) return
  let items = data.items || []
  for (const item of items) {
    if (item.id) {
      options.push({
        id: item.id,
        name: item.name,
        index: index++,
        count: item.count
      })
    }
  }
  if (!options.length) {
    options.push({
      id: 0,
      name: '',
      index: index++,
      count: 0
    })
  }
}

const onSubmit = () => {
  contactFolderSaveApi({
    items: options
  })
    .then((res: any) => {
      const { code, message } = res
      if (code == 200) {
        ElMessage.success(t('success'))
        emit('relaod')
        emit('close')
      } else {
        ElMessage.error(message)
      }
    })
}

const addOption = () => {
  options.push({
    name: '',
    id: 0,
    index: index++,
    count: 0
  })
}

const delOption = (item: IItem) => {
  let fn = () => {
    let i = options.findIndex(value => value.index == item.index)
    if (i >= 0) {
      options.length > 0 && options.splice(i, 1)
    }
  }
  if (item.count > 0) {
    ElDialog.create({
      title: '',
      content: t('confirmDeleteFolder', { name: item.name, count: item.count }),
      positiveText: t('ok'),
      negativeText: t('cancelAction'),
      onPositiveClick: () => {
        fn()
      }
    })
  } else {
    fn()
  }
}

const onCloseClick = () => {
  emit('close')
}
const isCanSubmit = computed(() => {
  return options.some((item: IItem) => item.name.trim().length === 0)
})

onLoad()
</script>

<template>
  <el-dialog
    v-model="isShowBox"
    :before-close="onCloseClick"
    :title="t('contactFolders')"
    width="30%"
  >
    <el-container class="launch-box">
      <div class="options">
        <div
          v-for="(item, index) in options"
          class="option"
          :key="index"
        >
          <el-input
            v-model="item.name"
            :placeholder="t('enterFolderName')"
          />
          <el-button
            @click="delOption(item)"
            :icon="IconDelete"
            class="btn"
            link
          />
        </div>
        <el-button
          v-if="options.length < 6"
          :icon="IconPlus"
          class="btn plus"
          link
          @click="addOption"
        >
          {{ t('more') }}
        </el-button>
      </div>
    </el-container>
    <template #footer>
      <div class="footer">
        <el-button
          @click="isShowBox = false"
        >
          {{ t('cancelAction') }}
        </el-button>
        <el-button
          :disabled="isCanSubmit"
          class="ml-15"
          type="primary"
          @click="onSubmit"
        >
          {{ t('save') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.launch-box {
  margin: 20px;

  .options {
    width: 100%;

    .option {
      margin: 8px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      user-select: none;
    }

    .btn {
      width: 30px;
      height: 30px;
      margin-left: 3px;
      cursor: pointer;

      &.plus {
        margin-left: auto;
        display: flex;
      }
    }
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
